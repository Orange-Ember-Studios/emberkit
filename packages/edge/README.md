# @emberkit/edge

Edge runtime adapters for EmberKit — deploy to Cloudflare Workers, Deno Deploy, and other edge platforms.

## Install

```bash
npm install @emberkit/edge
# or
pnpm add @emberkit/edge
```

## Cloudflare Workers

Production pattern (API + static `dist/` assets, SPA fallback):

```ts
import { createCloudflareWorker, defineWranglerConfig } from '@emberkit/edge';
import { handleApiRequest } from './src/server/api-router';

export default createCloudflareWorker({
  handleApi: handleApiRequest,
  injectPublicEnv: true,
  beforeAssets(request) {
    // optional: redirects, admin auth
    return null;
  },
});
```

`wrangler.jsonc` defaults:

```ts
import { defineWranglerConfig } from '@emberkit/edge';

export default defineWranglerConfig({ name: 'my-app', main: 'worker.ts' });
```

Lower-level adapter (streaming SSR stub):

```ts
import { createCloudflareAdapter } from '@emberkit/edge';

const adapter = createCloudflareAdapter();
export default { fetch: (req, env, ctx) => adapter.fetch(req, env, ctx) };
```

## Deno Deploy

```ts
import { createDenoAdapter } from '@emberkit/edge';

const adapter = createDenoAdapter();

Deno.serve((request) => adapter.fetch(request));
```

## Edge Adapter

```ts
import { createEdgeAdapter } from '@emberkit/edge';

const adapter = createEdgeAdapter({
  runtime: 'cloudflare',
  streaming: true,
  staticGeneration: true,
});

const response = await adapter.render(context, async () => {
  return '<h1>Hello from the edge</h1>';
});
```

## Utilities

### Bundle Analysis

```ts
import { analyzeBundle } from '@emberkit/edge';

const stats = analyzeBundle(code);
console.log(stats.size);     // bytes
console.log(stats.warnings); // array of warning strings
console.log(stats.errors);   // array of error strings
```

### Static Pages

```ts
import { StaticPage } from '@emberkit/edge';

const page = new StaticPage('<html>...</html>');
page.addStyle('/styles/main.css');
page.addScript('/app.js');
console.log(page.toHTML());
```

### Cache Headers

```ts
import { createCacheHeaders } from '@emberkit/edge';

const headers = createCacheHeaders({
  edge: 3600,
  browser: 'public, max-age=300',
  staleWhileRevalidate: 86400,
});
```

### Environment Detection

```ts
import { isEdgeEnvironment } from '@emberkit/edge';

if (isEdgeEnvironment()) {
  // Running on Cloudflare Workers, Deno, or Bun
}
```

## Bundle Size Limits

| Level | Size | Description |
|-------|------|-------------|
| Warning | 1KB | Bundle approaching limit |
| Maximum | 8KB | Hard limit for edge runtime |

## License

Apache-2.0
