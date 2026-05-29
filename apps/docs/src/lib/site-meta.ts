import type { HeadProps, MetaData } from '@emberkit/core';
import { extractLocaleFromPath, localizePath } from '@emberkit/core';
import en from '../locales/en.json';
import es from '../locales/es.json';
import fr from '../locales/fr.json';
import {
  DEFAULT_DOCS_LOCALE,
  DOCS_LOCALES,
  isDocsLocale,
  type DocsLocale,
} from './locales.js';

export const SITE_URL = 'https://emberkit.orangeember.com';
export const SITE_NAME = 'EmberKit';
export const DOCS_TITLE_SUFFIX = 'EmberKit Docs';
export const DEFAULT_DESCRIPTION = en.meta.siteDescription;
export const OG_IMAGE_URL = `${SITE_URL}/og-image.svg`;

const LOCALE_PAGES: Record<DocsLocale, Record<string, { title: string; description: string }>> = {
  en: en.pages,
  es: es.pages,
  fr: fr.pages,
};

const LOCALE_SITE_DESCRIPTION: Record<DocsLocale, string> = {
  en: en.meta.siteDescription,
  es: es.meta.siteDescription,
  fr: fr.meta.siteDescription,
};

const OG_LOCALE: Record<DocsLocale, string> = {
  en: 'en_US',
  es: 'es_ES',
  fr: 'fr_FR',
};

export function normalizeDocsPath(pathname: string): string {
  const stripped = pathname.replace(/\/+$/, '') || '/';
  const { pathnameWithoutLocale } = extractLocaleFromPath(stripped, DOCS_LOCALES);
  return pathnameWithoutLocale || '/';
}

export function localeFromDocsPath(pathname: string): DocsLocale {
  const { locale } = extractLocaleFromPath(pathname.replace(/\/+$/, '') || '/', DOCS_LOCALES);
  return locale && isDocsLocale(locale) ? locale : DEFAULT_DOCS_LOCALE;
}

function pageCopyForPath(pathname: string, locale: DocsLocale): { title: string; description: string } | undefined {
  const path = normalizeDocsPath(pathname);
  return LOCALE_PAGES[locale]?.[path];
}

export function formatDocsTitle(title?: string): string {
  if (!title) {
    return DOCS_TITLE_SUFFIX;
  }
  if (title.includes(DOCS_TITLE_SUFFIX)) {
    return title;
  }
  return `${title} | ${DOCS_TITLE_SUFFIX}`;
}

export function docsPageUrl(pathname: string): string {
  const path = pathname.replace(/\/+$/, '') || '/';
  return path === '/' ? SITE_URL : `${SITE_URL}${path}`;
}

const HREFLANG: Record<DocsLocale, string> = {
  en: 'en',
  es: 'es',
  fr: 'fr',
};

/** Alternate URLs for the same page in each docs locale (hreflang). */
export function docsAlternateLinks(pathname: string): Array<{ hreflang: string; href: string }> {
  const stripped = pathname.replace(/\/+$/, '') || '/';
  const { pathnameWithoutLocale } = extractLocaleFromPath(stripped, DOCS_LOCALES);
  const pathWithoutLocale = pathnameWithoutLocale || '/';

  const links = DOCS_LOCALES.map((locale) => ({
    hreflang: HREFLANG[locale],
    href: docsPageUrl(localizePath(pathWithoutLocale, locale, DOCS_LOCALES)),
  }));

  links.push({
    hreflang: 'x-default',
    href: docsPageUrl(localizePath(pathWithoutLocale, DEFAULT_DOCS_LOCALE, DOCS_LOCALES)),
  });

  return links;
}

export function enrichDocsMetadata(
  pathname: string,
  frontmatter: Record<string, unknown> = {},
  locale?: DocsLocale,
): MetaData {
  const resolvedLocale = locale ?? localeFromDocsPath(pathname);
  const path = normalizeDocsPath(pathname);
  const page = pageCopyForPath(pathname, resolvedLocale);
  const title = typeof frontmatter.title === 'string' ? frontmatter.title : page?.title;
  const description =
    typeof frontmatter.description === 'string'
      ? frontmatter.description
      : (page?.description ?? LOCALE_SITE_DESCRIPTION[resolvedLocale]);
  const pageUrl = docsPageUrl(pathname.startsWith('/') ? pathname : `/${pathname}`);
  const fullTitle = formatDocsTitle(title);

  return {
    title,
    description,
    keywords: Array.isArray(frontmatter.keywords)
      ? frontmatter.keywords.filter((k): k is string => typeof k === 'string')
      : ['emberkit', 'jsx', 'typescript', 'ssr', 'framework'],
    robots: path.includes('404') ? 'noindex, follow' : 'index, follow',
    canonical: pageUrl,
    openGraph: {
      type: 'website',
      locale: OG_LOCALE[resolvedLocale],
      siteName: SITE_NAME,
      url: pageUrl,
      title: fullTitle,
      description,
      images: [
        {
          url: OG_IMAGE_URL,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      image: OG_IMAGE_URL,
      imageAlt: fullTitle,
    },
  };
}

export function getDocsHeadProps(pathname: string, metadata?: MetaData): HeadProps {
  const meta = metadata ?? enrichDocsMetadata(pathname);
  const pageUrl = meta.canonical ?? docsPageUrl(pathname);
  const title = formatDocsTitle(meta.title);
  const description = meta.description ?? DEFAULT_DESCRIPTION;
  const ogImage = meta.openGraph?.images?.[0]?.url ?? OG_IMAGE_URL;

  return {
    title,
    description,
    canonical: pageUrl,
    robots: meta.robots,
    keywords: meta.keywords,
    og: {
      type: meta.openGraph?.type ?? 'website',
      title: meta.openGraph?.title ?? title,
      description: meta.openGraph?.description ?? description,
      url: meta.openGraph?.url ?? pageUrl,
      image: ogImage,
      locale: meta.openGraph?.locale ?? 'en_US',
      siteName: meta.openGraph?.siteName ?? SITE_NAME,
    },
    twitter: {
      card: meta.twitter?.card ?? 'summary_large_image',
      title: meta.twitter?.title ?? title,
      description: meta.twitter?.description ?? description,
      image: meta.twitter?.image ?? ogImage,
    },
  };
}
