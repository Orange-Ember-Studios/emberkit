export type Locale = string;

export type MessageValue = string;

export type MessageCatalog = Record<string, MessageValue>;

export type MessagesByLocale = Record<Locale, MessageCatalog>;

export interface InterpolationValues {
  [key: string]: string | number;
}

export type PluralForms = Partial<Record<Intl.LDMLPluralRule, string>> & {
  other: string;
};

export interface I18nConfig<TLocales extends readonly Locale[] = readonly Locale[]> {
  locales: TLocales;
  defaultLocale: TLocales[number];
  fallbackLocale?: TLocales[number];
  messages: Record<TLocales[number], MessageCatalog> & MessagesByLocale;
}

export interface I18nInstance<TKeys extends string = string> {
  readonly locales: readonly Locale[];
  readonly defaultLocale: Locale;
  readonly fallbackLocale: Locale;
  locale: Locale;
  t(key: TKeys, values?: InterpolationValues): string;
  tp(key: TKeys, count: number, values?: InterpolationValues & { count?: number }): string;
  setLocale(locale: Locale): void;
  getLocale(): Locale;
  hasKey(key: string, locale?: Locale): boolean;
  formatDate(value: Date | number, options?: Intl.DateTimeFormatOptions): string;
  formatNumber(value: number, options?: Intl.NumberFormatOptions): string;
  formatRelativeTime(
    value: number,
    unit: Intl.RelativeTimeFormatUnit,
    options?: Intl.RelativeTimeFormatOptions,
  ): string;
}

export type LocaleResolutionStrategy = 'path-prefix' | 'header' | 'cookie' | 'query';

export interface ResolveLocaleOptions {
  locales: readonly Locale[];
  defaultLocale: Locale;
  strategy?: LocaleResolutionStrategy | LocaleResolutionStrategy[];
  cookieName?: string;
  queryParam?: string;
  pathPrefix?: boolean;
}
