"use client";

import { Project } from "@/types/cv";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface ProjectModalProps {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProjectModal({ project, open, onOpenChange }: ProjectModalProps) {
  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-balance">{project.title}</DialogTitle>
          <DialogDescription className="text-base">
            {project.fullDescription}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
            <Image
              src={project.image || "/placeholder.svg"}
              alt={project.title}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-sm">
                {tag}
              </Badge>
            ))}
          </div>

          {project.details.challenge && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Desafío</h3>
              <p className="text-muted-foreground leading-relaxed">
                {project.details.challenge}
              </p>
            </div>
          )}

          {project.details.solution && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Solución</h3>
              <p className="text-muted-foreground leading-relaxed">
                {project.details.solution}
              </p>
            </div>
          )}

          {project.details.results && project.details.results.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Resultados</h3>
              <ul className="space-y-2">
                {project.details.results.map((result, index) => (
                  <li key={index} className="flex gap-2 text-muted-foreground leading-relaxed">
                    <span className="text-accent font-bold">•</span>
                    <span>{result}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {project.link && (
            <div className="flex justify-end">
              <Button asChild variant="default">
                <a 
                  href={project.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  Ver más
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
