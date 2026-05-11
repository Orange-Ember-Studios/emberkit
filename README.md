# EmberKit

A minimalist, TypeScript-first JSX framework built for speed, minimal bundle size, and zero JavaScript by default.

## Philosophy

- **Speed**: Sub-50ms server-side rendering with streaming support
- **Weight**: Under 10KB runtime, fully tree-shakeable
- **Zero JS by default**: Only interactive elements receive hydration

## Quick Start

```bash
# Initialize a new project
pnpm create emberkit my-app
cd my-app

# Start development
pnpm dev

# Build for production
pnpm build
```

## Core Features

### File-Based Routing

```
src/routes/
├── index.tsx          # → /
├── about.tsx          # → /about
├── [slug].tsx         # → /:slug
└── _layout.tsx        # Shared layout wrapper
```

### Data Loading with Loaders

```tsx
import type { Loader } from '@emberkit/loader';

export const loader: Loader = async ({ params }) => {
  return { slug: params.slug };
};
```

### Signal-Based Reactivity

```tsx
import { createSignal, createEffect } from '@emberkit/core';

function Counter() {
  const [count, setCount] = createSignal(0);

  createEffect(() => {
    console.log('Count:', count());
  });

  return <button onClick={() => setCount(c => c + 1)}>{count()}</button>;
}
```

### Selective Hydration

Only components with event handlers receive client-side JavaScript:

```tsx
// This gets hydrated (has onClick)
<button onClick={handleClick}>Click me</button>

// This remains static HTML
<p>Just text content</p>
```

### View Transitions API

```tsx
import { navigate } from '@emberkit/core';

navigate('/new-page', {
  viewTransition: true
});
```

## Architecture

```
packages/
├── emberkit/          # Core runtime, compiler, router, SSR
├── cli/               # Scaffolding CLI
├── edge/              # Edge runtime adapters (Cloudflare, Deno)
└── tsconfig/          # Shared TypeScript configs
```

## Commands

```bash
pnpm dev          # Start development server with HMR
pnpm build        # Production build
pnpm test         # Run tests (199 passing)
pnpm lint         # ESLint
pnpm format       # Prettier
pnpm typecheck    # TypeScript checks
```

## Key Packages

| Package | Description |
|---------|-------------|
| `@emberkit/core` | Runtime, JSX compiler, signals, context |
| `@emberkit/cli` | Scaffolding and code generation |
| `@emberkit/edge` | Cloudflare Workers & Deno Deploy adapters |

## Configuration

```ts
// emberkit.config.ts
import { defineConfig } from '@emberkit/core';

export default defineConfig({
  mode: 'ssr',
  server: { port: 3000 },
  build: { target: 'esnext' }
});
```

## Browser Support

- Modern browsers with View Transitions API
- Progressive enhancement for older browsers
- Edge runtime targets Cloudflare Workers, Deno Deploy

## Status

**v0.1.0 - Phase 4 Complete**

- [x] Core runtime & JSX compiler
- [x] File-based routing
- [x] SSR with streaming
- [x] Signals & context API
- [x] Selective hydration
- [x] Navigation with View Transitions
- [x] CLI scaffolding
- [x] Dev server with HMR
- [x] Plugin system
- [x] Edge runtime adapters
- [x] Image optimization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests first (TDD)
4. Ensure all tests pass: `pnpm test`
5. Submit a pull request

## License

MIT