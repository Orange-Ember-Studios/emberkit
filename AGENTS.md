# EmberKit — Agent Guidance

## Project Status

**v0.1.0 - Phase 1 Foundation.** Monorepo scaffolded, core package created. Implementing in order per PLAN.md.

## Framework Overview

EmberKit is a minimalist, TypeScript-first JSX framework with:
- Sub-10KB runtime, tree-shakeable
- File-based routing (no config needed)
- Vite-powered build with JSX-to-template-literal compilation
- Modes: `static`, `ssr`, `spa`, `hybrid` (default)
- SSR + selective hydration

## Directory Conventions (from spec)

```
src/
  routes/         # File-based routing → URLs
    index.tsx     # → /
    [slug].tsx    # → /:slug
    _layout.tsx   # Layout wrapper
    _error.tsx    # Error boundary
    _loading.tsx  # Loading boundary
    _api/*.ts     # API routes (server-only)
  layouts/        # Named layout components
  components/     # Shared UI components
  pages/          # Alias for routes/
```

## Key Naming Patterns

- `index.tsx` — folder index route
- `[param].tsx` — dynamic segment
- `[...rest].tsx` — catch-all route
- `_layout.tsx` — layout wrapper
- `_api/*.ts` — server-only API endpoints

## Important Implementation Notes (from spec)

- Use `jsxImportSource: "emberkit"` in tsconfig
- Loader return types use `LoaderResult<T>` with `{ data: T } | { error: {...} }` shape
- Route handlers get `RouteParams<T>` typed with param interface
- Components are plain functions returning `JSX.Element`
- State via `signal<T>()`, context via `createContext<T>()`

## Dev Commands (planned)

Based on spec, commands will be:
```bash
emberkit dev        # Start dev server (Vite + HMR)
emberkit build      # Production build (Rollup)
emberkit preview    # Preview production build
emberkit generate types  # Generate route/types
```

## Open Questions Affecting Implementation

These decisions are unresolved and will affect how agents should work:

1. **CSS strategy** — CSS-in-JS, Tailwind, CSS Modules? Undecided.
2. **ORM** — Drizzle, Prisma, or none? Undecided.
3. **Deployment targets** — Node.js, Deno, Bun, Cloudflare Workers? Undecided.
4. **Image optimization** — Built-in or plugin? Undecided.

## Development Workflow

- **Package manager:** pnpm — always use `pnpm`, never npm/yarn
- **Testing:** TDD with strict Red-Green-Refactor cycle. Write failing test first, then make it pass, then refactor.
- **Linting & Formatting:** ESLint + Prettier. Run lint and format before committing.
- **JS/TS conventions:** Follow best practices — camelCase for variables/functions, PascalCase for components/types, kebab-case for file names (except components, which use PascalCase). Use `const` by default, explicit return types on exported functions.

## Verification

Since no source code exists yet, there are no existing tests/lint/typecheck commands to run. When implementation begins:
- Check for `emberkit.config.ts` at package roots
- All packages live under `packages/*` (pnpm workspaces)
- Run commands from root with `pnpm --filter @emberkit/core <script>`

## Reading Order for New Context

1. `PLAN.md` — current work queue
2. `SPEC.md` — full framework spec
3. Root manifest (`package.json`, `pnpm-workspace.yaml`)
4. `packages/emberkit/emberkit.config.ts` — package config
5. Then explore representative source files