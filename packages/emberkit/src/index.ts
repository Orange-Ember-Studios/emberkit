export const VERSION = '0.1.0';

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
export { navigate, preload, useNavigate } from './navigation/index.js';
export { createRouter, matchRoute } from './router/index.js';
export { createLoaderData, type LoaderResult, type LoaderFunction } from './loader/index.js';
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

export { Head } from './meta/index.js';
export type { HeadProps } from './meta/index.js';
export {
  generateMeta,
  generateBreadcrumbs,
  generateArticleSchema,
  generateProductSchema,
} from './meta/index.js';
export type { MetaData, OpenGraphData, TwitterCardData } from './meta/index.js';

export type { FC, RouteComponent, RouteChildren } from './runtime/types.js';

export function defineConfig(config: Record<string, unknown>): Record<string, unknown> {
  return config;
}
