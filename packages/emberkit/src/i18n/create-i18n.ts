import { parsePluralMessage, selectPluralForm } from './helpers/plural.js';
import { interpolate, resolveMessage } from './helpers/translate.js';
import type { I18nConfig, I18nInstance, InterpolationValues, Locale, MessageCatalog } from './types.js';

export class MissingTranslationError extends Error {
  readonly key: string;
  readonly locale: string;

  constructor(key: string, locale: string) {
    super(`Missing translation for key "${key}" (locale: ${locale})`);
    this.name = 'MissingTranslationError';
    this.key = key;
    this.locale = locale;
  }
}

export interface CreateI18nOptions {
  /** When true, missing keys throw MissingTranslationError. Default: false (returns key). */
  strict?: boolean;
}

function assertLocale(locale: Locale, supported: readonly Locale[]): void {
  if (!supported.includes(locale)) {
    throw new Error(`Unsupported locale "${locale}". Supported: ${supported.join(', ')}`);
  }
}

function catalogKeys(catalog: MessageCatalog): string[] {
  return Object.keys(catalog);
}

export function createI18n<
  const TLocales extends readonly Locale[],
  const TMessages extends Record<TLocales[number], MessageCatalog>,
>(
  config: I18nConfig<TLocales> & { messages: TMessages },
  options: CreateI18nOptions = {},
): I18nInstance<Extract<keyof TMessages[TLocales[number]], string>> {
  const { strict = false } = options;
  const locales = config.locales;
  const defaultLocale = config.defaultLocale;
  const fallbackLocale = config.fallbackLocale ?? defaultLocale;
  const messages = config.messages as Record<string, MessageCatalog>;

  let currentLocale: Locale = defaultLocale;

  function lookup(key: string, locale: Locale): string {
    const resolved = resolveMessage(messages, key, locale, fallbackLocale);
    if (resolved !== undefined) return resolved;
    if (strict) throw new MissingTranslationError(key, locale);
    return key;
  }

  const instance: I18nInstance = {
    locales,
    defaultLocale,
    fallbackLocale,
    get locale() {
      return currentLocale;
    },
    set locale(value: Locale) {
      assertLocale(value, locales);
      currentLocale = value;
    },

    getLocale(): Locale {
      return currentLocale;
    },

    setLocale(locale: Locale): void {
      assertLocale(locale, locales);
      currentLocale = locale;
    },

    hasKey(key: string, locale?: Locale): boolean {
      const target = locale ?? currentLocale;
      return resolveMessage(messages, key, target, fallbackLocale) !== undefined;
    },

    t(key: string, values?: InterpolationValues): string {
      return interpolate(lookup(key, currentLocale), values);
    },

    tp(key: string, count: number, values?: InterpolationValues): string {
      const raw = lookup(key, currentLocale);
      const pluralForms = parsePluralMessage(raw);

      const merged: InterpolationValues = { ...values, count };

      if (pluralForms) {
        const selected = selectPluralForm(currentLocale, count, pluralForms);
        return interpolate(selected, merged);
      }

      return interpolate(raw, merged);
    },

    formatDate(value: Date | number, formatOptions?: Intl.DateTimeFormatOptions): string {
      const date = value instanceof Date ? value : new Date(value);
      return new Intl.DateTimeFormat(currentLocale, formatOptions).format(date);
    },

    formatNumber(value: number, formatOptions?: Intl.NumberFormatOptions): string {
      return new Intl.NumberFormat(currentLocale, formatOptions).format(value);
    },

    formatRelativeTime(
      value: number,
      unit: Intl.RelativeTimeFormatUnit,
      formatOptions?: Intl.RelativeTimeFormatOptions,
    ): string {
      return new Intl.RelativeTimeFormat(currentLocale, formatOptions).format(value, unit);
    },
  };

  return instance as I18nInstance<Extract<keyof TMessages[TLocales[number]], string>>;
}

export function defineMessages<const T extends MessageCatalog>(catalog: T): T {
  return catalog;
}

export function mergeMessageCatalogs(
  ...catalogs: MessageCatalog[]
): MessageCatalog {
  return Object.assign({}, ...catalogs);
}

export function getCatalogKeys(catalog: MessageCatalog): string[] {
  return catalogKeys(catalog);
}
