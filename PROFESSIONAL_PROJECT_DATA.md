# Professional Project Data

```yaml
id: "whatsapp-sales-assistant"
title:
  en: "WhatsApp Sales Assistant - Corpelec SAS"
  es: "Asistente de Ventas WhatsApp - Corpelec SAS"
subtitle:
  en: "Context-Aware AI Sales Automation"
  es: "Automatización de Ventas con IA y Contexto Conversacional"
description:
  en: "Backend platform for a WhatsApp sales assistant that helps customers find technology products, check availability, request business information, and escalate to a human advisor. The bot uses structured conversation context to safely handle follow-ups, product selections, budgets, and human handoff without relying on ungrounded AI memory."
  es: "Plataforma backend para un asistente de ventas por WhatsApp que ayuda a clientes a encontrar productos tecnológicos, consultar disponibilidad, pedir información del negocio y escalar a un asesor humano. El bot usa contexto conversacional estructurado para manejar seguimientos, selección de productos, presupuestos y derivación humana sin depender de memoria no verificada de IA."
challenge:
  en: "Prevent AI hallucinations while preserving conversational continuity, so customers can ask follow-up questions like cheaper options, product details, budgets, or advisor requests without the bot losing context."
  es: "Evitar alucinaciones de IA manteniendo continuidad conversacional, para que los clientes puedan hacer seguimientos como opciones más económicas, detalles de producto, presupuestos o solicitud de asesor sin que el bot pierda el contexto."
solution:
  en: "Implemented a TypeScript/Express backend integrated with WAHA, Supabase/PostgreSQL RPCs, deterministic intent routing, tool validation, grounded response validation, and fallback AI providers. Built a structured bot context layer that persists the latest intent, category, tool call, tool arguments, shown product IDs, product snapshots, and handoff status to resolve follow-ups safely and feed compact state summaries into AI prompts."
  es: "Se implementó un backend en TypeScript/Express integrado con WAHA, RPCs de Supabase/PostgreSQL, enrutamiento determinístico, validación de herramientas, validación de respuestas fundamentadas y proveedores de IA de respaldo. Se construyó una capa de contexto estructurado del bot que persiste la última intención, categoría, herramienta usada, argumentos, IDs de productos mostrados, snapshots de productos y estado de derivación para resolver seguimientos de forma segura y alimentar prompts de IA con resúmenes compactos."
results:
  en:
    - "Enabled context-aware follow-ups such as “the second one,” “more info about the Tiny,” “up to 2 million,” and “cheaper options” using persisted structured state."
    - "Reduced hallucination risk by forcing product, price, stock, schedule, location, payment, and service answers through database-backed tools or approved knowledge."
    - "Preserved human handoff state so automated replies stop after an advisor is requested."
  es:
    - "Permitió seguimientos con contexto como “el segundo”, “más info del Tiny”, “hasta 2 millones” y “opciones más económicas” usando estado estructurado persistido."
    - "Redujo el riesgo de alucinaciones obligando respuestas sobre productos, precios, stock, horarios, ubicación, pagos y servicios a pasar por herramientas respaldadas por base de datos o conocimiento aprobado."
    - "Conservó el estado de derivación humana para detener respuestas automáticas después de solicitar un asesor."
techStack:
  - "TypeScript"
  - "Node.js"
  - "Express"
  - "Supabase"
  - "PostgreSQL"
  - "WAHA"
  - "OpenRouter/Groq"
  - "Docker"
imageUrls: []
linkTarget: null
hasDetailPage: false
```

## Suggested screenshots/assets

- Screenshot 1: WhatsApp conversation showing a product list followed by “more info about the second one.”
- Screenshot 2: WhatsApp conversation showing category context plus budget follow-up.
- Screenshot 3: Architecture diagram highlighting WAHA, intent router, Supabase tools, AI fallback, and conversation context storage.
- Screenshot 4: Admin/API documentation for products, knowledge entries, and business data.
