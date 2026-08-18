import en from '../../translations/en.json';
import te from '../../translations/te.json';
import type { LanguageCode } from '@/src/types/profile';

const dictionaries: Record<LanguageCode, Record<string, string>> = {
  en: en as Record<string, string>,
  te: te as Record<string, string>,
};

export function translate(language: LanguageCode, key: string, vars?: Record<string, string | number>): string {
  const table = dictionaries[language] ?? dictionaries.en;
  let value = table[key] ?? dictionaries.en[key] ?? key;
  if (vars) {
    for (const [name, replacement] of Object.entries(vars)) {
      value = value.replaceAll(`{{${name}}}`, String(replacement));
    }
  }
  return value;
}

export function hasTranslation(language: LanguageCode, key: string): boolean {
  return Boolean(dictionaries[language]?.[key] || dictionaries.en[key]);
}
