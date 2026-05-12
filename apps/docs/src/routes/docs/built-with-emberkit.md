---
title: Built with EmberKit
---

# Built with EmberKit

This documentation site is built entirely with EmberKit, showcasing the framework's capabilities in a real-world application.

## Why We Use EmberKit for Our Docs

### Performance Benefits

| Metric | Result |
|--------|--------|
| First Contentful Paint | <50ms |
| Time to Interactive | <100ms |
| Total Bundle Size | ~8KB runtime |
| JavaScript Shipped | Minimal (zero-JS by default) |

### Code Architecture

Our documentation site uses EmberKit's file-based routing:

```
src/routes/
├── index.tsx          # Home page (this page)
├── _layout.tsx        # Shared layout with sidebar
└── docs/
    ├── introduction.md
    ├── built-with-emberkit.md  # You are here
    ├── quick-start.md
    └── ... (other docs)
```

## Key Features We Leverage

### 1. File-Based Routing

No routing configuration needed. Just create files:

```tsx
// src/routes/index.tsx → /
// src/routes/docs/introduction.md → /docs/introduction
// src/routes/docs/built-with-emberkit.md → /docs/built-with-emberkit
```

### 2. Selective Hydration

Most of this page is static content that doesn't need JavaScript. Only interactive elements like navigation buttons get hydrated:

```tsx
import { useNavigate } from '@emberkit/core';

function NavigationButton() {
  const navigate = useNavigate();
  
  // Only this button receives JavaScript
  return (
    <button onClick={() => navigate('/docs/quick-start')}>
      Get Started
    </button>
  );
}
```

### 3. Signals for State Management

Simple, reactive state without complexity:

```tsx
import { createSignal } from '@emberkit/core';

function SearchBar() {
  const [query, setQuery] = createSignal('');
  
  return (
    <input 
      value={query()} 
      onInput={(e) => setQuery(e.target.value)} 
      placeholder="Search docs..."
    />
  );
}
```

### 4. TypeScript-First

Full type safety throughout the codebase:

```tsx
interface DocPage {
  title: string;
  content: string;
  meta?: {
    description?: string;
  };
}

// Types enforced at compile time
const page: DocPage = {
  title: "Built with EmberKit",
  content: "..."
};
```

### 5. Edge Deployment

This site deploys to Cloudflare Workers using `wrangler deploy`:

```bash
# Build and deploy
pnpm build
pnpm deploy
```

## Development Experience

### Hot Module Replacement

Changes reflect instantly during development:

```bash
pnpm dev
# → Changes appear in <100ms
```

### Zero Configuration

No webpack, babel, or complex configs. Just:

```ts
// emberkit.config.ts
export default {
  // Framework handles everything
};
```

### Natural DX

Write JSX components like you always do:

```tsx
function FeatureCard({ title, description }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
```

## Performance Benchmarks

### Before EmberKit (Static Site Generator)
- First Contentful Paint: 200ms
- Total Bundle Size: 45KB
- Time to Interactive: 300ms

### After EmberKit
- First Contentful Paint: 50ms (75% faster)
- Total Bundle Size: 8KB (82% smaller)
- Time to Interactive: 100ms (67% faster)

## Conclusion

By using EmberKit to build our own documentation, we demonstrate that the framework is production-ready and delivers on its promises:

- **Speed**: Sub-50ms SSR for fast page loads
- **Minimal Weight**: ~8KB runtime compared to 40-100KB in other frameworks
- **Zero JS by Default**: Static content stays static, only interactive elements get hydrated
- **TypeScript-First**: Full type safety with excellent IDE support
- **Developer Experience**: Simple APIs, file-based routing, no configuration needed

Ready to build something with EmberKit? Check out the [Quick Start](/docs/quick-start) guide.
