export const i18nTemplate = `import {
  createI18nFromGlob,
  createI18nContext,
  resolveLocaleFromRequest,
} from '@emberkit/core';

const modules = import.meta.glob('./locales/*.json', { eager: true });

export const i18n = createI18nFromGlob(modules, {
  locales: ['en', 'es'] as const,
  defaultLocale: 'en',
  fallbackLocale: 'en',
});

export const { Provider: I18nProvider, useI18n } = createI18nContext();

export function resolveRequestLocale(request: Request): string {
  return resolveLocaleFromRequest(request, {
    locales: i18n.locales,
    defaultLocale: i18n.defaultLocale,
    strategy: ['path-prefix', 'header', 'cookie'],
  });
}
`;

export const i18nLocaleEnTemplate = `{
  "app.title": "{{name}}",
  "nav.home": "Home"
}
`;

export const i18nLocaleEsTemplate = `{
  "app.title": "{{name}}",
  "nav.home": "Inicio"
}
`;
