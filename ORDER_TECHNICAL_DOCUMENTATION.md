# Documentación Técnica - Commerce Platform

## 1. Overview (TL;DR)

**Problema Resuelto:** Plataforma de comercio electrónico distribuida que gestiona el ciclo de vida completo de órdenes de compra con garantías de consistencia eventual en un entorno de microservicios. Resuelve el desafío de mantener consistencia de datos entre servicios descentralizados sin transacciones ACID distribuidas.

**Tipo de Sistema:** Arquitectura de microservicios event-driven con Event Sourcing, Saga Pattern para compensación distribuida, y Outbox Pattern para publicación confiable de eventos.

**Stack Principal Detectado:**

| Capa | Tecnología |
|------|------------|
| **Lenguaje** | TypeScript 5.3+ |
| **Runtime** | Node.js 20+ |
| **Framework Web** | Express.js con TSOA (OpenAPI) |
| **Arquitectura** | Hexagonal / Ports & Adapters |
| **Message Broker** | RabbitMQ |
| **Base de Datos** | PostgreSQL 15+ |
| **Cache** | Redis 7 |
| **Infraestructura** | AWS (ECS, RDS, ElastiCache, ALB) |
| **IaC** | Terraform |
| **Contenedores** | Docker |

**Público Objetivo:**
- Desarrolladores de software aprendiendo arquitecturas distribuidas
- Equipos técnicos implementando sistemas resilientes con Event Sourcing
- Arquitectos diseñando soluciones de comercio electrónico distribuido

---

## 2. Architecture Diagram (descripción textual)

### Componentes Principales

```
┌─────────────────────────────────────────────────────────────────────┐
│                            CLIENTE                                  │
└──────────────────────────┬────────────────────────────────────────────┘
                           │ HTTP/REST
                           ▼
┌──────────────────────────▼────────────────────────────────────────────┐
│                        ORDER-SERVICE                                │
│  ┌─────────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │ REST API Layer  │  │ Application  │  │ Workers (Partitioned)│   │
│  │ (Express+TSOA)  │─▶│   Service    │─▶│ - Order Router       │   │
│  │                 │  │              │  │ - Order Workers (N)  │   │
│  │ Endpoints:      │  │ Use Cases:   │  │ - Outbox Worker      │   │
│  │ POST /orders    │  │ - Create     │  └──────────────────────┘   │
│  │ GET /orders/:id │  │ - Query      │                             │
│  │ GET /:id/events │  │ - Process    │                             │
│  └─────────────────┘  └──────────────┘                             │
│         │                    │                                      │
│         │                    │                                      │
│         ▼                    ▼                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                  INFRASTRUCTURE LAYER                        │  │
│  │  PostgreSQL (orders, events, outbox)   │   Redis (dedup)    │  │
│  └──────────────────────────────────────────────────────────────┘  │
└──────────────────────────┬──────────────────────────────────────────┘
                           │ Events (RabbitMQ)
          ┌────────────────┴────────────────┐
          ▼                                 ▼
┌───────────────────────┐       ┌───────────────────────┐
│   INVENTORY-SERVICE   │       │    PAYMENT-SERVICE    │
│  ┌─────────────────┐  │       │  ┌─────────────────┐  │
│  │ Event Consumers │  │       │  │ Event Consumers │  │
│  │ - OrderCreated  │  │       │  │ - OrderCreated  │  │
│  │ - Compensate    │  │       │  │ - Compensate    │  │
│  └─────────────────┘  │       │  └─────────────────┘  │
│         │             │       │         │             │
│         │             │       │         │             │
│         ▼             │       │         ▼             │
│  ┌─────────────────┐  │       │  ┌─────────────────┐  │
│  │     Domain:     │  │       │  │     Domain:     │  │
│  │ - Reservations  │  │       │  │ - Payments      │  │
│  │ - Stock Mgmt    │  │       │  │ - Customers     │  │
│  └─────────────────┘  │       │  └─────────────────┘  │
│         │             │       │         │             │
│         ▼             │       │         ▼             │
│     PostgreSQL        │       │     PostgreSQL        │
└───────────────────────┘       └───────────────────────┘
```

### Relaciones entre Componentes

| Origen | Destino | Protocolo | Propósito |
|--------|---------|-----------|-----------|
| Cliente | Order-Service | HTTP/REST | Crear/consultar órdenes |
| Order-Service | PostgreSQL | TCP/SQL | Persistencia de eventos y outbox |
| Order-Service | Redis | TCP | Deduplicación de mensajes |
| Order-Service | RabbitMQ | AMQP | Publicación de eventos de dominio |
| RabbitMQ | Inventory-Service | AMQP | Consumo de eventos de orden |
| RabbitMQ | Payment-Service | AMQP | Consumo de eventos de orden |
| Inventory-Service | PostgreSQL | TCP/SQL | Gestión de reservas e inventario |
| Payment-Service | PostgreSQL | TCP/SQL | Gestión de pagos y clientes |

### Límites entre Capas

| Capa | Responsabilidad | Ejemplo en Código |
|------|----------------|-------------------|
| **Presentation** | HTTP/API Controllers | `OrderController.ts` |
| **Application** | Casos de uso, orquestación | `CreateOrderUseCase.ts`, `OrderProcessManager.ts` |
| **Domain** | Entidades, reglas de negocio | `Order.ts`, `OrderEvents.ts` |
| **Infrastructure** | Adaptadores a tecnología | `RabbitMQMessagingService.ts`, `PostgreOrderRepository.ts` |

---

## 3. Data Flow

### Flujo Principal - Creación de Orden

```
┌────────┐
│ Client │
└───┬────┘
    │ POST /orders
    ▼
┌────────────────────────────┐
│ 1. Order-Service (API)     │◄── Validación de entrada
│ OrderController.create     │
└──────┬─────────────────────┘
       │
       ▼
┌────────────────────────────┐
│ 2. Application Layer       │
│ OrderService.create()      │
└──────┬─────────────────────┘
       │
       ▼ Transaction
┌────────────────────────────────────────────────┐
│ 3. PostgreSQL (ACID Transaction)               │
│ ┌──────────────┐  ┌─────────────┐             │
│ │   orders     │  │ outbox_events│             │
│ │ - INSERT     │  │ - INSERT     │             │
│ │ status=PENDING│  │              │             │
│ └──────────────┘  └─────────────┘             │
└────────────────────────────────────────────────┘
       │
       ▼
┌────────────────────────────┐
│ 4. Commit Transaction      │◄── Garantía atómica
└──────┬─────────────────────┘
       │
       ▼ (Async)
┌────────────────────────────┐
│ 5. Outbox Worker (Polling) │
│ - Lee cada 5s              │
│ - Publica a RabbitMQ       │
└──────┬─────────────────────┘
       │
       ▼
┌────────────────────────────┐
│ 6. RabbitMQ Exchanges      │
│ - order_events             │
│ - inventory_events         │
│ - payment_events           │
└──────┬─────────────────────┘
       │
       ├──────────────┐
       ▼              ▼
┌─────────────┐ ┌─────────────┐
│  Inventory  │ │   Payment   │
│   Service   │ │   Service   │
└─────────────┘ └─────────────┘
```

### Flujo de Procesamiento de Eventos (Saga Pattern)

```
┌────────────────────────────────────────────────────────────────────┐
│              RabbitMQ Exchange: order_events                       │
└──────────┬─────────────────────────────────────────────────────────┘
           │ ORDER_CREATED event
           ▼
┌─────────────────────┐         ┌─────────────────────┐
│  Inventory-Service  │         │  Payment-Service    │
│  - Reserva stock    │         │  - Valida saldo     │
│  - Publica resultado│         │  - Publica resultado│
└──────────┬──────────┘         └──────────┬──────────┘
           │                               │
           ▼                               ▼
┌────────────────────────────────────────────────────────────────────┐
│    RabbitMQ Exchange: inventory_events / payment_events            │
└───────────────────┬────────────────────────────────────────────────┘
                    │
                    ▼
┌────────────────────────────────────────────────────────────────────┐
│              Order Workers (Consistent Hashing)                    │
│  - Worker_1: orderId hash range 0-49                               │
│  - Worker_2: orderId hash range 50-99                              │
└─────┬──────────────────────────────────────────────────────────────┘
      │
      ▼
┌────────────────────────────────────────────────────────────────────┐
│   7. Reconstrucción de Estado (Event Sourcing)                     │
│   a. Query event_store WHERE aggregate_id = :orderId               │
│   b. Aplica eventos en orden cronológico                           │
│   c. Estado actual = fold(events)                                  │
└─────┬──────────────────────────────────────────────────────────────┘
      │
      ▼
┌────────────────────────────────────────────────────────────────────┐
│   8. Detección de Inconsistencia                                   │
│   IF (payment=APPROVED && inventory=FAILED)                        │
│   THEN trigger compensation                                        │
└─────┬──────────────────────────────────────────────────────────────┘
      │
      ▼
┌────────────────────────────────────────────────────────────────────┐
│   9. Saga de Compensación                                          │
│   ┌─────────────────────────────────────────────────────────────┐ │
│   │ a. ORDER_CANCELLED → Outbox                                 │ │
│   │ b. ORDER_COMPENSATION_STARTED → Outbox                      │ │
│   │ c. ORDER_PAYMENT_ROLLBACK_REQUESTED → Outbox                │ │
│   └─────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────┘
```

### Diagrama de Estados de Orden

```
┌─────────┐    ┌──────────┐    ┌──────────┐
│ PENDING │───▶│ CONFIRMED│───▶│COMPLETED │
└────┬────┘    └──────────┘    └──────────┘
     │
     │ (fallo)
     ▼
┌──────────┐    ┌─────────────────────┐    ┌────────────┐
│CANCELLED │───▶│COMPENSATION_PENDING │───▶│COMPENSATED │
└──────────┘    └─────────────────────┘    └────────────┘
     │                                              │
     │                                              │
     ▼                                              │
┌─────────────────┐                                 │
│COMPENSATION_FAIL│◀────────────────────────────────┘
└─────────────────┘
```

---

## 4. Design Decisions & Trade-offs

| Decisión | Implementación | Alternativas | Trade-offs |
|----------|---------------|--------------|------------|
| **Event Sourcing** | Estado reconstruido desde eventos | CRUD tradicional | **Pros:** Auditabilidad completa, replay de eventos, debugging. **Contras:** Complejidad de implementación, curva de aprendizaje, requiere proyecciones para lecturas |
| **Outbox Pattern** | Tabla outbox_events + worker de polling | Transactional Outbox con CDC (Debezium) | **Pros:** Simple, sin dependencias externas. **Contras:** Latencia de 5s, no es real-time |
| **Saga (Coreografía)** | Servicios reaccionan a eventos | Saga Orquestada (con orquestador central) | **Pros:** Desacoplamiento, escalabilidad. **Contras:** Difícil de rastrear, debugging complejo |
| **Consistent Hashing** | Router en Order-Service con Redis | Round-robin simple | **Pros:** Orden de procesamiento garantizado para mismo orderId. **Contras:** Hot spots si orderIds no uniformes |
| **Hexagonal Architecture** | Ports (interfaces) + Adapters (implementaciones) | MVC, Layered | **Pros:** Testabilidad, independencia de frameworks, swap de tecnología. **Contras:** Boilerplate adicional |
| **PostgreSQL por servicio** | Cada servicio tiene su propia BD | Base de datos compartida | **Pros:** Independencia, aislamiento de fallos. **Contras:** Consistencia eventual compleja, joins distribuidos imposibles |
| **ECS en AWS** | EC2 con auto-scaling groups | EKS (Kubernetes), Fargate | **Pros:** Control total, costo predecible. **Contras:** Overhead de gestión, no serverless |

---

## 5. Design Journal (inferido)

### Suposiciones Implícitas del Diseño

1. **Consistencia eventual aceptable:** El sistema prioriza disponibilidad sobre consistencia fuerte (teorema CAP - partition tolerance + availability)
2. **Operaciones idempotentes:** Se asume que los eventos pueden ser procesados múltiples veces sin efectos secundarios (implementado con deduplicación Redis)
3. **Orden parcial garantizado:** Eventos del mismo orderId se procesan en orden, pero órdenes diferentes pueden procesarse concurrentemente
4. **Recuperación manual de DLQ:** Eventos que fallan repetidamente requieren intervención humana

### Razones Detrás de Decisiones Clave

| Decisión | Razón Probable |
|----------|---------------|
| **Polling 5s en Outbox** | Balance entre latencia aceptable y carga de base de datos |
| **RabbitMQ vs Kafka** | Simplicidad de operación, requisitos de throughput moderados |
| **PostgreSQL vs NoSQL** | ACID necesario para Event Store, soporte de JSON para eventos |
| **TypeScript + Node.js** | Ecosistema maduro, mismo lenguaje frontend/backend posible |
| **Docker Compose local + ECS prod** | Paridad de entornos, escalado horizontal en AWS |

### Prioridades del Diseño (ordenadas)

1. **Consistencia eventual garantizada** - Saga pattern con compensación
2. **Auditabilidad completa** - Event sourcing con event store inmutable
3. **Resiliencia** - Retries, DLQ, tolerancia a fallos de servicios
4. **Escalabilidad horizontal** - Stateless workers con partitiones
5. **Simplicidad operativa** - Evitar complejidad innecesaria

---

## 6. Cost Considerations & Optimization

### Componentes Generadores de Costo (AWS)

| Componente | Servicio AWS | Costo Estimado (mensual) |
|------------|--------------|--------------------------|
| Compute | ECS (t3.micro) | ~$15/mes por instancia |
| Base de Datos | RDS PostgreSQL | ~$15/mes (db.t3.micro) |
| Cache | ElastiCache Redis | ~$15/mes (cache.t3.micro) |
| Message Broker | ECS RabbitMQ | ~$15/mes |
| Load Balancer | ALB | ~$17/mes + $0.008/LCU |
| Logs | CloudWatch | ~$0.50/GB ingestado |
| ECR | Repositorios | ~$0.10/GB almacenado |

### Patrones de Optimización Implementados

1. **Autoscaling:**
   - Min: 1 instancia, Max: 2 (limitado explícitamente)
   - Target: CPU 70%

2. **Polling en Outbox:**
   - Intervalo de 5s reduce queries a BD
   - Workers duplicados para throughput (particionados)

3. **Consistent Hashing:**
   - Evita procesamiento duplicado innecesario
   - Distribución uniforme (suposición: orderIds uniformes)

### Riesgos de Costo con Tráfico Alto

| Escenario | Riesgo | Mitigación Actual |
|-----------|--------|-------------------|
| Outbox saturado | Workers no escalan automáticamente | Particionamiento fijo (2 workers) |
| Event Store creciendo | Almacenamiento infinito | No identificado - requiere archivado |
| Redis memoria llena | Deduplication keys acumulación | TTL no identificado |
| RDS conexiones | Pool agotado | Tamaño de pool no configurado |

---

## 7. Variants & Extensions

| Extensión | Caso de Uso | Complejidad | Cambios Requeridos |
|-----------|-------------|-------------|-------------------|
| **Webhook Notifications** | Notificar a sistemas externos | Media | Nuevo consumidor de eventos, gestión de retries |
| **Event Replay** | Reconstruir proyecciones | Media | API para re-procesar eventos históricos |
| **Multi-region** | Disaster recovery | Alta | Replicación de RDS, conflict resolution |
| **Real-time Analytics** | Dashboard de órdenes en vivo | Alta | Streaming (Kafka/Kinesis), materialized views |
| **ML Fraud Detection** | Detectar órdenes fraudulentas | Alta | Feature store, model serving, pipeline de eventos |
| **Inventory Event Sourcing** | Consistencia inventory | Media | Migrar inventory a Event Sourcing |
| **CQRS Separado** | Lecturas optimizadas | Alta | Proyecciones dedicadas, read models |

---

## 8. Security Considerations

### Autenticación

| Aspecto | Estado | Detalle |
|---------|--------|---------|
| API Authentication | **No identificado** | No se observa JWT, API keys, ni OAuth |
| RabbitMQ Auth | **Básico** | Username/password en variables de entorno |
| Database Auth | **Básico** | PostgreSQL user/password |

### Autorización

| Aspecto | Estado | Detalle |
|---------|--------|---------|
| Role-based access | **No implementado** | No se observan roles ni permisos |
| Resource-level auth | **No identificado** | Cualquier cliente puede consultar cualquier orden |

### Manejo de Secretos

| Secreto | Almacenamiento | Problema |
|---------|---------------|----------|
| DATABASE_URL | AWS SSM | ✅ Correcto |
| RabbitMQ credentials | AWS SSM | ✅ Correcto |
| Redis URL | AWS SSM | ✅ Correcto |

### Superficie de Ataque Evidente

1. **Exposición de datos sensibles:** Respuestas HTTP incluyen datos completos de órdenes sin filtrar
2. **Inyección SQL:** Uso de pg-format con queries dinámicas (riesgo potencial)
3. **Rate limiting:** No identificado en endpoints HTTP
4. **TLS:** No identificado (suposición: AWS ALB maneja TLS termination)

### Riesgos

| Riesgo | Severidad | Mitigación Sugerida |
|--------|-----------|-------------------|
| Data exposure | Alto | Implementar autenticación JWT, autorización por customerId |
| SQL Injection | Medio | Usar queries parametrizadas, validar inputs |
| DoS | Medio | Implementar rate limiting en API Gateway |

---

## 9. Limitations / Non-Goals

### Qué el Sistema NO Hace

| Funcionalidad | Estado | Nota |
|---------------|--------|------|
| Autenticación/Autorización | **No implementado** | Cualquier cliente puede acceder a cualquier recurso |
| Catálogo de productos | **No identificado** | Asume productId existentes |
| Gestión de usuarios | **No identificado** | Asume customerId existentes |
| Notificaciones (email/SMS) | **No implementado** | Podría extenderse con webhook |
| Reporting/Analytics | **No implementado** | Requiere proyecciones adicionales |
| Multi-tenancy | **No identificado** | Datos no aislados por tenant |
| Archivado de eventos | **No implementado** | Event store crece indefinidamente |

### Casos de Uso No Cubiertos

1. **Modificación de órdenes:** Solo creación y consulta, no actualización
2. **Devoluciones parciales:** Saga solo soporta cancelación completa
3. **Reservas temporales:** Inventario reservado permanentemente hasta cancelación
4. **Concurrencia de edición:** No hay optimistic locking en entidades

### Restricciones Técnicas Visibles

| Restricción | Impacto |
|-------------|---------|
| Workers fijos (2 particiones) | Throughput limitado, requiere reconfiguración para escalar |
| Polling 5s en Outbox | Latencia mínima de 5s para eventos |
| Sin CDC (Change Data Capture) | Outbox requerido, no puede usar Debezium u otra alternativa |
| Sin schema registry | Eventos validados solo en runtime |
| PostgreSQL single-node | Punto único de fallo en persistencia |

### Supuestos Críticos

- **RabbitMQ siempre disponible:** Sin circuit breaker identificado
- **Redis no pierde datos:** Deduplicación fallaría si Redis se reinicia
- **OrderIds distribuidos uniformemente:** Hot spots posibles en workers
- **Eventos inmutables:** No hay migración de eventos históricos

---

## 10. AWS Infrastructure Architecture

### 10.1 Diagrama de Infraestructura AWS

```
                                    ┌─────────────────────────────┐
                                    │         INTERNET            │
                                    └─────────────┬───────────────┘
                                                  │ HTTPS (443)
                                                  ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                              AWS VPC                                              │
│  ┌─────────────────────────────────────────────────────────────────────────────┐│
│  │                         AVAILABILITY ZONE A                                   ││
│  │                                                                              ││
│  │  ┌───────────────────────────────┐                                          ││
│  │  │  Application Load Balancer   │                                          ││
│  │  │         (ALB)                │                                          ││
│  │  │   - Port: 80                 │                                          ││
│  │  │   - Type: Application        │                                          ││
│  │  │   - Scheme: Internet-facing  │                                          ││
│  │  └───────────────┬───────────────┘                                          ││
│  │                  │                                                          ││
│  │                  ▼                                                          ││
│  │  ┌─────────────────────────────────────────────────────────────────────┐   ││
│  │  │                     ECS: services-cluster                          │   ││
│  │  │  ┌─────────────────────────────────────────────────────────────────┐│   ││
│  │  │  │ Auto Scaling Group (t3.micro)                                  ││   ││
│  │  │  │ Min: 1 | Max: 2 | Desired: 1                                 ││   ││
│  │  │  └─────────────────────────────────────────────────────────────────┘│   ││
│  │  │                              │                                       │   ││
│  │  │         ┌────────────────────┼────────────────────┐                  │   ││
│  │  │         ▼                    ▼                    ▼                  │   ││
│  │  │  ┌───────────────┐   ┌───────────────┐   ┌───────────────┐           │   ││
│  │  │  │ ECS Service:  │   │ ECS Service:  │   │ ECS Service:  │           │   ││
│  │  │  │ order-service │   │ inventory-svc │   │ payment-svc   │           │   ││
│  │  │  │ (Port: 3000)  │   │ (Worker)      │   │ (Worker)      │           │   ││
│  │  │  │ - Container   │   │ - Container   │   │ - Container   │           │   ││
│  │  │  │ - Outbox      │   │ - Consumer    │   │ - Consumer    │           │   ││
│  │  │  │   Worker      │   │               │   │               │           │   ││
│  │  │  └───────┬───────┘   └───────┬───────┘   └───────┬───────┘           │   ││
│  │  │          │                   │                   │                   │   ││
│  │  └──────────┼───────────────────┼───────────────────┼───────────────────┘   ││
│  │             │                   │                   │                        ││
│  │             └───────────────────┬┴┬───────────────────┘                        ││
│  │                                 ││                                         ││
│  │                                 ▼│                                         ││
│  │  ┌─────────────────────────────────────────────────────────────────────┐   ││
│  │  │              Cloud Map / Service Connect                            │   ││
│  │  │  Namespace: commerce-platform.local                                │   ││
│  │  │                                                                     │   ││
│  │  │  ┌─────────────────────┐    ┌─────────────────────┐               │   ││
│  │  │  │ Service Discovery:   │    │ Service Discovery:   │               │   ││
│  │  │  │ - order-service      │    │ - rabbitmq         │               │   ││
│  │  │  │   (SRV records)      │    │   (A record)         │               │   ││
│  │  │  └─────────────────────┘    └─────────────────────┘               │   ││
│  │  └─────────────────────────────────────────────────────────────────────┘   ││
│  │                                 │                                         ││
│  └─────────────────────────────────┼───────────────────────────────────────────┘│
│                                    │                                           │
│  ┌───────────────────────────────────────────────────────────────────────────┐│
│  │                       ECS: rabbitmq-cluster                                ││
│  │  ┌─────────────────────────────────────────────────────────────────────┐  ││
│  │  │               RabbitMQ Service (t3.micro)                          │  ││
│  │  │                                                                     │  ││
│  │  │  ┌─────────────────────────┐  ┌─────────────────────────┐          │  ││
│  │  │  │ Port: 5672 (AMQP)       │  │ Port: 15672 (HTTP)     │          │  ││
│  │  │  │ Service Connect: rabbitmq│  │ Management Console     │          │  ││
│  │  │  └─────────────────────────┘  └─────────────────────────┘          │  ││
│  │  │                                                                     │  ││
│  │  └─────────────────────────────────────────────────────────────────────┘  ││
│  └───────────────────────────────────────────────────────────────────────────┘│
│                                                                               │
│  ┌───────────────────────────────────────────────────────────────────────────┐
│  │                         DATA LAYER                                         │
│  │                                                                            │
│  │  ┌─────────────────────┐  ┌─────────────────────┐  ┌───────────────────┐ │
│  │  │   RDS PostgreSQL    │  │   RDS PostgreSQL    │  │  ElastiCache      │ │
│  │  │   order-service-db  │  │   inventory-svc-db  │  │  Redis (v7)       │ │
│  │  │                     │  │                     │  │                   │ │
│  │  │  - Instance: db.    │  │  - Instance: db.    │  │  - Node: cache. │ │
│  │  │    t3.micro         │  │    t3.micro         │  │    t3.micro       │ │
│  │  │  - Storage: 20GB    │  │  - Storage: 20GB    │  │  - Engine: Redis  │ │
│  │  │  - Multi-AZ: No     │  │  - Multi-AZ: No     │  │  - Port: 6379    │ │
│  │  │  - Encrypted: KMS   │  │  - Encrypted: KMS   │  │  - AZ: single    │ │
│  │  │                     │  │                     │  │                   │ │
│  │  │  Subnet Group:      │  │  Subnet Group:      │  │  Subnet Group:    │ │
│  │  │  private-subnets    │  │  private-subnets    │  │  private-subnets  │ │
│  │  └─────────────────────┘  └─────────────────────┘  └───────────────────┘ │
│  │                                                                            │
│  └───────────────────────────────────────────────────────────────────────────┘
│                                                                               │
│  ┌───────────────────────────────────────────────────────────────────────────┐
│  │                         SECURITY LAYER                                     │
│  │                                                                            │
│  │  ┌───────────────────────────────────────────────────────────────────┐    │
│  │  │                    Security Groups                                │    │
│  │  │                                                                     │    │
│  │  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │    │
│  │  │  │ order-svc-sg │  │  rabbitmq-sg │  │   rds-sg     │          │    │
│  │  │  │ - ALB:80     │  │ - AMQP:5672  │  │ - RDS:5432   │          │    │
│  │  │  │ - Inbound    │  │ - Mgmt:15672 │  │ - Internal   │          │    │
│  │  │  └──────────────┘  └──────────────┘  └──────────────┘          │    │
│  │  │                                                                     │    │
│  │  │  ┌──────────────┐  ┌──────────────┐                               │    │
│  │  │  │  redis-sg    │  │  common-sg   │                               │    │
│  │  │  │ - Redis:6379 │  │ - Internal   │                               │    │
│  │  │  │ - Internal   │  │   traffic    │                               │    │
│  │  │  └──────────────┘  └──────────────┘                               │    │
│  │  └───────────────────────────────────────────────────────────────────┘    │
│  │                                                                            │
│  └───────────────────────────────────────────────────────────────────────────┘
└──────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                          MANAGEMENT & OPERATIONS                                 │
│                                                                                  │
│  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────────┐  │
│  │   Amazon ECR        │  │   CloudWatch Logs   │  │   AWS SSM               │  │
│  │                     │  │                     │  │   Parameter Store       │  │
│  │  Repositories:      │  │  Log Groups:        │  │                         │  │
│  │  - order-service    │  │  - /ecs/order-service│  │  Secure Parameters:     │  │
│  │  - inventory-service│  │  - /ecs/inventory   │  │  - DATABASE_URL         │  │
│  │  - payment-service  │  │  - /ecs/payment     │  │  - REDIS_HOST           │  │
│  │  - rabbitmq         │  │  - /ecs/rabbitmq    │  │  - RABBITMQ_USER        │  │
│  │                     │  │                     │  │  - RABBITMQ_PASSWORD    │  │
│  │  Lifecycle:         │  │  Retention:         │  │                         │  │
│  │  - Untagged: 7d     │  │  - Not configured   │  │  KMS Encryption: Yes    │  │
│  │  - Keep: 3 recent   │  │                     │  │                         │  │
│  └─────────────────────┘  └─────────────────────┘  └─────────────────────────┘  │
│                                                                                  │
│  ┌─────────────────────┐  ┌─────────────────────┐                               │
│  │   CloudWatch Alarms │  │   KMS Keys          │                               │
│  │                     │  │                     │                               │
│  │  - CPU High (70%)   │  │  Key Purpose:       │                               │
│  │  - Memory High      │  │  - RDS encryption   │                               │
│  │  - Action: Notify     │  │  - SSM encryption     │                               │
│  │                     │  │                     │                               │
│  └─────────────────────┘  └─────────────────────┘                               │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                          IAM & ROLES                                             │
│                                                                                  │
│  ┌───────────────────────────────┐  ┌─────────────────────────────────────────┐  │
│  │  ECS Task Execution Role      │  │  ECS Task Roles                         │  │
│  │                               │  │                                         │  │
│  │  Permissions:                 │  │  - order-service-task-role              │  │
│  │  - ECR: Pull images            │  │    (SSM read, CloudWatch logs)          │  │
│  │  - CloudWatch: Write logs      │  │                                         │  │
│  │  - SSM: Read parameters      │  │  - inventory-service-task-role          │  │
│  │                               │  │    (SSM read, CloudWatch logs)          │  │
│  │  Role ARN:                    │  │                                         │  │
│  │  arn:aws:iam::...:ecsTaskExec  │  │                                         │  │
│  └───────────────────────────────┘  └─────────────────────────────────────────┘  │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────────┐  │
│  │                      ECS Instance Profile                                   │  │
│  │                                                                             │  │
│  │  Permissions:                                                               │  │
│  │  - ECS: Register container instances                                       │  │
│  │  - ECS: Poll for tasks                                                      │  │
│  │  - ECR: Pull images                                                         │  │
│  │  - CloudWatch: Put logs                                                     │  │
│  └─────────────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 10.2 Descripción de Servicios AWS Utilizados

#### Networking

| Servicio | Uso | Configuración |
|----------|-----|---------------|
| **VPC** | Red aislada para todos los recursos | Default VPC (no identificado si es custom) |
| **Subnets** | Ubicación de recursos | Private subnets (ids pasados por variable) |
| **Security Groups** | Control de tráfico | 5 SGs: order-service, rabbitmq, rds, redis, common |
| **Cloud Map** | Service Discovery | Namespace: `commerce-platform.local` |

#### Compute (ECS)

| Cluster | Propósito | Tipo de Instancia | Escalado |
|---------|-----------|-------------------|----------|
| **services-cluster** | Microservicios de aplicación | t3.micro | Min: 1, Max: 2, Desired: 1 |
| **rabbitmq-cluster** | Message broker dedicado | t3.micro | Min: 1, Max: 1, Desired: 1 |

| Servicio | Tipo | Puertos | Características |
|----------|------|---------|---------------|
| **order-service** | Web API + Workers | 3000 (HTTP) | Exposición via ALB, Service Connect |
| **inventory-service** | Worker | N/A | Consumer de eventos, Service Connect |
| **payment-service** | Worker | N/A | Consumer de eventos, Service Connect |
| **rabbitmq** | Message Broker | 5672 (AMQP), 15672 (HTTP) | Service Connect, management UI |

#### Data Stores

| Servicio | Uso | Instancia | Almacenamiento | Encriptación |
|----------|-----|-----------|----------------|--------------|
| **RDS PostgreSQL** | Event Store + Outbox (order) | db.t3.micro | 20GB (default) | KMS |
| **RDS PostgreSQL** | Inventario + Reservas | db.t3.micro | 20GB (default) | KMS |
| **ElastiCache Redis** | Deduplicación de mensajes | cache.t3.micro | N/A | No (in-memory) |

#### Load Balancing

| Componente | Tipo | Propósito |
|------------|------|-----------|
| **Application Load Balancer** | Internet-facing | Punto de entrada HTTPS para order-service |
| **Target Group** | order-service | Port: 3000, Health checks: HTTP |

#### Container Registry

| Repositorio | Política de Lifecycle | Propósito |
|-------------|----------------------|-----------|
| **order-service** | Untagged: 7 días, Keep: 3 últimas | Imagen del servicio de órdenes |
| **inventory-service** | Untagged: 7 días, Keep: 3 últimas | Imagen del servicio de inventario |
| **payment-service** | Untagged: 7 días, Keep: 3 últimas | Imagen del servicio de pagos |
| **rabbitmq** | Untagged: 7 días, Keep: 3 últimas | Imagen de RabbitMQ (tag: 3-management-alpine) |

### 10.3 Comunicación entre Servicios AWS

#### Service Connect (AWS Cloud Map)

```
┌─────────────────────────────────────────────────────────────────┐
│               Service Connect Architecture                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   Namespace: commerce-platform.local                           │
│   ├── order-service.commerce-platform.local:3000               │
│   ├── rabbitmq.commerce-platform.local:5672                     │
│   └── rabbitmq.commerce-platform.local:15672 (management)     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

| Servicio Origen | Servicio Destino | Mecanismo | Puerto |
|-----------------|------------------|-----------|--------|
| order-service | rabbitmq | Service Connect DNS | 5672 |
| inventory-service | rabbitmq | Service Connect DNS | 5672 |
| payment-service | rabbitmq | Service Connect DNS | 5672 |
| order-service | redis | SSM Parameter (endpoint) | 6379 |
| order-service | RDS (order-db) | SSM Parameter (DATABASE_URL) | 5432 |
| inventory-service | RDS (inventory-db) | SSM Parameter (DATABASE_URL) | 5432 |

#### Flujo de Tráfico

```
Cliente
    │
    │ HTTPS (443)
    ▼
┌──────────────┐
│   Route 53   │ (No identificado - suposición: DNS externo)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│     ALB      │ (Application Load Balancer)
│  Port: 80    │
└──────┬───────┘
       │
       │ HTTP (3000)
       ▼
┌──────────────┐
│ ECS Service  │ (order-service)
│  Container   │
└──────┬───────┘
       │
       ├──────────────┐
       │              │
       ▼              ▼
┌──────────┐ ┌──────────┐
│   RDS    │ │  Redis   │
│PostgreSQL│ │  Cache   │
└──────────┘ └──────────┘
       │
       ▼
┌──────────┐
│ RabbitMQ │ (vía Service Connect)
└──────┬───┘
       │
       ├──────────────┐
       ▼              ▼
┌──────────┐ ┌──────────┐
│ Inventory│ │ Payment  │
│ Service  │ │ Service  │
└──────────┘ └──────────┘
       │              │
       ▼              ▼
┌──────────┐ ┌──────────┐
│   RDS    │ │   RDS    │
│PostgreSQL│ │PostgreSQL│
└──────────┘ └──────────┘
```

### 10.4 Configuración de Seguridad en AWS

#### Security Groups - Reglas de Entrada

| Security Group | Puerto | Origen | Descripción |
|----------------|--------|--------|-------------|
| **order-service-sg** | 80 | 0.0.0.0/0 | ALB → Internet |
| **order-service-sg** | 3000 | ALB SG | ALB → order-service |
| **rabbitmq-sg** | 5672 | Common SG | Servicios → AMQP |
| **rabbitmq-sg** | 15672 | Internal | Management UI |
| **rds-sg** | 5432 | Common SG | Servicios → PostgreSQL |
| **redis-sg** | 6379 | Common SG | Servicios → Redis |
| **common-sg** | Todo | VPC | Tráfico interno |

#### Gestión de Secretos (SSM Parameter Store)

| Parámetro | Tier | Encriptación | Uso |
|-----------|------|--------------|-----|
| `/commerce-platform/order-service/db-url` | Standard | KMS | Connection string PostgreSQL |
| `/commerce-platform/inventory-service/db-url` | Standard | KMS | Connection string PostgreSQL |
| `/commerce-platform/redis/host` | Standard | KMS | Endpoint Redis |
| `/commerce-platform/rabbitmq/username` | Standard | KMS | Usuario RabbitMQ |
| `/commerce-platform/rabbitmq/password` | Standard | KMS | Contraseña RabbitMQ |

**Nota:** Los secrets se inyectan en los contenedores vía `secrets` en la definición de task de ECS, no como variables de entorno.

### 10.5 Monitoreo y Observabilidad

#### CloudWatch Logs

| Log Group | Fuente | Retención |
|-----------|--------|-----------|
| `/ecs/order-service` | order-service containers | No configurada (default: indefinida) |
| `/ecs/inventory-service` | inventory-service containers | No configurada |
| `/ecs/payment-service` | payment-service containers | No configurada |
| `/ecs/rabbitmq` | rabbitmq containers | No configurada |

**Log Configuration en ECS:**
- Log Driver: awslogs
- Region: us-east-2 (configurable)
- Stream prefix: ecs

#### CloudWatch Alarms (Identificadas)

| Alarma | Métrica | Umbral | Acción |
|--------|---------|--------|--------|
| **CPU High** | CPUUtilization | > 70% | Escalado hacia arriba |
| **Memory High** | MemoryUtilization | > 70% | Notificación |

**Nota:** Las alarmas están configuradas pero sin SNS topic identificado (posiblemente no notifican aún).

### 10.6 Design Decisions - Infrastructure

| Decisión | Implementación | Alternativas | Trade-offs |
|----------|---------------|--------------|------------|
| **EC2 vs Fargate** | EC2 con ASG | AWS Fargate (serverless) | **Pros:** Control total, predecible. **Contras:** Overhead de gestión de EC2 |
| **ALB vs NLB** | ALB (Application) | NLB (Network) | **Pros:** HTTP routing, health checks avanzados. **Contras:** Solo L7, más costoso |
| **Single-AZ vs Multi-AZ** | Single-AZ | Multi-AZ RDS, Multi-subnet ECS | **Pros:** Costo reducido (~50%). **Contras:** Punto único de fallo en AZ |
| **Service Connect vs NLB** | Service Connect (Cloud Map) | NLB por servicio | **Pros:** DNS interno, load balancing L4. **Contras:** Complejidad, solo intra-VPC |
| **RDS db.t3.micro** | Burstable | db.t2, Serverless Aurora | **Pros:** Costo mínimo, acumulación de créditos. **Contras:** Performance inconsistente |
| **KMS vs no encryption** | KMS encryption | Sin encriptación | **Pros:** Compliance, seguridad. **Contras:** Latencia mínima, costo KMS |
| **ECR Lifecycle** | 7 días untagged, keep 3 | Sin lifecycle | **Pros:** Ahorro de almacenamiento. **Contras:** Posible pérdida de imágenes |

### 10.7 Costos Estimados de Infraestructura AWS

#### Costos Fijos Mensuales (aproximados)

| Servicio | Componente | Costo Unitario | Cantidad | Total |
|----------|------------|----------------|----------|-------|
| **EC2** | t3.micro (Linux) | ~$8.50/mes | 2 (1 por cluster) | ~$17/mes |
| **RDS** | db.t3.micro | ~$13/mes | 2 instancias | ~$26/mes |
| **ElastiCache** | cache.t3.micro | ~$12.50/mes | 1 nodo | ~$12.50/mes |
| **ALB** | Application LB | ~$16.50/mes + $0.008/LCU | 1 | ~$16.50/mes |
| **ECR** | Almacenamiento | ~$0.10/GB | ~1GB | ~$0.10/mes |
| **CloudWatch** | Logs (1GB/mes) | ~$0.50/GB | ~1GB | ~$0.50/mes |
| **KMS** | Requests + Keys | ~$1/mes | 1 key | ~$1/mes |
| **VPC** | Data transfer | Variable | - | ~$5/mes |
| **Data Transfer** | Saliente | $0.09/GB | <10GB | ~$1/mes |

**Costo Total Estimado: ~$80-100/mes**

#### Optimizaciones de Costo Implementadas

1. **t3.micro en todas partes**: Instancia más pequeña soportada
2. **Single-AZ**: Sin redundancia de AZ para reducir costos
3. **ECR Lifecycle**: Eliminación automática de imágenes antiguas
4. **ASG con min=1**: Siempre al menos una instancia, pero permite escalar
5. **Service Connect**: Sin costo adicional (incluido en ECS), vs NLB ($16/mes cada uno)

#### Riesgos de Costo

| Escenario | Impacto | Probabilidad | Mitigación |
|-----------|---------|--------------|------------|
| **RDS storage overflow** | Alto costo si se usa más de 20GB | Media | Monitoreo no implementado |
| **CloudWatch logs sin retención** | Costo creciente indefinido | Media | Retención no configurada |
| **Data transfer alto** | $0.09/GB puede acumularse | Baja | Suposición: tráfico bajo |
| **KMS API requests** | $0.03/10,000 requests | Baja | Uso mínimo esperado |

### 10.8 Variants & Extensions - Infrastructure

| Extensión | Caso de Uso | Cambios Requeridos | Costo Adicional |
|-----------|-------------|-------------------|-----------------|
| **Multi-AZ RDS** | Alta disponibilidad | Enable Multi-AZ, agregar subnet en AZ B | ~2x costo RDS |
| **RDS Read Replicas** | Escalar lecturas | Crear réplica, modificar conexión | ~1x costo RDS por réplica |
| **CloudFront** | CDN para estáticos | Distribución CloudFront, origin ALB | ~$0.085/GB transferido |
| **WAF** | Protección web | Web ACL, reglas rate limiting | ~$5/mes + $1/rule |
| **Auto-scaling avanzado** | Escalado por métricas | Target tracking, step scaling | Sin costo adicional |
| **ECS Fargate** | Eliminar gestión EC2 | Migrar de EC2 a Fargate | ~20% más costoso |
| **Aurora Serverless** | BD serverless | Migrar RDS a Aurora v2 | Costo variable, mayor en idle |
| **PrivateLink** | Conexión con terceros | VPC Endpoints | ~$0.01/hr por AZ |

### 10.9 Limitations / Non-Goals - Infrastructure

#### Qué la Infraestructura NO Implementa

| Funcionalidad | Estado | Impacto |
|---------------|--------|---------|
| **Multi-AZ** | No implementado | Punto único de fallo en AZ |
| **Backup automatizado RDS** | No identificado | Riesgo de pérdida de datos |
| **Disaster Recovery** | No implementado | No hay plan de recuperación |
| **SSL/TLS en ALB** | No identificado | Tráfico en texto plano HTTP |
| **CDN (CloudFront)** | No implementado | Latencia alta para usuarios lejanos |
| **VPC Flow Logs** | No identificado | Sin visibilidad de tráfico de red |
| **AWS Config** | No identificado | Sin auditoría de cambios |
| **GuardDuty** | No identificado | Sin detección de amenazas |
| **Private Subnets (NAT)** | No identificado | Servicios sin acceso a internet saliente |
| **Bastion Host / VPN** | No identificado | Sin acceso seguro a recursos privados |

#### Limitaciones Técnicas de la Infraestructura Actual

| Limitación | Descripción |
|------------|-------------|
| **Máximo 2 instancias por cluster** | ASG limitado a max_size=2, cuello de botella en carga |
| **Sin NAT Gateway** | Si los servicios necesitan salida a internet, fallarán |
| **Sin health checks custom** | Health checks básicos HTTP, no validan dependencias |
| **Rollback manual de deployments** | Sin pipeline CI/CD, deployments manuales |
| **Sin monitoreo de RDS** | CloudWatch básico, sin métricas de query performance |
| **Secrets en SSM sin rotación** | Contraseñas estáticas, sin rotación automática |

### 10.10 Security Considerations - Infrastructure

#### Superficie de Ataque en AWS

| Vector | Estado | Riesgo |
|--------|--------|--------|
| **Security Groups con 0.0.0.0/0** | Identificado en ALB | Bajo (ALB debe ser público) |
| **Sin WAF** | No implementado | Alto (inyecciones SQL, XSS) |
| **Sin Shield/DDoS protection** | No implementado | Medio (vulnerable a DoS) |
| **SSM parameters sin rotación** | Identificado | Medio (credenciales estáticas) |
| **Sin AWS Secrets Manager** | Usa SSM Parameters | Bajo (SSM es seguro, sin rotación) |
| **IAM roles con permisos amplios** | No auditado | No identificado |
| **Sin VPC Flow Logs** | No implementado | Medio (sin auditoría de tráfico) |

#### Riesgos Específicos de Infraestructura

| Riesgo | Severidad | Mitigación Sugerida |
|--------|-----------|---------------------|
| **Exposición directa de RDS** | Alto | Security Group solo permite tráfico desde common-sg |
| **Redis sin autenticación** | Alto | ElastiCache Redis requiere auth token (no identificado si configurado) |
| **ALB sin HTTPS** | Alto | Agregar certificado ACM y redirección HTTPS |
| **Secrets hardcodeados** | Medio | Usar SSM Parameter Store (ya implementado ✅) |
| **Sin CloudTrail** | Medio | Habilitar CloudTrail para auditoría de API calls |

---

## Referencias

- **Event Sourcing:** Martin Fowler - https://martinfowler.com/eaaDev/EventSourcing.html
- **Outbox Pattern:** Microservices.io - https://microservices.io/patterns/data/transactional-outbox.html
- **Saga Pattern:** Microservices.io - https://microservices.io/patterns/data/saga.html
- **Consistent Hashing:** DynamoDB Paper - https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf
