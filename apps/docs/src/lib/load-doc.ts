import type { RouteComponent } from '@emberkit/core';
import type { DocsLocale } from './locales.js';

export type DocModule = {
  default: RouteComponent;
  metadata?: Record<string, unknown>;
  title?: string;
  description?: string;
};

const docModules = import.meta.glob('../content/docs/**/*.mdx', {
  eager: true,
}) as Record<string, DocModule>;

function moduleKey(locale: DocsLocale, slug: string): string {
  return `../content/docs/${locale}/${slug}.mdx`;
}

export function normalizeDocSlug(slug: string | string[] | undefined): string {
  if (!slug) return 'introduction';
  if (Array.isArray(slug)) return slug.join('/').replace(/\/+$/, '') || 'introduction';
  return slug.replace(/\/+$/, '') || 'introduction';
}

export function resolveDocModule(
  locale: DocsLocale,
  slug: string,
): { module: DocModule; resolvedLocale: DocsLocale; isFallback: boolean } | null {
  const localized = docModules[moduleKey(locale, slug)];
  if (localized) {
    return { module: localized, resolvedLocale: locale, isFallback: false };
  }

  if (locale !== 'en') {
    const fallback = docModules[moduleKey('en', slug)];
    if (fallback) {
      return { module: fallback, resolvedLocale: 'en', isFallback: true };
    }
  }

  return null;
}

export function listDocSlugs(): string[] {
  const slugs = new Set<string>();
  for (const path of Object.keys(docModules)) {
    const match = path.match(/\/content\/docs\/[^/]+\/(.+)\.mdx$/);
    if (match?.[1]) slugs.add(match[1]);
  }
  return [...slugs].sort();
}
