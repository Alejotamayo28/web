"use client";

import { Project } from "@/types/cv";
import { Code, Server, Cloud, Settings } from "lucide-react";

interface SidebarProjectItemProps {
  project: Project;
  onClick: () => void;
}

const getProjectIcon = (id: string) => {
  switch (id) {
    case "zapenu":
      return Server;
    case "deploy-bot":
      return Cloud;
    case "fittracker":
      return Code;
    case "tmux-config":
    case "nvim-config":
      return Settings;
    default:
      return Code;
  }
};

export function SidebarProjectItem({ project, onClick }: SidebarProjectItemProps) {
  const Icon = getProjectIcon(project.id);

  return (
    <button
      onClick={onClick}
      className="w-full text-left p-3 rounded-lg bg-card hover:bg-accent/10 transition-all group border border-border hover:border-accent relative"
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-accent/20 group-hover:text-accent transition-colors">
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-foreground group-hover:text-accent transition-colors text-balance">
            {project.title}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mt-1">
            {project.description}
          </p>
        </div>
      </div>
    </button>
  );
}
