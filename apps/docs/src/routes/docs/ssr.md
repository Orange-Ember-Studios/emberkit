# SSR & SSG

EmberKit supports multiple rendering modes: Server-Side Rendering (SSR), Static Site Generation (SSG), and client-side SPA.

## Rendering Modes

| Mode | Description | Use Case |
|------|-------------|----------|
| `static` | Pre-renders all pages at build time | Marketing sites, blogs |
| `ssr` | Renders on every request | Dynamic pages, APIs |
| `spa` | Client-side only | Dashboards, admin panels |
| `hybrid` | Mix of SSR and static (default) | Most apps |

## Configuration

Set the mode in `emberkit.config.ts`:

```typescript
import { defineConfig } from '@emberkit/core';

export default defineConfig({
  mode: 'ssr',  // 'static' | 'ssr' | 'spa' | 'hybrid'
  server: {
    port: 3000,
    host: 'localhost',
  },
  build: {
    outDir: 'dist',
    target: 'esnext',
  },
});
```

## SSR (Server-Side Rendering)

SSR renders your app on the server for each request. The HTML is sent to the browser, then hydrated with JavaScript.

```typescript
import { renderSSR } from '@emberkit/core';

const html = renderSSR(<App />);
// Returns fully rendered HTML string
```

### SSR with HTML Document

```typescript
import { renderToHTMLString, createHtmlDocument } from '@emberkit/core';

const body = renderToHTMLString(<App />);
const document = createHtmlDocument(body, {
  title: 'My Page',
  lang: 'en',
  meta: { description: 'Page description' },
});
```

### Streaming SSR

For large pages, use streaming to send HTML progressively:

```typescript
import { createStreamingRenderer } from '@emberkit/core';

const renderer = createStreamingRenderer();
const stream = renderer.renderToStream(<App />);
```

## SSG (Static Site Generation)

SSG pre-renders all routes at build time. The output is pure HTML files with no server required.

```bash
# Build static output
pnpm build
# Output in dist/ — ready for any static host
```

### When to Use SSG

- Marketing pages
- Blog posts
- Documentation sites
- Any page where content doesn't change per-request

## Hybrid Mode

The default mode. Static pages are pre-rendered, dynamic pages use SSR:

```typescript
export default defineConfig({
  mode: 'hybrid',
});
```

## Edge Deployment

SSR works at the edge. See [Edge Deployment](/docs/edge) for deploying to Cloudflare Workers, Deno Deploy, and more.

## Performance

- Sub-50ms TTFB for SSR
- Streaming support for large pages
- Automatic code splitting
- Selective hydration via `data-ek-bind` (only bound elements get JS)

## Next Steps

- [Hydration](/docs/hydration) - Client-side interactivity
- [Edge Deployment](/docs/edge) - Deploy SSR to the edge
- [Components](/docs/components) - Static vs interactive components
