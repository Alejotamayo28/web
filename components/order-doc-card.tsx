"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Project } from "@/types/cv";
import Link from "next/link";
import { Server, Database, Cloud, Layers, ArrowRight } from "lucide-react";

interface OrderDocCardProps {
  project: Project;
}

export function OrderDocCard({ project }: OrderDocCardProps) {
  return (
    <Link href={project.link || "#"} className="block">
      <Card className="border-0 border-l-4 border-l-primary/60 overflow-hidden bg-background hover:shadow-xl transition-all duration-300">
        <CardContent className="p-0">
          <div className="w-full p-6 md:p-8 flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Left: Project Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Server className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground">{project.title}</h3>
                  <p className="text-sm text-muted-foreground">Event-Driven Architecture</p>
                </div>
              </div>

              <p className="text-foreground/80 text-base mb-4 leading-relaxed hidden md:block">
                {project.description}
              </p>

              {/* Tech Stack Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                  <Layers className="h-3 w-3 mr-1" />
                  Event Sourcing
                </Badge>
                <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                  <Cloud className="h-3 w-3 mr-1" />
                  Saga Pattern
                </Badge>
                <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                  <Database className="h-3 w-3 mr-1" />
                  Microservices
                </Badge>
              </div>

              {/* CTA */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground group-hover:text-primary transition-colors">
                <span>Ver documentación del proyecto</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>

            {/* Right: Architecture Preview */}
            <div className="lg:w-[400px] xl:w-[500px] flex-shrink-0">
              <div className="relative rounded-lg overflow-hidden border border-border/50 bg-muted/30 shadow-sm aspect-video flex items-center justify-center">
                <div className="text-center p-8">
                  <Server className="h-20 w-20 text-muted-foreground/20 mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground/50 font-medium">Diagrama de Arquitectura</p>
                  <p className="text-xs text-muted-foreground/30 mt-2">Client → Order → RabbitMQ → Services</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-center mt-2">
                Arquitectura de microservicios con Event Sourcing y Saga Pattern
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
