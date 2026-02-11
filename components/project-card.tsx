"use client";

import { Project } from "@/types/cv";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (
    <Card 
      className="cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 group overflow-hidden"
      onClick={onClick}
    >
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        <Image
          src={project.image || "/placeholder.svg"}
          alt={project.title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
      </div>
      <CardHeader>
        <CardTitle className="text-lg text-balance">{project.title}</CardTitle>
        <CardDescription className="line-clamp-2 leading-relaxed">
          {project.description}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
