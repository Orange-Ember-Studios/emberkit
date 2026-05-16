# @emberkit/core

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
