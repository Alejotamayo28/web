"use client";

import { useState, useRef, useEffect } from "react";
import { cvData } from "@/lib/cv-data";
import { projectsData } from "@/lib/projects-data";
import { Project } from "@/types/cv";
import { ProjectModal } from "@/components/project-modal";
import { SidebarProjectItem } from "@/components/sidebar-project-item";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import {
  Download, Github, Linkedin, Mail, MapPin,
  Home, Briefcase, Code2, GraduationCap, ChevronDown,
  Menu, X, Server, Cloud, Database, FileCode2,
  LayoutGrid
} from "lucide-react";

export default function Portfolio() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const homeRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const educationRef = useRef<HTMLDivElement>(null);

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
      { ref: projectsRef, id: 'projects' },
      { ref: skillsRef, id: 'skills' },
      { ref: educationRef, id: 'education' }
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

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleDownloadCV = () => {
    alert("Función de descarga de CV - Conectar con archivo PDF real");
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

  const SkillCategoryCard = ({ 
    icon: Icon, 
    title, 
    skills,
    color
  }: { 
    icon: any, 
    title: string, 
    skills: string[],
    color: string
  }) => (
    <Card className="group bg-card/50 border-border/30 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-lg ${color}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{title}</h3>
            <div className="flex flex-wrap gap-2 mt-3">
              {skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs bg-secondary/30">{skill}</Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
  </Card>
);

const ConfigProjectCard = ({ project, onClick }: { project: Project, onClick: () => void }) => {
  const Icon = LayoutGrid;
  
  return (
    <Card
      className="group cursor-pointer bg-card/50 border-border/30 hover:border-primary/30 transition-all duration-300 hover:shadow-md"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold group-hover:text-primary transition-colors">{project.title}</h3>
            <div className="flex flex-wrap gap-1 mt-1">
              {project.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs bg-secondary/30">{tag}</Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const EducationCard = ({ degree, period, institution }: { degree: string, period: string, institution: string }) => (
    <Card className="bg-card/50 border-border/30 hover:border-primary/30 transition-all duration-300 hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-primary/10">
            <GraduationCap className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{degree}</h3>
            <p className="text-muted-foreground">{institution}</p>
            <p className="text-sm text-primary font-medium mt-1">{period}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const ProjectCard = ({ project, onClick }: { project: Project, onClick: () => void }) => {
    const getProjectIcon = (id: string) => {
      switch (id) {
        case "zapenu": return Server;
        case "deploy-bot": return Cloud;
        case "fittracker": return Code2;
        default: return LayoutGrid;
      }
    };
    const Icon = getProjectIcon(project.id);
    
  return (
    <Card
      className="group cursor-pointer bg-card/50 border-border/30 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
      onClick={onClick}
    >
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
                icon={Code2}
                label="Habilidades"
                isActive={activeSection === 'skills'}
                onClick={() => scrollToSection(skillsRef, 'skills')}
              />
              <SidebarNavItem
                icon={GraduationCap}
                label="Formación"
                isActive={activeSection === 'education'}
                onClick={() => scrollToSection(educationRef, 'education')}
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
            <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16">
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
                  <Button onClick={handleDownloadCV} size="lg" className="flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    Descargar CV
                  </Button>
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

          {/* Projects Section */}
          <section ref={projectsRef} id="projects" className="min-h-screen px-6 py-20">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Proyectos</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Una selección de proyectos que demuestran mis habilidades en backend, APIs y arquitecturas cloud.
                </p>
              </div>
              
              {/* Proyectos Generales */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {projectsData.slice(0, 3).map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onClick={() => handleProjectClick(project)}
                  />
                ))}
              </div>

              {/* Proyectos de Configuración */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-primary mb-6">Configuraciones</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projectsData.slice(3).map((project) => (
                    <ConfigProjectCard
                      key={project.id}
                      project={project}
                      onClick={() => handleProjectClick(project)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Skills Section */}
          <section ref={skillsRef} id="skills" className="min-h-screen px-6 py-20">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Habilidades</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Tecnologías y herramientas que utilizo en mi día a día como desarrollador backend.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SkillCategoryCard 
                  icon={FileCode2}
                  title="Lenguajes"
                  skills={cvData.skills.languages.map(s => s.name)}
                  color="bg-blue-500"
                />
                <SkillCategoryCard 
                  icon={Server}
                  title="Backend"
                  skills={cvData.skills.backend.map(s => s.name)}
                  color="bg-green-500"
                />
                <SkillCategoryCard 
                  icon={Cloud}
                  title="Cloud & DevOps"
                  skills={cvData.skills.cloud.map(s => s.name)}
                  color="bg-orange-500"
                />
                <SkillCategoryCard 
                  icon={Database}
                  title="Bases de Datos"
                  skills={cvData.skills.databases.map(s => s.name)}
                  color="bg-indigo-500"
                />
              </div>
            </div>
          </section>

          {/* Education Section */}
          <section ref={educationRef} id="education" className="min-h-screen px-6 py-20">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Formación</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Mi trayectoria académica y certificaciones.
                </p>
              </div>
              <div className="space-y-6">
                {cvData.education.map((edu, index) => (
                  <EducationCard 
                    key={index}
                    degree={edu.degree}
                    period={edu.period}
                    institution={edu.institution}
                  />
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>

      <ProjectModal
        project={selectedProject}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </main>
  );
}
