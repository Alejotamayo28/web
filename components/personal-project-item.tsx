"use client";

import { Project } from "@/types/cv";
import Link from "next/link";
import { Server, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PersonalProjectItemProps {
  project: Project;
}

export function PersonalProjectItem({ project }: PersonalProjectItemProps) {
  return (
    <Link href={project.link || "#"} className="block group">
      <div className="border-l-2 border-primary/40 pl-4 py-2 hover:border-primary transition-colors cursor-pointer">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Server className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {project.title}
              </h4>
            </div>
            <div className="flex gap-1.5 flex-wrap mb-3">
              <span className="text-xs text-muted-foreground/70">Event Sourcing</span>
              <span className="text-xs text-muted-foreground/50">•</span>
              <span className="text-xs text-muted-foreground/70">Saga Pattern</span>
              <span className="text-xs text-muted-foreground/50">•</span>
              <span className="text-xs text-muted-foreground/70">Outbox Pattern</span>
              <span className="text-xs text-muted-foreground/50">•</span>
              <span className="text-xs text-muted-foreground/70">Microservices</span>
            </div>
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {project.description}
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              {project.tags.slice(0, 5).map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-secondary text-secondary-foreground text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
        </div>
      </div>
    </Link>
  );
}
