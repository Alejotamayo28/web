import { CvData } from "@/types/cv";

export const cvData: CvData = {
  name: "Alejandro Vergara Tamayo",
  title: "Backend Developer (Node.js | TypeScript | SQL | Docker | AWS)",
  contact: {
    email: "alejandropucca0@gmail.com",
    phone: "+57 316 5087855",
    location: "Cali, Colombia",
  },
  summary: "Backend Developer con experiencia en sistemas en producción (Node.js, TypeScript, PostgreSQL, Docker, AWS, RabbitMQ). He diseñado y optimizado APIs REST/gRPC, bases de datos relacionales y flujos de despliegue automatizados. Busco aportar mis habilidades en microservicios y cloud a equipos dinámicos de alto impacto",
  experience: [
    {
      role: "Desarrollador Backend",
      period: "2025 - 2025",
      company: "Zapenu (startup)",
      location: "Remoto",
      tags: [
        "TypeScript", "Node.js", "Express", "Tsoa", "PostgreSQL", "Supabase", "AWS", "VPS", "Docker", "Cloudflare", "gRPC", "Swagger", "Microservicios"
      ],
      achievements: [
        "Diseñé modelo relacional en PostgreSQL para productos y menús, soportando +10k items por tienda con consultas rápidas bajo carga.",
        "Implementé comunicación entre microservicios con gRPC, reduciendo en 40% la latencia de llamadas críticas.",
        "Introduje TSOA con Swagger, mejorando la validación de entradas y acelerando las pruebas frontend-backend.",
        "Diseñé el sistema de subida de archivos binarios en Cloudflare R2, reemplazando un flujo anterior que generaba errores frecuentes.",
        "Creé migraciones y consultas SQL optimizadas que redujeron tiempos de lectura/escritura en 25%",
        "Participé en la integración de OmniPago con MercadoPago y Nequi, ampliando métodos de pago soportados.",
        "Mantuve código heredado y adapté clases antiguas, garantizando compatibilidad y escalabilidad del sistema.",
        "Colaboré en decisiones técnicas de backend y DevOps con impacto directo en producción."
      ]
    },
    {
      role: "Desarrollador Backend - Proyecto Personal",
      period: "2024 - 2025",
      company: "Plataforma de Despliegue Automatizado",
      location: "Remoto",
      tags: ["Typescript", "Node.js", "AWS", "Docker", "Cloudflare Workers", "Telegram API"],
      achievements: [
        "Construí un bot en Cloudflare Workers que automatiza despliegues Docker en AWS EC2, reduciendo tiempos de 20min a 3min.",
        "Automaticé instalación de Docker, ejecución de contenedores y monitoreo con CloudWatch, eliminando errores manuales.",
        "Integré con DockerHub para que usuarios gestionen imágenes y visualicen estado de instancias en tiempo real."
      ],
      linkedinLink: "https://www.linkedin.com/in/alejandro-vergara-tamayo-/"
    },
    {
      role: "Desarrollador Backend - Proyecto Personal",
      period: "2024 - 2024",
      company: "FitTracker: Asistente de Gimnasio",
      location: "Remoto",
      tags: ["Typescript", "PostgreSQL", "Node.js", "Docker", "Telegram API"],
      achievements: [
        "Desarrollé bot de Telegram para registrar y consultar entrenamientos, alcanzando +10 usuarios activos.",
        "Implementé autenticación y sesiones estilo Netflix para compartir progresos familiares.",
        "Optimicé PostgreSQL con consultas dinámicas por intervalos (diarios, semanales, mensuales)."
      ],
      repoLink: "https://github.com/Alejotamayo28/fit-tracker-bot",
    }
  ],
  education: [
    {
      degree: "Tecnología en Desarrollo de Software",
      period: "2024 - Actualidad",
      institution: "Universidad del Valle",
    },
    {
      degree: "Bachiller Académico",
      period: "2022",
      institution: "Institución Educativa Cárdenas Centro",
    },
    {
      degree: "Inglés Avanzado (B2/C1 certificado)",
      period: "2019",
      institution: "English Now Institute",
    }
  ],
  skills: {
    languages: [
      { name: "TypeScript", level: "Avanzado" },
      { name: "JavaScript", level: "Intermedio" },
      { name: "SQL", level: "Intermedio" },
    ],
    backend: [
      { name: "Node.js" },
      { name: "Express.js" },
      { name: "GRPC" },
      { name: "Microservicios" },
      { name: "API Design" },
    ],
    databases: [
      { name: "PostgreSQL" },
      { name: "Supabase" },
      { name: "Database Design" },
    ],
    cloud: [
      { name: "AWS (EC2, S3, CloudWatch)" },
      { name: "Docker" },
      { name: "Cloudflare (Workers, R2)" },
      { name: "CI/CD" },
      { name: "VPS Management" }
    ],
    documentation: [
      { name: "TSOA/Swagger" },
      { name: "API Documentation" },
      { name: "Technical Writing" },
    ],
    tools: [
      { name: "Git" },
      { name: "Insomnia" },
    ],
    integrations: [
      { name: "Payment Gateways" },
      { name: "Telegram API" },
    ]
  }
};
