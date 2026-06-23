# @emberkit/core

## 0.11.2

### Patch Changes

- 8ffb312: add runtime guard in createEffect that throws after more than 100 synchronous re-runs of the same effect chain, detecting "effect reads the signal it writes" infinite loops before they cause a stack overflow

## 0.11.1

### Patch Changes

- 75001e4: fix vite plugin dev render to avoid double-hydrate wiping SSR content

## 0.11.0

### Minor Changes

- de16a37: Add built-in default 404/500 pages when projects omit custom routes. Merge Head shorthand with children; fix SSR head priority and prerender template pollution. Wire notFoundRoute and errorRoute through virtual routes, client render, and CLI templates.

## 0.10.1

### Patch Changes

- Declare esbuild as a direct dependency so load-emberkit-config transpilation resolves in CI and published installs.

## 0.10.0

### Minor Changes

- a0343c6: Add core i18n, form event hydration, UI Select leading option, and CLI i18n scaffold template. Docs site trilingual with full es/fr MDX translations.

## 0.9.0

### Minor Changes

- Extract Cloudflare Workers patterns from Orange Ember website: createCloudflareWorker, injectPublicEnv, defineWranglerConfig; bare .sql bundling and createNodeDevApiHandler for dev/prod API parity.

## 0.8.2

### Patch Changes

- fix(vite-plugin): bundle sqlRaw and harden compression imports

## 0.8.1

### Patch Changes

- docs: expand 0.8.0 changelog for published packages

## 0.8.0

### Minor Changes

- **Signals:** `createEffect` and `createMemo` track dependencies and re-run when signals change; `batch` and `untrack` coalesce notifications; effects skip during SSR
- **View Transitions:** `render(..., { viewTransitions: true })`, `initViewTransitions`, `navigateWithViewTransition`, and `navigate(..., { viewTransition: true })` wait for `#app` DOM updates before transition snapshots
- **Dev API:** `devApiPlugin`, `devApi` config option, auto file-based routing from `src/routes/_api/*`, SSR middleware skips `/api` requests
- **Vite:** `sqlRawPlugin` for `*.sql?raw` imports; `load-emberkit-config` transpiles `emberkit.config.ts` via esbuild
- **Hydration:** `data-ek-bind` syncs `input`/`textarea`/`select` `.value` and button `disabled`

## 0.7.0

### Minor Changes

- SSR loaders with hydration sync, CLI render normalization, and Text contrast on dark UI

## 0.6.1

### Patch Changes

- Fix SSR layout wrapping and per-page Open Graph head injection

## 0.6.0

### Minor Changes

- Add SSR route head builder and site config for Open Graph tags

## 0.5.0

### Minor Changes

- Add LazyInView viewport lazy loading API

## 0.4.2

### Patch Changes

- edf551b: Read VERSION from package.json at build time

## 0.4.1

### Patch Changes

- 8df9f10: Export RouteParams from the public API

## 0.4.0

### Minor Changes

- feat: add custom 404 and 500 error page support

  Users can now create `404.tsx` and `500.tsx` files in their routes directory to customize error pages, similar to Next.js and Astro. The framework automatically renders these custom pages when no route matches (404) or when errors occur during rendering (500).

## 0.3.8

### Patch Changes

- fix: ssr guard for effects, trailing slash route matching
  - Skip createEffect execution during SSR (window undefined check)
  - Make trailing slash optional in SSR route regex matching
  - Prevents 404 flash on index routes and DOM errors in Node

## 0.3.7

### Patch Changes

- Restore syntax highlighting, copy buttons, and heading IDs in MDX pages

## 0.3.6

### Patch Changes

- Restore md-doc/md-content styling wrappers in MDX transform

## 0.3.5

### Patch Changes

- Fix MDX double-compile in production builds

## 0.3.4

### Patch Changes

- SSR production bundle, MDX compile, markdown fences, and test fixes

## 0.3.3

### Patch Changes

- SSR dev middleware and branded CLI dev server

## 0.3.2

### Patch Changes

- 326d105: Fix pino loading in browser; use @emberkit/core/logger subpath exports

## 0.3.1

### Patch Changes

- aaa517b: Fix pino module being bundled into browser code

## 0.3.0

### Minor Changes

- 85ae98e: Add comprehensive pino-based logging system with request tracking and audit trails

## 0.2.10

### Patch Changes

- e4e910a: Fix parent routes stealing child URL matches via broken prefix matching

## 0.2.9

### Patch Changes

- 0027e88: Fix static routes incorrectly matching dynamic peers at the same path depth

## 0.2.8

### Patch Changes

- Escape HTML in text nodes and string attributes for safe SSR output

## 0.2.7

### Patch Changes

- Escape text nodes and string attributes in SSR HTML output

## 0.2.6

## 0.2.6-alpha.0

### Patch Changes

- fix: pass dynamic route params to component props

## 0.2.5

### Patch Changes

- Add signal, computed, effect exports for simpler API
  - signal() - shorthand for createSignal() with .value property
  - computed() - shorthand for createMemo()
  - effect() - shorthand for createEffect()

## 0.2.4

### Patch Changes

- a563b0d: Fix vite-plugin-compression2 import by using dynamic import to avoid module resolution error when compression is not enabled
- 2467e81: Add typecheck, lint, and formatting support to all packages.

## 0.2.4-alpha.0

### Patch Changes

- Fix vite-plugin-compression2 import by using dynamic import to avoid module resolution error when compression is not enabled

## 0.2.2-alpha.0

### Patch Changes

- Add typecheck, lint, and formatting support to all packages.

## 0.2.1

### Patch Changes

- Fix style object serialization in SSR rendering, add native HTML attribute types to Input/Select, update semantic color tokens for dark theme, add :root fallback for all color CSS variables

## 0.1.2

### Patch Changes

- 34d4667: First Release
- Initial stable release of all EmberKit packages.

## 0.1.2-alpha.0

### Patch Changes

- First Release

## 0.1.1

### Patch Changes

- First Package Release
