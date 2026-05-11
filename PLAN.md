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
- [ ] **2.3** — Error & loading boundaries (`_error.tsx`, `_loading.tsx`)

### Phase 3: Interactivity (v0.3.0)

- [ ] **3.1** — Signal primitives (`signal`, `effect`, `computed`)
- [ ] **3.2** — Context API (`createContext`)
- [ ] **3.3** — Selective hydration
- [ ] **3.4** — Navigation primitives (`navigate`, `redirect`, `preload`)

### Phase 4: Ecosystem (v0.4.0+)

- [ ] **4.1** — Scaffolding CLI (`emberkit` CLI)
- [ ] **4.2** — Dev server with HMR
- [ ] **4.3** — Plugin system
- [ ] **4.4** — Edge runtime adapter
- [ ] **4.5** — Image optimization plugin

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