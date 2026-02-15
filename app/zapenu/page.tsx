"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
ArrowLeft,
ArrowRight,
ArrowDown,
Server,
Globe,
Shield,
Database,
Cloud,
MessageSquare,
CreditCard,
CheckCircle,
AlertTriangle,
XCircle,
DollarSign,
Zap,
Lock,
Key,
Clock,
Users,
ShoppingCart,
Package,
Workflow,
GitBranch,
AlertCircle,
ExternalLink,
Monitor,
HardDrive,
Layers,
Maximize2,
X,
ChevronDown,
ChevronUp,
LucideIcon,
Maximize,
TrendingUp
} from "lucide-react";
import { MermaidDiagram, MiniMermaidDiagram } from "@/components/ui/mermaid-diagram";

const navigationItems = [
  { id: "overview", label: "Overview" },
  { id: "architecture", label: "Architecture" },
  { id: "dataflows", label: "Data Flows" },
  { id: "decisions", label: "Decisions" },
  { id: "costs", label: "Costs" },
];

const overviewData = {
  title: "Zapenu",
  description: "Plataforma multi-tenant de pedidos digitales con pagos integrados, notificaciones en tiempo real y arquitectura optimizada en costos",
  badges: [
    { label: "Architecture-focused", icon: "GitBranch", color: "bg-secondary text-secondary-foreground" },
    { label: "Real payments integration", icon: "CreditCard", color: "bg-secondary text-secondary-foreground" },
    { label: "Cost-aware design", icon: "DollarSign", color: "bg-secondary text-secondary-foreground" },
    { label: "Security-conscious", icon: "Shield", color: "bg-secondary text-secondary-foreground" },
  ],
  problem: {
    title: "Problema Resuelto",
    items: [
      "Digitalización de menús con opciones personalizables",
      "Gestión multi-tenant de múltiples locales comerciales",
      "Procesamiento de pedidos con flujos de estado",
      "Procesamiento de pagos en línea mediante integración con MercadoPago",
      "Notificaciones en tiempo real a través de WhatsApp",
    ]
  },
  stack: {
    frontend: ["React 19", "Vite 6.2.x", "Tailwind CSS 3.4", "Radix UI / shadcn/ui"],
    backend: ["Node.js 20", "Express.js 4.21.2", "TypeScript 4.9.5", "TSOA 6.6.0"],
    database: ["PostgreSQL", "Supabase", "AWS RDS"],
    infrastructure: ["Cloudflare Pages", "Cloudflare R2", "Docker", "VPS"],
    payments: ["MercadoPago SDK v2.0.15"],
    messaging: ["WhatsApp (WAHA)", "Telegram"],
    auth: ["Supabase Auth (JWT)"],
  }
};

const architectureData = {
  layers: [
    { 
      name: "Presentation Layer", 
      services: [
        { name: "Homero", type: "Frontend Público", stack: "React 19 + Vite", port: "Cloudflare Pages", role: "Menú digital para clientes", access: "Público", cache: "5 min" },
        { name: "Marge", type: "Frontend Admin", stack: "React 19 + Vite", port: "Cloudflare Pages", role: "Dashboard de gestión", access: "Autenticado", cache: "1 min" },
      ]
    },
    { 
      name: "Edge Layer", 
      services: [
        { name: "Cloudflare Edge", type: "CDN + Functions", stack: "Cloudflare", role: "Cache, Auth, Proxy", features: ["Cache 5min (Homero)", "Auth (Marge)", "Edge Functions"] },
      ]
    },
    { 
      name: "Backend Layer", 
      services: [
        { name: "Barto", type: "API Principal", stack: "Node.js + Express + TSOA", port: "3001", role: "Gestión de productos, órdenes, usuarios", protocol: "REST + gRPC" },
        { name: "Omnipago", type: "Microservicio de Pagos", stack: "Node.js 16 + Express", port: "4000", role: "Integración con MercadoPago", protocol: "REST" },
      ]
    },
    { 
      name: "Data Layer", 
      services: [
        { name: "PostgreSQL (Supabase)", type: "DB Principal", role: "Datos de operaciones, productos, órdenes" },
        { name: "PostgreSQL (RDS + omnipago)", type: "DB Pagos", role: "Schema payments_gateway" },
        { name: "Cloudflare R2", type: "Object Storage", role: "Almacenamiento de imágenes (S3-compatible)" },
      ]
    },
    { 
      name: "External Services", 
      services: [
        { name: "MercadoPago", type: "Pasarela de pagos", role: "Procesamiento de transacciones, Webhooks" },
        { name: "WAHA", type: "WhatsApp API", role: "Notificaciones en tiempo real", port: "3000" },
        { name: "Supabase", type: "Auth + Storage", role: "Autenticación JWT, Row Level Security" },
      ]
    }
  ]
};

const dataFlowsData = [
  {
    id: "order-creation",
    title: "Creación de Pedido",
    icon: ShoppingCart,
    steps: [
      { num: 1, title: "Cliente navega menú", desc: "GET /products/all/{client}/{short_id}" },
      { num: 2, title: "Selecciona productos", desc: "Construye carrito local (React state)" },
      { num: 3, title: "Confirma pedido", desc: "POST /orders (sin auth público)" },
      { num: 4, title: "Procesamiento backend", desc: "Valida, calcula totales, inserta en DB" },
      { num: 5, title: "Notificación async", desc: "WhatsApp al negocio vía WAHA" },
    ]
  },
  {
    id: "authentication",
    title: "Autenticación Administrativa",
    icon: Lock,
    steps: [
      { num: 1, title: "Admin abre Marge", desc: "Redirigido a /login" },
      { num: 2, title: "Ingresa email", desc: "Supabase Auth: signInWithOtp()" },
      { num: 3, title: "Magic link", desc: "Callback con session JWT" },
      { num: 4, title: "Token storage", desc: "LocalStorage + Context API" },
      { num: 5, title: "Requests protegidos", desc: "Bearer token en headers" },
    ]
  },
  {
    id: "payment-flow",
    title: "Flujo de Pagos",
    icon: CreditCard,
    steps: [
      { num: 1, title: "Confirmar pedido", desc: "POST /orders → PENDING_PAYMENT" },
      { num: 2, title: "Crear preferencia", desc: "POST /omnipago/payments/create-order" },
      { num: 3, title: "Redirect a MP", desc: "init_point → checkout MercadoPago" },
      { num: 4, title: "Webhook", desc: "POST /payments/payment-webhook" },
      { num: 5, title: "Actualizar estado", desc: "PUT /orders/{id}/payment-status" },
    ]
  }
];

const decisionsData = [
  {
    decision: "Separación de Frontends (Homero vs Marge)",
    why: "Homero público con cache agresivo, Marge con auth y datos sensibles",
    tradeoff: "Duplicación de código, overhead de mantenimiento. vs. Independencia de deploy, optimización de bundle, seguridad por separación",
    alternatives: "Single SPA con code-splitting"
  },
  {
    decision: "Supabase como Backend-as-a-Service",
    why: "Menor infraestructura, precio predictivo, RLS incorporado",
    tradeoff: "Vendor lock-in, límites de conexiones, latencia en regiones no cubiertas",
    alternatives: "Auth0 + RDS independiente, Firebase"
  },
  {
    decision: "TSOA para Generación de API",
    why: "Type safety end-to-end, OpenAPI automático, validación integrada",
    tradeoff: "Curva de aprendizaje, menos flexible que Express puro, dependencia de tooling",
    alternatives: "Express manual, NestJS, Fastify"
  },
  {
    decision: "Cloudflare R2 vs AWS S3",
    why: "Costo: $0 egress fees (vs AWS), S3-compatible",
    tradeoff: "Menos maduro, menos integraciones nativas, dependencia de Cloudflare",
    alternatives: "AWS S3, MinIO self-hosted"
  },
  {
    decision: "WhatsApp (WAHA) Self-Hosted",
    why: "Costo cero (usa WhatsApp Business API no oficial), control total",
    tradeoff: "No oficial, puede romperse, requiere mantener sesión activa",
    alternatives: "Twilio, MessageBird, WATI"
  },
  {
    decision: "Microservicio de Pagos (Omnipago)",
    why: "Separación de responsabilidades, aislamiento de fallas de pagos",
    tradeoff: "Complejidad de deployment, latencia adicional (HTTP entre servicios)",
    alternatives: "Integrado en barto (monolito)"
  }
];

const costsData = {
baseline: [
{ component: "VPS Backend", provider: "AWS/GCP/Otros", model: "Single VPS (barto + omnipago)", estimate: "$5-20/mes", icon: Server },
{ component: "Supabase", provider: "Supabase", model: "Free tier", estimate: "$0", icon: Database },
{ component: "Cloudflare R2", provider: "Cloudflare", model: "Storage S3-compatible", estimate: "$0", icon: Cloud },
{ component: "Cloudflare Pages", provider: "Cloudflare", model: "Free tier", estimate: "$0", icon: Globe },
{ component: "WhatsApp WAHA", provider: "Self-hosted", model: "Infraestructura propia", estimate: "$0 (marginal)", icon: MessageSquare },
{ component: "GitHub Actions", provider: "GitHub", model: "Self-hosted", estimate: "$0", icon: GitBranch },
{ component: "MercadoPago Fees", provider: "MercadoPago", model: "% por transacción", estimate: "2.99% + IVA", icon: CreditCard, variable: true },
],
total: "$5-20/mes",
totalNote: "+ 2.99% + IVA por transacción",
drivers: [
{ label: "VPS Upgrade", impact: "Si escala: $20-50/mes", icon: Server, tier: "medium" },
{ label: "Supabase Pro", impact: "$25+/mes si escala", icon: Database, tier: "high" },
{ label: "Cloudflare Pro", impact: "$20/mes si 10x tráfico", icon: Cloud, tier: "medium" },
],
risks: [
{ scenario: "10x tráfico en Homero", risk: "Cloudflare Pages free tier limits", mitigation: "Upgrade a Pro ($20/mes)", severity: "medium" },
{ scenario: "100x imágenes subidas", risk: "R2 storage limits", mitigation: "Compresión previa, límites de tamaño", severity: "low" },
{ scenario: "1000x pedidos/día", risk: "Supabase rate limits", mitigation: "Pool tuning, migración a Pro", severity: "high" },
{ scenario: "Viralización WhatsApp", risk: "Ban de número WAHA", mitigation: "Fallback a email/SMS", severity: "medium" },
]
};

// Component for Mermaid Accordion with Expand Modal
interface MermaidAccordionProps {
  title: string;
  icon: LucideIcon;
  diagram: string;
  defaultOpen?: boolean;
}

function MermaidAccordion({ title, icon: Icon, diagram, defaultOpen = false }: MermaidAccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const scrollPositionRef = useRef<number>(0);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      scrollPositionRef.current = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPositionRef.current}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.overflow = 'hidden';
      document.body.style.width = '100%';
    } else {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
      document.body.style.width = '';
      // Restore scroll position after a brief delay to ensure DOM is updated
      setTimeout(() => {
        window.scrollTo(0, scrollPositionRef.current);
      }, 0);
    }
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
      document.body.style.width = '';
    };
  }, [isModalOpen]);

  return (
    <>
      <Card className="overflow-hidden border-l-4 border-l-primary">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center gap-3 p-4 md:p-5 hover:bg-accent/5 transition-colors text-left"
        >
          <div className="w-10 h-10 md:w-11 md:h-11 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base md:text-lg font-semibold text-foreground opacity-80 truncate">{title}</h3>
            <p className="text-xs md:text-sm text-muted-foreground">Click to view diagram</p>
          </div>
          <div className={`w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
            <ChevronDown className="h-4 w-4 text-primary" />
          </div>
        </button>
        
        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-[1500px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="p-4 md:p-6 border-t border-border bg-muted/30">
            <div className="bg-white rounded-lg p-4 shadow-inner overflow-x-auto relative group">
              <MermaidDiagram chart={diagram} />
              
              {/* Expand Button - Desktop only: hover */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="hidden md:block absolute top-2 right-2 p-2 bg-background/90 backdrop-blur-sm rounded-lg shadow-lg border border-border opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-primary/10"
                aria-label="View full diagram"
              >
                <Maximize2 className="h-4 w-4 text-foreground" />
              </button>
            </div>
            
            {/* Mobile Expand Hint - Only option for mobile */}
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full mt-3 flex items-center justify-center gap-2 py-2 px-4 bg-primary/5 rounded-lg border border-border/50 md:hidden hover:bg-primary/10 transition-colors"
            >
              <Maximize2 className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium text-foreground opacity-80">Tap to view full diagram</span>
            </button>
          </div>
        </div>
      </Card>

      {/* Diagram Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div className="relative max-w-6xl max-h-[90vh] w-full flex flex-col">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute -top-12 right-0 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors z-10"
              aria-label="Close modal"
            >
              <X className="h-6 w-6 text-white" />
            </button>
            
            {/* Modal Title */}
            <h3 className="text-white text-lg font-semibold mb-4 text-center">{title}</h3>
            
            {/* Modal Diagram */}
            <div className="relative rounded-lg overflow-hidden bg-white shadow-2xl p-4 md:p-6 overflow-x-auto">
              <MermaidDiagram chart={diagram} />
            </div>
            
            {/* Modal Caption */}
            <p className="text-white/80 text-center mt-4 text-sm">
              Click anywhere to close
            </p>
          </div>
        </div>
      )}
    </>
  );
}

// Component for Mini Diagram Card with Modal
interface MiniDiagramCardProps {
  title: string;
  diagram: string;
}

function MiniDiagramCard({ title, diagram }: MiniDiagramCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const scrollPositionRef = useRef<number>(0);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      scrollPositionRef.current = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPositionRef.current}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.overflow = 'hidden';
      document.body.style.width = '100%';
    } else {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
      document.body.style.width = '';
      setTimeout(() => {
        window.scrollTo(0, scrollPositionRef.current);
      }, 0);
    }
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
      document.body.style.width = '';
    };
  }, [isModalOpen]);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="group w-full bg-card rounded-lg border-2 border-border hover:border-primary hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-[150px] sm:h-[160px] md:h-[180px]"
      >
        {/* Mini Diagram Preview - Fixed height */}
        <div className="relative flex-1 bg-white h-[110px] sm:h-[120px] md:h-[130px] overflow-hidden p-1">
          <MiniMermaidDiagram chart={diagram} />
          
          {/* Hover overlay with expand icon */}
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Maximize className="h-4 w-4 text-primary" />
            </div>
          </div>
        </div>
        
        {/* Title - Fixed height */}
        <div className="h-[40px] sm:h-[40px] md:h-[50px] p-2 border-t border-border bg-card flex items-center justify-center">
          <h3 className="text-[10px] sm:text-xs font-semibold text-foreground opacity-80 text-center line-clamp-2 leading-tight">
            {title}
          </h3>
        </div>
      </button>

      {/* Full Screen Modal - With internal scroll */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-start justify-center p-8 md:p-12 overflow-y-auto"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="relative w-full max-w-5xl my-auto flex flex-col pt-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button - Lowered position */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-0 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors z-10"
              aria-label="Close modal"
            >
              <X className="h-5 w-5 text-white" />
            </button>
            
            {/* Title */}
            <h3 className="text-white text-sm md:text-base font-semibold mb-2 text-center">{title}</h3>
            
            {/* Diagram - Scrollable */}
            <div className="relative rounded-lg overflow-hidden bg-white shadow-2xl p-2 md:p-4 overflow-x-auto">
              <div className="min-w-[800px] md:min-w-0">
                <MermaidDiagram chart={diagram} />
              </div>
            </div>
            
            {/* Caption */}
            <p className="text-white/70 text-center mt-2 text-xs">
              Click outside to close • Scroll to explore
            </p>
          </div>
        </div>
      )}
  </>
);
}

// Component for Large Diagram Card (for main flow) with Modal
interface LargeDiagramCardProps {
title: string;
diagram: string;
}

function LargeDiagramCard({ title, diagram }: LargeDiagramCardProps) {
const [isModalOpen, setIsModalOpen] = useState(false);
const scrollPositionRef = useRef<number>(0);

// Lock body scroll when modal is open
useEffect(() => {
if (isModalOpen) {
scrollPositionRef.current = window.scrollY;
document.body.style.position = 'fixed';
document.body.style.top = `-${scrollPositionRef.current}px`;
document.body.style.left = '0';
document.body.style.right = '0';
document.body.style.overflow = 'hidden';
document.body.style.width = '100%';
} else {
document.body.style.position = '';
document.body.style.top = '';
document.body.style.left = '';
document.body.style.right = '';
document.body.style.overflow = '';
document.body.style.width = '';
setTimeout(() => {
window.scrollTo(0, scrollPositionRef.current);
}, 0);
}
return () => {
document.body.style.position = '';
document.body.style.top = '';
document.body.style.left = '';
document.body.style.right = '';
document.body.style.overflow = '';
document.body.style.width = '';
};
}, [isModalOpen]);

return (
<>
<button
onClick={() => setIsModalOpen(true)}
className="group w-full bg-card rounded-lg border-2 border-border hover:border-primary hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-[316px] sm:h-[336px] md:h-[384px]"
>
{/* Large Diagram Preview - Fixed height */}
<div className="relative flex-1 bg-white overflow-hidden p-1">
<MiniMermaidDiagram chart={diagram} />

{/* Hover overlay with expand icon */}
<div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
<div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
<Maximize className="h-5 w-5 text-primary" />
</div>
</div>
</div>

{/* Title - Fixed height */}
<div className="h-[50px] p-2 sm:p-3 border-t border-border bg-card flex items-center justify-center">
<h3 className="text-xs sm:text-sm font-semibold text-foreground opacity-80 text-center line-clamp-2 leading-tight">
{title}
</h3>
</div>
</button>

{/* Full Screen Modal - With internal scroll */}
{isModalOpen && (
<div
className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-start justify-center p-8 md:p-12 overflow-y-auto"
onClick={() => setIsModalOpen(false)}
>
<div
className="relative w-full max-w-5xl my-auto flex flex-col pt-8"
onClick={(e) => e.stopPropagation()}
>
{/* Close Button - Lowered position */}
<button
onClick={() => setIsModalOpen(false)}
className="absolute top-2 right-0 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors z-10"
aria-label="Close modal"
>
<X className="h-5 w-5 text-white" />
</button>

{/* Title */}
<h3 className="text-white text-sm md:text-base font-semibold mb-2 text-center">{title}</h3>

{/* Diagram - Scrollable */}
<div className="relative rounded-lg overflow-hidden bg-white shadow-2xl p-2 md:p-4 overflow-x-auto">
<div className="min-w-[800px] md:min-w-0">
<MermaidDiagram chart={diagram} />
</div>
</div>

{/* Caption */}
<p className="text-white/70 text-center mt-2 text-xs">
Click outside to close • Scroll to explore
</p>
</div>
</div>
)}
</>
);
}

export default function ZapenuProjectPage() {
  const [activeSection, setActiveSection] = useState("overview");
  const [isProblemExpanded, setIsProblemExpanded] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [expandedLayers, setExpandedLayers] = useState<boolean[]>([true, false, false, false, false]);
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  const toggleLayer = (index: number) => {
    setExpandedLayers(prev => prev.map((isExpanded, i) => i === index ? !isExpanded : isExpanded));
  };

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          setActiveSection(sectionId);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    Object.keys(sectionRefs.current).forEach((key) => {
      if (sectionRefs.current[key]) {
        observer.observe(sectionRefs.current[key]!);
      }
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    sectionRefs.current[sectionId]?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden" style={{ maxWidth: '100vw' }}>
      {/* Header - Solo botón de regreso, sin navegación horizontal */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <Link href="/#projects" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4 flex-shrink-0" />
            <span className="text-sm sm:text-base">Back to Projects</span>
          </Link>
        </div>
      </header>

      <div className="flex w-full overflow-x-hidden">
        {/* Main Content */}
        <main className="flex-1 w-full min-w-0">
{/* Overview Section - Three Panel Layout (Responsive) */}
      <section id="overview" ref={(el) => { sectionRefs.current['overview'] = el; }} className="min-h-screen px-3 sm:px-4 md:px-6 py-8 md:py-20 overflow-x-hidden">
        <div className="max-w-7xl mx-auto w-full">
          {/* Section Title */}
          <div className="text-center mb-6 md:mb-10">
            <h2 className="text-xl md:text-3xl font-bold text-foreground opacity-80">Project Overview</h2>
            <div className="w-20 md:w-24 h-1 bg-primary/30 mx-auto mt-3 md:mt-4 rounded-full"></div>
          </div>
          
          {/* Three Panel Grid Layout */}
          <div className="flex flex-col lg:grid lg:grid-cols-5 gap-4 md:gap-6 min-w-0">
            {/* Left Column - Two stacked boxes */}
            <div className="lg:col-span-2 flex flex-col gap-4 md:gap-6 min-w-0">
              {/* Top Left Box: Project Info */}
              <Card className="flex-1 border-l-4 border-l-primary border-y border-r border-border bg-card/50 hover:shadow-lg transition-shadow overflow-hidden">
                <CardContent className="p-3 sm:p-4 md:p-6">
                  <div className="flex items-start gap-2 sm:gap-3 md:gap-4 mb-3 md:mb-4 min-w-0">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Zap className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1 overflow-hidden">
                      <h3 className="text-lg sm:text-xl md:text-3xl font-bold text-foreground opacity-80 truncate">{overviewData.title}</h3>
                      <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground mt-0.5 md:mt-1">Digital Ordering Platform</p>
                    </div>
                  </div>
                  <p className="text-foreground opacity-80 text-xs sm:text-sm md:text-base mb-3 md:mb-5 leading-relaxed break-words">{overviewData.description}</p>
                  
                  {/* Badges - Icons only on mobile, with text on desktop */}
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {overviewData.badges.slice(0, 4).map((badge, idx) => {
                      const iconMap: Record<string, React.ElementType> = {
                        GitBranch,
                        CreditCard,
                        DollarSign,
                        Shield,
                      };
                      const Icon = iconMap[badge.icon] || Badge;
                      return (
                        <Badge 
                          key={idx} 
                          variant="secondary" 
                          className="flex items-center justify-center p-1.5 sm:p-2 md:px-2.5 md:py-1.5 transition-all flex-shrink-0"
                          title={badge.label}
                        >
                          <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-3 md:w-3 flex-shrink-0" />
                          <span className="hidden md:inline md:ml-1.5 text-xs font-medium">{badge.label}</span>
                        </Badge>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
              
              {/* Bottom Left Box: Problem Solved - Accordion on mobile */}
              <Card className="flex-1 border-l-4 border-l-primary/60 border-y border-r border-border bg-card/50 hover:shadow-lg transition-shadow overflow-hidden">
                <CardContent className="p-0">
                  {/* Accordion Header - Clickable on mobile */}
                  <button 
                    onClick={() => setIsProblemExpanded(!isProblemExpanded)}
                    className="w-full p-3 sm:p-4 md:p-6 flex items-center justify-between text-left hover:bg-accent/5 transition-colors md:cursor-default min-w-0"
                  >
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="h-4 w-4 sm:h-4.5 sm:w-4.5 md:h-5 md:w-5 text-primary" />
                      </div>
                      <h4 className="text-sm sm:text-base md:text-lg font-semibold text-foreground opacity-80 truncate">{overviewData.problem.title}</h4>
                    </div>
                    <div className="md:hidden flex-shrink-0 ml-2">
                      {isProblemExpanded ? (
                        <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                      )}
                    </div>
                  </button>
                  
                  {/* Accordion Content - Always visible on desktop, toggle on mobile */}
                  <div className={`px-3 sm:px-4 md:px-6 pb-3 sm:pb-4 md:pb-6 transition-all duration-300 md:block ${isProblemExpanded ? 'block' : 'hidden md:block'}`}>
                    <ul className="space-y-2 md:space-y-3">
                      {overviewData.problem.items.map((item, idx) => (
                        <li key={idx} className="flex gap-2 md:gap-3 text-sm text-foreground opacity-80 items-start min-w-0">
                          <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-[9px] sm:text-[10px] font-bold text-primary">{idx + 1}</span>
                          </div>
                          <span className="leading-relaxed text-xs sm:text-sm break-words flex-1 min-w-0">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Right Column - Large Image Box */}
            <Card className="lg:col-span-3 border border-border bg-card/50 overflow-hidden hover:shadow-lg transition-shadow min-w-0">
              <CardContent className="p-0">
                {/* Header */}
                <div className="px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 md:py-4 border-b border-border bg-primary/5 flex items-center justify-between min-w-0">
                  <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
                    <Layers className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                    <span className="text-[10px] sm:text-xs md:text-sm font-semibold text-foreground opacity-80 truncate">Infrastructure Architecture</span>
                  </div>
                  <Badge variant="outline" className="text-[10px] sm:text-xs flex-shrink-0 ml-2">5-Layer</Badge>
                </div>
                
                {/* Image Container with Expand Button */}
                <div className="p-2 sm:p-3 md:p-4 bg-gradient-to-br from-background to-muted/30">
                  <div className="relative rounded-lg border border-border/50 overflow-hidden shadow-sm bg-white group">
                    <Image
                      src="/zapenu-infrastructure-diagram.png"
                      alt="Zapenu Infrastructure Architecture"
                      width={900}
                      height={600}
                      className="w-full h-auto max-w-full"
                      priority
                      style={{ maxWidth: '100%' }}
                    />
                    {/* Expand Button Overlay */}
                    <button
                      onClick={() => setIsImageModalOpen(true)}
                      className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 p-1.5 sm:p-2 bg-background/90 backdrop-blur-sm rounded-lg shadow-lg border border-border opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-primary/10"
                      aria-label="View full image"
                    >
                      <Maximize2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-foreground" />
                    </button>
                  </div>
                  
                  {/* Mobile Expand Hint */}
                  <button 
                    onClick={() => setIsImageModalOpen(true)}
                    className="w-full mt-2 sm:mt-3 flex items-center justify-center gap-2 py-1.5 sm:py-2 px-3 sm:px-4 bg-primary/5 rounded-lg border border-border/50 md:hidden hover:bg-primary/10 transition-colors"
                  >
                    <Maximize2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                    <span className="text-[10px] sm:text-xs font-medium text-foreground opacity-80">Tap to view full diagram</span>
                  </button>
                  
                  {/* Image Caption */}
                  <p className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground text-center mt-2 sm:mt-3 px-2 hidden md:block">
                    Complete system architecture: Client → Edge → Backend → Data → External Services
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Image Modal/Lightbox */}
        {isImageModalOpen && (
          <div 
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setIsImageModalOpen(false)}
          >
            <div className="relative max-w-6xl max-h-[90vh] w-full flex flex-col">
              {/* Close Button */}
              <button
                onClick={() => setIsImageModalOpen(false)}
                className="absolute -top-12 right-0 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors z-10"
                aria-label="Close modal"
              >
                <X className="h-6 w-6 text-white" />
              </button>
              
              {/* Modal Image */}
              <div className="relative rounded-lg overflow-hidden bg-white shadow-2xl">
                <Image
                  src="/zapenu-infrastructure-diagram.png"
                  alt="Zapenu Infrastructure Architecture - Full View"
                  width={1200}
                  height={800}
                  className="w-full h-auto max-h-[80vh] object-contain"
                  priority
                />
              </div>
              
              {/* Modal Caption */}
              <p className="text-white/80 text-center mt-4 text-sm">
                Zapenu Infrastructure Architecture - Click anywhere to close
              </p>
            </div>
          </div>
        )}
      </section>

{/* Architecture Section - Accordion Style */}
      <section id="architecture" ref={(el) => { sectionRefs.current['architecture'] = el; }} className="min-h-screen px-4 md:px-6 py-12 md:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-xl md:text-2xl font-bold text-foreground opacity-80">System Architecture</h2>
            <div className="w-20 md:w-24 h-1 bg-primary/30 mx-auto mt-3 md:mt-4 rounded-full"></div>
          </div>

          {/* Contenedor único para todas las capas */}
          <div className="rounded-xl border-2 border-foreground/80 overflow-hidden bg-transparent">
            {/* Header general del System Architecture */}
            <div className="flex items-center justify-center gap-3 p-4 md:p-6 bg-primary/5 border-b border-border">
              <Server className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              <h3 className="text-lg md:text-xl font-semibold text-foreground opacity-80">5-Layer Architecture</h3>
              <Badge variant="secondary" className="text-xs">{architectureData.layers.reduce((acc, layer) => acc + layer.services.length, 0)} Services</Badge>
            </div>

            <div className="p-4 md:p-6">
              {/* Acordeones de capas */}
              {(() => {
                const layerIcons = [Monitor, Cloud, Server, Database, ExternalLink];
                const serviceIcons: Record<string, React.ElementType> = {
                  'Homero': Globe, 'Marge': Lock, 'Cloudflare Edge': Cloud,
                  'Barto': Server, 'Omnipago': CreditCard,
                  'PostgreSQL (Supabase)': Database, 'PostgreSQL (RDS + omnipago)': Database, 'Cloudflare R2': HardDrive,
                  'MercadoPago': CreditCard, 'WAHA': MessageSquare, 'Supabase': Database
                };

                return (
                  <div className="space-y-0">
                    {architectureData.layers.map((layer, layerIdx) => {
                      const LayerIcon = layerIcons[layerIdx];
                      const isExpanded = expandedLayers[layerIdx];
                      const isLast = layerIdx === architectureData.layers.length - 1;

                      return (
                        <div key={layerIdx} className={`${!isLast ? 'border-b border-border' : ''}`}>
                          {/* Header clickeable del acordeón */}
                          <button
                            onClick={() => toggleLayer(layerIdx)}
                            className="w-full flex items-center gap-3 p-3 md:p-4 hover:bg-accent/5 transition-colors text-left group"
                          >
                            {/* Icono de la capa */}
                            <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                              <LayerIcon className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                            </div>
                            
                            {/* Info de la capa */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-xs md:text-sm font-bold text-primary">
                                  {layerIdx + 1}.
                                </span>
                                <h4 className="text-sm md:text-base font-semibold text-foreground opacity-80 truncate">
                                  {layer.name}
                                </h4>
                              </div>
                              <p className="text-[10px] md:text-xs text-muted-foreground truncate">
                                {layer.services.map(s => s.name).join(' • ')}
                              </p>
                            </div>

                            {/* Contador y toggle */}
                            <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
                              <Badge variant="secondary" className="text-[10px] md:text-xs h-5 md:h-6">
                                {layer.services.length}
                              </Badge>
                              <div className={`w-6 h-6 md:w-7 md:h-7 rounded-full bg-primary/10 flex items-center justify-center transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                                <ChevronDown className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary" />
                              </div>
                            </div>
                          </button>

                          {/* Contenido expandible */}
                          <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="p-3 md:p-4 pt-0 md:pt-0">
                              {/* Grid de servicios */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                                {layer.services.map((service, svcIdx) => {
                                  const ServiceIcon = serviceIcons[service.name] || Server;

                                  return (
<Card
                                  key={svcIdx}
                                  className="group border-0 border-l-2 border-l-primary/40 hover:border-l-primary hover:shadow-md transition-all duration-200 bg-background"
                                >
                                      <CardContent className="p-3 md:p-4">
                                        {/* Header del servicio */}
                                        <div className="flex items-start gap-2.5 md:gap-3 mb-2.5 md:mb-3">
                                          <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                                            <ServiceIcon className="h-4 w-4 md:h-4.5 md:w-4.5 text-primary" />
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                              <h5 className="text-sm md:text-base font-semibold text-foreground opacity-80 truncate">
                                                {service.name}
                                              </h5>
                                              {service.port && typeof service.port === 'string' && service.port.length < 10 && (
                                                <Badge variant="outline" className="text-[10px] h-4 md:h-5 px-1 md:px-1.5 flex-shrink-0">
                                                  {service.port}
                                                </Badge>
                                              )}
                                            </div>
                                            <p className="text-[10px] md:text-xs text-primary truncate">{service.type}</p>
                                          </div>
                                        </div>

                                        {/* Descripción */}
                                        <p className="text-xs text-foreground opacity-70 mb-2.5 md:mb-3 leading-relaxed line-clamp-2">
                                          {service.role}
                                        </p>

                                        {/* Stack */}
                                        {service.stack && (
                                          <div className="mb-2">
                                            <Badge variant="secondary" className="text-[10px] h-5 px-2">
                                              {service.stack}
                                            </Badge>
                                          </div>
                                        )}

{/* Badges de tecnología - Todos con variant secondary para consistencia */}
                                    <div className="flex flex-wrap gap-1.5">
                                      {service.protocol && (
                                        <Badge variant="secondary" className="text-[10px] h-4 md:h-5 px-1.5 md:px-2">
                                          {service.protocol}
                                        </Badge>
                                      )}
                                      {service.access && (
                                        <Badge
                                          variant="secondary"
                                          className="text-[10px] h-4 md:h-5 px-1.5 md:px-2"
                                        >
                                          {service.access === "Público" ? (
                                            <Globe className="h-2.5 w-2.5 md:h-3 md:w-3 mr-0.5 md:mr-1" />
                                          ) : (
                                            <Lock className="h-2.5 w-2.5 md:h-3 md:w-3 mr-0.5 md:mr-1" />
                                          )}
                                          <span className="hidden sm:inline">{service.access}</span>
                                        </Badge>
                                      )}
                                      {service.cache && (
                                        <Badge variant="secondary" className="text-[10px] h-4 md:h-5 px-1.5 md:px-2">
                                          <Clock className="h-2.5 w-2.5 md:h-3 md:w-3 mr-0.5 md:mr-1" />
                                          Cache {service.cache}
                                        </Badge>
                                      )}
                                    </div>

{/* Features - Con variant secondary para consistencia */}
                                    {service.features && service.features.length > 0 && (
                                      <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-border/50">
                                        {service.features.slice(0, 3).map((f, i) => (
                                          <Badge
                                            key={i}
                                            variant="secondary"
                                            className="text-[9px] md:text-[10px] h-4 md:h-5 px-1.5 md:px-2"
                                          >
                                            <CheckCircle className="h-2 w-2 md:h-2.5 md:w-2.5 mr-0.5 md:mr-1 text-primary" />
                                            <span className="truncate max-w-[80px] md:max-w-[100px]">{f}</span>
                                          </Badge>
                                        ))}
                                      </div>
                                    )}
                                      </CardContent>
                                    </Card>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </section>

{/* Data Flows Section - Asymmetric Layout */}
<section id="dataflows" ref={(el) => { sectionRefs.current['dataflows'] = el; }} className="min-h-screen px-4 md:px-6 py-12 md:py-20">
<div className="max-w-7xl mx-auto">
<div className="text-center mb-8 md:mb-10">
<h2 className="text-xl md:text-2xl font-bold text-foreground opacity-80">Key Data Flows</h2>
<div className="w-20 md:w-24 h-1 bg-primary/30 mx-auto mt-3 md:mt-4 rounded-full"></div>
</div>

{/* Asymmetric Grid Layout */}
<div className="flex flex-col gap-4 md:gap-6">
{/* Mobile: Order Creation First (Featured) */}
<div className="lg:hidden">
<LargeDiagramCard
title="Order Creation with Payment"
diagram={`sequenceDiagram
participant Cliente
participant Homero as Homero (Frontend)
participant Barto as Barto (Backend)
participant Omnipago
participant MP as MercadoPago
participant WAHA

Cliente->>Homero: Navega menú
Homero->>Barto: GET /products
Barto-->>Homero: Lista productos
Cliente->>Homero: Confirma pedido
Homero->>Barto: POST /orders
Note over Barto: Valida y guarda Estado: PENDING_PAYMENT
Barto-->>Homero: {order_id, total}
Homero->>Barto: Solicita pago
Barto->>Omnipago: POST /payments/create-order
Omnipago->>MP: Crea preferencia
MP-->>Omnipago: preference_id, init_point
Omnipago->>Omnipago: Guarda en DB
Omnipago-->>Barto: init_point
Barto-->>Homero: init_point
Homero->>Cliente: Redirecciona a MP
Cliente->>MP: Realiza pago
MP->>Omnipago: POST webhook
Note over Omnipago: Valida HMAC
Omnipago->>MP: GET /payments/{id}
MP-->>Omnipago: Estado: approved
Omnipago->>Omnipago: Guarda pago
Omnipago->>Barto: PUT /orders/{id}/payment-status
Barto->>Barto: Actualiza estado PENDING_PAYMENT → CREATED
Barto->>WAHA: Envía notificación
WAHA->>Cliente: WhatsApp confirmación`}
/>
</div>

{/* Desktop: Asymmetric Grid 2+3 / Mobile: Two columns for remaining flows */}
<div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-6">
{/* Left Column - Two stacked boxes (2 cols on desktop) */}
<div className="lg:col-span-2 flex flex-col gap-4 md:gap-6">
{/* Authentication Flow */}
<MiniDiagramCard
title="Authentication Flow (Marge)"
diagram={`sequenceDiagram
participant Admin
participant Marge
participant Supabase
participant Barto

Admin->>Marge: Accede a /login
Marge->>Admin: Formulario email
Admin->>Marge: Ingresa email
Marge->>Supabase: signInWithOtp(email)
Supabase-->>Admin: Envía magic link
Admin->>Supabase: Click en magic link
Supabase-->>Marge: Callback con sesión
Marge->>Marge: Guarda tokens en localStorage
Admin->>Marge: Solicita recurso protegido
Marge->>Barto: GET /api/protected Authorization: Bearer {jwt}
Barto->>Supabase: Valida JWT (JWKS)
Supabase-->>Barto: Token válido
Barto-->>Marge: Recurso solicitado`}
/>

{/* Order State Diagram */}
<MiniDiagramCard
title="Order State Diagram"
diagram={`stateDiagram-v2
[*] --> PENDING_PAYMENT: Crear pedido (con pago)
[*] --> CREATED: Crear pedido (efectivo)
PENDING_PAYMENT --> CREATED: Pago aprobado
PENDING_PAYMENT --> CANCELLED: Pago rechazado/cancelado
CREATED --> CONFIRMED: Negocio confirma
CONFIRMED --> FINALIZED: Pedido completado/entregado
CREATED --> CANCELLED: Cancelación
CONFIRMED --> CANCELLED: Cancelación
FINALIZED --> [*]
CANCELLED --> [*]`}
/>
</div>

{/* Right Column - Large featured card (3 cols on desktop, hidden on mobile) */}
<div className="hidden lg:block lg:col-span-3">
<LargeDiagramCard
title="Order Creation with Payment"
diagram={`sequenceDiagram
participant Cliente
participant Homero as Homero (Frontend)
participant Barto as Barto (Backend)
participant Omnipago
participant MP as MercadoPago
participant WAHA

Cliente->>Homero: Navega menú
Homero->>Barto: GET /products
Barto-->>Homero: Lista productos
Cliente->>Homero: Confirma pedido
Homero->>Barto: POST /orders
Note over Barto: Valida y guarda Estado: PENDING_PAYMENT
Barto-->>Homero: {order_id, total}
Homero->>Barto: Solicita pago
Barto->>Omnipago: POST /payments/create-order
Omnipago->>MP: Crea preferencia
MP-->>Omnipago: preference_id, init_point
Omnipago->>Omnipago: Guarda en DB
Omnipago-->>Barto: init_point
Barto-->>Homero: init_point
Homero->>Cliente: Redirecciona a MP
Cliente->>MP: Realiza pago
MP->>Omnipago: POST webhook
Note over Omnipago: Valida HMAC
Omnipago->>MP: GET /payments/{id}
MP-->>Omnipago: Estado: approved
Omnipago->>Omnipago: Guarda pago
Omnipago->>Barto: PUT /orders/{id}/payment-status
Barto->>Barto: Actualiza estado PENDING_PAYMENT → CREATED
Barto->>WAHA: Envía notificación
WAHA->>Cliente: WhatsApp confirmación`}
/>
</div>
</div>
</div>
</div>
</section>

{/* Design Decisions Section - Timeline Layout */}
<section id="decisions" ref={(el) => { sectionRefs.current['decisions'] = el; }} className="min-h-screen px-4 md:px-6 py-12 md:py-20">
<div className="max-w-5xl mx-auto">
<div className="text-center mb-10 md:mb-12">
<h2 className="text-xl md:text-2xl font-bold text-foreground opacity-80">Design Decisions & Trade-offs</h2>
<div className="w-20 md:w-24 h-1 bg-primary/30 mx-auto mt-3 md:mt-4 rounded-full"></div>
</div>

{/* Timeline Container */}
<div className="relative">
{/* Vertical Line - Hidden on mobile, visible on md+ */}
<div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/30 via-primary/50 to-primary/30"></div>

{/* Mobile Line - Left aligned */}
<div className="md:hidden absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/30 via-primary/50 to-primary/30"></div>

{/* Timeline Items */}
<div className="space-y-8 md:space-y-12">
{decisionsData.map((decision, idx) => {
const isEven = idx % 2 === 0;
const icons = [GitBranch, Database, Workflow, Cloud, MessageSquare, Server];
const Icon = icons[idx % icons.length];

return (
<div key={idx} className="relative">
{/* Node - Positioned on the line */}
<div className={`absolute md:left-1/2 md:-translate-x-1/2 left-6 -translate-x-1/2 top-6 z-10`}>
<div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-card border-2 border-primary flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
<Icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
</div>
</div>

{/* Card Container - Alternating sides on desktop */}
<div className={`md:grid md:grid-cols-2 md:gap-8 pl-16 md:pl-0 ${isEven ? '' : 'md:direction-rtl'}`}>
{/* Spacer for alternating layout */}
<div className={`hidden md:block ${isEven ? 'md:order-1' : 'md:order-2'}`}></div>

{/* Card */}
<div className={`${isEven ? 'md:order-2 md:pl-8' : 'md:order-1 md:pr-8'}`}>
<Card className="border-l-4 border-l-primary/60 hover:border-l-primary hover:shadow-lg transition-all duration-300 bg-card/50">
<CardContent className="p-4 md:p-6">
{/* Header with number */}
<div className="flex items-start gap-3 mb-4">
<div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
<span className="text-xs font-bold text-primary">{idx + 1}</span>
</div>
<h3 className="text-base md:text-lg font-semibold text-foreground opacity-80 leading-tight">
{decision.decision}
</h3>
</div>

{/* Why & Trade-off */}
<div className="space-y-3 text-sm">
<div className="flex gap-2">
<span className="font-semibold text-foreground opacity-80 whitespace-nowrap">Why:</span>
<span className="text-muted-foreground">{decision.why}</span>
</div>
<div className="flex gap-2">
<span className="font-semibold text-foreground opacity-80 whitespace-nowrap">Trade-off:</span>
<span className="text-muted-foreground">{decision.tradeoff}</span>
</div>
</div>

{/* Alternatives */}
<div className="mt-4 pt-3 border-t border-border/50">
<div className="flex flex-wrap items-center gap-2 text-sm">
<span className="font-semibold text-foreground opacity-80 whitespace-nowrap">Alternatives:</span>
<span className="text-muted-foreground">
{decision.alternatives}
</span>
</div>
</div>
</CardContent>
</Card>
</div>
</div>
</div>
);
})}
</div>

{/* Timeline End Indicator */}
<div className="relative mt-8 md:mt-12">
<div className="absolute left-6 md:left-1/2 md:-translate-x-1/2 transform -translate-x-1/2">
<div className="w-4 h-4 rounded-full bg-primary/50"></div>
</div>
</div>
</div>
</div>
</section>

{/* Costs Section - Asymmetric Layout */}
<section id="costs" ref={(el) => { sectionRefs.current['costs'] = el; }} className="min-h-screen px-4 md:px-6 py-12 md:py-20">
<div className="max-w-7xl mx-auto">
<div className="text-center mb-10 md:mb-12">
<h2 className="text-xl md:text-2xl font-bold text-foreground opacity-80">Cost Considerations</h2>
<div className="w-20 md:w-24 h-1 bg-primary/30 mx-auto mt-3 md:mt-4 rounded-full"></div>
</div>

{/* Asymmetric Grid: 2 cols left + 3 cols right */}
<div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-6">
{/* Left Column - Total Cost Card (2 cols) */}
<div className="lg:col-span-2">
<Card className="border-l-4 border-l-primary h-full bg-card/50 hover:shadow-lg transition-all">
<CardContent className="p-4 md:p-6 flex flex-col">
{/* Total Cost Header */}
<div className="flex items-center gap-3 mb-6">
<div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center">
<DollarSign className="h-5 w-5 md:h-6 md:w-6 text-primary" />
</div>
<div>
<h3 className="text-lg font-semibold text-foreground opacity-80">Total Cost</h3>
<p className="text-xs text-muted-foreground">Estimated Monthly</p>
</div>
</div>

{/* Cost Display */}
<div className="text-center py-6 md:py-8 bg-gradient-to-br from-primary/5 to-transparent rounded-lg border border-primary/10 mb-6">
<p className="text-4xl md:text-5xl font-bold text-primary">{costsData.total}</p>
<p className="text-sm text-muted-foreground mt-2">{costsData.totalNote}</p>
</div>

{/* Free Services Summary */}
<div className="space-y-3 mt-auto">
<h4 className="text-sm font-semibold text-foreground opacity-80 flex items-center gap-2">
<CheckCircle className="h-4 w-4 text-green-500" />
Free Infrastructure
</h4>
<div className="space-y-2">
{costsData.baseline.filter(item => item.estimate === "$0" || item.estimate === "$0 (marginal)").slice(0, 4).map((item, idx) => {
const Icon = item.icon || Server;
return (
<div key={idx} className="flex items-center gap-2 text-sm">
<Icon className="h-4 w-4 text-muted-foreground" />
<span className="text-muted-foreground">{item.component}</span>
<Badge variant="secondary" className="text-xs ml-auto">{item.estimate}</Badge>
</div>
);
})}
</div>
</div>
</CardContent>
</Card>
</div>

{/* Right Column - Cost Breakdown (3 cols) */}
<div className="lg:col-span-3">
<Card className="border-l-4 border-l-primary/60 h-full bg-card/50 hover:shadow-lg transition-all">
<CardContent className="p-4 md:p-6">
{/* Breakdown Header */}
<div className="flex items-center justify-between mb-6">
<div className="flex items-center gap-3">
<div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center">
<Server className="h-5 w-5 md:h-6 md:w-6 text-primary" />
</div>
<h3 className="text-lg font-semibold text-foreground opacity-80">Cost Breakdown</h3>
</div>
<Badge variant="outline" className="text-xs">7 Services</Badge>
</div>

{/* Cost Items */}
<div className="space-y-3">
{costsData.baseline.map((item, idx) => {
const Icon = item.icon || Server;
const isVariable = item.variable;
const isFree = item.estimate === "$0" || item.estimate === "$0 (marginal)";
return (
<div key={idx} className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border/50 hover:border-primary/30 transition-colors">
<div className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-primary/5 flex items-center justify-center flex-shrink-0">
<Icon className="h-4 w-4 md:h-5 md:w-5 text-primary" />
</div>
<div className="flex-1 min-w-0">
<div className="flex items-center gap-2">
<span className="font-medium text-sm text-foreground opacity-80 truncate">{item.component}</span>
{isVariable && (
<Badge variant="outline" className="text-xs flex-shrink-0 bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
Variable
</Badge>
)}
{isFree && (
<Badge variant="outline" className="text-xs flex-shrink-0 bg-green-500/10 text-green-600 border-green-500/20">
Free
</Badge>
)}
</div>
<p className="text-xs text-muted-foreground truncate">{item.model}</p>
</div>
<Badge 
variant={isFree ? "secondary" : "default"}
className={`flex-shrink-0 text-xs ${isVariable ? 'bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20' : ''}`}
>
{item.estimate}
</Badge>
</div>
);
})}
</div>
</CardContent>
</Card>
</div>
</div>

{/* Bottom Row - Drivers & Risks */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-6">
{/* Cost Drivers */}
<Card className="bg-card/50 hover:shadow-lg transition-all">
<CardContent className="p-4 md:p-6">
<div className="flex items-center gap-3 mb-4">
<div className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-primary/10 flex items-center justify-center">
<TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-primary" />
</div>
<h3 className="text-base md:text-lg font-semibold text-foreground opacity-80">Future Cost Drivers</h3>
</div>
<div className="space-y-4">
{costsData.drivers.map((driver, idx) => {
const Icon = driver.icon || Zap;
const tierColor = driver.tier === 'high' ? 'text-red-500' : driver.tier === 'medium' ? 'text-yellow-500' : 'text-green-500';
const tierBg = driver.tier === 'high' ? 'bg-red-500/10' : driver.tier === 'medium' ? 'bg-yellow-500/10' : 'bg-green-500/10';
return (
<div key={idx} className="flex gap-3 items-start">
<div className={`w-8 h-8 rounded-lg ${tierBg} flex items-center justify-center flex-shrink-0`}>
<Icon className={`h-4 w-4 ${tierColor}`} />
</div>
<div className="flex-1">
<div className="flex items-center justify-between gap-2">
<span className="font-medium text-sm text-foreground opacity-80">{driver.label}</span>
<Badge variant="outline" className="text-xs flex-shrink-0">
{driver.impact}
</Badge>
</div>
</div>
</div>
);
})}
</div>
</CardContent>
</Card>

{/* Scaling Risks */}
<Card className="bg-card/50 hover:shadow-lg transition-all">
<CardContent className="p-4 md:p-6">
<div className="flex items-center gap-3 mb-4">
<div className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-primary/10 flex items-center justify-center">
<AlertTriangle className="h-4 w-4 md:h-5 md:w-5 text-primary" />
</div>
<h3 className="text-base md:text-lg font-semibold text-foreground opacity-80">Scaling Risks</h3>
</div>
<div className="space-y-4">
{costsData.risks.map((risk, idx) => {
const severityColor = risk.severity === 'high' ? 'text-red-500' : risk.severity === 'medium' ? 'text-yellow-500' : 'text-green-500';
const severityBg = risk.severity === 'high' ? 'bg-red-500/10' : risk.severity === 'medium' ? 'bg-yellow-500/10' : 'bg-green-500/10';
return (
<div key={idx} className="border-l-2 border-l-border pl-4 py-1">
<div className="flex items-center gap-2 mb-1">
<div className={`w-2 h-2 rounded-full ${severityBg.replace('bg-', 'bg-').replace('/10', '')}`}></div>
<span className="font-medium text-sm text-foreground opacity-80">{risk.scenario}</span>
</div>
<p className="text-xs text-muted-foreground">
<span className="font-medium text-foreground opacity-60">Mitigation:</span> {risk.mitigation}
</p>
</div>
);
})}
</div>
</CardContent>
</Card>
</div>
</div>
</section>

{/* Footer Statement */}
<footer className="px-4 md:px-6 py-12 md:py-16 bg-primary/5">
<div className="max-w-2xl mx-auto text-center">
<p className="text-xl md:text-2xl font-semibold text-foreground leading-relaxed">
"This project reflects how I design systems: pragmatic, cost-aware, and built under real constraints."
</p>
</div>
</footer>
        </main>
      </div>
    </div>
  );
}
