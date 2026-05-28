import { createI18n, type CreateI18nOptions } from './create-i18n.js';
import {
  localeFromJsonPath,
  parseMessageCatalog,
  parseMessageCatalogJson,
} from './helpers/catalog.js';
import type { I18nConfig, I18nInstance, Locale, MessageCatalog } from './types.js';

export { InvalidMessageCatalogError } from './helpers/catalog.js';

export type JsonLocaleInput = Record<Locale, unknown>;

export interface CreateI18nFromJsonConfig<
  TLocales extends readonly Locale[] = readonly Locale[],
> extends Omit<I18nConfig<TLocales>, 'messages'> {
  messages: Record<TLocales[number], unknown> & Partial<Record<Locale, unknown>>;
}

function normalizeJsonMessages(
  locales: readonly Locale[],
  messages: Record<string, unknown>,
): Record<string, MessageCatalog> {
  const normalized: Record<string, MessageCatalog> = {};

  for (const locale of locales) {
    const raw = messages[locale];
    if (raw === undefined) {
      throw new Error(`Missing JSON messages for locale "${locale}"`);
    }
    normalized[locale] = parseMessageCatalog(raw, locale);
  }

  return normalized;
}

export function createI18nFromJson<
  const TLocales extends readonly Locale[],
>(
  config: CreateI18nFromJsonConfig<TLocales>,
  options?: CreateI18nOptions,
): I18nInstance<string> {
  const messages = normalizeJsonMessages(config.locales, config.messages);
  return createI18n({ ...config, messages }, options);
}

export type LocaleGlobModule = { default?: unknown } | unknown;

export interface CreateI18nFromGlobConfig<
  TLocales extends readonly Locale[] = readonly Locale[],
> extends Omit<I18nConfig<TLocales>, 'messages'> {}

export function createI18nFromGlob<
  const TLocales extends readonly Locale[],
>(
  modules: Record<string, LocaleGlobModule>,
  config: CreateI18nFromGlobConfig<TLocales>,
  options?: CreateI18nOptions,
): I18nInstance<string> {
  const messages: Record<string, MessageCatalog> = {};

  for (const [path, mod] of Object.entries(modules)) {
    const locale = localeFromJsonPath(path);
    const raw =
      mod !== null && typeof mod === 'object' && 'default' in mod
        ? (mod as { default: unknown }).default
        : mod;
    messages[locale] = parseMessageCatalog(raw, path);
  }

  for (const locale of config.locales) {
    if (!messages[locale]) {
      throw new Error(`Missing JSON module for locale "${locale}" in glob imports`);
    }
  }

  return createI18n({ ...config, messages }, options);
}

export async function fetchLocaleMessages(
  urls: Record<Locale, string>,
): Promise<Record<Locale, MessageCatalog>> {
  const entries = await Promise.all(
    Object.entries(urls).map(async ([locale, url]) => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch locale "${locale}" from ${url}: HTTP ${response.status}`);
      }
      const json = (await response.json()) as unknown;
      return [locale, parseMessageCatalog(json, url)] as const;
    }),
  );

  return Object.fromEntries(entries);
}

export async function createI18nFromUrls<
  const TLocales extends readonly Locale[],
>(
  urls: Record<TLocales[number], string>,
  config: CreateI18nFromGlobConfig<TLocales>,
  options?: CreateI18nOptions,
): Promise<I18nInstance<string>> {
  const messages = await fetchLocaleMessages(urls);
  return createI18n({ ...config, messages }, options);
}

export { parseMessageCatalog, parseMessageCatalogJson, localeFromJsonPath };
