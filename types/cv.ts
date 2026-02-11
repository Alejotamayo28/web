export interface CvData {
  name: string;
  title: string;
  contact: {
    email: string;
    phone: string;
    location: string;
  };
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: Skills;
}

export interface Experience {
  role: string;
  period: string;
  company: string;
  location: string;
  tags: string[];
  achievements: string[];
  repoLink?: string;
  linkedinLink?: string;
}

export interface Education {
  degree: string;
  period: string;
  institution: string;
}

export interface Skills {
  languages: Skill[];
  backend: Skill[];
  databases: Skill[];
  cloud: Skill[];
  documentation: Skill[];
  tools: Skill[];
  integrations: Skill[];
}

export interface Skill {
  name: string;
  level?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  image: string;
  tags: string[];
  link?: string;
  details: {
    challenge?: string;
    solution?: string;
    results?: string[];
  };
}
