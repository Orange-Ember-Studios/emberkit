import packageJson from '../package.json' with { type: 'json' };

export const VERSION = packageJson.version;

export { createElement, render, hydrate } from './runtime/index.js';
export {
  createSignal,
  createMemo,
  createEffect,
  batch,
  untrack,
  signal,
  computed,
  effect,
} from './signals/index.js';
export { createContext, useContext } from './context/index.js';
export {
  createI18n,
  defineMessages,
  mergeMessageCatalogs,
  getCatalogKeys,
  createI18nContext,
  MissingTranslationError,
  resolveLocaleFromRequest,
  normalizeLocale,
  matchLocale,
  extractLocaleFromPath,
  stripLocalePrefix,
  addLocalePrefix,
  localizePath,
  interpolate,
  parseMessageCatalog,
  parseMessageCatalogJson,
  createI18nFromJson,
  createI18nFromGlob,
  fetchLocaleMessages,
  createI18nFromUrls,
  InvalidMessageCatalogError,
} from './i18n/index.js';
export type {
  Locale,
  MessageCatalog,
  I18nConfig,
  I18nInstance,
  I18nContextValue,
  ResolveLocaleOptions,
  LocaleResolutionStrategy,
  InterpolationValues,
  PluralForms,
  CreateI18nOptions,
  CreateI18nFromJsonConfig,
  CreateI18nFromGlobConfig,
  JsonLocaleInput,
  LocaleGlobModule,
} from './i18n/index.js';
export {
  navigate,
  preload,
  useNavigate,
  supportsViewTransitions,
  withViewTransition,
  waitForAppUpdate,
  initViewTransitions,
  navigateWithViewTransition,
} from './navigation/index.js';
export { createRouter, matchRoute } from './router/index.js';
export {
  createLoaderData,
  runLoader,
  type LoaderResult,
  type LoaderFunction,
} from './loader/index.js';
export {
  renderMatchedRouteModule,
  createWrapWithRootLayout,
  parseUrlForLoader,
  buildRoutePropsFromLoader,
  resolvePrerenderPaths,
  injectSSRIntoTemplate,
  buildLoaderStateScript,
  readLoaderStateFromDocument,
  clearLoaderStateScript,
  type PrerenderConfig,
  type LoaderStatePayload,
} from './ssr/index.js';
export { createErrorBoundary, createLoadingBoundary } from './boundaries/index.js';
export type { JSXElement, JSXNode, DOMElement } from './runtime/types.js';
export type { Signal, WritableSignal, ReadonlySignal } from './signals/index.js';
export {
  createMarkdownParser,
  parseMarkdown,
  renderMarkdown,
  extractFrontmatter,
} from './markdown/index.js';
export { compileMDX, compileSync, useMDX } from './mdx/index.js';

export { DataCache, createCache, getCached, setCache, prefetch } from './cache/index.js';
export { LazyInView, hydrateLazyInView, clearLazyRegistry } from './viewport/index.js';

export { renderToHTMLString } from './ssr/helpers/render-html.js';
export { drainHeadContent, clearHeadContent } from './meta/head-registry.js';
export { Head } from './meta/index.js';
export type { HeadProps } from './meta/index.js';
export {
  generateMeta,
  buildRouteHeadFromMetadata,
  generateBreadcrumbs,
  generateArticleSchema,
  generateProductSchema,
} from './meta/index.js';
export type { MetaData, OpenGraphData, TwitterCardData, SiteHeadOptions } from './meta/index.js';

export type { FC, RouteComponent, RouteChildren, RouteParams } from './runtime/types.js';
export type { LazyInViewProps } from './viewport/index.js';

export type { Logger, LoggerOptions, LogLevel, RequestLog, ResponseLog } from './logger/types.js';

export function defineConfig(config: Record<string, unknown>): Record<string, unknown> {
  return config;
}
