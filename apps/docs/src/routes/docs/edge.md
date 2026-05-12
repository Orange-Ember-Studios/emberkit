# Edge Deployment

EmberKit is designed for edge-first deployment. Your app runs in 300+ locations worldwide with sub-50ms latency.

## Supported Platforms

| Platform | Runtime | Status |
|----------|---------|--------|
| Cloudflare Workers | V8 isolates | Supported |
| Deno Deploy | Deno | Supported |
| Node.js | Node 18+ | Supported |
| Bun | Bun | Supported |

## Cloudflare Workers

### Setup

```bash
pnpm add -D wrangler
```

```typescript
// wrangler.toml
name = "my-app"
main = "dist/_worker.js"
compatibility_date = "2025-01-01"

[site]
bucket = "dist"
```

### Deploy

```bash
pnpm build
pnpm wrangler deploy
```

## Deno Deploy

### Setup

```typescript
// deno.json
{
  "tasks": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "@emberkit/core"
  }
}
```

### Deploy

```bash
deployctl deploy --project=my-app --prod dist/index.js
```

## Node.js

```bash
pnpm build
node dist/server.js
```

## Bundle Size Analysis

EmberKit includes tools to analyze your edge bundle:

```typescript
import { analyzeBundle } from '@emberkit/edge';

const code = await readFile('dist/bundle.js');
const stats = analyzeBundle(code);

if (stats.warnings.length) {
  console.warn('Bundle warnings:', stats.warnings);
}
if (stats.errors.length) {
  console.error('Bundle errors:', stats.errors);
}
```

### Size Limits

| Metric | Limit | Description |
|--------|-------|-------------|
| Warning | 1KB | Bundle approaching limit |
| Maximum | 8KB | Hard limit for edge runtime |

## HTML Optimization

```typescript
import { minifyHTML } from '@emberkit/edge';

const minified = minifyHTML('<div>  <p>  Hello  </p>  </div>');
// "<div><p> Hello </p></div>"
```

## Static Page Generation

The edge adapter supports static page generation for SSG:

```typescript
import { StaticPage } from '@emberkit/edge';

const page = new StaticPage('<html>...</html>');
page.addStyle('/styles/main.css');
page.addScript('/app.js');
page.setTitle('My Page');
page.setMeta('description', 'Page description');

const html = page.render();
```

## Performance

Edge deployment with EmberKit typically achieves:

- **TTFB**: < 50ms globally
- **FCP**: < 200ms (SSR + selective hydration)
- **TTI**: < 500ms (only interactive components load JS)
- **Bundle**: < 10KB total (framework + app code)

## Next Steps

- [SSR](/docs/ssr) - Server-side rendering modes
- [Hydration](/docs/hydration) - Selective hydration
- [SEO & Meta](/docs/meta) - Edge-rendered meta tags
