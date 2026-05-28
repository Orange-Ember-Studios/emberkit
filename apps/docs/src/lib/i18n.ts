import {
  createI18nFromGlob,
  createI18nContext,
  extractLocaleFromPath,
  localizePath,
  resolveLocaleFromRequest,
} from '@emberkit/core';
import {
  DEFAULT_DOCS_LOCALE,
  DOCS_LOCALES,
  isDocsLocale,
  LOCALE_FLAGS,
  LOCALE_LABELS,
  type DocsLocale,
} from './locales.js';

export {
  DEFAULT_DOCS_LOCALE,
  DOCS_LOCALES,
  isDocsLocale,
  LOCALE_FLAGS,
  LOCALE_LABELS,
  type DocsLocale,
};

const modules = import.meta.glob('../locales/*.json', { eager: true });

export const i18n = createI18nFromGlob(modules, {
  locales: DOCS_LOCALES,
  defaultLocale: DEFAULT_DOCS_LOCALE,
  fallbackLocale: DEFAULT_DOCS_LOCALE,
});

export const { Provider: I18nProvider, useI18n } = createI18nContext();

export function resolveDocsLocale(request: Request): DocsLocale {
  const locale = resolveLocaleFromRequest(request, {
    locales: DOCS_LOCALES,
    defaultLocale: DEFAULT_DOCS_LOCALE,
    strategy: ['path-prefix', 'header', 'cookie'],
    cookieName: 'docs_locale',
  });
  return isDocsLocale(locale) ? locale : DEFAULT_DOCS_LOCALE;
}

export function localeFromPathname(pathname: string): DocsLocale {
  const { locale } = extractLocaleFromPath(pathname, DOCS_LOCALES);
  return locale && isDocsLocale(locale) ? locale : DEFAULT_DOCS_LOCALE;
}

export function localizeDocsPath(pathname: string, locale: DocsLocale): string {
  const { pathnameWithoutLocale } = extractLocaleFromPath(pathname, DOCS_LOCALES);
  return localizePath(pathnameWithoutLocale || '/', locale, DOCS_LOCALES);
}

export function docsNavPath(slug: string, locale: DocsLocale): string {
  const normalized = slug.replace(/^\/+/, '').replace(/\/+$/, '');
  return normalized ? `/${locale}/docs/${normalized}` : `/${locale}/docs/introduction`;
}
