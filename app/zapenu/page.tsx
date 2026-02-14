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
  ChevronUp
} from "lucide-react";

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
    { component: "VPS Backend (barto)", provider: "AWS/GCP/Otros", model: "Compute instance (ARM64)", estimate: "$5-20/mes" },
    { component: "VPS Backend (omnipago)", provider: "AWS/GCP/Otros", model: "Compute instance", estimate: "$5-15/mes" },
    { component: "Supabase", provider: "Supabase", model: "Free tier / Pro", estimate: "$0-25/mes" },
    { component: "PostgreSQL (omnipago)", provider: "Self-hosted", model: "Shared con VPS", estimate: "$0 (marginal)" },
    { component: "Cloudflare R2", provider: "Cloudflare", model: "Storage + Class A/B ops", estimate: "$0-5/mes" },
    { component: "Cloudflare Pages", provider: "Cloudflare", model: "Free tier", estimate: "$0" },
    { component: "WhatsApp WAHA", provider: "Self-hosted", model: "Infraestructura propia", estimate: "$0 (marginal)" },
    { component: "GitHub Actions", provider: "GitHub", model: "Self-hosted", estimate: "$0" },
    { component: "MercadoPago Fees", provider: "MercadoPago", model: "% por transacción", estimate: "2.99% + IVA" },
  ],
  total: "$30-80/mes",
  drivers: [
    { label: "MercadoPago Fees", impact: "Variable según volumen", icon: CreditCard },
    { label: "Supabase Pro si escala", impact: "$25+/mes", icon: Database },
    { label: "Cloudflare Pages Pro", impact: "$20/mes si 10x tráfico", icon: Cloud },
  ],
  risks: [
    { scenario: "10x tráfico en Homero", risk: "Cloudflare Pages free tier limits", mitigation: "Upgrade a Pro ($20/mes)" },
    { scenario: "100x imágenes subidas", risk: "R2 storage y operaciones", mitigation: "Límites de tamaño (10MB), compresión previa" },
    { scenario: "1000x pedidos/día", risk: "Supabase rate limits", mitigation: "Pool tuning, potencial migración" },
    { scenario: "Viralización WhatsApp", risk: "Ban de número WAHA", mitigation: "No identificado: fallback a email/SMS" },
    { scenario: "Crecimiento DB", risk: "Supabase storage limits", mitigation: "Archivado, particionamiento no identificado" },
  ]
};



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
          <h2 className="text-xl md:text-2xl font-bold mb-12 text-foreground opacity-80 text-center">System Architecture</h2>

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

{/* Data Flows Section */}
      <section id="dataflows" ref={(el) => { sectionRefs.current['dataflows'] = el; }} className="min-h-screen px-4 md:px-6 py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl md:text-2xl font-bold mb-12 text-foreground opacity-80 text-center">Key Data Flows</h2>
              
              <div className="space-y-12">
                {dataFlowsData.map((flow, idx) => (
                  <div key={flow.id} className="relative">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <flow.icon className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold text-primary">{flow.title}</h3>
                    </div>
                    <div className="grid gap-4">
                      {flow.steps.map((step, stepIdx) => (
                        <div key={stepIdx} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                              {step.num}
                            </div>
                            {stepIdx < flow.steps.length - 1 && (
                              <div className="w-0.5 h-12 bg-border" />
                            )}
                          </div>
                          <Card className="flex-1">
                            <CardContent className="p-4">
                              <h4 className="font-semibold mb-1">{step.title}</h4>
                              <p className="text-xs md:text-sm text-muted-foreground font-mono break-words">{step.desc}</p>
                            </CardContent>
                          </Card>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

{/* Design Decisions Section */}
      <section id="decisions" ref={(el) => { sectionRefs.current['decisions'] = el; }} className="min-h-screen px-4 md:px-6 py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl md:text-2xl font-bold mb-12 text-foreground opacity-80 text-center">Design Decisions & Trade-offs</h2>
              
              <div className="space-y-6">
                {decisionsData.map((decision, idx) => (
                  <Card key={idx} className="hover:border-primary/30 transition-colors">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-3">{decision.decision}</h3>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-semibold text-primary">Why: </span>
                          <span className="text-muted-foreground">{decision.why}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-foreground opacity-80">Trade-off: </span>
                          <span className="text-muted-foreground">{decision.tradeoff}</span>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-border">
                        <span className="text-xs text-muted-foreground">Alternatives: </span>
                        <span className="text-xs text-primary">{decision.alternatives}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

{/* Costs Section */}
      <section id="costs" ref={(el) => { sectionRefs.current['costs'] = el; }} className="min-h-screen px-4 md:px-6 py-12 md:py-20">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-xl md:text-2xl font-bold mb-12 text-foreground opacity-80 text-center">Cost Considerations</h2>
              
              <div className="mb-8 text-center">
                <div className="inline-block px-8 py-4 bg-primary/10 rounded-xl">
                  <span className="text-sm text-muted-foreground">Estimated Monthly Cost</span>
                  <p className="text-4xl font-bold text-primary">{costsData.total}</p>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 text-primary">Cost Breakdown</h3>
                <div className="grid gap-3">
                  {costsData.baseline.map((item, idx) => (
<div key={idx} className="flex flex-wrap justify-between items-center gap-2 p-3 bg-card rounded-lg border border-border">
                                  <div className="min-w-0 flex-1">
                                    <span className="font-medium truncate block">{item.component}</span>
                                    <span className="text-xs text-muted-foreground truncate block">({item.provider})</span>
                                  </div>
                                  <Badge variant="outline" className="flex-shrink-0">{item.estimate}</Badge>
                                </div>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Zap className="h-4 w-4 text-primary" />
                      Main Cost Drivers
                    </h4>
                    <div className="space-y-3">
                      {costsData.drivers.map((driver, idx) => (
                        <div key={idx} className="flex gap-3">
                          <driver.icon className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="font-medium text-sm">{driver.label}</span>
                            <span className="text-xs text-muted-foreground ml-2">{driver.impact}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-foreground opacity-80" />
                      Scaling Risks
                    </h4>
                    <div className="space-y-3">
                      {costsData.risks.map((risk, idx) => (
                        <div key={idx}>
                          <span className="font-medium text-sm">{risk.scenario}</span>
                          <p className="text-xs text-muted-foreground">Mitigation: {risk.mitigation}</p>
                        </div>
                      ))}
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
              <p className="mt-4 text-muted-foreground">
                Architecture designed for the Latin American market with focus on operational simplicity and scalability.
              </p>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
