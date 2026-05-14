export { Head } from './head.js';
export type { HeadProps } from './head.js';
export {
  registerHeadContent,
  drainHeadContent,
  peekHeadContent,
  clearHeadContent,
} from './head-registry.js';

export interface MetaData {
  title?: string;
  description?: string;
  keywords?: string[];
  author?: string;
  robots?: string;
  canonical?: string;
  openGraph?: OpenGraphData;
  twitter?: TwitterCardData;
  structuredData?: Record<string, unknown>;
}

export interface OpenGraphData {
  title?: string;
  description?: string;
  url?: string;
  type?: 'website' | 'article' | 'product' | 'profile';
  images?: OGImage[];
  locale?: string;
  siteName?: string;
}

export interface OGImage {
  url: string;
  width?: number;
  height?: number;
  alt?: string;
}

export interface TwitterCardData {
  card: 'summary' | 'summary_large_image' | 'app' | 'player';
  site?: string;
  creator?: string;
  title?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
}

export class MetaGenerator {
  private baseUrl: string;
  private defaultDescription = 'Built with EmberKit';
  private defaultTitle = 'EmberKit App';
  private siteName = 'EmberKit';

  constructor(baseUrl = 'https://example.com') {
    this.baseUrl = baseUrl;
  }

  generate(data: MetaData): string {
    const tags: string[] = [];

    tags.push(...this.generateBasicMeta(data));
    tags.push(...this.generateOpenGraph(data));
    tags.push(...this.generateTwitter(data));
    tags.push(...this.generateCanonical(data));
    tags.push(...this.generateStructuredData(data));

    return tags.join('\n');
  }

  private generateBasicMeta(data: MetaData): string[] {
    const tags: string[] = [];

    const title = data.title ?? this.defaultTitle;
    tags.push(`<title>${escapeHtml(title)}</title>`);
    tags.push(`<meta name="title" content="${escapeHtml(title)}">`);

    const description = data.description ?? this.defaultDescription;
    tags.push(`<meta name="description" content="${escapeHtml(description)}">`);

    if (data.keywords?.length) {
      tags.push(`<meta name="keywords" content="${escapeHtml(data.keywords.join(', '))}">`);
    }

    if (data.author) {
      tags.push(`<meta name="author" content="${escapeHtml(data.author)}">`);
    }

    if (data.robots) {
      tags.push(`<meta name="robots" content="${escapeHtml(data.robots)}">`);
    }

    return tags;
  }

  private generateCanonical(data: MetaData): string[] {
    if (!data.canonical && this.baseUrl) {
      return [`<link rel="canonical" href="${escapeHtml(this.baseUrl)}">`];
    }

    if (data.canonical) {
      return [`<link rel="canonical" href="${escapeHtml(data.canonical)}">`];
    }

    return [];
  }

  private generateOpenGraph(data: MetaData): string[] {
    if (!data.openGraph) return [];

    const og = data.openGraph;
    const tags: string[] = [];

    tags.push(`<meta property="og:type" content="${og.type ?? 'website'}">`);
    tags.push(`<meta property="og:title" content="${escapeHtml(og.title ?? data.title ?? '')}">`);
    tags.push(
      `<meta property="og:description" content="${escapeHtml(og.description ?? data.description ?? '')}">`,
    );

    if (og.url) {
      tags.push(`<meta property="og:url" content="${escapeHtml(og.url)}">`);
    }

    if (og.images?.length) {
      for (const img of og.images) {
        tags.push(`<meta property="og:image" content="${escapeHtml(img.url)}">`);
        if (img.width) tags.push(`<meta property="og:image:width" content="${img.width}">`);
        if (img.height) tags.push(`<meta property="og:image:height" content="${img.height}">`);
        if (img.alt) tags.push(`<meta property="og:image:alt" content="${escapeHtml(img.alt)}">`);
      }
    }

    if (og.locale) {
      tags.push(`<meta property="og:locale" content="${escapeHtml(og.locale)}">`);
    }

    if (og.siteName) {
      tags.push(`<meta property="og:site_name" content="${escapeHtml(og.siteName)}">`);
    }

    return tags;
  }

  private generateStructuredData(data: MetaData): string[] {
    if (!data.structuredData) return [];

    const json = JSON.stringify(data.structuredData);

    return [`<script type="application/ld+json">${json}</script>`];
  }

  private generateTwitter(data: MetaData): string[] {
    if (!data.twitter) return [];

    const tc = data.twitter;
    const tags: string[] = [];

    tags.push(`<meta name="twitter:card" content="${tc.card}">`);

    if (tc.title) tags.push(`<meta name="twitter:title" content="${escapeHtml(tc.title)}">`);
    if (tc.description)
      tags.push(`<meta name="twitter:description" content="${escapeHtml(tc.description)}">`);
    if (tc.image) tags.push(`<meta name="twitter:image" content="${escapeHtml(tc.image)}">`);
    if (tc.imageAlt)
      tags.push(`<meta name="twitter:image:alt" content="${escapeHtml(tc.imageAlt)}">`);
    if (tc.site) tags.push(`<meta name="twitter:site" content="${escapeHtml(tc.site)}">`);
    if (tc.creator) tags.push(`<meta name="twitter:creator" content="${escapeHtml(tc.creator)}">`);

    return tags;
  }
}

export function createMetaGenerator(baseUrl?: string): MetaGenerator {
  return new MetaGenerator(baseUrl);
}

export function generateMeta(data: MetaData, baseUrl?: string): string {
  const generator = new MetaGenerator(baseUrl);
  return generator.generate(data);
}

export function generateBreadcrumbs(items: Array<{ name: string; url: string }>): string {
  const json = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  });

  return `<script type="application/ld+json">${json}</script>`;
}

export function generateArticleSchema(data: {
  title: string;
  description: string;
  author: string;
  publishedAt: string;
  url: string;
  image?: string;
}): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.title,
    description: data.description,
    author: {
      '@type': 'Person',
      name: data.author,
    },
    datePublished: data.publishedAt,
    url: data.url,
    ...(data.image ? { image: data.image } : {}),
  });
}

export function generateProductSchema(data: {
  name: string;
  description: string;
  price: string;
  currency?: string;
  availability?: string;
  image?: string;
}): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: data.name,
    description: data.description,
    offers: {
      '@type': 'Offer',
      price: data.price,
      priceCurrency: data.currency ?? 'USD',
      availability: data.availability ?? 'https://schema.org/InStock',
    },
    ...(data.image ? { image: data.image } : {}),
  });
}

export interface MetaLink {
  rel: string;
  href: string;
  type?: string;
  sizes?: string;
}

export function generateLinks(links: MetaLink[]): string {
  return links
    .map((link) => {
      let tag = `<link rel="${link.rel}" href="${escapeHtml(link.href)}"`;
      if (link.type) tag += ` type="${link.type}"`;
      if (link.sizes) tag += ` sizes="${link.sizes}"`;
      return tag + '>';
    })
    .join('\n');
}

export interface MetaScript {
  src?: string;
  content?: string;
  type?: string;
  async?: boolean;
  defer?: boolean;
}

export function generateScripts(scripts: MetaScript[]): string {
  return scripts
    .map((script) => {
      let tag = '<script';

      if (script.type) tag += ` type="${script.type}"`;
      if (script.async) tag += ' async';
      if (script.defer) tag += ' defer';
      if (script.src) tag += ` src="${escapeHtml(script.src)}"`;

      if (script.content) {
        return `${tag}>${script.content}</script>`;
      }

      return `${tag}></script>`;
    })
    .join('\n');
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export const DEFAULT_META: MetaData = {
  title: 'EmberKit',
  description: 'Minimalist TypeScript-first JSX framework',
  robots: 'index, follow',
};

export function mergeMeta(base: MetaData, override: Partial<MetaData>): MetaData {
  return {
    ...base,
    ...override,
    openGraph: {
      ...base.openGraph,
      ...override.openGraph,
    },
    twitter: {
      ...base.twitter,
      ...override.twitter,
    },
  };
}
