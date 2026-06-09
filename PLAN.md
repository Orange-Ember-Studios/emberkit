# EmberKit — Development Plan

**Version:** 0.2.0
**Last Updated:** 2026-06-09

---

## Phases

### Phase 1: Foundation (v0.1.0)

- [x] **1.1** — Monorepo setup: pnpm-workspace.yaml, root package.json
- [x] **1.2** — EmberKit package scaffold: tsconfig, eslint, prettier
- [x] **1.3** — Vite plugin (`emberkit:vite-plugin`)
- [x] **1.4** — JSX-to-template-literal compiler
- [x] **1.5** — Core runtime: `createElement`, `render`, `hydrate`
- [x] **1.6** — File-based routing engine

### Phase 2: Data & SSR (v0.2.0)

- [x] **2.1** — Loader/data loading API (`RouteParams`, `LoaderResult`)
- [x] **2.2** — SSR renderer
- [x] **2.3** — Error & loading boundaries (`_error.tsx`, `_loading.tsx`)

### Phase 3: Interactivity (v0.3.0)

- [x] **3.1** — Signal primitives (`signal`, `effect`, `computed`)
- [x] **3.2** — Context API (`createContext`)
- [x] **3.3** — Selective hydration
- [x] **3.4** — Navigation primitives (`navigate`, `redirect`, `preload`)

### Phase 4: Ecosystem (v0.4.0+)

- [x] **4.1** — Scaffolding CLI (`emberkit` CLI)
- [x] **4.2** — Dev server with HMR
- [x] **4.3** — Plugin system
- [x] **4.4** — Edge runtime adapter
- [x] **4.5** — Image optimization plugin

### Phase 5: Data & Forms (v0.5.0)

- [x] **5.1** — Static generation / SSG
- [x] **5.2** — Forms & validation
- [x] **5.3** — Data mutations (POST/PUT/DELETE)
- [x] **5.4** — Meta tags & SEO
- [x] **5.5** — Prefetch & cache control

### Phase 6: Internationalization (v0.6.0)

- [x] **6.1** — Built-in i18n core (`createI18n`, `t`, `tp`, `Intl` formatters)
- [x] **6.2** — `createI18nContext` / `useI18n` provider
- [x] **6.3** — SSR locale resolution (`resolveLocaleFromRequest`)
- [x] **6.4** — Path-prefix helpers for `[locale]` routes
- [x] **6.5** — Docs & CLI `generate i18n` template
- [x] **6.6** — JSON translation files (import, glob, fetch, Node directory loader)

### Phase 7: Advanced SSR & Deployment (v0.7.0)

- [x] **7.1** — Per-route prerender/SSR export support
- [x] **7.2** — Formal adapter interface system
- [x] **7.3** — Middleware system
- [x] **7.4** — Streaming SSR support
- [x] **7.5** — Render scope isolation for SSR

---

## Completed

| Task | Date |
|------|------|
| 1.1 Monorepo setup | 2026-05-11 |
| 1.2 Package scaffold | 2026-05-11 |
| 1.3 Vite plugin | 2026-05-11 |
| 1.4 JSX compiler | 2026-05-11 |
| 1.5 Core runtime | 2026-05-11 |
| 1.6 File-based routing | 2026-05-11 |
| 2.1 Loader API | 2026-05-11 |
| 2.2 SSR renderer | 2026-05-11 |
| 2.3 Boundaries | 2026-05-11 |
| 3.1 Signals | 2026-05-11 |
| 3.2 Context API | 2026-05-11 |
| 3.3 Hydration | 2026-05-11 |
| 3.4 Navigation | 2026-05-11 |
| 4.1 CLI scaffold | 2026-05-11 |
| 4.2 Dev server + HMR | 2026-05-11 |
| 4.3 Plugin system | 2026-05-11 |
| 4.4 Edge runtime | 2026-05-11 |
| 4.5 Image optimization | 2026-05-11 |
| 5.1 SSG | 2026-05-11 |
| 5.2 Forms + validation | 2026-05-11 |
| 5.3 Mutations | 2026-05-11 |
| 5.4 Meta + SEO | 2026-05-11 |
| 5.5 Cache + prefetch | 2026-05-11 |
| MD/MDX support | 2026-05-11 |
| 6.1–6.5 i18n core + docs | 2026-05-28 |
| 7.1 Per-route prerender/SSR exports | 2026-06-09 |
| 7.2 Adapter interface system | 2026-06-09 |
| 7.3 Middleware system | 2026-06-09 |
| 7.4 Streaming SSR | 2026-06-09 |
| 7.5 Render scope isolation | 2026-06-09 |

---

## New Features in v0.2.0

### Per-route Rendering Control

Routes can now export `prerender`, `ssr`, and `ssrOnly` to control rendering behavior:

```typescript
// src/routes/blog/[slug].tsx
export const prerender = true;  // Pre-render at build time
export const ssr = true;         // Enable SSR (default)
export const ssrOnly = false;    // Disable client-side hydration
```

### Adapter System

Formal adapter interface for deployment targets:

```typescript
import { createAdapter } from '@emberkit/core';

export default createAdapter('my-app', 'cloudflare', async (context) => {
  return {
    status: 200,
    headers: { 'Content-Type': 'text/html' },
    body: await renderToHTML(context.request.url),
  };
});
```

### Middleware System

Request middleware for auth, logging, etc.:

```typescript
import { addMiddleware } from '@emberkit/core';

addMiddleware(async ({ request, locals }) => {
  const user = await authenticate(request);
  if (!user) {
    return new Response(null, { status: 401 });
  }
  locals.user = user;
});
```

### Streaming SSR

Progressive HTML delivery for faster TTFB:

```typescript
import { renderToStream } from '@emberkit/core';

export default async function handler(request: Request) {
  const stream = await renderToStream(<App />, {
    streaming: true,
  });
  
  return new Response(stream, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
```

### Render Scope Isolation

Context values are now scoped per render, preventing leakage between SSR renders.

---

## Open Questions (Resolved)

| Question | Status |
|----------|--------|
| Per-route rendering control | ✅ Implemented via `export const prerender/ssr/ssrOnly` |
| Adapter system | ✅ Formal `Adapter` interface with `createAdapter()` |
| Middleware | ✅ `addMiddleware()` and `runMiddleware()` |
| Streaming SSR | ✅ `renderToStream()` function |
| Context isolation | ✅ `runWithRenderScope()` for SSR renders |