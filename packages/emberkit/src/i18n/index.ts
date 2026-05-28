export type {
  Locale,
  MessageCatalog,
  MessagesByLocale,
  MessageValue,
  InterpolationValues,
  PluralForms,
  I18nConfig,
  I18nInstance,
  LocaleResolutionStrategy,
  ResolveLocaleOptions,
} from './types.js';

export {
  createI18n,
  defineMessages,
  mergeMessageCatalogs,
  getCatalogKeys,
  MissingTranslationError,
} from './create-i18n.js';
export type { CreateI18nOptions } from './create-i18n.js';

export { createI18nContext, type I18nContextValue } from './context.js';

export { interpolate, resolveMessage } from './helpers/translate.js';
export { selectPluralForm, parsePluralMessage } from './helpers/plural.js';
export {
  normalizeLocale,
  isSupportedLocale,
  matchLocale,
  parseAcceptLanguage,
  resolveLocaleFromRequest,
} from './helpers/locale.js';
export {
  extractLocaleFromPath,
  stripLocalePrefix,
  addLocalePrefix,
  localizePath,
} from './helpers/path.js';

export {
  parseMessageCatalog,
  parseMessageCatalogJson,
  localeFromJsonPath,
  flattenMessageCatalog,
  InvalidMessageCatalogError,
} from './helpers/catalog.js';

export {
  createI18nFromJson,
  createI18nFromGlob,
  fetchLocaleMessages,
  createI18nFromUrls,
  type JsonLocaleInput,
  type CreateI18nFromJsonConfig,
  type CreateI18nFromGlobConfig,
  type LocaleGlobModule,
} from './load-json.js';
