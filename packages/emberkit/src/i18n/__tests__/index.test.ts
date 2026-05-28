import { describe, it, expect, beforeEach } from 'vitest';
import { clearAllContexts } from '../../context/index.js';
import {
  createI18n,
  defineMessages,
  mergeMessageCatalogs,
  MissingTranslationError,
  createI18nContext,
  interpolate,
  resolveMessage,
  selectPluralForm,
  parsePluralMessage,
  normalizeLocale,
  matchLocale,
  parseAcceptLanguage,
  resolveLocaleFromRequest,
  extractLocaleFromPath,
  stripLocalePrefix,
  addLocalePrefix,
  localizePath,
} from '../index.js';

const en = defineMessages({
  greeting: 'Hello {name}',
  items: 'one {count} item | other {count} items',
  farewell: 'Goodbye',
});

const es = defineMessages({
  greeting: 'Hola {name}',
  items: 'one {count} artículo | other {count} artículos',
  farewell: 'Adiós',
});

describe('interpolate', () => {
  it('replaces placeholders', () => {
    expect(interpolate('Hello {name}', { name: 'Ada' })).toBe('Hello Ada');
  });

  it('leaves unknown placeholders intact', () => {
    expect(interpolate('Hello {name}', {})).toBe('Hello {name}');
  });
});

describe('resolveMessage', () => {
  it('falls back to fallback locale', () => {
    const catalogs = { en: { key: 'EN' }, es: {} };
    expect(resolveMessage(catalogs, 'key', 'es', 'en')).toBe('EN');
  });
});

describe('plural', () => {
  it('parses pipe-separated plural messages', () => {
    const forms = parsePluralMessage('one 1 item | other {count} items');
    expect(forms?.one).toBe('1 item');
    expect(forms?.other).toBe('{count} items');
  });

  it('selects plural form by locale rules', () => {
    expect(selectPluralForm('en', 1, { one: '1 item', other: '{count} items' })).toBe('1 item');
    expect(selectPluralForm('en', 5, { one: '1 item', other: '{count} items' })).toBe(
      '{count} items',
    );
  });
});

describe('locale helpers', () => {
  it('normalizes locales', () => {
    expect(normalizeLocale('en_US')).toBe('en-US');
    expect(normalizeLocale('EN')).toBe('en');
  });

  it('matches supported locales', () => {
    expect(matchLocale('en-US', ['en', 'es'] as const)).toBe('en');
    expect(matchLocale('es-MX', ['en', 'es'] as const)).toBe('es');
  });

  it('parses Accept-Language', () => {
    const tags = parseAcceptLanguage('es;q=0.9,en;q=0.8,en-US;q=0.7');
    expect(tags[0]).toBe('es');
  });
});

describe('resolveLocaleFromRequest', () => {
  it('resolves from path prefix', () => {
    const request = new Request('https://example.com/es/about');
    expect(
      resolveLocaleFromRequest(request, {
        locales: ['en', 'es'],
        defaultLocale: 'en',
        strategy: 'path-prefix',
      }),
    ).toBe('es');
  });

  it('resolves from Accept-Language', () => {
    const request = new Request('https://example.com/about', {
      headers: { 'accept-language': 'es-ES,en;q=0.5' },
    });
    expect(
      resolveLocaleFromRequest(request, {
        locales: ['en', 'es'],
        defaultLocale: 'en',
        strategy: 'header',
      }),
    ).toBe('es');
  });

  it('resolves from cookie', () => {
    const request = new Request('https://example.com/', {
      headers: { cookie: 'locale=es' },
    });
    expect(
      resolveLocaleFromRequest(request, {
        locales: ['en', 'es'],
        defaultLocale: 'en',
        strategy: 'cookie',
      }),
    ).toBe('es');
  });

  it('falls back to default locale', () => {
    const request = new Request('https://example.com/');
    expect(
      resolveLocaleFromRequest(request, {
        locales: ['en', 'es'],
        defaultLocale: 'en',
      }),
    ).toBe('en');
  });
});

describe('path helpers', () => {
  it('extracts locale from path', () => {
    expect(extractLocaleFromPath('/es/blog', ['en', 'es'])).toEqual({
      locale: 'es',
      pathnameWithoutLocale: '/blog',
    });
  });

  it('strips and adds locale prefix', () => {
    expect(stripLocalePrefix('/en/docs', ['en', 'es'])).toBe('/docs');
    expect(addLocalePrefix('/docs', 'es')).toBe('/es/docs');
    expect(localizePath('/en/docs', 'es', ['en', 'es'])).toBe('/es/docs');
  });
});

describe('createI18n', () => {
  const i18n = createI18n({
    locales: ['en', 'es'] as const,
    defaultLocale: 'en',
    messages: { en, es },
  });

  beforeEach(() => {
    i18n.setLocale('en');
  });

  it('translates with interpolation', () => {
    expect(i18n.t('greeting', { name: 'World' })).toBe('Hello World');
  });

  it('switches locale', () => {
    i18n.setLocale('es');
    expect(i18n.t('greeting', { name: 'Mundo' })).toBe('Hola Mundo');
  });

  it('translates plurals', () => {
    expect(i18n.tp('items', 1, { count: 1 })).toContain('1');
    expect(i18n.tp('items', 3, { count: 3 })).toContain('3');
  });

  it('formats dates and numbers with Intl', () => {
    const date = new Date('2024-01-15T12:00:00Z');
    expect(i18n.formatDate(date, { month: 'short' })).toBeTruthy();
    expect(i18n.formatNumber(1234.5)).toBeTruthy();
  });

  it('reports hasKey', () => {
    expect(i18n.hasKey('farewell')).toBe(true);
    expect(i18n.hasKey('missing')).toBe(false);
  });

  it('returns key when missing in non-strict mode', () => {
    expect(i18n.t('missing.key')).toBe('missing.key');
  });

  it('throws in strict mode', () => {
    const strict = createI18n(
      { locales: ['en'] as const, defaultLocale: 'en', messages: { en } },
      { strict: true },
    );
    expect(() => strict.t('nope')).toThrow(MissingTranslationError);
  });

  it('rejects unsupported locale', () => {
    expect(() => i18n.setLocale('fr')).toThrow(/Unsupported locale/);
  });
});

describe('mergeMessageCatalogs', () => {
  it('merges catalogs', () => {
    const merged = mergeMessageCatalogs({ a: 'A' }, { b: 'B' });
    expect(merged).toEqual({ a: 'A', b: 'B' });
  });
});

describe('createI18nContext', () => {
  it('provides i18n via useI18n', () => {
    const i18n = createI18n({
      locales: ['en'] as const,
      defaultLocale: 'en',
      messages: { en },
    });
    const { Provider, useI18n, context } = createI18nContext<keyof typeof en>();

    Provider({ i18n, locale: 'en', children: null });
    expect(useI18n().t('farewell')).toBe('Goodbye');
    expect(context).toBeDefined();
  });

  it('throws outside provider', () => {
    clearAllContexts();
    const { useI18n } = createI18nContext();
    expect(() => useI18n()).toThrow();
  });
});
