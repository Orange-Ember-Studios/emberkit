---
title: Quick Start
---

# Quick Start

Build your first EmberKit page in 5 minutes.

## Create Your First Route

Routes live in `src/routes/`. Create `index.tsx`:

```tsx
import { render } from '@emberkit/core';

function HomePage() {
  return (
    <main>
      <h1>Welcome to EmberKit</h1>
      <p>Fast, light, and zero-JS by default.</p>
    </main>
  );
}

render(<HomePage />, document.getElementById('app')!);
```

## Add Dynamic Routes

Create `[slug].tsx` for dynamic paths:

```tsx
import type { Loader } from '@emberkit/loader';

export const loader: Loader = async ({ params }) => {
  return { slug: params.slug };
};

export default function PostPage({ data }: { data: { slug: string } }) {
  return <h1>Post: {data.slug}</h1>;
}
```

## Use Signals for State

Signals store state and automatically update the DOM without re-rendering. Use `data-ek-bind` to connect a signal to an element:

```tsx
import { createSignal } from '@emberkit/core';

function Counter() {
  const [count, setCount] = createSignal(0);

  return (
    <div>
      <p>
        Count: <span data-ek-bind={count}>{count()}</span>
      </p>
      <button onClick={() => setCount(c => c + 1)}>
        Increment
      </button>
    </div>
  );
}
```

The `<span>` renders with the initial count value in the HTML. When the button is clicked, `setCount` updates the signal, and only the `<span>`'s `textContent` changes — no re-render of the whole component.

### DOM Binding Patterns

```tsx
// textContent sync (default)
<span data-ek-bind={name}>{name()}</span>

// Class toggle (show/hide)
<div data-ek-bind={open} data-ek-show="opacity-100" data-ek-hide="opacity-0 pointer-events-none">

// String match (tabs)
<div data-ek-bind={tab} data-ek-show-when="preview">Preview</div>
```

See [Hydration](/docs/hydration) for the full reference.

## Add Navigation

```tsx
import { navigate, Link } from '@emberkit/core';

function Nav() {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
      <button onClick={() => navigate('/contact')}>
        Contact
      </button>
    </nav>
  );
}
```

## Add a Layout

Create `_layout.tsx` to wrap all routes:

```tsx
export default function Layout({ children }) {
  return (
    <div className="app">
      <header>
        <nav>...</nav>
      </header>
      <main>{children}</main>
      <footer>...</footer>
    </div>
  );
}
```

## Build for Production

```bash
pnpm build
```

Output will be in `dist/`.

## What's Next?

- [Components](/docs/components) - Learn about component patterns
- [Routing](/docs/routing) - Deep dive into file-based routing
- [Signals](/docs/signals) - Reactive state management
