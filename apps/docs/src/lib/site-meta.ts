import type { HeadProps, MetaData } from '@emberkit/core';

export const SITE_URL = 'https://emberkit.orangeember.com';
export const SITE_NAME = 'EmberKit';
export const DOCS_TITLE_SUFFIX = 'EmberKit Docs';
export const DEFAULT_DESCRIPTION =
  'Documentation for EmberKit — a minimalist, TypeScript-first JSX framework built for speed, minimal weight, and selective hydration.';
export const OG_IMAGE_URL = `${SITE_URL}/og-image.svg`;

const PAGE_COPY: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'EmberKit',
    description:
      'The TypeScript-first JSX framework where speed comes first — fast SSR, pre-rendered static routes, and selective hydration.',
  },
  '/docs/introduction': {
    title: 'Introduction',
    description: 'What EmberKit is, how it prioritizes speed, and how zero-JS-by-default works.',
  },
  '/docs/installation': {
    title: 'Installation',
    description: 'Install EmberKit, create a project, and configure your first app.',
  },
  '/docs/quick-start': {
    title: 'Quick Start',
    description: 'Build your first EmberKit page with routing, components, and metadata.',
  },
  '/docs/built-with-emberkit': {
    title: 'Built with EmberKit',
    description: 'This documentation site and patterns used to build it with EmberKit.',
  },
  '/docs/api': {
    title: 'API Reference',
    description: 'Runtime, router, signals, SSR, meta, and CLI API reference.',
  },
  '/docs/examples': {
    title: 'Examples',
    description: 'Example patterns for components, routing, and interactivity.',
  },
  '/docs/components': {
    title: 'Components',
    description: 'Author components, compose UI, and return JSX from functions.',
  },
  '/docs/routing': {
    title: 'Routing',
    description: 'File-based routes, dynamic segments, layouts, and loaders.',
  },
  '/docs/signals': {
    title: 'Signals',
    description: 'Reactive state with signals, memos, and effects.',
  },
  '/docs/context': {
    title: 'Context',
    description: 'Share values across the component tree with createContext.',
  },
  '/docs/ssr': {
    title: 'SSR & SSG',
    description: 'Server rendering, static generation, hybrid mode, and route metadata.',
  },
  '/docs/forms': {
    title: 'Forms & Mutations',
    description: 'Forms, actions, and progressive enhancement patterns.',
  },
  '/docs/hydration': {
    title: 'Hydration',
    description: 'Selective hydration, data-ek-bind, and client event wiring.',
  },
  '/docs/meta': {
    title: 'SEO & Meta',
    description: 'generateMeta, Open Graph, Twitter cards, and structured data.',
  },
  '/docs/head': {
    title: 'Head Component',
    description: 'Manage document head tags from JSX with the Head component.',
  },
  '/docs/icons': {
    title: 'Icons',
    description: 'Use @emberkit/icons in your EmberKit applications.',
  },
  '/docs/ui': {
    title: 'UI Components',
    description: 'Primitives and molecules from @emberkit/ui for docs and apps.',
  },
  '/docs/edge': {
    title: 'Edge Deployment',
    description: 'Deploy static output and SSR bundles to edge and Node hosts.',
  },
  '/docs/images': {
    title: 'Image Optimization',
    description: 'Responsive images, transforms, and lazy loading helpers.',
  },
  '/docs/markdown': {
    title: 'Markdown & MDX',
    description: 'Author content in Markdown and MDX with frontmatter metadata.',
  },
  '/404': {
    title: 'Page Not Found',
    description: 'The page you requested does not exist on the EmberKit documentation site.',
  },
  '/500': {
    title: 'Server Error',
    description: 'Something went wrong while loading this EmberKit documentation page.',
  },
};

export function normalizeDocsPath(pathname: string): string {
  return pathname.replace(/\/+$/, '') || '/';
}

function pageCopyForPath(pathname: string): { title: string; description: string } | undefined {
  return PAGE_COPY[normalizeDocsPath(pathname)];
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
  const path = normalizeDocsPath(pathname);
  return path === '/' ? SITE_URL : `${SITE_URL}${path}`;
}

export function enrichDocsMetadata(
  pathname: string,
  frontmatter: Record<string, unknown> = {},
): MetaData {
  const path = normalizeDocsPath(pathname);
  const page = pageCopyForPath(path);
  const title = typeof frontmatter.title === 'string' ? frontmatter.title : page?.title;
  const description =
    typeof frontmatter.description === 'string'
      ? frontmatter.description
      : (page?.description ?? DEFAULT_DESCRIPTION);
  const pageUrl = docsPageUrl(path);
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
      locale: 'en_US',
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
