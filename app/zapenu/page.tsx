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
  HardDrive
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
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/#projects" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Projects</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                  activeSection === item.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/10'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <div className="flex">
        {/* Main Content */}
        <main className="flex-1">
          {/* Hero Section */}
          <section id="overview" ref={(el) => { sectionRefs.current['overview'] = el; }} className="min-h-screen px-4 md:px-6 py-12 md:py-20">
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <h1 className="text-3xl md:text-5xl font-bold text-foreground opacity-80 mb-4">{overviewData.title}</h1>
                <p className="text-lg md:text-xl text-primary mb-8">{overviewData.description}</p>
                <div className="grid grid-cols-2 sm:flex gap-2 mb-8">
                  {overviewData.badges.map((badge, idx) => {
                    const iconMap: Record<string, React.ElementType> = {
                      GitBranch,
                      CreditCard,
                      DollarSign,
                      Shield,
                    };
                    const Icon = iconMap[badge.icon] || Badge;
                    return (
                      <Badge key={idx} className={`${badge.color} flex items-center justify-center gap-1.5 md:gap-2 px-2 md:px-3 py-1.5 text-xs md:text-sm`}>
                        <Icon className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                        <span className="truncate">{badge.label}</span>
                      </Badge>
                    );
                  })}
                </div>
              </div>
              </div>

              {/* Problem Solved */}
              <div className="mb-12">
                <h2 className="text-xl md:text-2xl font-bold mb-6 text-foreground opacity-80 text-center">{overviewData.problem.title}</h2>
                <ul className="space-y-3 max-w-2xl mx-auto">
                  {overviewData.problem.items.map((item, idx) => (
                    <li key={idx} className="flex gap-2 md:gap-3 text-sm md:text-base text-primary items-start justify-center">
                      <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
          </section>

      {/* Architecture Section */}
      <section id="architecture" ref={(el) => { sectionRefs.current['architecture'] = el; }} className="min-h-screen px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl md:text-2xl font-bold mb-12 text-foreground opacity-80 text-center">System Architecture</h2>
          
          {/* Mappings de iconos y colores por capa */}
          {(() => {
            const layerIcons = [Monitor, Cloud, Server, Database, ExternalLink];
            const layerColors = [
              { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-500', badge: 'bg-blue-500/20 text-blue-600', header: 'border-blue-500' },
              { bg: 'bg-orange-500/10', border: 'border-orange-500/20', text: 'text-orange-500', badge: 'bg-orange-500/20 text-orange-600', header: 'border-orange-500' },
              { bg: 'bg-green-500/10', border: 'border-green-500/20', text: 'text-green-500', badge: 'bg-green-500/20 text-green-600', header: 'border-green-500' },
              { bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-500', badge: 'bg-purple-500/20 text-purple-600', header: 'border-purple-500' },
              { bg: 'bg-pink-500/10', border: 'border-pink-500/20', text: 'text-pink-500', badge: 'bg-pink-500/20 text-pink-600', header: 'border-pink-500' },
            ];
            const serviceIcons: Record<string, React.ElementType> = {
              'Homero': Globe, 'Marge': Lock, 'Cloudflare Edge': Cloud,
              'Barto': Server, 'Omnipago': CreditCard,
              'PostgreSQL (Supabase)': Database, 'PostgreSQL (RDS + omnipago)': Database, 'Cloudflare R2': HardDrive,
              'MercadoPago': CreditCard, 'WAHA': MessageSquare, 'Supabase': Database
            };
            
            return (
              <div className="space-y-12">
                {architectureData.layers.map((layer, layerIdx) => {
                  const LayerIcon = layerIcons[layerIdx];
                  const colors = layerColors[layerIdx];
                  
                  return (
                    <div key={layerIdx}>
                      {/* Contenedor principal de la capa - Estructura rectangular centrada */}
                      <div className={`max-w-4xl mx-auto rounded-xl border ${colors.header} bg-card overflow-hidden`}>
                        {/* Header de la capa */}
                        <div className={`flex items-center gap-4 p-4 ${colors.bg} border-b ${colors.border}`}>
                          <div className={`w-10 h-10 rounded-lg bg-background flex items-center justify-center ${colors.text}`}>
                            <LayerIcon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-0.5 rounded text-xs font-bold ${colors.badge}`}>
                                {layerIdx + 1}
                              </span>
                              <h3 className={`text-lg font-semibold ${colors.text}`}>{layer.name}</h3>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">{layer.services.length} services</p>
                          </div>
                        </div>
                        
                      {/* Grid de servicios dentro del contenedor - Centrado */}
                      <div className="p-4">
                        <div className="flex flex-wrap justify-center gap-3">
                          {layer.services.map((service, svcIdx) => {
                              const ServiceIcon = serviceIcons[service.name] || Server;
                              
                              return (
                            <Card 
                              key={svcIdx} 
                              className={`group w-full sm:w-[calc(50%-0.375rem)] lg:w-[calc(33.333%-0.5rem)] max-w-sm border-l-2 ${colors.border.replace('/20', '')} hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 transition-all duration-300 ${colors.bg} bg-background`}
                            >
                                  <CardContent className="p-3">
                                    {/* Header del servicio */}
                                    <div className="flex items-start gap-2 mb-2">
                                      <div className={`w-8 h-8 rounded bg-muted flex items-center justify-center ${colors.text} group-hover:scale-105 transition-transform flex-shrink-0`}>
                                        <ServiceIcon className="h-4 w-4" />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-1">
                                          <h4 className="font-semibold text-foreground text-sm truncate">{service.name}</h4>
                                          {service.port && (
                                            <Badge variant="outline" className="text-[9px] whitespace-nowrap flex-shrink-0 h-4 px-1">
                                              {service.port}
                                            </Badge>
                                          )}
                                        </div>
                                        <p className="text-[11px] text-primary">{service.type}</p>
                                      </div>
                                    </div>
                                    
                                    {/* Descripción */}
                                    <p className="text-xs text-foreground opacity-80 mb-2 border-t border-border/50 pt-1.5 leading-relaxed">
                                      {service.role}
                                    </p>
                                    
                                    {/* Badges de tecnología */}
                                    <div className="flex flex-wrap gap-1">
                                      {service.stack && (
                                        <Badge variant="secondary" className={`text-[9px] h-4 px-1.5 ${colors.badge}`}>
                                          {service.stack}
                                        </Badge>
                                      )}
                                      {service.protocol && (
                                        <Badge variant="outline" className="text-[9px] h-4 px-1.5">
                                          {service.protocol}
                                        </Badge>
                                      )}
                                    </div>
                                    
                                    {/* Acceso y cache */}
                                    {(service.access || service.cache) && (
                                      <div className="flex flex-wrap gap-1 mt-1.5">
                                        {service.access && (
                                          <Badge 
                                            variant={service.access === "Público" ? "default" : "secondary"}
                                            className="text-[9px] h-4 px-1.5"
                                          >
                                            {service.access === "Público" ? <Globe className="h-2 w-2 mr-0.5" /> : <Lock className="h-2 w-2 mr-0.5" />}
                                            {service.access}
                                          </Badge>
                                        )}
                                        {service.cache && (
                                          <Badge variant="outline" className="text-[9px] h-4 px-1.5">
                                            <Clock className="h-2 w-2 mr-0.5" />
                                            {service.cache}
                                          </Badge>
                                        )}
                                      </div>
                                    )}
                                    
                                    {/* Features */}
                                    {service.features && (
                                      <div className="flex flex-wrap gap-1 mt-1.5">
                                        {service.features.map((f, i) => (
                                          <Badge 
                                            key={i} 
                                            variant="outline" 
                                            className={`text-[9px] h-4 px-1.5 ${colors.bg}`}
                                          >
                                            <CheckCircle className={`h-2 w-2 mr-0.5 ${colors.text}`} />
                                            {f}
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
                      
                      {/* Separador entre capas (excepto la última) */}
                      {layerIdx < architectureData.layers.length - 1 && (
                        <div className="flex items-center gap-4 mt-6 opacity-40">
                          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                          <ArrowDown className="h-4 w-4 text-muted-foreground" />
                          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      </section>

          {/* Data Flows Section */}
          <section id="dataflows" ref={(el) => { sectionRefs.current['dataflows'] = el; }} className="min-h-screen px-6 py-20">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-12 text-center">Key Data Flows</h2>
              
              <div className="space-y-12">
                {dataFlowsData.map((flow, idx) => (
                  <div key={flow.id} className="relative">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <flow.icon className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold">{flow.title}</h3>
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
                              <p className="text-sm text-muted-foreground font-mono">{step.desc}</p>
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
          <section id="decisions" ref={(el) => { sectionRefs.current['decisions'] = el; }} className="min-h-screen px-6 py-20 bg-card/30">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-12 text-center">Design Decisions & Trade-offs</h2>
              
              <div className="space-y-6">
                {decisionsData.map((decision, idx) => (
                  <Card key={idx} className="hover:border-primary/30 transition-colors">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-3">{decision.decision}</h3>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-semibold text-green-500">Why: </span>
                          <span className="text-muted-foreground">{decision.why}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-orange-500">Trade-off: </span>
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
          <section id="costs" ref={(el) => { sectionRefs.current['costs'] = el; }} className="min-h-screen px-6 py-20">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-12 text-center">Cost Considerations</h2>
              
              <div className="mb-8 text-center">
                <div className="inline-block px-8 py-4 bg-primary/10 rounded-xl">
                  <span className="text-sm text-muted-foreground">Estimated Monthly Cost</span>
                  <p className="text-4xl font-bold text-primary">{costsData.total}</p>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Cost Breakdown</h3>
                <div className="grid gap-3">
                  {costsData.baseline.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-card rounded-lg border border-border">
                      <div>
                        <span className="font-medium">{item.component}</span>
                        <span className="text-xs text-muted-foreground ml-2">({item.provider})</span>
                      </div>
                      <Badge variant="outline">{item.estimate}</Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Zap className="h-4 w-4 text-orange-500" />
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
                      <AlertTriangle className="h-4 w-4 text-red-500" />
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
          <footer className="px-6 py-16 bg-primary/5">
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
