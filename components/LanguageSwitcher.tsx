"use client";

import { useLanguage } from "@/app/context/LanguageContext";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <button
        onClick={() => setLanguage('es')}
        className={`text-sm font-medium transition-colors duration-200 ${
          language === 'es' 
            ? 'text-foreground' 
            : 'text-muted-foreground hover:text-foreground/70'
        }`}
        title="Español"
        aria-label="Cambiar a español"
      >
        ES
      </button>
      <span className="text-muted-foreground text-xs">/</span>
      <button
        onClick={() => setLanguage('en')}
        className={`text-sm font-medium transition-colors duration-200 ${
          language === 'en' 
            ? 'text-foreground' 
            : 'text-muted-foreground hover:text-foreground/70'
        }`}
        title="English"
        aria-label="Switch to English"
      >
        ENG
      </button>
    </div>
  );
}
