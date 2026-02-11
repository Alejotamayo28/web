"use client";

import { useState } from "react";
import { cvData } from "@/lib/cv-data";
import { projectsData } from "@/lib/projects-data";
import { Project } from "@/types/cv";
import { ProjectModal } from "@/components/project-modal";
import { SidebarProjectItem } from "@/components/sidebar-project-item";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Github, Linkedin, Mail, MapPin, Briefcase, Calendar, Menu, X } from "lucide-react";

export default function Portfolio() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
    setIsSidebarOpen(false);
  };

  const handleDownloadCV = () => {
    alert("Función de descarga de CV - Conectar con archivo PDF real");
  };

  const SocialLinks = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className={`flex ${isMobile ? 'flex-row gap-6 justify-center items-center' : 'flex-col gap-2'}`}>
      <a
        href="https://github.com/Alejotamayo28"
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center justify-center rounded-full hover:bg-accent/10 transition-colors group ${isMobile ? 'p-3' : 'px-3 py-2'}`}
      >
        <Github className={`text-muted-foreground group-hover:text-accent transition-colors ${isMobile ? 'h-5 w-5' : 'h-5 w-5'}`} />
        {!isMobile && <span className="text-sm text-foreground group-hover:text-accent transition-colors">GitHub</span>}
      </a>
      <a
        href="https://www.linkedin.com/in/alejandro-vergara-tamayo-/"
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center justify-center rounded-full hover:bg-accent/10 transition-colors group ${isMobile ? 'p-3' : 'px-3 py-2'}`}
      >
        <Linkedin className={`text-muted-foreground group-hover:text-accent transition-colors ${isMobile ? 'h-5 w-5' : 'h-5 w-5'}`} />
        {!isMobile && <span className="text-sm text-foreground group-hover:text-accent transition-colors">LinkedIn</span>}
      </a>
      <a
        href={`mailto:${cvData.contact.email}`}
        className={`flex items-center justify-center rounded-full hover:bg-accent/10 transition-colors group ${isMobile ? 'p-3' : 'px-3 py-2'}`}
      >
        <Mail className={`text-muted-foreground group-hover:text-accent transition-colors ${isMobile ? 'h-5 w-5' : 'h-5 w-5'}`} />
        {!isMobile && <span className="text-sm text-foreground group-hover:text-accent transition-colors">Email</span>}
      </a>
    </div>
  );

  return (
    <main className="min-h-screen bg-background pb-16 lg:pb-0">
      {/* Mobile Header with Menu Button */}
      <div className={`lg:hidden fixed top-0 left-0 right-0 z-50 px-4 py-3 flex items-center justify-end transition-all duration-300 ${isSidebarOpen ? 'bg-transparent' : 'bg-background/95 backdrop-blur-sm border-b border-border'}`}>
        <span className={`font-bold text-primary transition-opacity duration-300 absolute left-4 ${isSidebarOpen ? 'opacity-0' : 'opacity-100'}`}>
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

      {/* Mobile Bottom Bar */}
      <div className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-t border-border px-4 py-2 transition-transform duration-300 ${isSidebarOpen ? 'translate-y-full' : 'translate-y-0'}`}>
        <SocialLinks isMobile />
      </div>

      <div className="flex flex-col lg:flex-row">
      {/* Left Sidebar - Mobile: Slide from left, Desktop: Fixed */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-full lg:w-80 xl:w-96 bg-primary/5 border-r border-border transform transition-transform duration-300 ease-in-out lg:transform-none lg:min-h-screen lg:sticky lg:top-0 lg:overflow-y-auto ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6 space-y-8 pt-16 lg:pt-6">
          {/* Projects Section */}
          <div>
            <h3 className="text-lg font-bold lg:text-primary text-white mb-4">Proyectos</h3>
            <div className="space-y-3">
              {projectsData.slice(0, 3).map((project) => (
                <SidebarProjectItem
                  key={project.id}
                  project={project}
                  onClick={() => handleProjectClick(project)}
                />
              ))}
            </div>

            {/* Config Projects */}
            <div className="pt-4 border-t border-border mt-4">
              <div className="space-y-3">
                {projectsData.slice(3).map((project) => (
                  <SidebarProjectItem
                    key={project.id}
                    project={project}
                    onClick={() => handleProjectClick(project)}
                  />
                ))}
              </div>
            </div>

            {/* Social Links - Desktop only */}
            <div className="pt-4 border-t border-border mt-4 hidden lg:block">
              <div className="flex justify-center gap-6">
                <a
                  href="https://github.com/Alejotamayo28"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center p-2 rounded-lg hover:bg-accent/10 transition-colors group"
                >
                  <Github className="h-5 w-5 text-muted-foreground group-hover:text-accent transition-colors" />
                </a>
                <a
                  href="https://www.linkedin.com/in/alejandro-vergara-tamayo-/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center p-2 rounded-lg hover:bg-accent/10 transition-colors group"
                >
                  <Linkedin className="h-5 w-5 text-muted-foreground group-hover:text-accent transition-colors" />
                </a>
                <a
                  href={`mailto:${cvData.contact.email}`}
                  className="flex items-center justify-center p-2 rounded-lg hover:bg-accent/10 transition-colors group"
                >
                  <Mail className="h-5 w-5 text-muted-foreground group-hover:text-accent transition-colors" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </aside>

        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 pt-14 lg:pt-0">
          {/* Hero Section */}
          <section className="min-h-[70vh] flex items-center justify-center px-6 py-20 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-20 right-20 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

            <div className="text-center relative z-10 max-w-3xl space-y-6">
              <h1 className="text-5xl md:text-7xl font-bold text-primary mb-4 text-balance">
                {cvData.name}
              </h1>
              <p className="text-xl md:text-2xl text-foreground/80 leading-relaxed">
                Backend Developer
              </p>
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Especializado en microservicios, APIs REST/gRPC/RabbitMQ, y arquitecturas cloud escalables con Node.js y AWS
              </p>
              <div className="flex flex-wrap gap-4 justify-center items-center pt-4">
                <Button
                  onClick={handleDownloadCV}
                  size="lg"
                  className="flex items-center gap-2"
                >
                  <Download className="h-5 w-5" />
                  Descargar CV
                </Button>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{cvData.contact.location}</span>
                </div>
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
