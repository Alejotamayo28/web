export interface TechItem {
  name: string;
  category: string;
}

export const techStack: TechItem[] = [
  // Languages
  { name: "TypeScript", category: "languages" },
  { name: "JavaScript", category: "languages" },
  { name: "SQL", category: "languages" },
  
  // Frameworks & Runtime
  { name: "Node.js", category: "frameworks" },
  { name: "Express.js", category: "frameworks" },
  { name: "TSOA", category: "frameworks" },
  
  // Databases
  { name: "PostgreSQL", category: "databases" },
  { name: "Supabase", category: "databases" },
  
  // Cloud & DevOps
  { name: "AWS", category: "cloud" },
  { name: "Docker", category: "devops" },
  { name: "Cloudflare", category: "cloud" },
  { name: "EC2", category: "cloud" },
  { name: "S3", category: "cloud" },
  { name: "CloudWatch", category: "cloud" },
  
  // Tools & Other
  { name: "gRPC", category: "tools" },
  { name: "Git", category: "tools" },
  { name: "Swagger", category: "tools" },
  { name: "REST APIs", category: "tools" },
];

export const categories = [
  { key: "languages", label: "Lenguajes" },
  { key: "frameworks", label: "Frameworks" },
  { key: "databases", label: "Bases de Datos" },
  { key: "cloud", label: "Cloud" },
  { key: "devops", label: "DevOps" },
  { key: "tools", label: "Herramientas" },
];
