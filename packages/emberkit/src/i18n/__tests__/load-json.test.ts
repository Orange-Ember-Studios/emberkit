import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  parseMessageCatalog,
  parseMessageCatalogJson,
  InvalidMessageCatalogError,
  localeFromJsonPath,
  createI18nFromJson,
  createI18nFromGlob,
  fetchLocaleMessages,
  createI18nFromUrls,
} from '../load-json.js';
import { flattenMessageCatalog } from '../helpers/catalog.js';
import {
  readLocaleCatalog,
  loadLocalesFromDirectory,
  createI18nFromDirectory,
} from '../node.js';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const fixturesDir = join(dirname(fileURLToPath(import.meta.url)), 'fixtures');

describe('parseMessageCatalog', () => {
  it('flattens nested JSON objects into dot keys', () => {
    const catalog = parseMessageCatalog({
      greeting: 'Hello',
      nav: { home: 'Home', about: 'About' },
    });

    expect(catalog).toEqual({
      greeting: 'Hello',
      'nav.home': 'Home',
      'nav.about': 'About',
    });
  });

  it('throws for invalid leaf values', () => {
    expect(() => parseMessageCatalog({ count: 1 })).toThrow(InvalidMessageCatalogError);
  });

  it('parses JSON strings', () => {
    const catalog = parseMessageCatalogJson('{"hello":"world"}');
    expect(catalog.hello).toBe('world');
  });

  it('derives locale from file path', () => {
    expect(localeFromJsonPath('./locales/en-US.json')).toBe('en-US');
  });
});

describe('createI18nFromJson', () => {
  const en = JSON.parse(readFileSync(join(fixturesDir, 'en.json'), 'utf-8'));
  const es = JSON.parse(readFileSync(join(fixturesDir, 'es.json'), 'utf-8'));

  const i18n = createI18nFromJson({
    locales: ['en', 'es'] as const,
    defaultLocale: 'en',
    messages: { en, es },
  });

  it('translates nested JSON keys', () => {
    expect(i18n.t('nav.home')).toBe('Home');
    i18n.setLocale('es');
    expect(i18n.t('nav.home')).toBe('Inicio');
  });

  it('supports interpolation and plurals from JSON', () => {
    i18n.setLocale('en');
    expect(i18n.t('greeting', { name: 'Ada' })).toBe('Hello Ada');
    expect(i18n.tp('items', 2, { count: 2 })).toContain('2');
  });
});

describe('createI18nFromGlob', () => {
  it('loads eager glob modules', () => {
    const en = JSON.parse(readFileSync(join(fixturesDir, 'en.json'), 'utf-8'));
    const es = JSON.parse(readFileSync(join(fixturesDir, 'es.json'), 'utf-8'));

    const i18n = createI18nFromGlob(
      {
        './locales/en.json': { default: en },
        './locales/es.json': { default: es },
      },
      {
        locales: ['en', 'es'] as const,
        defaultLocale: 'en',
      },
    );

    expect(i18n.t('nav.about')).toBe('About');
  });
});

describe('fetchLocaleMessages', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    globalThis.fetch = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      const locale = url.endsWith('/es.json') ? 'es' : 'en';
      const body = readFileSync(join(fixturesDir, `${locale}.json`), 'utf-8');
      return new Response(body, { status: 200, headers: { 'Content-Type': 'application/json' } });
    }) as typeof fetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('fetches and parses locale JSON over the network', async () => {
    const messages = await fetchLocaleMessages({
      en: '/locales/en.json',
      es: '/locales/es.json',
    });

    expect(messages.en['nav.home']).toBe('Home');
    expect(messages.es['nav.home']).toBe('Inicio');
  });

  it('creates i18n from remote URLs', async () => {
    const i18n = await createI18nFromUrls(
      {
        en: '/locales/en.json',
        es: '/locales/es.json',
      },
      {
        locales: ['en', 'es'] as const,
        defaultLocale: 'en',
      },
    );

    expect(i18n.t('farewell')).toBe('Goodbye');
  });
});

describe('node JSON loaders', () => {
  it('reads a locale file from disk', () => {
    const catalog = readLocaleCatalog(join(fixturesDir, 'en.json'));
    expect(catalog['nav.home']).toBe('Home');
  });

  it('loads every JSON file in a directory', () => {
    const messages = loadLocalesFromDirectory(fixturesDir);
    expect(messages.en['greeting']).toBe('Hello {name}');
    expect(messages.es['greeting']).toBe('Hola {name}');
  });

  it('creates i18n from a locales directory', () => {
    const i18n = createI18nFromDirectory(fixturesDir, {
      locales: ['en', 'es'] as const,
      defaultLocale: 'en',
    });

    expect(i18n.t('greeting', { name: 'World' })).toBe('Hello World');
  });
});

describe('flattenMessageCatalog', () => {
  it('exports flatten helper for custom pipelines', () => {
    expect(flattenMessageCatalog({ a: { b: 'value' } })).toEqual({ 'a.b': 'value' });
  });
});
