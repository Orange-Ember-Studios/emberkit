# EmberKit — Development Plan

**Version:** 0.1.0  
**Last Updated:** 2026-05-11

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