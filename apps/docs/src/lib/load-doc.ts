import type { RouteComponent } from '@emberkit/core';
import type { DocsLocale } from './locales.js';

export type DocModule = {
  default: RouteComponent;
  metadata?: Record<string, unknown>;
  title?: string;
  description?: string;
};

type DocModuleLoader = () => Promise<DocModule>;

const docModules = import.meta.glob('../content/docs/**/*.mdx') as Record<string, DocModuleLoader>;

/** Populated by `resolveDocModule` so sync render (after loader) can read the same module. */
let resolvedCache: { key: string; resolved: ResolvedDoc } | null = null;

function moduleKey(locale: DocsLocale, slug: string): string {
  return `../content/docs/${locale}/${slug}.mdx`;
}

function cacheKey(locale: DocsLocale, slug: string): string {
  return `${locale}/${slug}`;
}

async function loadModule(key: string): Promise<DocModule | null> {
  const loader = docModules[key];
  if (!loader) return null;
  const mod = await loader();
  return mod as DocModule;
}

export function normalizeDocSlug(slug: string | string[] | undefined): string {
  if (!slug) return 'introduction';
  if (Array.isArray(slug)) return slug.join('/').replace(/\/+$/, '') || 'introduction';
  return slug.replace(/\/+$/, '') || 'introduction';
}

export type ResolvedDoc = {
  module: DocModule;
  resolvedLocale: DocsLocale;
  isFallback: boolean;
};

export async function resolveDocModule(
  locale: DocsLocale,
  slug: string,
): Promise<ResolvedDoc | null> {
  const key = cacheKey(locale, slug);
  const localized = await loadModule(moduleKey(locale, slug));
  if (localized) {
    const resolved: ResolvedDoc = { module: localized, resolvedLocale: locale, isFallback: false };
    resolvedCache = { key, resolved };
    return resolved;
  }

  if (locale !== 'en') {
    const fallback = await loadModule(moduleKey('en', slug));
    if (fallback) {
      const resolved: ResolvedDoc = { module: fallback, resolvedLocale: 'en', isFallback: true };
      resolvedCache = { key, resolved };
      return resolved;
    }
  }

  resolvedCache = null;
  return null;
}

/** Sync access after `resolveDocModule` ran in the route loader (SSR + client navigation). */
export function getResolvedDocModule(locale: DocsLocale, slug: string): ResolvedDoc | null {
  const key = cacheKey(locale, slug);
  if (!resolvedCache || resolvedCache.key !== key) {
    return null;
  }
  return resolvedCache.resolved;
}

export function listDocSlugs(): string[] {
  const slugs = new Set<string>();
  for (const path of Object.keys(docModules)) {
    const match = path.match(/\/content\/docs\/[^/]+\/(.+)\.mdx$/);
    if (match?.[1]) slugs.add(match[1]);
  }
  return [...slugs].sort();
}
