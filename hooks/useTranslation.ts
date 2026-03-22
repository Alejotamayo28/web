"use client";

import { useLanguage } from "@/app/context/LanguageContext";
import { Language } from "@/types/i18n";
import { getNestedValue } from "@/lib/translations";
import commonEs from "@/locales/es/common.json";
import commonEn from "@/locales/en/common.json";
import cvEs from "@/locales/es/cv.json";
import cvEn from "@/locales/en/cv.json";
import projectsEs from "@/locales/es/projects.json";
import projectsEn from "@/locales/en/projects.json";
import zapenuEs from "@/locales/es/zapenu.json";
import zapenuEn from "@/locales/en/zapenu.json";
import orderEs from "@/locales/es/order.json";
import orderEn from "@/locales/en/order.json";

type TranslationsMap = {
  es: Record<string, unknown>;
  en: Record<string, unknown>;
};

const translationsMap: Record<string, TranslationsMap> = {
  common: { es: commonEs, en: commonEn },
  cv: { es: cvEs, en: cvEn },
  projects: { es: projectsEs, en: projectsEn },
  zapenu: { es: zapenuEs, en: zapenuEn },
  order: { es: orderEs, en: orderEn },
};

interface UseTranslationReturn {
  t: (key: string, fallback?: string) => string;
  language: Language;
}

export function useTranslation(namespace: string = 'common'): UseTranslationReturn {
  const { language } = useLanguage();

  const t = (key: string, fallback?: string): string => {
    const namespaceData = translationsMap[namespace]?.[language];
    if (!namespaceData) {
      return fallback || key;
    }
    const value = getNestedValue(namespaceData as Record<string, unknown>, key);
    return value || fallback || key;
  };

  return { t, language };
}
