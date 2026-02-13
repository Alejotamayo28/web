# Documentación Técnica: Plataforma Zapenu

## 1. Overview (TL;DR)

### Problema Resuelto
Zapenu es una plataforma de pedidos digitales para restaurantes y negocios de alimentos que permite:
- Digitalización de menús con opciones personalizables (tamaños, ingredientes, complementos)
- Gestión multi-tenant de múltiples locales comerciales
- Procesamiento de pedidos con flujos de estado (pendiente, confirmado, finalizado, cancelado)
- **Procesamiento de pagos en línea** mediante integración con MercadoPago
- Notificaciones en tiempo real a través de WhatsApp

### Tipo de Sistema
- **Arquitectura**: Aplicación web distribuida de 4 capas (microservicios ligero)
- **Frontend público (homero)**: Menú digital client-facing (SSR/SPA híbrido)
- **Frontend administrativo (marge)**: Dashboard de gestión (SPA)
- **Backend principal (barto)**: API REST con documentación OpenAPI/Swagger
- **Servicio de pagos (omnipago)**: Microservicio de integración con MercadoPago
- **Modelo de despliegue**: Multi-plataforma (VPS + Edge/CDN)

### Stack Principal Detectado
| Capa | Tecnología |
|------|------------|
| Backend Runtime | Node.js 20 (Alpine Linux) / Node.js 16 (omnipago) |
| Backend Framework | Express.js 4.21.2 + TSOA 6.6.0 (barto) / Express 4.21.1 (omnipago) |
| Lenguaje | TypeScript 4.9.5 (barto) / 5.7.2 (omnipago) / 5.7-5.8 (frontend) |
| Bases de Datos | PostgreSQL (Supabase + AWS RDS + omnipago schema) |
| Frontend Framework | React 19 + Vite 6.2.x |
| Estilos | Tailwind CSS 3.4 + Radix UI / shadcn/ui |
| Autenticación | Supabase Auth (JWT) |
| Almacenamiento | Cloudflare R2 (S3-compatible) |
| Pasarela de Pagos | MercadoPago SDK v2.0.15 (omnipago) |
| Mensajería | WhatsApp (WAHA) + Telegram |

### Público Objetivo
- **Negocios**: Restaurantes, cafeterías, dark kitchens, negocios de comida rápida
- **Usuarios finales**: Clientes que realizan pedidos a través de menús digitales QR
- **Administradores**: Dueños de negocios y staff operativo

---

## 2. Architecture Diagram (Descripción Textual)

### Componentes Principales

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENTES                                 │
├─────────────────┬─────────────────┬───────────────────────────────┤
│   Navegador     │   Navegador     │     App Móvil (no existente) │
│   (Homero)      │   (Marge)       │                              │
└────────┬────────┴────────┬────────┴───────────────┬───────────────┘
         │                 │                      │
         ▼                 ▼                      │
┌─────────────────┐ ┌──────────────────┐         │
│  Cloudflare     │ │  Cloudflare      │         │
│  Pages (Edge)   │ │  Pages (Edge)    │         │
│  - Cache 5min   │ │  - Auth          │         │
│  - Functions    │ │  - Cache 1min    │         │
└────────┬────────┘ └────────┬─────────┘         │
         │                   │                   │
         └─────────┬─────────┘                   │
                   │                             │
                   ▼                             │
         ┌──────────────────┐                    │
         │   Barto API      │◄───────────────────┘
         │   (VPS Docker)   │         │
         │   Port 3001      │         │
         └────────┬─────────┘         │
                  │                   │
                  │                   ▼
                  │         ┌──────────────────┐
                  │         │   Omnipago       │
                  └────────►│   (VPS Docker)   │
                            │   Port 4000      │
                            └────────┬─────────┘
                                     │
                           ┌─────────┴─────────┐
                           │                   │
                           ▼                   ▼
                  ┌─────────────────┐  ┌──────────────┐
                  │   PostgreSQL    │  │ MercadoPago  │
                  │   (DB propia)   │  │   Webhooks   │
                  └─────────────────┘  └──────────────┘

┌────────────────────────────────────────────────────────────────────┐
│                      SERVICIOS EXTERNOS                           │
├──────────────┬──────────────┬──────────────┬──────────────────────┤
│  Supabase    │     R2       │    WAHA      │   MercadoPago        │
│  - Auth      │   Images     │  WhatsApp    │   - Gateway          │
│  - DB        │              │  Port 3000   │   - Webhooks         │
└──────────────┴──────────────┴──────────────┴──────────────────────┘
```

### Límites Entre Capas

#### Frontend → Backend
- **Protocolo**: HTTPS/REST
- **Autenticación**: JWT Bearer tokens (solo Marge)
- **CORS**: Configurado explícitamente para dominios permitidos
- **Rate Limiting**: No identificado explícitamente (dependería de Cloudflare)

#### Backend → Data Stores
- **PostgreSQL**: Conexiones poolizadas via Supabase
- **R2**: AWS SDK v3 con S3Client
- **WAHA**: HTTP API interna (Docker network)

#### Frontend Público vs Administrativo
| Aspecto | Homero (Público) | Marge (Admin) |
|---------|------------------|---------------|
| Acceso | Anónimo/Público | Autenticado |
| Cache | 5 min (agresivo) | 1 min (dinámico) |
| Rutas | Solo lectura | CRUD completo |
| Edge Functions | Sí (proxy API) | No |

### Servicios Externos Identificados

| Servicio | Propósito | Integración |
|----------|-----------|-------------|
| Supabase | Auth + PostgreSQL | SDK oficial, JWT validation |
| Cloudflare R2 | Almacenamiento de imágenes | AWS S3 SDK compatible |
| WAHA | Notificaciones WhatsApp | HTTP API (self-hosted) |
| Telegram | Logging de errores | HTTP Worker (Cloudflare) |
| GitHub Actions | CI/CD | Self-hosted runner en VPS |

---

## 3. Data Flow

### Flujo Principal: Creación de Pedido

```
1. CLIENTE (Homero)
   └── Navega menú público
       └── GET /products/all/{client}/{short_id}
           └── Respuesta: Productos + opciones + choices
   
2. CLIENTE selecciona productos
   └── Construye carrito local (React state)
   └── Valida reglas de opciones (min/max, requeridos)
   
3. CLIENTE confirma pedido
   └── POST /orders
       ├── Header: (público - sin auth)
       ├── Body: { shop_id, items[], delivery_type, ... }
       │
       └── Backend Processing:
           ├── Valida productos y disponibilidad
           ├── Calcula totales (precios + opciones)
           ├── Inserta en logistics.orders
           ├── Inserta items en logistics.items
           ├── Estado inicial: PENDING_PAYMENT
           │
           └── Async Notifications:
               ├── WAHA: POST http://waha:3000/send-message
               └── (Opcional) Telegram logging
   
4. RESPUESTA
   └── 201 Created: { order_id, total, payment_url? }
   
5. NOTIFICACIÓN
   └── WhatsApp enviado al dueño del negocio
   └── Contenido: Detalle del pedido, total, instrucciones
```

### Flujo de Autenticación (Marge)

```
1. ADMIN abre Marge
   └── Redirigido a /login
   
2. ADMIN ingresa email
   └── Supabase Auth: signInWithOtp()
   └── Envía magic link al email
   
3. ADMIN recibe email y hace click
   └── Callback a Marge con session
   └── Supabase almacena tokens (access_token, refresh_token)
   
4. Marge almacena sesión
   └── LocalStorage/Context API
   └── authFetch() automáticamente agrega Bearer token
   
5. PETICIONES PROTEGIDAS
   └── Header: Authorization: Bearer <jwt>
   └── Barto verifica JWT contra Supabase JWKS
   └── Cache de perfil por 5 minutos (performance)
```

### Flujo de Subida de Imágenes

```
1. ADMIN selecciona imagen en Marge
   └── Compresión client-side (browser-image-compression)
   └── Conversión a WebP (@jsquash/webp)
   
2. UPLOAD a Barto
   └── POST /branding/logo (multipart/form-data)
   └── Multer middleware: valida tipo, tamaño máx 10MB
   
3. BACKEND procesa
   └── Genera UUID para nombre de archivo
   └── AWS S3 SDK → Upload a R2 (products bucket)
   └── URL resultante: https://media.zapenu.com/{uuid}.webp
   
4. ALMACENAMIENTO
   └── URL guardada en base de datos (operations.products.photo_urls)
```

### Flujo de Pagos (Omnipago)

#### Creación de Orden de Pago

```
1. CLIENTE confirma pedido en Homero
   └── POST a Barto: /orders
       └── Barto verifica y crea orden (estado: PENDING_PAYMENT)
   
2. REDIRECCIÓN A PAGO
   └── Barto responde con { order_id, total, payment_required: true }
   └── Homero redirige a flujo de pago
   
3. CREACIÓN DE PREFERENCIA (Marge u Homero)
   └── POST /omnipago/payments/create-order
       ├── Body: { order_id, client_id, items[], back_urls }
       │
       └── Omnipago Processing:
           ├── Valida items (express-validator)
           ├── Crea preferencia en MercadoPago API
           │   ├── Items transformados al formato MP
           │   ├── Excluye métodos configurados (EFECTY/ticket por defecto)
           │   ├── Configura URLs de retorno
           │   └── Recibe preference_id, init_point
           ├── Persiste en PostgreSQL (payments_gateway.preference)
           ├── Relaciona order_id → preference_id
           └── Retorna: { init_point, preference_id }
   
4. REDIRECCIÓN A MERCADOPAGO
   └── Cliente es redirigido a init_point (checkout de MP)
   └── Pago procesado por MercadoPago (tarjeta, PSE, etc.)
```

#### Webhook de Confirmación de Pago

```
1. MERCADOPAGO procesa pago
   └── Estado: approved | rejected | pending
   
2. WEBHOOK a Omnipago
   └── POST /omnipago/payments/payment-webhook
       ├── Headers: x-signature, x-request-id
       ├── Query: order_id
       ├── Body: { type: "payment", data: { id: payment_id } }
       │
       └── Omnipago Processing:
           ├── Valida HMAC (x-signature)
           │   ├── Extrae ts y v1 de signature
           │   ├── Genera manifest: "id:{data_id};request-id:{x-request-id};ts:{ts};"
           │   ├── Calcula HMAC-SHA256 con secret del client
           │   └── Compara con hash recibido
           ├── Consulta payment en MercadoPago API
           │   └── GET /v1/payments/{payment_id}
           ├── Determina estado:
           │   ├── approved/authorized → PAYMENT_APPROVED
           │   └── rejected/cancelled → PAYMENT_REJECTED
           ├── Persiste en PostgreSQL (payments_gateway.payments)
           │   └── JSONB: card, payer, payment_method
           └── Notifica a Barto
               └── PUT /orders/{order_id}/payment-status
                   └── Body: { payment_status: "PAYMENT_APPROVED" }
   
3. BARTO ACTUALIZA ORDEN
   └── Recibe notificación de Omnipago
   └── Actualiza estado: PENDING_PAYMENT → CREATED
   └── Notifica a negocio vía WhatsApp (WAHA)
```

### Flujo de Datos de Productos

```
Entrada: Administrador crea/actualiza producto

POST/PATCH /products
├── Validación: class-validator + express-validator
├── Interactor: ProductInteractor
│   ├── Gestiona lógica de negocio
│   ├── Calcula sort_keys (fractional-indexing)
│   └── Valida reglas de opciones
├── Gateway: ProductPostgresGateway
│   └── Transacciones SQL con pg
├── Persistencia: operations.products
│   ├── JSONB para datos flexibles (photo_urls[], info_modal)
│   └── Foreign keys a operations.categories
└── Respuesta: Producto serializado

Cache: No identificado explícitamente (asumido: sin cache)
```

---

## 3.5 Arquitectura de Omnipago (Microservicio de Pagos)

### Overview

Omnipago es un microservicio dedicado a la integración con pasarelas de pago, actualmente implementando **MercadoPago** como proveedor principal. Opera de forma independiente pero en coordinación con el backend principal (Barto).

### Stack Tecnológico

| Componente | Tecnología | Versión | Nota |
|------------|------------|---------|------|
| Runtime | Node.js | 16.13.0 | Version antigua (EOL: April 2024) |
| Framework | Express.js | 4.21.1 | Similar a Barto |
| Lenguaje | TypeScript | 5.7.2 | Mas reciente que Barto (4.9.5) |
| Documentación API | Swagger/OpenAPI | 3.0.1 | Multi-file YAML |
| Base de Datos | PostgreSQL | 14+ | Schema dedicado: payments_gateway |
| Pasarela | MercadoPago SDK | 2.0.15 | Oficial |
| Validación | express-validator | 7.2.0 | Middleware chain |
| Process Manager | PM2 | (ecosystem.config.js) | Producción |

### Estructura del Proyecto

Omnipago sigue una arquitectura de capas similar a Barto:
- **Controllers**: Manejan HTTP requests (express-validator)
- **Interactors**: Lógica de negocio (creación de preferencias, procesamiento de webhooks)
- **Entities**: Dominio (Payment, Preference, MercadoPago wrapper)
- **Gateway**: Acceso a datos (PostgreSQL con transacciones)

### Base de Datos (Schema: payments_gateway)

**Tablas principales:**
- **preference**: Almacena preferencias de pago de MercadoPago
- **order_preference**: Relación entre orden interna y preferencia MP
- **payments**: Registro de pagos completados
- **client_config**: Configuración por tenant (métodos excluidos, cuotas)
- **notifications**: Log de webhooks recibidos

### Seguridad de Webhooks

- **Verificación HMAC**: SHA-256 de los headers x-signature
- **Secret por cliente**: Cada tenant tiene su propio secret de validación
- **Formato del manifest**: `id:{data_id};request-id:{x-request-id};ts:{ts};`

### Integración con Barto

| Dirección | Flujo | Descripción |
|-----------|-------|-------------|
| Barto → Omnipago | POST /payments/create-order | Crea preferencia de pago |
| Omnipago → Barto | PUT /orders/{id}/payment-status | Notifica estado del pago |
| MercadoPago → Omnipago | POST /payments/payment-webhook | Webhook asíncrono |


## 4. Design Decisions & Trade-offs

### Decisión 1: Separación de Frontends (Homero vs Marge)

| Aspecto | Decisión Tomada | Alternativas | Trade-offs |
|---------|-----------------|--------------|------------|
| Arquitectura | Dos SPAs separadas | Single SPA con code-splitting | (+) Independencia de deploy, optimización de bundle, seguridad por separación<br>(-) Duplicación de código, overhead de mantenimiento |
| Razón | Homero público con cache agresivo, Marge con auth y datos sensibles | | |

### Decisión 2: Supabase como Backend-as-a-Service

| Aspecto | Decisión Tomada | Alternativas | Trade-offs |
|---------|-----------------|--------------|------------|
| Auth + DB | Supabase integrado | Auth0 + RDS independiente, Firebase | (+) Menor infraestructura, precio predictivo, RLS incorporado<br>(-) Vendor lock-in, límites de conexiones, latencia en regiones no cubiertas |
| Precio | Tier gratuito/inicial | Auto-hosteado (Keycloak + Postgres) | Suposición: optimización de costos para startup |

### Decisión 3: TSOA para Generación de API

| Aspecto | Decisión Tomada | Alternativas | Trade-offs |
|---------|-----------------|--------------|------------|
| Framework | TSOA + decorators | Express manual, NestJS, Fastify | (+) Type safety end-to-end, OpenAPI automático, validación integrada<br>(-) Curva de aprendizaje, menos flexible que Express puro, dependencia de tooling |
| Generación | Rutas y specs auto-generadas | OpenAPI manual | (+) Single source of truth en TypeScript<br>(-) Build step adicional, posibles errores de generación |

### Decisión 4: Cloudflare R2 vs AWS S3

| Aspecto | Decisión Tomada | Alternativas | Trade-offs |
|---------|-----------------|--------------|------------|
| Storage | Cloudflare R2 | AWS S3, MinIO self-hosted | (+) Costo: $0 egress fees (vs AWS), S3-compatible<br>(-) Menos maduro, menos integraciones nativas, dependencia de Cloudflare |
| Custom Domain | media.zapenu.com | URL firmadas de S3 | (+) Branding consistente, cache en edge<br>(-) Configuración DNS adicional |

### Decisión 5: WhatsApp (WAHA) Self-Hosted

| Aspecto | Decisión Tomada | Alternativas | Trade-offs |
|---------|-----------------|--------------|------------|
| Notificaciones | WAHA en Docker local | Twilio, MessageBird, WATI | (+) Costo cero (usa WhatsApp Business API no oficial), control total<br>(-) No oficial, puede romperse, requiere mantener sesión activa, limitaciones de rate |
| Imagen | devlikeapro/waha:arm | waha-plus, custom | Optimizado para ARM64 (costo en VPS ARM) |

### Decisión 6: GitHub Actions Self-Hosted Runner

| Aspecto | Decisión Tomada | Alternativas | Trade-offs |
|---------|-----------------|--------------|------------|
| CI/CD | Self-hosted en VPS | GitHub-hosted runners | (+) Acceso a VPS privado, sin límites de minutos, costo fijo<br>(-) Seguridad: runner tiene acceso al servidor, requiere mantenimiento, riesgo de mining si comprometido |

### Decisión 7: Microservicio de Pagos (Omnipago)

| Aspecto | Decisión Tomada | Alternativas | Trade-offs |
|---------|-----------------|--------------|------------|
| Arquitectura | Servicio separado (omnipago) | Integrado en barto (monolito) | (+) Separación de responsabilidades, puede escalar independientemente, aislamiento de fallas de pagos<br>(-) Complejidad de deployment, latencia adicional (HTTP entre servicios), overhead de infraestructura |
| Pasarela | MercadoPago | Stripe, PayU, PlaceToPay | (+) Dominante en LATAM, SDK maduro, soporte local<br>(-) Vendor lock-in, fees del gateway, disponibilidad limitada a LATAM |
| Validación Webhooks | HMAC-SHA256 | Firma JWT, Basic Auth | (+) Estándar de MercadoPago, integridad garantizada<br>(-) Implementación manual compleja, secret management |
| DB Schema | Schema dedicado (payments_gateway) | Shared schema con barto | (+) Aislamiento de datos, independencia evolutiva<br>(-) Cross-database joins más complejos |

### Decisión 8: Exclusión de Métodos de Pago

| Aspecto | Decisión Tomada | Alternativas | Trade-offs |
|---------|-----------------|--------------|------------|
| Configuración | Excluir EFECTY por defecto | Todos los métodos habilitados | (+) Control de métodos de alto riesgo (efectivo), configuración por cliente<br>(-) Menos opciones para usuarios finales, requiere configuración explícita |

### Decisión 9: Fractional Indexing para Ordenamiento

| Aspecto | Decisión Tomada | Alternativas | Trade-offs |
|---------|-----------------|--------------|------------|
| Orden | fractional-indexing (strings) | Integers secuenciales, linked list | (+) Reordenamiento O(1), sin gaps, funciona con sync offline<br>(-) Complejidad adicional, strings más pesadas que integers |

---

## 5. Design Journal (Inferido)

### Suposiciones Implícitas del Diseño

1. **Prioridad: Velocidad de desarrollo sobre optimización extrema**
   - Uso de BaaS (Supabase) para acelerar MVP
   - TSOA reduce boilerplate de API (barto)
   - Swagger multi-file para API docs (omnipago)
   - shadcn/ui acelera desarrollo UI

2. **Asunción: Tráfico moderado (no hyperscale)**
   - Sin cache distribuido identificado (Redis/Memcached)
   - Conexiones directas a DB sin pool avanzado
   - Single VPS para backend

3. **Asunción: Negocio B2B2C multi-tenant simple**
   - Un cliente = un dueño de negocio
   - Shops pertenecen a clientes
   - No identificado: tenant isolation a nivel de DB (RLS básico)

4. **Asunción: Pagos externos (no integrado)**
   - Estados de pago: PENDING_PAYMENT → CREATED
   - No gateway de pago identificado en código
   - Suposición: pagos manuales (efectivo/transferencia) o externo

### Posibles Razones detrás de Decisiones Clave

| Decisión | Razón Inferida |
|----------|----------------|
| React 19 (muy reciente) | Adopción temprana de features (Server Components futuros?), prueba de concepto |
| Dos frontends separados | Homero diseñado para "fácil embed" (iframe/QR), Marge para "aplicación completa" |
| WAHA en lugar de Twilio | Margen de beneficio: evitar costos por mensaje en volumen bajo |
| R2 en lugar de S3 | Costo predecible: sin sorpresas de egress fees si viraliza |
| TypeScript 4.9 en backend | LTS estable, compatibilidad con TSOA, evitar breaking changes de TS 5.x |
| Sin ORM identificado | Query builders (pg-format) para control SQL, posiblemente evitar overhead de ORM |
| Supabase Auth vs Firebase | Relación con PostgreSQL nativa, precio, curva de aprendizaje menor para equipo SQL |

### Qué Prioriza el Diseño

| Prioridad | Evidencia |
|-----------|-----------|
| **Costo operativo** | R2 (egress gratis), WAHA (gratis), VPS único, self-hosted runner |
| **Velocidad de desarrollo** | Supabase, TSOA, shadcn/ui, Vite |
| **Simplicidad** | Arquitectura monolítica (sin microservicios), Docker Compose simple |
| **Escalabilidad horizontal** | NO priorizada - single VPS, sin sharding |

---

## 6. Cost Considerations & Optimization

### Componentes Generadores de Costo

| Componente | Proveedor | Modelo de Precio | Costo Estimado |
|------------|-----------|------------------|----------------|
| VPS Backend (barto) | AWS/GCP/OTros | Compute instance (ARM64) | $5-20/mes |
| VPS Backend (omnipago) | AWS/GCP/OTros | Compute instance | $5-15/mes |
| Supabase | Supabase | Free tier / Pro | $0-25/mes |
| PostgreSQL (omnipago) | Self-hosted | Shared con VPS | $0 (marginal) |
| Cloudflare R2 | Cloudflare | Storage + Class A/B ops | $0-5/mes (bajo volumen) |
| Cloudflare Pages | Cloudflare | Free tier | $0 |
| WhatsApp WAHA | Self-hosted | Infraestructura propia | $0 (marginal) |
| GitHub Actions | GitHub | Self-hosted | $0 (infra propia) |
| MercadoPago Fees | MercadoPago | % por transacción (aprox 2.99% + IVA) | Variable |
| DNS/Dominio | Cloudflare/OTros | Registro + DNS | $10-15/año |

**Total estimado infraestructura**: $30-80/mes
**Costo transaccional**: 2.99% + IVA por transacción (MercadoPago Colombia)

### Patrones de Optimización Implementados

| Patrón | Implementación | Impacto |
|--------|----------------|---------|
| **Edge Caching** | Cloudflare Pages con cache headers | Reduce compute en VPS, mejora TTFB |
| **Image Compression** | WebP client-side (@jsquash/webp) | Reduce storage y bandwidth 30-70% |
| **Connection Pooling** | Supabase PostgreSQL pooling | Reutiliza conexiones, evita overhead |
| **Lazy Loading** | React code-splitting (asumido por Vite) | Reduce bundle inicial |
| **Self-hosted Services** | WAHA, VPS propio | Elimina costos por uso (SaaS) |
| **ARM64 Architecture** | Docker images ARM64 (waha:arm) | 20-40% más barato en algunos cloud providers |

### Riesgos de Costo si el Tráfico Aumenta

| Escenario | Riesgo | Mitigación Identificada |
|-----------|--------|------------------------|
| 10x tráfico en Homero | Cloudflare Pages free tier limits | Upgrade a Pro ($20/mes) |
| 100x imágenes subidas | R2 storage y operaciones | Límites de tamaño (10MB), compresión previa |
| 1000x pedidos/día | Supabase rate limits / connection limits | Pool tuning, potencial migración a connection pooling externo |
| Viralización WhatsApp | Ban de número WAHA | No identificado: fallback a email/SMS |
| Crecimiento DB | Supabase storage limits | Archivado, particionamiento no identificado |

---

## 7. Variants & Extensions

### Variante A: Mobile App Nativa

| Aspecto | Descripción |
|---------|-------------|
| **Caso de Uso** | Clientes frecuentes, notificaciones push, experiencia offline |
| **Impacto en Complejidad** | Alto |
| **Cambios Arquitectónicos** | React Native/Flutter con expo, APIs públicas ya existentes funcionan, Push notifications (Firebase/OneSignal), deep linking |

### Variante B: Sistema de Pagos Integrado

| Aspecto | Descripción |
|---------|-------------|
| **Caso de Uso** | Checkout online con tarjetas, wallets digitales |
| **Impacto en Complejidad** | Medio-Alto |
| **Cambios Arquitectónicos** | Stripe/MercadoPago integration, Webhooks para confirmación de pago, Tabla de transacciones, Estado de orden vinculado a pago, PCI compliance consideraciones |

### Variante C: Multi-idioma y Multi-moneda

| Aspecto | Descripción |
|---------|-------------|
| **Caso de Uso** | Expansión internacional, turismo |
| **Impacto en Complejidad** | Medio |
| **Cambios Arquitectónicos** | i18n en frontends (react-i18next), Campos de traducción en DB (JSONB), Cambio de moneda en tiempo real, Localization de fechas/números |

### Variante D: Arquitectura Microservicios

| Aspecto | Descripción |
|---------|-------------|
| **Caso de Uso** | Escalar equipos independientes, alta disponibilidad |
| **Impacto en Complejidad** | Muy Alto |
| **Cambios Arquitectónicos** | Separar: Auth service, Product service, Order service, Notification service, Message broker (RabbitMQ/SQS), Service mesh o API Gateway, Infraestructura Kubernetes/EKS |

### Variante E: Real-time con WebSockets

| Aspecto | Descripción |
|---------|-------------|
| **Caso de Uso** | Actualizaciones de pedido en tiempo real, chat cliente-negocio |
| **Impacto en Complejidad** | Medio |
| **Cambios Arquitectónicos** | Socket.io o WS nativo, Redis para pub/sub entre nodos, Supabase Realtime (alternativa), Manejo de reconexión y estado |

### Variante F: White-label / SaaS Multi-tenant Avanzado

| Aspecto | Descripción |
|---------|-------------|
| **Caso de Uso** | Vender plataforma a múltiples negocios como SaaS |
| **Impacto en Complejidad** | Alto |
| **Cambios Arquitectónicos** | Subdominios dinámicos (*.zapenu.com), Tenant isolation fuerte (schema per tenant o row-level), Billing engine, Admin super-user, Custom branding avanzado |

### Variante G: Soporte Multi-Pasarela de Pagos

| Aspecto | Descripción |
|---------|-------------|
| **Caso de Uso** | Permitir a negocios elegir su pasarela de pagos (Stripe, PayU, PlaceToPay) |
| **Impacto en Complejidad** | Medio-Alto |
| **Cambios Arquitectónicos** | Patrón Strategy/Adapter para gateways, Omnipago extensión: PaymentGateway interface, Configuración por cliente de gateway preferido, Normalización de webhooks (formato unificado), Fallback entre gateways, Múltiples secrets HMAC |

### Variante H: Sistema de Reconciliación Automática

| Aspecto | Descripción |
|---------|-------------|
| **Caso de Uso** | Conciliación diaria de pagos con estado en MercadoPago |
| **Impacto en Complejidad** | Medio |
| **Cambios Arquitectónicos** | Job scheduler (cron), Batch job para consultar pagos del día, Comparación con pagos locales, Alertas de discrepancias, Dashboard de conciliación |

---

## 8. Security Considerations

### Autenticación

| Aspecto | Implementación | Estado |
|---------|----------------|--------|
| Método | JWT (Supabase Auth) | ✅ Identificado |
| Almacenamiento | LocalStorage (Marge) | ⚠️ Vulnerable a XSS, considerar httpOnly cookies |
| Refresh | Automático por Supabase client | ✅ Implementado |
| Expiración | 1 hora (access_token), 1 semana (refresh) | ✅ Estándar |
| MFA | No identificado | ❌ No implementado |

### Autorización

| Aspecto | Implementación | Estado |
|---------|----------------|--------|
| RBAC | Básico: `authenticated`, `client` scopes | ✅ Simple |
| RLS | Implementado en Supabase (profiles) | ✅ Identificado |
| Ownership | Verificación manual en interactors | ⚠️ No identificado explícitamente |
| Admin vs User | No identificado: roles diferenciados | ❌ No claro |

### Manejo de Secretos

| Aspecto | Implementación | Estado |
|---------|----------------|--------|
| Environment | Archivos .env (no en repo) | ✅ Correcto |
| Configuración | config.json en producción | ⚠️ Posiblemente en volumen Docker |
| Secrets | DATABASE_URL, SUPABASE_ANON_KEY, R2 credentials | ⚠️ Rotación no identificada |
| CI/CD | GitHub Secrets | ✅ Asumido |

### Superficie de Ataque Evidente

| Vulnerabilidad | Ubicación | Riesgo | Mitigación Identificada |
|----------------|-----------|--------|------------------------|
| **NoSQL Injection** | PostgreSQL queries | Medio | pg-format para escaping (parcial) |
| **Path Traversal** | File uploads (multer) | Medio | UUID renaming, extensión validada |
| **XSS** | Frontend (React escapa por defecto) | Bajo | React DOM escaping |
| **CSRF** | API endpoints | Medio | CORS configurado, tokens en headers |
| **IDOR** | /products/{id}, /orders/{id} | Alto | No identificado: validación de ownership |
| **JWT None Algorithm** | JWT verification | Bajo | Supabase JWKS validation |
| **DoS** | File upload (10MB) | Medio | Multer limits |
| **Reconnaissance** | Swagger docs públicos | Medio | Basic Auth en /api-docs |

### Riesgos de Seguridad

1. **IDOR (Insecure Direct Object Reference)**: Endpoints como GET /products/{id} no muestran verificación explícita de que el usuario tenga acceso a ese recurso.

2. **XSS via LocalStorage**: Tokens JWT almacenados en LocalStorage son accesibles a JavaScript malicioso (script injection).

3. **Self-hosted Runner**: El runner de GitHub Actions en el VPS tiene acceso al servidor. Si se compromete, el atacante controla el VPS.

4. **WAHA No Oficial**: Usa WhatsApp Web no oficial, susceptible a bans y potencialmente a cambios de API.

5. **CORS Permisivo**: No identificado explícitamente - si CORS está configurado ampliamente, permite ataques cross-origin.

6. **Missing Rate Limiting**: No identificado: endpoints como login, creación de pedidos podrían ser brute-forced.

#### Riesgos Específicos de Pagos (Omnipago)

7. **Webhook Replay Attack**: No identificado: validación de timestamp en webhooks para prevenir replay de pagos antiguos.

8. **Man-in-the-Middle en Webhooks**: Aunque usa HTTPS, no hay verificación adicional de origen IP de MercadoPago.

9. **Race Condition en Pagos**: No identificado: procesamiento concurrente de múltiples webhooks para la misma orden.

10. **Secret Hardcodeado**: MercadoPago tokens en config.json (potencialmente en volumen Docker) - rotación manual requerida.

11. **Card Data Exposure**: Datos de tarjetas (first_six_digits, last_four) almacenados en JSONB - requiere cumplimiento PCI-DSS si se escala.

---

## 9. Limitations / Non-Goals

### Qué el Sistema NO Hace

| Capacidad | Estado | Nota |
|-----------|--------|------|
| Pagos integrados | ✅ SÍ | MercadoPago integrado vía Omnipago microservicio |
| Inventario en tiempo real | ❌ NO | No tracking de stock disponible |
| Delivery/logística | ❌ NO | Solo registra dirección, no routing |
| Analytics avanzados | ❌ NO | Datos crudos disponibles, no dashboards |
| Multi-moneda | ❌ NO | Moneda única por tenant |
| Offline mode | ❌ NO | Requiere conexión constante |
| Progressive Web App | ❌ NO | No service worker identificado |
| Reservas de mesas | ❌ NO | Solo pedidos, no booking |
| Chat tiempo real | ❌ NO | Solo notificaciones push (WAHA) |
| API pública documentada | ❌ NO | Swagger requiere Basic Auth |

### Casos de Uso NO Cubiertos

1. **Cadena de restaurantes**: Multi-sucursal con inventario centralizado
2. **Franquicias**: Modelo de fees y royalties
3. **Marketplace**: Plataforma con múltiples vendedores
4. **Food delivery**: Integración con apps de delivery (Rappi, UberEats)
5. **Kioscos self-service**: Interfaz táctil para locales físicos
6. **Llamadas telefónicas**: Integración con call center
7. **Fidelización**: Programa de puntos, cupones, membresías
8. **Multi-idioma**: Soporte para idiomas múltiples simultáneos
9. **Accesibilidad WCAG**: Cumplimiento no verificado
10. **GDPR/CCPA**: Herramientas de data portability/rectificación no identificadas

### Restricciones Técnicas Visibles

| Restricción | Detalle |
|-------------|---------|
| Single VPS | Single point of failure, no alta disponibilidad |
| PostgreSQL único | No read replicas identificados |
| Sin CDN para API | Latencia geográfica no optimizada |
| Sin cola de mensajes | Procesamiento síncrono de notificaciones |
| Sin cache distribuido | Cada instancia tiene su propio estado |
| Sin backups automatizados | No identificado: estrategia de backup |
| Sin monitoreo avanzado | Solo Telegram logs, no APM (Datadog/NewRelic) |
| Sin feature flags | Despliegue all-or-nothing |
| Sin AB testing | No infraestructura para experimentos |
| Sin rate limiting | Vulnerable a abuso |
| **Sin reconciliación de pagos** | No identificado: proceso de conciliación con MP |
| **Sin retry de webhooks** | Fallos en webhooks no tienen mecanismo de retry |
| **Sin idempotencia garantizada** | Webhooks pueden duplicar pagos si no se maneja |
| **Sin circuit breaker** | Fallas en MercadoPago no tienen fallback |

### Supuestos de Negocio no Validados

- El negocio tiene conexión estable a WhatsApp (WAHA puede fallar)
- Los dueños revisan notificaciones WhatsApp activamente
- Volumen de pedidos soportado por VPS actual (< 1000 pedidos/día)
- Clientes pueden pagar via MercadoPago (integrado) o fuera del sistema (efectivo/transferencia)
- MercadoPago mantiene disponibilidad del servicio (sin fallback a otras pasarelas identificado)
- Webhooks de MercadoPago son entregados consistentemente (sin retry mechanism identificado)
- Volumen de transacciones soportado sin rate limiting de MP
- Entendimiento de fees de MercadoPago (aprox 2.99% + IVA en Colombia) vs margen del negocio
- Staff técnico puede gestionar GitHub Actions self-hosted

---

## Apéndice: Glosario

| Término | Definición |
|---------|------------|
| **Barto** | Backend API principal (Node.js/Express/TSOA) - nombre del repositorio |
| **Homero** | Frontend público (React/Vite) - menú para clientes |
| **Marge** | Frontend administrativo (React/Vite) - dashboard de gestión |
| **Omnipago** | Microservicio de pagos (Node.js/Express) - integración MercadoPago |
| **Zapenu** | Nombre de la plataforma completa |
| **TSOA** | Framework para generar rutas OpenAPI desde TypeScript decorators |
| **WAHA** | WhatsApp HTTP API - servidor no oficial de WhatsApp Web |
| **R2** | Cloudflare R2 - almacenamiento S3-compatible sin egress fees |
| **Supabase** | Backend-as-a-Service (PostgreSQL + Auth + Storage) |
| **MercadoPago** | Pasarela de pagos líder en LATAM (propiedad de MercadoLibre) |
| **HMAC** | Hash-based Message Authentication Code - verificación de integridad de webhooks |
| **Preference** | Objeto de MercadoPago que representa una orden de pago pendiente |
| **Webhook** | HTTP callback asíncrono para notificaciones de eventos |
| **Fractional Indexing** | Técnica de ordenamiento usando strings para permitir inserciones O(1) |

---

*Documento generado: 2026-02-13 (actualizado con análisis de Omnipago)*
*Análisis basado en código fuente disponible - suposiciones marcadas explícitamente*
*Componentes analizados: barto, homero, marge, omnipago*
