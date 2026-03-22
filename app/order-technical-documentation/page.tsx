"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useTranslation } from "@/hooks/useTranslation";
import {
  ArrowLeft,
  Server,
  Database,
  Cloud,
  MessageSquare,
  GitBranch,
  Globe,
  Shield,
  Lock,
  Key,
  Layers,
  Workflow,
  ChevronDown,
  X,
  Menu,
  Maximize2,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  AlertCircle,
  LucideIcon,
  Maximize,
  Box,
  Clock,
  RefreshCw,
  MessageCircle,
  Container,
  HardDrive,
  Scale,
  Users,
  FileKey,
  Terminal,
  FileCode,
  Cpu,
  Network,
  Blocks,
  BookOpen
} from "lucide-react";
import { MermaidDiagram, MiniMermaidDiagram } from "@/components/ui/mermaid-diagram";

const navigationItems = [
  { id: "overview", labelKey: "nav.overview" },
  { id: "architecture", labelKey: "nav.architecture" },
  { id: "infrastructure", labelKey: "nav.infrastructure" },
  { id: "dataflows", labelKey: "nav.dataflows" },
  { id: "decisions", labelKey: "nav.decisions" },
  { id: "security", labelKey: "nav.security" },
  { id: "limitations", labelKey: "nav.limitations" },
];

const overviewData = {
  titleKey: "sections.overview.title",
  subtitleKey: "sections.overview.subtitle",
  descriptionKey: "sections.overview.description",
  badges: [
    { labelKey: "sections.overview.badges.eventDriven", color: "bg-secondary text-secondary-foreground" },
    { labelKey: "sections.overview.badges.eventSourcing", color: "bg-secondary text-secondary-foreground" },
    { labelKey: "sections.overview.badges.sagaPattern", color: "bg-secondary text-secondary-foreground" },
    { labelKey: "sections.overview.badges.microservices", color: "bg-secondary text-secondary-foreground" },
  ],
  problem: {
    titleKey: "sections.overview.problemTitle",
    itemsKeys: [
      "sections.overview.problemItems.0",
      "sections.overview.problemItems.1",
      "sections.overview.problemItems.2",
      "sections.overview.problemItems.3",
      "sections.overview.problemItems.4"
    ]
  }
};

const architectureData = {
  services: [
    {
      name: "Order Service",
      type: "API + Workers",
      stack: "Node.js + Express + TSOA",
      port: "3000",
      roleKey: "architecture.services.orderService.role",
      protocol: "REST + AMQP",
      features: ["Event Store", "Outbox Pattern", "Deduplication"]
    },
    {
      name: "Inventory Service",
      type: "Event Consumer",
      stack: "Node.js",
      roleKey: "architecture.services.inventoryService.role",
      protocol: "AMQP Consumer",
      features: ["Stock Management", "Reservations"]
    },
    {
      name: "Payment Service",
      type: "Event Consumer",
      stack: "Node.js",
      roleKey: "architecture.services.paymentService.role",
      protocol: "AMQP Consumer",
      features: ["Payment Processing", "Validation"]
    }
  ],
  orderServiceComponents: [
    {
      name: "REST API",
      type: "Express + TSOA",
      port: "3000",
      roleKey: "architecture.components.restApi.role",
      features: ["POST /orders", "GET /orders/:id", "GET /:id/events"]
    },
    {
      name: "outbox-worker",
      type: "Worker",
      roleKey: "architecture.components.outboxWorker.role",
      featuresKey: "architecture.components.outboxWorker.features"
    },
    {
      name: "router.ts",
      type: "Event Router",
      roleKey: "architecture.components.router.role",
      featuresKey: "architecture.components.router.features"
    },
    {
      name: "workers",
      type: "Partitioned Workers",
      roleKey: "architecture.components.workers.role",
      featuresKey: "architecture.components.workers.features"
    }
  ],
  patterns: [
    {
      name: "Event Sourcing",
      icon: GitBranch,
      descriptionKey: "architecture.patterns.eventSourcing.description",
      benefitsKey: "architecture.patterns.eventSourcing.benefits"
    },
    {
      name: "Outbox Pattern",
      icon: RefreshCw,
      descriptionKey: "architecture.patterns.outboxPattern.description",
      benefitsKey: "architecture.patterns.outboxPattern.benefits"
    },
    {
      name: "Saga (Coreografía)",
      icon: Workflow,
      descriptionKey: "architecture.patterns.sagaChoreography.description",
      benefitsKey: "architecture.patterns.sagaChoreography.benefits"
    },
    {
      name: "Deduplicación",
      icon: Layers,
      descriptionKey: "architecture.patterns.deduplication.description",
      benefitsKey: "architecture.patterns.deduplication.benefits"
    },
    {
      name: "Consistent Hashing",
      icon: Globe,
      descriptionKey: "architecture.patterns.consistentHashing.description",
      benefitsKey: "architecture.patterns.consistentHashing.benefits"
    }
  ]
};

const infrastructureData = {
  layers: [
    {
      name: "Compute",
      subcategories: [
        {
          name: "ECS Clusters (Control Plane)",
          badge: "Infrastructure",
          items: [
            { name: "services-cluster", type: "ECS Cluster", detail: "t3.micro • ASG: 1-2" },
            { name: "rabbitmq-cluster", type: "ECS Cluster", detail: "t3.micro • Fixed: 1" },
          ]
        },
        {
          name: "ECS Services (Workloads)",
          badge: "Applications",
          items: [
            { 
              name: "order-service", 
              type: "ECS Service", 
              detail: "Port: 3000 • Public-facing", 
              badge: "ALB",
              icon: "internal"
            },
            { 
              name: "inventory-service", 
              type: "ECS Service", 
              detail: "Internal • Event Consumer", 
              badge: "Service Connect",
              icon: "internal"
            },
            { 
              name: "payment-service", 
              type: "ECS Service", 
              detail: "Internal • Event Consumer", 
              badge: "Service Connect",
              icon: "internal"
            },
            { 
              name: "rabbitmq", 
              type: "ECS Service", 
              detail: "Ports: 5672/15672 • Message Broker", 
              badge: "Service Connect",
              icon: "internal"
            },
          ]
        },
      ]
    },
    {
      name: "Networking",
      items: [
        { name: "ALB", type: "Application Load Balancer", detail: "Port: 80/443", badge: "Entry point" },
        { name: "VPC", type: "Virtual Private Cloud", detail: "AZ A", badge: "AWS VPC" },
        { name: "Service Connect", type: "Cloud Map", detail: "commerce-platform.local", badge: "DNS" },
      ]
    },
    {
      name: "Data Layer",
      items: [
        { name: "order-service-db", type: "RDS PostgreSQL", detail: "db.t3.micro • 20GB", badge: "orders + events" },
        { name: "inventory-service-db", type: "RDS PostgreSQL", detail: "db.t3.micro • 20GB", badge: "inventory" },
        { name: "payment-service-db", type: "RDS PostgreSQL", detail: "db.t3.micro • 20GB", badge: "payments" },
        { name: "Redis", type: "ElastiCache", detail: "cache.t3.micro • Port: 6379", badge: "deduplication" },
      ]
    },
    {
      name: "Security",
      items: [
        { name: "Security Groups", type: "5 groups", detail: "order-svc, rabbitmq, rds, redis, common", badge: "Network" },
        { name: "KMS", type: "Key Management", detail: "RDS + SSM encryption", badge: "Encryption" },
      ]
    },
    {
      name: "Management",
      items: [
        { name: "ECR", type: "Container Registry", detail: "3 repos", badge: "Images" },
        { name: "CloudWatch Logs", type: "Logging", detail: "Log groups per service", badge: "Logs" },
        { name: "SSM Parameter Store", type: "Secrets", detail: "DATABASE_URL, Redis, RabbitMQ", badge: "Secrets" },
        { name: "IAM Roles", type: "ECS Roles", detail: "Task Execution + Task Roles", badge: "Access" },
      ]
    }
  ]
};

const dataFlowsData = [
  {
    id: "order-creation",
    title: "Order Creation Flow",
    icon: Box,
    diagram: `sequenceDiagram
    participant C as Client
    participant O as Order Service
    participant DB as PostgreSQL
    participant R as Redis
    participant RMQ as RabbitMQ
    participant I as Inventory
    participant P as Payment
    
    C->>O: POST /orders
    O->>O: Validate input
    O->>DB: BEGIN TRANSACTION
    DB->>DB: INSERT orders (PENDING)
    DB->>DB: INSERT outbox_events
    DB->>O: COMMIT
    O->>R: Set dedup key (TTL)
    O->>RMQ: Publish ORDER_CREATED
    RMQ->>I: Consume ORDER_CREATED
    I->>DB: Reserve stock
    I->>RMQ: Publish INVENTORY_RESERVED
    RMQ->>P: Consume ORDER_CREATED
    P->>DB: Validate payment
    P->>RMQ: Publish PAYMENT_APPROVED
    O->>I: Consume INVENTORY_RESERVED
    O->>P: Consume PAYMENT_APPROVED
    O->>DB: UPDATE order status (COMPLETED)`
  },
  {
    id: "saga-pattern",
    title: "Saga Compensation Flow",
    icon: RefreshCw,
    diagram: `sequenceDiagram
    participant O as Order Service
    participant I as Inventory Service
    participant P as Payment Service
    participant RMQ as RabbitMQ
    participant DB as PostgreSQL
    
    O->>RMQ: Publish ORDER_CREATED
    RMQ->>I: Consume ORDER_CREATED
    I->>I: Reserve stock
    I->>RMQ: Publish INVENTORY_RESULT
    RMQ->>P: Consume ORDER_CREATED
    P->>P: Process payment
    P->>RMQ: Publish PAYMENT_RESULT
    alt Both Success
        O->>O: Update to COMPLETED
    else Inventory Failed
        I->>RMQ: Publish INVENTORY_FAILED
        RMQ->>O: Consume INVENTORY_FAILED
        O->>RMQ: Publish ORDER_CANCELLED
        RMQ->>P: Consume ORDER_CANCELLED
        P->>P: Rollback payment
        O->>DB: Update to CANCELLED
    else Payment Failed
        P->>RMQ: Publish PAYMENT_FAILED
        RMQ->>O: Consume PAYMENT_FAILED
        O->>RMQ: Publish ORDER_CANCELLED
        RMQ->>I: Consume ORDER_CANCELLED
        I->>I: Release stock
        O->>DB: Update to CANCELLED
    end`
  },
  {
    id: "state-machine",
    title: "Order State Machine",
    icon: Workflow,
    diagram: `stateDiagram-v2
    [*] --> PENDING
    PENDING --> CONFIRMED: Payment + Inventory OK
    PENDING --> CANCELLED: Payment Failed
    PENDING --> CANCELLED: Inventory Failed
    CONFIRMED --> COMPLETED: All processed
    CANCELLED --> COMPENSATION_PENDING: Trigger saga
    COMPENSATION_PENDING --> COMPENSATED: All rolled back
    COMPENSATION_PENDING --> COMPENSATION_FAILED: Rollback error
    COMPENSATION_FAILED --> [*]`
  }
];

const decisionsData = [
  {
    decision: "Event Sourcing",
    whyKey: "decisions.items.eventSourcing.why",
    tradeoffKey: "decisions.items.eventSourcing.tradeoff",
    alternativesKey: "decisions.items.eventSourcing.alternatives"
  },
  {
    decision: "Outbox Pattern",
    whyKey: "decisions.items.outboxPattern.why",
    tradeoffKey: "decisions.items.outboxPattern.tradeoff",
    alternativesKey: "decisions.items.outboxPattern.alternatives"
  },
  {
    decision: "Saga (Coreografía)",
    whyKey: "decisions.items.sagaChoreography.why",
    tradeoffKey: "decisions.items.sagaChoreography.tradeoff",
    alternativesKey: "decisions.items.sagaChoreography.alternatives"
  },
  {
    decision: "Hexagonal Architecture",
    whyKey: "decisions.items.hexagonalArchitecture.why",
    tradeoffKey: "decisions.items.hexagonalArchitecture.tradeoff",
    alternativesKey: "decisions.items.hexagonalArchitecture.alternatives"
  },
  {
    decision: "PostgreSQL por Servicio",
    whyKey: "decisions.items.postgresqlPerService.why",
    tradeoffKey: "decisions.items.postgresqlPerService.tradeoff",
    alternativesKey: "decisions.items.postgresqlPerService.alternatives"
  }
];

const securityData = {
  authentication: {
    status: "NOT IMPLEMENTED",
    detailKey: "security.authentication.detail",
    severity: "high",
    mitigationKey: "security.authentication.mitigation"
  },
  authorization: {
    status: "NOT IMPLEMENTED",
    detailKey: "security.authorization.detail",
    severity: "high",
    mitigationKey: "security.authorization.mitigation"
  },
  secrets: [
    { item: "DATABASE_URL", status: "OK", detail: "AWS SSM" },
    { item: "RabbitMQ credentials", status: "OK", detail: "AWS SSM" },
    { item: "Redis URL", status: "OK", detail: "AWS SSM" },
  ],
  vulnerabilities: [
    { item: "Data exposure", severity: "high", mitigation: "Filtrar respuestas HTTP" },
    { item: "SQL Injection", severity: "medium", mitigation: "Queries parametrizadas" },
    { item: "Rate limiting", severity: "medium", mitigation: "API Gateway rate limit" },
  ]
};

const limitationsData = {
  notImplemented: [
    { itemKey: "limitations.notImplemented.auth.item", detailKey: "limitations.notImplemented.auth.detail" },
    { itemKey: "limitations.notImplemented.catalog.item", detailKey: "limitations.notImplemented.catalog.detail" },
    { itemKey: "limitations.notImplemented.users.item", detailKey: "limitations.notImplemented.users.detail" },
    { itemKey: "limitations.notImplemented.notifications.item", detailKey: "limitations.notImplemented.notifications.detail" },
    { itemKey: "limitations.notImplemented.analytics.item", detailKey: "limitations.notImplemented.analytics.detail" },
  ],
  restrictions: [
    { itemKey: "limitations.restrictions.workers.item", detailKey: "limitations.restrictions.workers.detail" },
    { itemKey: "limitations.restrictions.polling.item", detailKey: "limitations.restrictions.polling.detail" },
    { itemKey: "limitations.restrictions.singleNode.item", detailKey: "limitations.restrictions.singleNode.detail" },
    { itemKey: "limitations.restrictions.eventStore.item", detailKey: "limitations.restrictions.eventStore.detail" },
  ]
};

// Component for Decision Accordion
interface DecisionAccordionProps {
  decision: {
    decision: string;
    whyKey: string;
    tradeoffKey: string;
    alternativesKey: string;
  };
  index: number;
  icon: React.ElementType;
  isExpanded: boolean;
  onToggle: () => void;
}

function DecisionAccordion({ decision, index, icon: Icon, isExpanded, onToggle }: DecisionAccordionProps) {
  const { t: tOrder } = useTranslation('order');
  const isEven = index % 2 === 0;

  return (
    <div className="relative">
      <div className={`absolute md:left-1/2 md:-translate-x-1/2 left-6 -translate-x-1/2 top-6 z-10`}>
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-card border-2 border-primary flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
          <Icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
        </div>
      </div>

      <div className={`md:grid md:grid-cols-2 md:gap-8 pl-16 md:pl-0 ${isEven ? '' : 'md:direction-rtl'}`}>
        <div className={`hidden md:block ${isEven ? 'md:order-1' : 'md:order-2'}`}></div>

        <div className={`${isEven ? 'md:order-2 md:pl-8' : 'md:order-1 md:pr-8'}`}>
          <Card className="border-0 border-l-4 border-l-primary/60 hover:border-l-primary hover:shadow-lg transition-all duration-300 bg-background overflow-hidden">
            <button
              onClick={onToggle}
              className="w-full p-4 md:p-6 flex items-start gap-3 text-left hover:bg-accent/5 transition-colors"
            >
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xs font-bold text-primary">{index + 1}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base md:text-lg font-semibold text-foreground opacity-80 leading-tight pr-8">
                  {decision.decision}
                </h3>
              </div>
              <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                <ChevronDown className="h-4 w-4 text-primary" />
              </div>
            </button>

            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="px-4 md:px-6 pb-4 md:pb-6 border-t border-border/50">
                <div className="space-y-3 text-sm pt-4">
                  <div className="flex gap-2">
                    <span className="font-semibold text-foreground opacity-80 whitespace-nowrap">{tOrder('sections.decisions.why')}</span>
                    <span className="text-muted-foreground">{tOrder(decision.whyKey)}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-semibold text-foreground opacity-80 whitespace-nowrap">{tOrder('sections.decisions.tradeoff')}</span>
                    <span className="text-muted-foreground">{tOrder(decision.tradeoffKey)}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-border/50">
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="font-semibold text-foreground opacity-80 whitespace-nowrap">{tOrder('sections.decisions.alternatives')}</span>
                    <span className="text-muted-foreground">{tOrder(decision.alternativesKey)}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Component for Mermaid Accordion
interface MermaidAccordionProps {
  title: string;
  titleKey?: string;
  icon: LucideIcon;
  diagram: string;
  defaultOpen?: boolean;
}

function MermaidAccordion({ title, titleKey, icon: Icon, diagram, defaultOpen = false }: MermaidAccordionProps) {
  const { t: tOrder } = useTranslation('order');
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const scrollPositionRef = useRef<number>(0);

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

  const displayTitle = titleKey ? tOrder(titleKey) : title;

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
            <h3 className="text-base md:text-lg font-semibold text-foreground opacity-80 truncate">{displayTitle}</h3>
            <p className="text-xs md:text-sm text-muted-foreground">{tOrder('components.mermaid.clickToView')}</p>
          </div>
          <div className={`w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
            <ChevronDown className="h-4 w-4 text-primary" />
          </div>
        </button>
        
        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-[1500px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="p-4 md:p-6 border-t border-border bg-muted/30">
            <div className="bg-white rounded-lg p-4 shadow-inner overflow-x-auto relative group">
              <MermaidDiagram chart={diagram} />
              
              <button
                onClick={() => setIsModalOpen(true)}
                className="hidden md:block absolute top-2 right-2 p-2 bg-background/90 backdrop-blur-sm rounded-lg shadow-lg border border-border opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-primary/10"
                aria-label={tOrder('components.mermaid.viewFull')}
              >
                <Maximize2 className="h-4 w-4 text-foreground" />
              </button>
            </div>
            
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full mt-3 flex items-center justify-center gap-2 py-2 px-4 bg-primary/5 rounded-lg border border-border/50 md:hidden hover:bg-primary/10 transition-colors"
            >
              <Maximize2 className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium text-foreground opacity-80">{tOrder('components.mermaid.tapToView')}</span>
            </button>
          </div>
        </div>
      </Card>

      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div className="relative max-w-6xl max-h-[90vh] w-full flex flex-col">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute -top-12 right-0 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors z-10"
              aria-label="Close modal"
            >
              <X className="h-6 w-6 text-white" />
            </button>
            
            <h3 className="text-white text-lg font-semibold mb-4 text-center">{displayTitle}</h3>
            
            <div className="relative rounded-lg overflow-hidden bg-white shadow-2xl p-4 md:p-6 overflow-x-auto">
              <MermaidDiagram chart={diagram} />
            </div>
            
            <p className="text-white/80 text-center mt-4 text-sm">
              {tOrder('components.mermaid.clickToClose')}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

// Component for Mini Diagram Card
interface MiniDiagramCardProps {
  title: string;
  diagram: string;
}

function MiniDiagramCard({ title, diagram }: MiniDiagramCardProps) {
  const { t: tOrder } = useTranslation('order');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const scrollPositionRef = useRef<number>(0);

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
        <div className="relative flex-1 bg-white h-[110px] sm:h-[120px] md:h-[130px] overflow-hidden p-1">
          <MiniMermaidDiagram chart={diagram} />
          
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Maximize className="h-4 w-4 text-primary" />
            </div>
          </div>
        </div>
        
        <div className="h-[40px] sm:h-[40px] md:h-[50px] p-2 border-t border-border bg-card flex items-center justify-center">
          <h3 className="text-[10px] sm:text-xs font-semibold text-foreground opacity-80 text-center line-clamp-2 leading-tight">
            {title}
          </h3>
        </div>
      </button>

      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-start justify-center p-8 md:p-12 overflow-y-auto"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="relative w-full max-w-5xl my-auto flex flex-col pt-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-0 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors z-10"
              aria-label="Close modal"
            >
              <X className="h-5 w-5 text-white" />
            </button>
            
            <h3 className="text-white text-sm md:text-base font-semibold mb-2 text-center">{title}</h3>
            
            <div className="relative rounded-lg overflow-hidden bg-white shadow-2xl p-2 md:p-4 overflow-x-auto">
              <div className="min-w-[800px] md:min-w-0">
                <MermaidDiagram chart={diagram} />
              </div>
            </div>
            
            <p className="text-white/70 text-center mt-2 text-xs">
              {tOrder('components.mermaid.clickToClose')} • {tOrder('components.mermaid.scrollToExplore')}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

// Icon mapping for services
const serviceIcons: Record<string, LucideIcon> = {
  "Order Service": Server,
  "Inventory Service": Box,
  "Payment Service": MessageCircle,
  "RabbitMQ": MessageSquare,
  "PostgreSQL": Database,
  "Redis": Cloud,
  "AWS ECS": Cloud,
};

export default function OrderTechnicalDocumentation() {
  const { t: tOrder } = useTranslation('order');
  const { t: tCommon } = useTranslation('common');
  const [activeSection, setActiveSection] = useState("overview");
  const [expandedDecisions, setExpandedDecisions] = useState<number[]>([0]); // First decision expanded by default
  const [expandedInfrastructure, setExpandedInfrastructure] = useState<number[]>([0]); // First layer expanded by default
  const [expandedSubcategories, setExpandedSubcategories] = useState<Record<number, number[]>>({}); // layerIdx -> subcategory indexes (collapsed by default)
  const [showOrderServiceComponents, setShowOrderServiceComponents] = useState(false); // Accordion for Order Service Internal Components
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Detect visible section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 170;
      
      for (const item of navigationItems) {
        const element = sectionRefs.current[item.id];
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;
          
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            if (activeSection !== item.id) {
              setActiveSection(item.id);
            }
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection]);

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = sectionRefs.current[sectionId];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const toggleDecision = (index: number) => {
    setExpandedDecisions(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const toggleInfrastructure = (index: number) => {
    setExpandedInfrastructure(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const toggleSubcategory = (layerIdx: number, subIdx: number) => {
    setExpandedSubcategories(prev => {
      const current = prev[layerIdx] || [];
      return {
        ...prev,
        [layerIdx]: current.includes(subIdx)
          ? current.filter(i => i !== subIdx)
          : [...current, subIdx]
      };
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-[70] w-full transition-all duration-300 ${isMobileMenuOpen ? 'bg-transparent border-none' : 'bg-background/95 backdrop-blur-sm border-b border-border'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          {/* Home Link */}
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4 flex-shrink-0" />
            <span className="text-sm sm:text-base">Home</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === item.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/10'
                }`}
              >
                {tOrder(item.labelKey)}
              </button>
            ))}
          </nav>

          {/* Right side: LanguageSwitcher + Mobile Menu */}
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-accent/10 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-white" />
              ) : (
                <Menu className="h-6 w-6 text-foreground" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 z-[55] bg-black/80 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Navigation Menu */}
      <aside
        className={`md:hidden fixed inset-y-0 left-0 z-[60] w-full bg-primary/5 border-r border-border transform transition-transform duration-300 ease-in-out pt-16 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Code Background Image */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.08]"
          style={{
            backgroundImage: 'url(/ejemplo-codigo-2.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'left top',
            backgroundRepeat: 'no-repeat',
          }}
        />
        <div className="p-6 relative z-10">
          <nav className="flex flex-col space-y-1">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  scrollToSection(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                  activeSection === item.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/10'
                }`}
              >
                {tOrder(item.labelKey)}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 pt-[80px] md:pt-[100px]">
        {/* Overview Section */}
        <section id="overview" ref={(el) => { sectionRefs.current['overview'] = el; }} className="mb-16 md:mb-24">
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              {tOrder(overviewData.titleKey)}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-6">
              {tOrder(overviewData.subtitleKey)}
            </p>
            <p className="text-foreground/80 max-w-3xl mx-auto leading-relaxed mb-8">
              {tOrder(overviewData.descriptionKey)}
            </p>
            
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {overviewData.badges.map((badge, idx) => (
                <Badge key={idx} className={badge.color}>
                  {tOrder(badge.labelKey)}
                </Badge>
              ))}
            </div>
          </div>

          {/* Problem Section */}
          <div className="max-w-4xl mx-auto">
            <Card className="border-0 border-l-4 border-l-primary/60 bg-background">
              <CardContent className="p-6 md:p-8">
                <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-primary" />
                  {tOrder(overviewData.problem.titleKey)}
                </h2>
                <ul className="space-y-2">
                  {overviewData.problem.itemsKeys.map((itemKey, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-muted-foreground">
                      <span className="text-primary mt-1">•</span>
                      <span>{tOrder(itemKey)}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Architecture Section */}
        <section id="architecture" ref={(el) => { sectionRefs.current['architecture'] = el; }} className="mb-16 md:mb-24">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground opacity-80">{tOrder('sections.architecture.title')}</h2>
            <div className="w-20 md:w-24 h-1 bg-primary/30 mx-auto mt-3 md:mt-4 rounded-full"></div>
          </div>

          {/* Main Architecture Diagram */}
          <div className="max-w-5xl mx-auto mb-8">
            <MiniDiagramCard 
              title={tOrder('sections.architecture.systemOverview')}
              diagram={`graph TB
    Client[Client<br/>HTTP] -->|POST /orders| API[REST API<br/>Express + TSOA<br/>Port: 3000]
    API -->|Use Cases| App[Application Layer<br/>CreateOrder<br/>QueryOrder]
    App -->|Transaction ACID| DB[(PostgreSQL<br/>orders + events<br/>+ outbox_events)]
    
    subgraph OrderService["Order Service (Internal)"]
        direction TB
        DB -.->|polling 5s| Outbox[outbox-worker]
        Outbox -->|publish events| RMQ1[RabbitMQ]
        RMQ1 -->|consume| Router[router.ts<br/>Consistent Hashing]
        Router -->|partition 0| W1[worker-1]
        Router -->|partition 1| W2[worker-2]
        W1 -->|process events| DB
        W2 -->|process events| DB
    end
    
    Outbox -.->|dedup| Redis[(Redis<br/>Deduplication)]
    W1 -.->|dedup| Redis
    W2 -.->|dedup| Redis
    
    API --> Redis
    
    RMQ1 -->|ORDER_CREATED| Inventory[Inventory Service<br/>Event Consumer]
    RMQ1 -->|ORDER_CREATED| Payment[Payment Service<br/>Event Consumer]
    
    Inventory -.->|response| RMQ2[RabbitMQ]
    Payment -.->|response| RMQ2
    RMQ2 -->|event_router_queue| Router
    
    Inventory -->|TCP| DB2[(PostgreSQL<br/>inventory)]
    Payment -->|TCP| DB3[(PostgreSQL<br/>payment)]`}
            />
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {architectureData.services.map((service, idx) => {
              const ServiceIcon = serviceIcons[service.name] || Server;
              return (
                <Card key={idx} className="border-0 border-l-4 border-l-primary/60 hover:border-l-primary hover:shadow-lg transition-all bg-background">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <ServiceIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-foreground">{service.name}</h3>
                        <p className="text-sm text-primary">{service.type}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">{service.port}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{tOrder(service.roleKey)}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {service.features.map((feature, fIdx) => (
                        <Badge key={fIdx} variant="secondary" className="text-xs">{feature}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Order Service Internal Components - Accordion */}
          <div className="max-w-4xl mx-auto mt-8">
            <Card className="border-0 border-l-4 border-l-primary/60 hover:border-l-primary hover:shadow-lg transition-all bg-background">
              <button
                onClick={() => setShowOrderServiceComponents(!showOrderServiceComponents)}
                className="w-full flex items-center gap-3 p-4 md:p-6 hover:bg-accent/5 transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Server className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base md:text-lg font-semibold text-foreground">{tOrder('sections.architecture.internalComponents')}</h3>
                  <p className="text-xs md:text-sm text-muted-foreground">{tOrder('sections.architecture.internalComponentsSubtitle')}</p>
                </div>
                <Badge variant="secondary" className="text-xs">{architectureData.orderServiceComponents.length}</Badge>
                <div className={`w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center transition-transform duration-300 ${showOrderServiceComponents ? 'rotate-180' : ''}`}>
                  <ChevronDown className="h-4 w-4 text-primary" />
                </div>
              </button>
              
              <div className={`transition-all duration-300 ease-in-out overflow-hidden ${showOrderServiceComponents ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="p-4 md:p-6 pt-0 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {architectureData.orderServiceComponents.map((component, idx) => (
                    <Card key={idx} className="border-0 border-l-4 border-l-primary/40 bg-background hover:border-l-primary hover:shadow-md transition-all">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Server className="h-4 w-4 text-primary" />
                          <h4 className="text-base font-semibold text-foreground">{component.name}</h4>
                        </div>
          <p className="text-sm text-muted-foreground mb-2">{component.type}</p>
          <p className="text-sm text-primary mb-2">{tOrder(component.roleKey)}</p>
          <div className="flex flex-wrap gap-1">
            {component.features 
              ? component.features.map((feature, fIdx) => (
                  <Badge key={fIdx} variant="secondary" className="text-xs">{feature}</Badge>
                ))
              : tOrder(component.featuresKey || '').split(', ').map((feature, fIdx) => (
                  <Badge key={fIdx} variant="secondary" className="text-xs">{feature}</Badge>
                ))
            }
          </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Design Patterns Container */}
          <div className="max-w-6xl mx-auto mt-8">
            {/* Header */}
            <div className="flex items-center justify-center gap-3 p-4 md:p-6 bg-primary/5 border-2 border-foreground/80 rounded-t-xl">
              <Workflow className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              <h3 className="text-lg md:text-xl font-semibold text-foreground opacity-80">{tOrder('sections.architecture.designPatternsTitle')}</h3>
      <Badge variant="secondary" className="text-xs">
        {architectureData.patterns.length} {tOrder('sections.architecture.patternsTitle')}
      </Badge>
            </div>

            {/* Patterns Grid */}
            <div className="rounded-b-xl border-2 border-t-0 border-foreground/80 overflow-hidden bg-transparent">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 md:p-6">
                {architectureData.patterns.map((pattern, idx) => {
                  const PatternIcon = pattern.icon;
                  return (
                    <Card key={idx} className="border-0 border-l-4 hover:shadow-lg transition-all bg-background border-l-primary">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <PatternIcon className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                          </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-base font-semibold text-foreground">{pattern.name}</h4>
              <p className="text-sm text-primary mb-3">{tOrder(pattern.descriptionKey)}</p>
              <div className="flex flex-wrap gap-1">
                {tOrder(pattern.benefitsKey).split(', ').map((benefit: string, bIdx: number) => (
                  <Badge key={bIdx} variant="secondary" className="text-xs">{benefit}</Badge>
                ))}
              </div>
            </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

          {/* AWS Infrastructure Section */}
        <section id="infrastructure" ref={(el) => { sectionRefs.current['infrastructure'] = el; }} className="mb-16 md:mb-24">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground opacity-80">{tOrder('sections.infrastructure.title')}</h2>
            <div className="w-20 md:w-24 h-1 bg-primary/30 mx-auto mt-3 md:mt-4 rounded-full"></div>
          </div>

          {/* AWS Architecture Diagram */}
          <div className="max-w-5xl mx-auto mb-8">
            <MiniDiagramCard 
              title={tOrder('sections.infrastructure.diagramTitle')}
              diagram={`graph TB
    subgraph Internet["INTERNET"]
        Client["Client"]
    end
    
    subgraph VPC["AWS VPC - AZ A"]
        subgraph ALB_Layer["Application Load Balancer"]
            ALB["ALB<br/>Port 80/443"]
        end
        
        subgraph Services_Cluster["ECS Cluster: services-cluster"]
            direction LR
            OrderService["order-service<br/>Port: 3000"]
            InventoryService["inventory-service"]
        end
        
        subgraph RabbitMQ_Cluster["ECS Cluster: rabbitmq-cluster"]
            RabbitMQ["rabbitmq<br/>AMQP: 5672<br/>Mgmt: 15672"]
        end
        
        subgraph Data_Layer["Data Layer"]
            RDS1["RDS PostgreSQL<br/>order-service-db"]
            RDS2["RDS PostgreSQL<br/>inventory-service-db"]
            Redis["ElastiCache Redis<br/>Port: 6379"]
        end
        
        subgraph Security["Security Layer"]
            SG["Security Groups<br/>order-svc, rabbitmq, rds, redis, common"]
            KMS["KMS Key<br/>Encryption"]
        end
        
        subgraph Management["Management & Operations"]
            ECR["ECR<br/>order-service, inventory-service, rabbitmq"]
            CW["CloudWatch Logs<br/>Log Groups per service"]
            SSM["SSM Parameter Store<br/>Secrets: DB_URL, Redis_HOST, RabbitMQ creds"]
            IAM["IAM Roles<br/>Task Execution, Task Roles"]
        end
        
        subgraph ServiceConnect["Cloud Map Service Connect"]
            NS["Namespace<br/>commerce-platform.local"]
        end
    end
    
    Client -->|HTTPS| ALB
    ALB --> OrderService
    OrderService -->|Service Connect| RabbitMQ
    OrderService --> RDS1
    OrderService --> Redis
    InventoryService -->|Service Connect| RabbitMQ
    InventoryService --> RDS2
    RabbitMQ -.->|Service Discovery| NS
    OrderService -.-> NS
    InventoryService -.-> NS`}
            />
          </div>

          {/* Infrastructure Accordions Container */}
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-center gap-3 p-4 md:p-6 bg-primary/5 border-2 border-foreground/80 rounded-t-xl">
              <Cloud className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              <h3 className="text-lg md:text-xl font-semibold text-foreground opacity-80">{tOrder('sections.infrastructure.componentsTitle')}</h3>
              <Badge variant="secondary" className="text-xs">
                {infrastructureData.layers.reduce((acc, layer) => {
                  if (layer.subcategories) {
                    return acc + layer.subcategories.reduce((s, sub) => s + sub.items.length, 0);
                  }
                  return acc + (layer.items?.length || 0);
                }, 0)} Items
              </Badge>
            </div>

            {/* Accordions */}
            <div className="rounded-b-xl border-2 border-t-0 border-foreground/80 overflow-hidden bg-transparent">
              {(() => {
                const layerIcons = [Container, Globe, Database, Shield, Cloud];
                
                return (
                  <div className="space-y-0">
                    {infrastructureData.layers.map((layer, layerIdx) => {
                      const LayerIcon = layerIcons[layerIdx];
                      const isExpanded = expandedInfrastructure.includes(layerIdx);
                      const isLast = layerIdx === infrastructureData.layers.length - 1;

                      return (
                        <div key={layerIdx} className={`${!isLast ? 'border-b border-border' : ''}`}>
                          {/* Header clickeable */}
                          <button
                            onClick={() => toggleInfrastructure(layerIdx)}
                            className="w-full flex items-center gap-3 p-3 md:p-4 hover:bg-accent/5 transition-colors text-left group"
                          >
                            <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                              <LayerIcon className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                            </div>
                            
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
                                {layer.subcategories 
                                  ? layer.subcategories.map(s => s.name).join(' • ')
                                  : layer.items?.map(i => i.name).join(' • ')
                                }
                              </p>
                            </div>

                            <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
                              <Badge variant="secondary" className="text-[10px] md:text-xs h-5 md:h-6">
                                {layer.subcategories 
                                  ? layer.subcategories.reduce((acc, s) => acc + s.items.length, 0)
                                  : layer.items?.length || 0
                                }
                              </Badge>
                              <div className={`w-6 h-6 md:w-7 md:h-7 rounded-full bg-primary/10 flex items-center justify-center transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                                <ChevronDown className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary" />
                              </div>
                            </div>
                          </button>

                          {/* Contenido expandible */}
                          <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="p-3 md:p-4 pt-0 md:pt-0">
                              {/* Verificar si tiene subcategorías (solo Compute) */}
                              {layer.subcategories ? (
                                <div className="space-y-3">
                                  {layer.subcategories.map((subcat, subIdx) => {
                                    const isSubExpanded = expandedSubcategories[layerIdx]?.includes(subIdx) ?? false;
                                    return (
                                      <div key={subIdx} className="border border-border/50 rounded-lg overflow-hidden">
                                        <button
                                          onClick={() => toggleSubcategory(layerIdx, subIdx)}
                                          className="w-full flex items-center gap-2 px-3 py-2 bg-muted/30 hover:bg-muted/50 transition-colors text-left"
                                        >
                                          <div className={`w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center transition-transform duration-300 ${isSubExpanded ? 'rotate-180' : ''}`}>
                                            <ChevronDown className="h-3 w-3 text-primary" />
                                          </div>
                                          <Globe className="h-3.5 w-3.5 text-primary" />
                                          <h5 className="text-xs md:text-sm font-semibold text-foreground flex-1">{subcat.name}</h5>
                                          <Badge variant="secondary" className="text-[10px] h-5">{subcat.items.length}</Badge>
                                        </button>
                                        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isSubExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                          <div className="p-3 pt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                            {subcat.items.map((item, itemIdx) => (
                                              <Card key={itemIdx} className={`border-0 border-l-2 hover:shadow-md transition-all duration-200 bg-background ${(item as any).icon === 'external' ? 'border-l-green-500/60' : 'border-l-primary/40'}`}>
                                                <CardContent className="p-3 md:p-4">
                                                  <div className="flex items-start gap-2.5 md:gap-3 mb-2.5 md:mb-3">
                                                    <div className={`w-8 h-8 md:w-9 md:h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${(item as any).icon === 'external' ? 'bg-green-500/10' : 'bg-primary/10'}`}>
                                                      <Server className={`h-4 w-4 md:h-4.5 md:w-4.5 ${(item as any).icon === 'external' ? 'text-green-500' : 'text-primary'}`} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                      <div className="flex items-start justify-between gap-2">
                                                        <h5 className="text-sm md:text-base font-semibold text-foreground opacity-80 truncate">
                                                          {item.name}
                                                        </h5>
                                                        {item.badge && (
                                                          <Badge variant="outline" className="text-[10px] h-4 md:h-5 px-1 md:px-1.5 flex-shrink-0">
                                                            {item.badge}
                                                          </Badge>
                                                        )}
                                                      </div>
                                                      <p className="text-[10px] md:text-xs text-primary truncate">{item.type}</p>
                                                    </div>
                                                  </div>
                                                  <p className="text-sm text-foreground opacity-70 leading-relaxed line-clamp-2">
                                                    {item.detail}
                                                  </p>
                                                </CardContent>
                                              </Card>
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : (
                                /* Renderizado normal sin subcategorías */
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                                  {layer.items.map((item, itemIdx) => (
                                    <Card key={itemIdx} className="border-0 border-l-2 border-l-primary/40 hover:border-l-primary hover:shadow-md transition-all duration-200 bg-background">
                                      <CardContent className="p-3 md:p-4">
                                        <div className="flex items-start gap-2.5 md:gap-3 mb-2.5 md:mb-3">
                                          <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                                            <Server className="h-4 w-4 md:h-4.5 md:w-4.5 text-primary" />
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                              <h5 className="text-sm md:text-base font-semibold text-foreground opacity-80 truncate">
                                                {item.name}
                                              </h5>
                                              {item.badge && (
                                                <Badge variant="outline" className="text-[10px] h-4 md:h-5 px-1 md:px-1.5 flex-shrink-0">
                                                  {item.badge}
                                                </Badge>
                                              )}
                                            </div>
                                            <p className="text-[10px] md:text-xs text-primary truncate">{item.type}</p>
                                          </div>
                                        </div>
                                        <p className="text-sm text-foreground opacity-70 leading-relaxed line-clamp-2">
                                          {item.detail}
                                        </p>
                                      </CardContent>
                                    </Card>
                                  ))}
                                </div>
                              )}
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
        </section>

        {/* Data Flows Section */}
        <section id="dataflows" ref={(el) => { sectionRefs.current['dataflows'] = el; }} className="mb-16 md:mb-24">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground opacity-80">{tOrder('sections.dataflows.title')}</h2>
            <div className="w-20 md:w-24 h-1 bg-primary/30 mx-auto mt-3 md:mt-4 rounded-full"></div>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {dataFlowsData.map((flow, idx) => (
              <MermaidAccordion
                key={flow.id}
                title={flow.title}
                icon={flow.icon}
                diagram={flow.diagram}
                defaultOpen={idx === 0}
              />
            ))}
          </div>
        </section>

        {/* Design Decisions Section */}
        <section id="decisions" ref={(el) => { sectionRefs.current['decisions'] = el; }} className="mb-16 md:mb-24">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground opacity-80">{tOrder('sections.decisions.title')}</h2>
            <div className="w-20 md:w-24 h-1 bg-primary/30 mx-auto mt-3 md:mt-4 rounded-full"></div>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/30 via-primary/50 to-primary/30"></div>
            <div className="md:hidden absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/30 via-primary/50 to-primary/30"></div>

            <div className="space-y-8">
              {decisionsData.map((decision, idx) => {
                const iconMap: Record<string, LucideIcon> = {
                  "Event Sourcing": GitBranch,
                  "Outbox Pattern": RefreshCw,
                  "Saga (Coreografía)": Workflow,
                  "Hexagonal Architecture": Layers,
                  "PostgreSQL por Servicio": Database,
                };
                const Icon = iconMap[decision.decision] || Server;
                
                return (
                  <DecisionAccordion
                    key={idx}
                    decision={decision}
                    index={idx}
                    icon={Icon}
                    isExpanded={expandedDecisions.includes(idx)}
                    onToggle={() => toggleDecision(idx)}
                  />
                );
              })}
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section id="security" ref={(el) => { sectionRefs.current['security'] = el; }} className="mb-16 md:mb-24">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground opacity-80">{tOrder('sections.security.title')}</h2>
            <div className="w-20 md:w-24 h-1 bg-primary/30 mx-auto mt-3 md:mt-4 rounded-full"></div>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Authentication & Authorization */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="border-0 border-l-4 border-l-red-500/60 bg-background">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Lock className="h-5 w-5 text-red-500" />
                    <h3 className="font-semibold text-foreground">{tOrder('sections.security.authentication')}</h3>
                  </div>
          <Badge variant="destructive" className="mb-2">{tOrder('sections.security.notImplemented')}</Badge>
          <p className="text-sm text-muted-foreground">{tOrder(securityData.authentication.detailKey)}</p>
          <p className="text-xs text-muted-foreground mt-2">{tOrder('sections.security.mitigation')}: {tOrder(securityData.authentication.mitigationKey)}</p>
                </CardContent>
              </Card>

              <Card className="border-0 border-l-4 border-l-red-500/60 bg-background">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Key className="h-5 w-5 text-red-500" />
                    <h3 className="font-semibold text-foreground">{tOrder('sections.security.authorization')}</h3>
                  </div>
          <Badge variant="destructive" className="mb-2">{tOrder('sections.security.notImplemented')}</Badge>
          <p className="text-sm text-muted-foreground">{tOrder(securityData.authorization.detailKey)}</p>
          <p className="text-xs text-muted-foreground mt-2">{tOrder('sections.security.mitigation')}: {tOrder(securityData.authorization.mitigationKey)}</p>
                </CardContent>
              </Card>
            </div>

            {/* Secrets Management */}
            <Card className="border-0 border-l-4 border-l-green-500/60 bg-background mb-8">
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-500" />
                  {tOrder('sections.security.secretsManagement')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {securityData.secrets.map((secret, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{secret.item}</p>
                        <p className="text-xs text-muted-foreground">{secret.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Vulnerabilities */}
            <Card className="border-0 border-l-4 border-l-amber-500/60 bg-background">
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  {tOrder('sections.security.vulnerabilities')}
                </h3>
                <div className="space-y-3">
                  {securityData.vulnerabilities.map((vuln, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-amber-500/5 rounded-lg">
                      <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{vuln.item}</p>
                        <p className="text-xs text-muted-foreground">{tOrder('sections.security.mitigation')}: {vuln.mitigation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Limitations Section */}
        <section id="limitations" ref={(el) => { sectionRefs.current['limitations'] = el; }} className="mb-16">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground opacity-80">{tOrder('sections.limitations.title')}</h2>
            <div className="w-20 md:w-24 h-1 bg-primary/30 mx-auto mt-3 md:mt-4 rounded-full"></div>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="border-0 border-l-4 border-l-muted-foreground/40 bg-background mb-8">
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-4">{tOrder('sections.limitations.notImplementedTitle')}</h3>
                <div className="space-y-3">
          {limitationsData.notImplemented.map((item, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <X className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm font-medium text-foreground">{tOrder(item.itemKey)}</p>
                <p className="text-xs text-muted-foreground">{tOrder(item.detailKey)}</p>
              </div>
            </div>
          ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 border-l-4 border-l-amber-500/60 bg-background">
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-4">{tOrder('sections.limitations.restrictionsTitle')}</h3>
                <div className="space-y-3">
          {limitationsData.restrictions.map((item, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <Clock className="h-4 w-4 text-amber-500 flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm font-medium text-foreground">{tOrder(item.itemKey)}</p>
                <p className="text-xs text-muted-foreground">{tOrder(item.detailKey)}</p>
              </div>
            </div>
          ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center py-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            {tOrder('sections.footer.text')}
          </p>
        </footer>
      </main>
    </div>
  );
}
