# SEO & Meta

EmberKit provides built-in tools for managing meta tags, Open Graph, Twitter cards, and structured data.

## Basic Meta Tags

```tsx
import { generateMeta } from '@emberkit/core';

const metaHtml = generateMeta({
  title: 'My Page - EmberKit',
  description: 'A page built with EmberKit',
  keywords: ['emberkit', 'framework', 'typescript'],
  author: 'EmberKit Team',
  robots: 'index, follow',
});
```

This generates:

```html
<title>My Page - EmberKit</title>
<meta name="title" content="My Page - EmberKit">
<meta name="description" content="A page built with EmberKit">
<meta name="keywords" content="emberkit, framework, typescript">
<meta name="author" content="EmberKit Team">
<meta name="robots" content="index, follow">
```

## Open Graph

```tsx
import { generateMeta } from '@emberkit/core';

const metaHtml = generateMeta({
  title: 'My Page',
  description: 'Page description',
  openGraph: {
    title: 'My Page',
    description: 'Page description for social sharing',
    type: 'article',
    url: 'https://example.com/my-page',
    images: [
      {
        url: 'https://example.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'My Page',
      },
    ],
    locale: 'en_US',
    siteName: 'My Site',
  },
});
```

## Twitter Cards

```tsx
const metaHtml = generateMeta({
  twitter: {
    card: 'summary_large_image',
    site: '@emberkit',
    creator: '@author',
    title: 'My Page',
    description: 'Page description',
    image: 'https://example.com/twitter-image.png',
    imageAlt: 'My Page',
  },
});
```

## Canonical URLs

```tsx
const metaHtml = generateMeta({
  canonical: 'https://example.com/my-page',
});
// <link rel="canonical" href="https://example.com/my-page">
```

## Structured Data (JSON-LD)

### Article Schema

```tsx
import { generateArticleSchema } from '@emberkit/core';

const jsonLd = generateArticleSchema({
  title: 'My Article',
  description: 'Article description',
  author: 'John Doe',
  publishedAt: '2025-01-15',
  url: 'https://example.com/article',
  image: 'https://example.com/article.png',
});

// Inject in <head>:
<script type="application/ld+json">{jsonLd}</script>
```

### Product Schema

```tsx
import { generateProductSchema } from '@emberkit/core';

const jsonLd = generateProductSchema({
  name: 'EmberKit Pro',
  description: 'Premium features',
  price: '29.99',
  currency: 'USD',
  image: 'https://example.com/product.png',
});
```

### Breadcrumbs

```tsx
import { generateBreadcrumbs } from '@emberkit/core';

const breadcrumbs = generateBreadcrumbs([
  { name: 'Home', url: 'https://example.com' },
  { name: 'Docs', url: 'https://example.com/docs' },
  { name: 'SEO', url: 'https://example.com/docs/seo' },
]);
```

## Merging Meta

Combine default meta with page-specific overrides:

```tsx
import { mergeMeta, DEFAULT_META } from '@emberkit/core';

const pageMeta = mergeMeta(DEFAULT_META, {
  title: 'Contact Us',
  description: 'Get in touch with our team',
});
```

## Next Steps

- [SSR](/docs/ssr) - Server-side meta rendering
- [Markdown/MDX](/docs/markdown) - Frontmatter meta
- [Edge Deployment](/docs/edge) - Edge-rendered meta
