export const DOCS_LOCALES = ['en', 'es', 'fr'] as const;
export type DocsLocale = (typeof DOCS_LOCALES)[number];
export const DEFAULT_DOCS_LOCALE: DocsLocale = 'en';

export function isDocsLocale(value: string): value is DocsLocale {
  return (DOCS_LOCALES as readonly string[]).includes(value);
}

export const LOCALE_LABELS: Record<DocsLocale, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
};

export const LOCALE_FLAGS: Record<DocsLocale, string> = {
  en: '🇺🇸',
  es: '🇪🇸',
  fr: '🇫🇷',
};

/** Short codes for compact mobile controls */
export const LOCALE_SHORT: Record<DocsLocale, string> = {
  en: 'EN',
  es: 'ES',
  fr: 'FR',
};
