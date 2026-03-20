import { Language } from '@/types/i18n';

type TranslationData = Record<string, Record<string, unknown>>;

const translationCache: Record<Language, Record<string, unknown>> = {
  es: {},
  en: {},
};

export async function loadTranslations(language: Language): Promise<void> {
  if (Object.keys(translationCache[language]).length > 0) {
    return;
  }

  const files = ['common', 'cv', 'projects', 'zapenu', 'order'];

  for (const file of files) {
    try {
      const translations = await import(`@/locales/${language}/${file}.json`);
      translationCache[language][file] = translations.default;
    } catch (error) {
      console.error(`Failed to load ${language}/${file}.json:`, error);
      translationCache[language][file] = {};
    }
  }
}

export function t(language: Language, namespace: string, key: string, fallback?: string): string {
  const namespaceData = translationCache[language][namespace] as Record<string, unknown>;
  
  if (!namespaceData) {
    return fallback || key;
  }

  const keys = key.split('.');
  let value: unknown = namespaceData;

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      return fallback || key;
    }
  }

  return typeof value === 'string' ? value : (fallback || key);
}

export function getNestedValue(obj: Record<string, unknown>, path: string): string | undefined {
  const keys = path.split('.');
  let value: unknown = obj;

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      return undefined;
    }
  }

  return typeof value === 'string' ? value : undefined;
}
