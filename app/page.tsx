"use client";

import { useState, useRef, useEffect } from "react";
import { cvData } from "@/lib/cv-data";
import { projectsData } from "@/lib/projects-data";
import { Project } from "@/types/cv";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import {
  Download, Github, Linkedin, Mail, MapPin, FileText,
  Home, Briefcase, ChevronDown,
  Menu, X, Server, Cloud, Database, FileCode2,
  LayoutGrid
} from "lucide-react";

export default function Portfolio() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [isCvMenuOpen, setIsCvMenuOpen] = useState(false);
  const [isProjectExpanded, setIsProjectExpanded] = useState(true);

  const homeRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);

  // Scroll spy to detect active section
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

    const sections = [
      { ref: homeRef, id: 'home' },
      { ref: projectsRef, id: 'projects' }
    ];

    sections.forEach(({ ref, id }) => {
      if (ref.current) {
        ref.current.id = id;
        observer.observe(ref.current);
      }
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>, sectionId: string) => {
    setActiveSection(sectionId);
    ref.current?.scrollIntoView({ behavior: 'smooth' });
    setIsSidebarOpen(false);
  };

  const handleViewCV = () => {
    window.open('https://assets.alejotamayo.com/cv/Alejandro_Vergara_Tamayo_CV.docx.pdf', '_blank');
  };

  const handleDownloadCV = () => {
    const link = document.createElement('a');
    link.href = '/Alejandro_Vergara_Tamayo_CV.pdf';
    link.download = 'Alejandro_Vergara_Tamayo_CV.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const SidebarNavItem = ({
    icon: Icon,
    label,
    isActive,
    onClick,
    isExpandable = false,
    isExpanded = false
  }: {
    icon: any,
    label: string,
    isActive: boolean,
    onClick: () => void,
    isExpandable?: boolean,
    isExpanded?: boolean
  }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
        isActive
          ? 'bg-primary text-primary-foreground'
          : 'hover:bg-accent/10 text-foreground'
      }`}
    >
      <Icon className={`h-5 w-5 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground'}`} />
      <span className="flex-1 text-left font-medium">{label}</span>
      {isExpandable && (
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
      )}
    </button>
  );

  const ProjectCard = ({ project, onClick }: { project: Project, onClick: () => void }) => {
    const getProjectIcon = (id: string) => {
      switch (id) {
        case "zapenu": return Server;
        default: return LayoutGrid;
      }
    };
    const Icon = getProjectIcon(project.id);
    const isInternalLink = project.link?.startsWith('/');

    const cardContent = (
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{project.title}</h3>
            <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{project.description}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {project.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs bg-secondary/30">{tag}</Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    );

    if (isInternalLink && project.link) {
      return (
        <Link href={project.link} className="block">
          <Card className="group cursor-pointer bg-card/50 border-border/30 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            {cardContent}
          </Card>
        </Link>
      );
    }

    return (
      <Card
        className="group cursor-pointer bg-card/50 border-border/30 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
        onClick={onClick}
      >
        {cardContent}
      </Card>
    );
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className={`lg:hidden fixed top-0 left-0 right-0 z-50 px-4 py-3 flex items-center justify-between transition-all duration-300 ${isSidebarOpen ? 'bg-transparent' : 'bg-background/95 backdrop-blur-sm border-b border-border'}`}>
        <span className={`font-bold text-primary transition-opacity duration-300 ${isSidebarOpen ? 'opacity-0' : 'opacity-100'}`}>
          {cvData.name}
        </span>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-lg hover:bg-accent/10 transition-colors"
        >
          {isSidebarOpen ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <Menu className="h-6 w-6 text-foreground" />
          )}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-start">
        {/* Sidebar */}
        <aside
          className={`fixed lg:fixed inset-y-0 left-0 z-40 w-full lg:w-80 xl:w-96 bg-primary/5 border-r border-border transform transition-transform duration-300 ease-in-out lg:transform-none lg:h-screen lg:overflow-y-auto ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
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

          <div className="p-6 space-y-2 pt-16 lg:pt-6 relative z-10">
            {/* Navigation */}
            <div className="space-y-1">
              <SidebarNavItem
                icon={Home}
                label="Home"
                isActive={activeSection === 'home'}
                onClick={() => scrollToSection(homeRef, 'home')}
              />
              <SidebarNavItem
                icon={Briefcase}
                label="Proyectos"
                isActive={activeSection === 'projects'}
                onClick={() => scrollToSection(projectsRef, 'projects')}
              />
              <SidebarNavItem
                icon={Mail}
                label="Contacto"
                isActive={false}
                isExpanded={true}
                onClick={() => {}}
              />
              <div className="ml-4 pl-4 border-l-2 border-border space-y-1 py-2">
                <a
                  href="https://github.com/Alejotamayo28"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center gap-2 text-left px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/5 rounded-md transition-colors"
                >
                  <Github className="h-4 w-4" />
                  GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/alejandro-vergara-tamayo-/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center gap-2 text-left px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/5 rounded-md transition-colors"
                >
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </a>
                <a
                  href={`mailto:${cvData.contact.email}`}
                  className="w-full flex items-center gap-2 text-left px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/5 rounded-md transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  Email
                </a>
              </div>
            </div>
          </div>
        </aside>

        {/* Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 lg:pt-0 lg:ml-80 xl:ml-96">
          {/* Home Section */}
          <section ref={homeRef} id="home" className="min-h-screen flex flex-col items-center justify-center px-6 py-20 relative overflow-hidden">
            <div className="absolute top-20 right-20 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

            <div className="relative z-10 max-w-5xl w-full">
              <div className="flex flex-col-reverse lg:flex-row items-center justify-center gap-8 lg:gap-16">
                {/* Text Content - Left */}
                <div className="text-center lg:text-left space-y-6 flex-1">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-4 text-balance">
                    {cvData.name}
                  </h1>
                  <p className="text-xl md:text-2xl text-foreground/80 leading-relaxed">
                    Desarrollador Backend
                  </p>
                  <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                    Especializado en microservicios, APIs REST/gRPC/RabbitMQ, y arquitecturas cloud escalables con Node.js y AWS
                  </p>
                  <div className="flex flex-wrap gap-4 justify-center lg:justify-start items-center pt-4">
                    <div className="relative">
                      <Button
                        size="lg"
                        className="flex items-center gap-2"
                        onClick={() => setIsCvMenuOpen(!isCvMenuOpen)}
                      >
                        Curriculum
                        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isCvMenuOpen ? 'rotate-180' : ''}`} />
                      </Button>
                      {isCvMenuOpen && (
                        <div className="absolute top-full left-0 mt-2 w-48 ml-4 pl-4 border-l-2 border-border space-y-1 py-2 animate-in fade-in-0 zoom-in-95 duration-200 z-50">
                          <button
                            onClick={handleViewCV}
                            className="w-full flex items-center gap-2 text-left px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/5 transition-colors"
                          >
                            <FileText className="h-4 w-4" />
                            Visualizar
                          </button>
                          <button
                            onClick={handleDownloadCV}
                            className="w-full flex items-center gap-2 text-left px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/5 transition-colors"
                          >
                            <Download className="h-4 w-4" />
                            Descargar
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{cvData.contact.location}</span>
                    </div>
                  </div>
                </div>

                {/* Profile Photo - Right */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-full overflow-hidden border-4 border-primary/20 shadow-2xl">
                      <Image
                        src="/traje-alejandro.png"
                        alt={cvData.name}
                        fill
                        className="object-cover rounded-full"
                        priority
                      />
                    </div>
                    {/* Decorative ring */}
                    <div className="absolute -inset-2 rounded-full border-2 border-primary/10" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Projects Section - Featured Layout */}
          <section ref={projectsRef} id="projects" className="min-h-screen px-6 py-20">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Proyecto Destacado</h2>
              </div>

              {/* Featured Project Card */}
              <Card className="border-0 border-l-4 border-l-primary/60 overflow-hidden bg-background hover:shadow-xl transition-all duration-300">
                <CardContent className="p-0">
                  {/* Header - Clickable */}
                  <button
                    onClick={() => setIsProjectExpanded(!isProjectExpanded)}
                    className="w-full p-6 md:p-8 flex flex-col lg:flex-row gap-6 lg:gap-8 text-left hover:bg-accent/5 transition-colors"
                  >
                    {/* Left: Project Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Server className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-2xl md:text-3xl font-bold text-foreground">Zapenu - Startup</h3>
                          <p className="text-sm text-muted-foreground">Digital Ordering Platform</p>
                        </div>
                      </div>

                      <p className="text-foreground/80 text-base mb-4 leading-relaxed">
                        Plataforma multi-tenant de pedidos digitales con pagos integrados, notificaciones en tiempo real y arquitectura optimizada en costos. Diseñada para manejar miles de items por tienda con microservicios.
                      </p>

                      {/* Tech Stack Badges */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                          <FileCode2 className="h-3 w-3 mr-1" />
                          TypeScript
                        </Badge>
                        <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                          <Server className="h-3 w-3 mr-1" />
                          Node.js
                        </Badge>
                        <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                          <Database className="h-3 w-3 mr-1" />
                          PostgreSQL
                        </Badge>
                        <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                          <Cloud className="h-3 w-3 mr-1" />
                          gRPC
                        </Badge>
                        <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                          <Cloud className="h-3 w-3 mr-1" />
                          Docker
                        </Badge>
                      </div>

                      {/* Expand Indicator */}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{isProjectExpanded ? 'Ocultar detalles' : 'Ver detalles del proyecto'}</span>
                        <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isProjectExpanded ? 'rotate-180' : ''}`} />
                      </div>
                    </div>

                    {/* Right: Architecture Preview */}
                    <div className="lg:w-[400px] xl:w-[500px] flex-shrink-0">
                      <div className="relative rounded-lg overflow-hidden border border-border/50 bg-white shadow-sm">
                        <Image
                          src="/zapenu-infrastructure-diagram.png"
                          alt="Zapenu Architecture"
                          width={500}
                          height={350}
                          className="w-full h-auto"
                          priority
                        />
                      </div>
                      <p className="text-xs text-muted-foreground text-center mt-2">
                        Arquitectura de 5 capas: Client → Edge → Backend → Data → External
                      </p>
                    </div>
                  </button>

                  {/* Expandable Content */}
                  <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isProjectExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-6 md:px-8 pb-6 md:pb-8">
                      {/* Divider with margins */}
                      <div className="mx-4 md:mx-6 border-t border-border/50 mb-6" />
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Challenge */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                              <span className="text-red-600 font-bold text-sm">!</span>
                            </div>
                            <h4 className="font-semibold text-foreground">Challenge</h4>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            Diseñar una arquitectura escalable para manejar miles de productos por tienda con tiempos de respuesta rápidos y comunicación eficiente entre servicios.
                          </p>
                        </div>

                        {/* Solution */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                              <span className="text-blue-600 font-bold text-sm">💡</span>
                            </div>
                            <h4 className="font-semibold text-foreground">Solution</h4>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            Implementé microservicios con comunicación gRPC, modelo relacional optimizado en PostgreSQL, y sistema de archivos en Cloudflare R2. TSOA/Swagger para documentación automática.
                          </p>
                        </div>

                        {/* Results */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                              <span className="text-green-600 font-bold text-sm">✓</span>
                            </div>
                            <h4 className="font-semibold text-foreground">Results</h4>
                          </div>
                          <ul className="text-sm text-muted-foreground space-y-2">
                            <li className="flex items-start gap-2">
                              <span className="text-green-500 mt-0.5">•</span>
                              <span>-40% latencia entre microservicios</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-green-500 mt-0.5">•</span>
                              <span>+10k items por tienda</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-green-500 mt-0.5">•</span>
                              <span>-25% tiempos de DB</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-green-500 mt-0.5">•</span>
                              <span>Integración con MercadoPago</span>
                            </li>
                          </ul>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <div className="mt-8 flex justify-center px-4 sm:px-0">
                        <Link href="/zapenu" className="w-full sm:w-auto">
                          <Button size="lg" className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 rounded-lg">
                            <FileText className="h-4 w-4" />
                            Ver Documentación Completa
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
