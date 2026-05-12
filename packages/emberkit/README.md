# @emberkit/core

The core runtime for EmberKit — a minimalist, TypeScript-first JSX framework built for speed, minimal bundle size, and zero JavaScript by default.

## Install

```bash
npm install @emberkit/core
# or
pnpm add @emberkit/core
```

## What's Included

- **Runtime** — `createElement`, `render`, `hydrate`
- **Signals** — `createSignal`, `createMemo`, `createEffect`, `batch`, `untrack`
- **Context** — `createContext`, `useContext`
- **Navigation** — `navigate`, `preload`, `useNavigate`
- **Router** — `createRouter`, `matchRoute`
- **SSR** — `renderToString`, `createHtmlDocument`
- **Meta/SEO** — `Head` component, `generateMeta`, `generateBreadcrumbs`
- **Markdown** — `parseMarkdown`, `renderMarkdown`, `createMarkdownParser`
- **MDX** — `compileMDX`, `compileSync`, `useMDX`
- **Boundaries** — `createErrorBoundary`, `createLoadingBoundary`
- **Cache** — `DataCache`, `createCache`, `prefetch`
- **Vite Plugin** — `emberkitVitePlugin` (import from `@emberkit/core/vite-plugin`)
- **JSX Runtime** — `@emberkit/core/jsx-runtime` and `@emberkit/core/jsx-dev-runtime`

## Quick Start

```tsx
import { render, createSignal } from '@emberkit/core';

function Counter() {
  const [count, setCount] = createSignal(0);

  return (
    <button onClick={() => setCount(c => c + 1)}>
      Count: {count()}
    </button>
  );
}

render(<Counter />, document.getElementById('app'));
```

## Configuration

```ts
// emberkit.config.ts
import { defineConfig } from '@emberkit/core';

export default defineConfig({
  mode: 'ssr',
  build: { target: 'esnext' },
});
```

## Vite Plugin

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import { emberkitVitePlugin } from '@emberkit/core/vite-plugin';

export default defineConfig({
  plugins: [emberkitVitePlugin()],
});
```

## License

Apache-2.0
