# Hydration

Hydration is the process of making server-rendered HTML interactive. Only components with event handlers receive JavaScript — static content stays as pure HTML.

## How It Works

1. Server renders the full page as HTML
2. Browser displays the HTML immediately (fast First Contentful Paint)
3. EmberKit analyzes the DOM for interactive elements
4. Only interactive elements are hydrated with JavaScript

```tsx
// This component gets NO JavaScript — pure HTML
function Footer() {
  return <footer>© 2025 EmberKit</footer>;
}

// This component gets hydration JavaScript
function Counter() {
  const [count, setCount] = createSignal(0);
  return <button onClick={() => setCount(c => c + 1)}>Count: {count()}</button>;
}
```

## Hydration Strategies

EmberKit determines the best strategy per element:

| Strategy | When | Behavior |
|----------|------|----------|
| `eager` | Elements with event handlers | Hydrate immediately |
| `lazy` | Interactive but not critical | Hydrate on idle |
| `deferred` | Non-urgent interactive | Hydrate after timeout |
| `none` | Static elements | Never hydrate |

## Controlling Hydration

Use `data-hydrate` attributes to override the default strategy:

```tsx
// Never hydrate this element
<div data-hydrate="false">Static content</div>

// Hydrate lazily
<div data-hydrate="lazy">Low priority interactive</div>

// Hydrate after 2 seconds
<div data-hydrate="deferred">Deferred interactive</div>
```

## Analyzing Hydration

The analyzer inspects the component tree to determine what needs hydration:

```typescript
import { analyzeTree } from '@emberkit/core';

const manifest = analyzeTree(rootElement);
console.log(manifest.hydrationRequired);  // elements needing JS
console.log(manifest.hydrationSkipped);    // static elements
```

## Performance Impact

| Approach | Bundle Size | FCP | TTI |
|----------|------------|-----|-----|
| Traditional SPA | ~100KB+ | Slow | Slow |
| EmberKit selective | ~5-10KB | Fast | Fast |
| Static only | 0KB | Instant | Instant |

## Example

```tsx
import { createSignal } from '@emberkit/core';

function App() {
  return (
    <div>
      {/* No JS — renders as static HTML */}
      <header>
        <h1>My App</h1>
        <nav>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
        </nav>
      </header>

      {/* Gets hydration JS */}
      <SearchBar />

      {/* No JS — pure content */}
      <article>
        <p>This content never needs JavaScript.</p>
      </article>

      {/* Gets hydration JS */}
      <CommentForm />
    </div>
  );
}

function SearchBar() {
  const [query, setQuery] = createSignal('');
  return (
    <input
      type="search"
      value={query()}
      onInput={(e) => setQuery(e.target.value)}
      placeholder="Search..."
    />
  );
}

function CommentForm() {
  const [comment, setComment] = createSignal('');
  return (
    <form onSubmit={(e) => { e.preventDefault(); /* submit */ }}>
      <textarea
        value={comment()}
        onInput={(e) => setComment(e.target.value)}
      />
      <button type="submit">Post</button>
    </form>
  );
}
```

## Next Steps

- [SSR](/docs/ssr) - Server-side rendering
- [Components](/docs/components) - Static vs interactive components
- [Edge Deployment](/docs/edge) - Edge SSR performance
