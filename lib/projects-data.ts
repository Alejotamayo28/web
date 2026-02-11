import { Project } from "@/types/cv";

export const projectsData: Project[] = [
  {
    id: "zapenu",
    title: "Zapenu - Startup Backend",
    description: "Sistema de microservicios para gestión de productos y menús de restaurantes",
    fullDescription: "Plataforma backend completa para startup de delivery que soporta +10k items por tienda con arquitectura de microservicios.",
    image: "/images/zapenu.jpg",
    tags: ["TypeScript", "Node.js", "PostgreSQL", "gRPC", "Docker", "AWS"],
    details: {
      challenge: "Diseñar una arquitectura escalable para manejar miles de productos por tienda con tiempos de respuesta rápidos y comunicación eficiente entre servicios.",
      solution: "Implementé microservicios con comunicación gRPC, modelo relacional optimizado en PostgreSQL, y sistema de archivos en Cloudflare R2. Introduje TSOA/Swagger para documentación automática.",
      results: [
        "Reducción del 40% en latencia de llamadas entre microservicios",
        "Soporte para +10k items por tienda con consultas rápidas",
        "Reducción del 25% en tiempos de lectura/escritura de base de datos",
        "Integración exitosa con pasarelas de pago (MercadoPago, Nequi)"
      ]
    }
  },
  {
    id: "deploy-bot",
    title: "Plataforma de Despliegue Automatizado",
    description: "Bot de Telegram para automatizar despliegues Docker en AWS EC2",
    fullDescription: "Sistema automatizado que reduce el tiempo de despliegue de aplicaciones Docker en AWS de 20 minutos a 3 minutos mediante bot de Telegram.",
    image: "/images/deploy-bot.jpg",
    tags: ["TypeScript", "AWS EC2", "Docker", "Cloudflare Workers", "Telegram API"],
    link: "https://www.linkedin.com/in/alejandro-vergara-tamayo-/",
    details: {
      challenge: "Los despliegues manuales tomaban 20 minutos y eran propensos a errores humanos. Se necesitaba una solución que permitiera desplegar rápidamente desde cualquier lugar.",
      solution: "Construí un bot en Cloudflare Workers que automatiza todo el proceso: instalación de Docker, gestión de contenedores, integración con DockerHub y monitoreo con CloudWatch.",
      results: [
        "Reducción de tiempo de despliegue de 20min a 3min",
        "Eliminación completa de errores manuales",
        "Gestión de instancias en tiempo real desde Telegram",
        "Monitoreo automático con CloudWatch"
      ]
    }
  },
  {
    id: "fittracker",
    title: "FitTracker - Asistente de Gimnasio",
    description: "Bot de Telegram para registro y seguimiento de entrenamientos personales",
    fullDescription: "Aplicación completa para tracking de ejercicios con sistema de autenticación multi-usuario y análisis de progreso.",
    image: "/images/fittracker.jpg",
    tags: ["TypeScript", "PostgreSQL", "Node.js", "Docker", "Telegram API"],
    link: "https://github.com/Alejotamayo28/fit-tracker-bot",
    details: {
      challenge: "Crear una forma simple y accesible para que las personas registren sus entrenamientos sin necesidad de apps complicadas, con capacidad de compartir progreso familiar.",
      solution: "Desarrollé un bot de Telegram con PostgreSQL para almacenamiento, sistema de sesiones compartidas estilo Netflix, y consultas dinámicas por intervalos de tiempo.",
      results: [
        "+10 usuarios activos utilizando la plataforma",
        "Sistema de sesiones compartidas para seguimiento familiar",
        "Consultas optimizadas por intervalos (diario, semanal, mensual)",
        "Interfaz intuitiva mediante comandos de Telegram"
      ]
    }
  },
  {
    id: "tmux-config",
    title: "Tmux Config",
    description: "Configuración personalizada de tmux para productividad en terminal",
    fullDescription: "Archivo de configuración de tmux optimizado para flujos de trabajo de desarrollo backend con atajos de teclado personalizados.",
    image: "/images/tmux.jpg",
    tags: ["Tmux", "Terminal", "Productividad", "Config"],
    link: "https://github.com/Alejotamayo28/tmux-config",
    details: {
      challenge: "Mejorar la eficiencia al trabajar con múltiples sesiones de terminal y paneles simultáneamente.",
      solution: "Creé una configuración personalizada de tmux con atajos intuitivos, tema visual agradable y soporte para integración con Neovim.",
      results: [
        "Navegación rápida entre paneles y ventanas",
        "Integración fluida con Neovim",
        "Personalización visual coherente",
        "Gestión eficiente de sesiones de trabajo"
      ]
    }
  },
  {
    id: "nvim-config",
    title: "Neovim Config",
    description: "Configuración completa de Neovim para desarrollo backend",
    fullDescription: "Setup de Neovim con LSP, tree-sitter, autocompletado y plugins esenciales para desarrollo moderno.",
    image: "/images/nvim.jpg",
    tags: ["Neovim", "Lua", "LSP", "TypeScript", "Editor"],
    link: "https://github.com/Alejotamayo28/nvim-config",
    details: {
      challenge: "Configurar un editor de código ligero pero potente para desarrollo TypeScript con todas las funcionalidades de un IDE moderno.",
      solution: "Desarrollé una configuración modular de Neovim con Lua, integrando LSP para TypeScript, autocompletado inteligente, tree-sitter y herramientas de debugging.",
      results: [
        "Entorno de desarrollo ligero y rápido",
        "Soporte completo para TypeScript/JavaScript",
        "Autocompletado inteligente y navegación de código",
        "Integración con herramientas de linting y formatting"
      ]
    }
  }
];
