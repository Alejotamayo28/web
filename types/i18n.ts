export type Language = 'es' | 'en';

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
}

export type TranslationKeys = {
  nav: {
    home: string;
    projects: string;
    professionalProjects: string;
    personalProjects: string;
    contact: string;
  };
  home: {
    title: string;
    subtitle: string;
    location: string;
    viewCV: string;
    downloadCV: string;
    curriculum: string;
  };
  project: {
    challenge: string;
    solution: string;
    results: string;
    viewDetails: string;
    hideDetails: string;
    viewDocumentation: string;
  };
  common: {
    seeMore: string;
    seeLess: string;
    loading: string;
  };
};
