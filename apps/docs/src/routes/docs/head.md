# Head Component

The `<Head>` component lets you manage `<head>` tags declaratively from any component. It renders nothing in the page body — tags are injected into `<head>` during SSR and updated directly in the DOM on the client.

## Basic Usage

```tsx
import { Head } from '@emberkit/core';

function MyPage() {
  return (
    <>
      <Head>
        <title>My Page - EmberKit</title>
        <meta name="description" content="A page built with EmberKit" />
      </Head>
      <h1>Hello World</h1>
    </>
  );
}
```

During SSR, this produces:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>My Page - EmberKit</title>
  <meta name="description" content="A page built with EmberKit">
</head>
<body>
  <h1>Hello World</h1>
</body>
</html>
```

## Shorthand Props

For common tags, use props instead of raw JSX:

```tsx
<Head
  title="My Page"
  description="Page description"
  keywords={['emberkit', 'framework', 'typescript']}
  author="EmberKit Team"
  robots="index, follow"
  canonical="https://example.com/my-page"
/>
```

### Supported Props

| Prop | Type | HTML Output |
|------|------|-------------|
| `title` | `string` | `<title>` + `<meta name="title">` |
| `description` | `string` | `<meta name="description">` |
| `keywords` | `string[]` | `<meta name="keywords">` (comma-separated) |
| `author` | `string` | `<meta name="author">` |
| `robots` | `string` | `<meta name="robots">` |
| `canonical` | `string` | `<link rel="canonical">` |

## Open Graph

```tsx
<Head
  og={{
    type: 'article',
    title: 'My Page',
    description: 'Page description for social sharing',
    url: 'https://example.com/my-page',
    image: 'https://example.com/og-image.png',
    locale: 'en_US',
    siteName: 'My Site',
  }}
/>
```

### Open Graph Props

| Prop | Type | HTML Output |
|------|------|-------------|
| `og.type` | `string` | `<meta property="og:type">` |
| `og.title` | `string` | `<meta property="og:title">` |
| `og.description` | `string` | `<meta property="og:description">` |
| `og.url` | `string` | `<meta property="og:url">` |
| `og.image` | `string` | `<meta property="og:image">` |
| `og.locale` | `string` | `<meta property="og:locale">` |
| `og.siteName` | `string` | `<meta property="og:site_name">` |

## Twitter Cards

```tsx
<Head
  twitter={{
    card: 'summary_large_image',
    site: '@emberkit',
    creator: '@author',
    title: 'My Page',
    description: 'Page description',
    image: 'https://example.com/twitter-image.png',
  }}
/>
```

### Twitter Props

| Prop | Type | HTML Output |
|------|------|-------------|
| `twitter.card` | `string` | `<meta name="twitter:card">` |
| `twitter.site` | `string` | `<meta name="twitter:site">` |
| `twitter.creator` | `string` | `<meta name="twitter:creator">` |
| `twitter.title` | `string` | `<meta name="twitter:title">` |
| `twitter.description` | `string` | `<meta name="twitter:description">` |
| `twitter.image` | `string` | `<meta name="twitter:image">` |

## Combining Children and Props

You can mix shorthand props with raw JSX children:

```tsx
<Head title="My Page" description="Description">
  <meta property="og:image" content="https://example.com/og.png" />
  <link rel="icon" href="/favicon.ico" />
</Head>
```

When `children` are provided, they take precedence — the shorthand props are ignored.

## Multiple `<Head>` Components

Use multiple `<Head>` components across your component tree. All tags are collected and merged into `<head>`:

```tsx
// Layout provides default meta
function Layout({ children }) {
  return (
    <>
      <Head>
        <meta name="theme-color" content="#0b0f19" />
        <meta property="og:site_name" content="My Site" />
      </Head>
      {children}
    </>
  );
}

// Page provides page-specific meta
function AboutPage() {
  return (
    <>
      <Head>
        <title>About Us - My Site</title>
        <meta name="description" content="Learn about our team" />
      </Head>
      <h1>About Us</h1>
    </>
  );
}
```

## Structured Data (JSON-LD)

Use children for structured data scripts:

```tsx
import { Head, generateArticleSchema } from '@emberkit/core';

function ArticlePage() {
  const schema = generateArticleSchema({
    title: 'My Article',
    description: 'Article description',
    author: 'John Doe',
    publishedAt: '2025-01-15',
    url: 'https://example.com/article',
  });

  return (
    <>
      <Head>
        <title>My Article</title>
        <script type="application/ld+json">{schema}</script>
      </Head>
      <article>
        <h1>My Article</h1>
      </article>
    </>
  );
}
```

## How It Works

### SSR

During server-side rendering, `<Head>`:

1. Renders its children to an HTML string
2. Registers the HTML to an internal head content registry
3. Returns `null` (nothing in the page body)

After `renderToString()` completes, `renderSSR()` drains the registry and passes the collected tags to `createHtmlDocument()`, which injects them into `<head>`.

### Client-Side Navigation

During SPA navigation, `<Head>`:

1. Renders its children to an HTML string
2. Parses the HTML and updates `document.head` directly
3. Tags are marked with `data-ek-head` so re-renders replace (not duplicate) managed tags

### API Reference

```typescript
interface HeadProps {
  children?: JSXNode | JSXNode[];
  title?: string;
  description?: string;
  og?: {
    title?: string;
    description?: string;
    type?: string;
    url?: string;
    image?: string;
    locale?: string;
    siteName?: string;
  };
  twitter?: {
    card?: string;
    site?: string;
    creator?: string;
    title?: string;
    description?: string;
    image?: string;
  };
  canonical?: string;
  robots?: string;
  keywords?: string[];
  author?: string;
}
```

## Next Steps

- [SEO & Meta](/docs/meta) - Programmatic meta generation with `generateMeta()`
- [SSR](/docs/ssr) - Server-side rendering pipeline
- [Components](/docs/components) - Component patterns
