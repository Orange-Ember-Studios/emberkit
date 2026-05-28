# EmberKit - Lightweight JSX Framework Specification

**Version:** 0.1.0  
**Last Updated:** 2026-05-11

---

## 1. Overview

EmberKit is a minimalist JavaScript framework for building web applications using the JSX specification, prioritizing:
- **Speed** - Fast server-side rendering, minimal hydration overhead
- **Code Weight** - Sub-10KB runtime, tree-shakeable
- **Developer Experience** - Familiar JSX syntax without framework lock-in

### Core Philosophy

1. **TypeScript-first** - Full type safety, excellent IDE support, catch errors at compile time
2. **JSX as the only DSL** - No proprietary components, hooks, or state management patterns
3. **Compile-time optimizations** - Static analysis at build time, not runtime
4. **Zero magic** - Explicit over implicit, visible data flow
5. **Progressive enhancement** - Works as SSR, static site, or client-side SPA

---

## 2. Architecture Overview

### 2.1 System Components

```
┌─────────────────────────────────────────────────────────────┐
│                        EmberKit                              │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │  Compiler   │→ │   Runtime   │→ │      Renderer       │  │
│  │  (Build)    │  │   (Client)  │  │  (SSR / Hydration)  │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                    Core Features                            │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────────────┐    │
│  │ Routing │ │  Data   │ │  Meta   │ │   Component     │    │
│  │ Engine  │ │ Loading │ │  Tags   │ │   Resolution    │    │
│  └─────────┘ └─────────┘ └─────────┘ └─────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Project Structure

```
my-app/
├── emberkit.config.ts        # Framework configuration
├── tsconfig.json            # TypeScript configuration
├── src/
│   ├── routes/              # File-based routing
│   │   ├── index.tsx        # → /
│   │   ├── about.tsx        # → /about
│   │   └── blog/
│   │       ├── index.tsx    # → /blog
│   │       └── [slug].tsx    # → /blog/:slug
│   ├── layouts/             # Layout components
│   │   └── default.tsx
│   ├── components/           # Shared components
│   │   └── header.tsx
│   └── pages/               # Page components (alias for routes)
└── dist/                    # Build output
```
my-app/
├── emberkit.config.js        # Framework configuration
├── src/
│   ├── routes/              # File-based routing
│   │   ├── index.jsx        # → /
│   │   ├── about.jsx        # → /about
│   │   └── blog/
│   │       ├── index.jsx    # → /blog
│   │       └── [slug].jsx   # → /blog/:slug
│   ├── layouts/             # Layout components
│   │   └── default.jsx
│   ├── components/          # Shared components
│   │   └── header.jsx
│   └── pages/               # Page components (alias for routes)
└── dist/                    # Build output
```

---

## 3. JSX Compilation Strategy

### 3.0 Build Tool: Vite

**Why Vite?**
- Development: esbuild for sub-50ms HMR
- Production: Rollup for optimal tree-shaking and chunking
- Rich plugin ecosystem
- Native TypeScript support without transpilation overhead
- Active maintenance and strong community

**Architecture:**
```
┌─────────────────────────────────────────────────────────────┐
│                        Vite                                 │
├─────────────────────────────────────────────────────────────┤
│   Dev Server (esbuild)          Build (Rollup)              │
│   ┌────────────────────┐       ┌────────────────────┐      │
│   │  emberkit:vite-plugin │       │  @emberkit/rollup     │      │
│   │  - JSX Transform   │       │  - JSX Compiler    │      │
│   │  - HMR             │       │  - Route Bundling  │      │
│   │  - Type Checking   │       │  - Code Splitting   │      │
│   └────────────────────┘       └────────────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

**Dev Experience:**
```bash
# Start dev server
emberkit dev

# Production build
emberkit build

# Preview production build
emberkit preview
```

### 3.1 Compiler Design

**Goal:** Convert JSX to vanilla JavaScript with zero framework imports

**Input (TSX):**
```tsx
function HomePage(): JSX.Element {
  return <h1>Hello World</h1>;
}
```

**Output (Pre-compilation):**
```typescript
// _jsx("h1", { children: "Hello World" })
```

**Output (Final Build):**
```typescript
// Static string concatenation - no runtime needed
const HomePage = (): string => `<h1>Hello World</h1>`;
```

### 3.2 Compilation Modes

| Mode | Description | Use Case |
|------|-------------|----------|
| `static` | Compile to HTML strings | Static sites, maximum performance |
| `ssr` | Compile to render functions | Server-side rendering with hydration |
| `spa` | Compile with client-side routing | Single-page applications |
| `hybrid` | Combine SSR + client navigation | Full-stack apps (Default) |

### 3.3 Static Analysis Optimizations

1. **Component inlining** - Inline simple components at compile time
2. **Prop hoisting** - Extract static props to constants
3. **Dead code elimination** - Remove unused branches
4. **Bundle splitting hints** - Automatic code splitting by route

---

## 4. TypeScript Support

### 4.1 Project Structure with TypeScript

```
my-app/
├── emberkit.config.ts        # Framework configuration
├── tsconfig.json            # TypeScript configuration
├── src/
│   ├── routes/
│   │   ├── index.tsx        # → /
│   │   ├── about.tsx        # → /about
│   │   └── blog/
│   │       ├── index.tsx    # → /blog
│   │       └── [slug].tsx   # → /blog/:slug
│   ├── layouts/
│   │   └── default.tsx
│   ├── components/
│   │   ├── header.tsx
│   │   └── types.ts         # Shared type definitions
│   └── pages/
└── dist/
```

### 4.2 Core Types

```typescript
// Route params and query strings
interface RouteParams<T extends Record<string, string> = {}> {
  params: T;
  query: Record<string, string | string[]>;
  request: Request;
}

// Data loader return type
interface LoaderData<T> {
  data: T;
  error?: never;
}

interface LoaderError {
  data?: never;
  error: {
    code: string;
    message: string;
    status: number;
  };
}

type LoaderResult<T> = LoaderData<T> | LoaderError;

// Component props auto-typed from loader
type PageProps<T> = (T extends LoaderData<infer D> ? { data: D } : {}) & {
  params: Record<string, string>;
};
```

### 4.3 Route Type Safety

```typescript
// src/routes/users/[id].tsx

// Define param types for this route
interface UserParams {
  id: string;
}

// Define the data shape this route returns
interface UserData {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

// Type-safe loader
export async function loader({ params }: RouteParams<UserParams>): Promise<LoaderResult<UserData>> {
  const user = await db.users.findById(params.id);

  if (!user) {
    return {
      error: {
        code: 'NOT_FOUND',
        message: 'User not found',
        status: 404
      }
    };
  }

  return { data: user };
}

// Props are fully typed based on loader
function UserPage({ data, params }: { data: UserData; params: UserParams }) {
  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.email}</p>
    </div>
  );
}
```

### 4.4 Component Type Safety

```typescript
// src/components/card.tsx

interface CardProps {
  title: string;
  description?: string;
  variant?: 'default' | 'outlined' | 'elevated';
  children?: JSX.Element | string;
  onClick?: (event: MouseEvent) => void;
}

// Forward ref for DOM access
function Card(
  { title, description, variant = 'default', children, onClick }: CardProps,
  ref: ForwardedRef<HTMLDivElement>
) {
  const className = `card card-${variant}`;

  return (
    <div ref={ref} class={className} onClick={onClick}>
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {children}
    </div>
  );
}

// Typed forward ref
const Card = forwardRef<HTMLDivElement, CardProps>(/* implementation */);

export { Card };
export type { CardProps };
```

### 4.5 Form Type Safety

```typescript
// src/components/form.tsx

interface FormProps<T extends Record<string, unknown>> {
  fields: T;
  onSubmit: (data: T) => Promise<void> | void;
  onError?: (errors: ValidationErrors<T>) => void;
}

interface ValidationErrors<T> {
  [K in keyof T]?: string;
}

// Usage with typed fields
function ContactForm() {
  const fields = useFormFields<{
    name: string;
    email: string;
    message: string;
  }>();

  return (
    <Form
      fields={fields}
      onSubmit={async (data) => {
        // data is fully typed: { name: string; email: string; message: string }
        await api.submitContact(data);
      }}
    />
  );
}
```

### 4.6 Signal Type Safety

```typescript
// src/components/counter.tsx

import { signal } from 'emberkit';

// Typed signal with explicit initial value
const count = signal<number>(0);

// Signal with complex type
const user = signal<User | null>(null);

// Readonly signal
const total = computed(() => count.value * 10);
const readonlyTotal = total.readonly;

// Effect with proper cleanup typing
effect(() => {
  console.log('Count changed:', count.value);
  return () => {
    // Cleanup function properly typed
  };
});
```

### 4.7 Context Type Safety

```typescript
// src/context/theme.tsx

interface ThemeContextValue {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

const ThemeContext = createContext<ThemeContextValue>();

// Provider with full type safety
function ThemeProvider({ children }: { children: JSX.Element }) {
  const theme = signal<'light' | 'dark'>('light');

  const value: ThemeContextValue = {
    theme: theme.value,
    toggleTheme: () => theme.value = theme.value === 'light' ? 'dark' : 'light',
    setTheme: (t) => theme.value = t,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// Consumer hook with type inference
function useTheme() {
  const context = ThemeContext.use();
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
```

### 4.8 API Routes Type Safety

```typescript
// src/routes/api/users/[id].ts

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

interface ApiError {
  code: string;
  message: string;
}

// Typed API handler
export async function handler(
  request: Request,
  { params }: RouteParams<{ id: string }>
): Promise<ApiResponse<User>> {
  if (request.method === 'GET') {
    const user = await db.users.findById(params.id);
    return { success: true, data: user };
  }

  if (request.method === 'DELETE') {
    await db.users.delete(params.id);
    return { success: true };
  }

  return {
    success: false,
    error: { code: 'METHOD_NOT_ALLOWED', message: 'Invalid method' }
  };
}
```

### 4.9 Strict Mode Configuration

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "exactOptionalPropertyTypes": true,
    "jsx": "react-jsx",
    "jsxImportSource": "emberkit",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### 4.10 Type Generation

EmberKit generates types automatically for:
- Route parameters from file structure
- Loader data types for page components
- API response types
- Form field types

```bash
# Generate types from project structure
emberkit generate types
```

---

## 5. Core Features Specification

### 5.1 Routing System

**Design Principles:**
- File-based routing with zero configuration
- Dynamic routes with bracket notation `[param]`
- Layout nesting with slots
- Programmatic route API for complex scenarios

**Route Resolution (TypeScript):**
```typescript
// src/routes/users/[id].tsx
function UserPage({ params, query }: RouteParams<{ id: string }>) {
  return <div>User: {params.id}</div>;
}
```

**Navigation API:**
```typescript
import { navigate, redirect, preload } from 'emberkit';

// Navigate
await navigate('/about');

// Redirect (server-side)
redirect('/login');

// Preload for instant navigation
preload('/blog/my-post');
```

### 5.2 Data Loading

**Parallel loading with async components (TypeScript):**
```typescript
interface UserData {
  name: string;
  email: string;
}

async function UserPage({ params }: RouteParams<{ id: string }>): Promise<JSX.Element> {
  const user = await fetch<UserData>(`/api/users/${params.id}`);
  return <div>{user.name}</div>;
}
```

**Server-only data functions:**
```typescript
// src/routes/posts/[slug].ts
interface PostData {
  post: {
    title: string;
    content: string;
  };
}

export async function loader({ params }: RouteParams<{ slug: string }>): Promise<LoaderResult<PostData>> {
  const post = await db.posts.findBySlug(params.slug);
  return { data: { post } };
}

function PostPage({ data }: { data: PostData }) {
  return <article><h1>{data.post.title}</h1></article>;
}
```

### 5.3 Layouts

```typescript
// src/layouts/blog.tsx
function BlogLayout({ children, data }: { children: JSX.Element; data: BlogData }) {
  return (
    <div class="blog">
      <aside>{data.categories}</aside>
      <main>{children}</main>
    </div>
  );
}
```

### 5.4 Meta Management

```typescript
function AboutPage(): JSX.Element {
  return (
    <>
      <title>About Us</title>
      <meta name="description" content="We're awesome" />
      <link rel="canonical" href="https://example.com/about" />
    </>
  );
}
```

---

## 6. Component Model

### 6.1 Component Definition

Any function returning JSX is a component:
```typescript
interface ButtonProps {
  children: JSX.Element | string;
  variant?: 'primary' | 'secondary';
  onClick?: (event: MouseEvent) => void;
}

function Button({ children, variant = 'primary', onClick }: ButtonProps): JSX.Element {
  const className = `btn btn-${variant}`;
  return <button class={className} onClick={onClick}>{children}</button>;
}
```

### 6.2 Component Composition

```typescript
interface CardProps {
  title: string;
  children: JSX.Element;
}

function Card({ title, children }: CardProps): JSX.Element {
  return (
    <div class="card">
      <h2>{title}</h2>
      {children}
    </div>
  );
}

// Usage
<Card title="Welcome">
  <p>This is card content</p>
</Card>
```

### 6.3 Conditional Rendering

```typescript
// Ternary (preferred for readability)
{isLoggedIn ? <LogoutButton /> : <LoginButton />}

// Short-circuit for null/false
{error && <ErrorMessage error={error} />}
```

### 6.4 List Rendering

```typescript
interface Item {
  id: string;
  name: string;
}

// Simple map with typed key
<ul>
  {items.map((item: Item) => <li key={item.id}>{item.name}</li>)}
</ul>
```

---

## 7. Built-in Primitives

### 7.1 Hydration

**Selective hydration for performance:**
```typescript
import { hydrate, lazy } from 'emberkit';

// Lazy component - only loads when visible
const HeavyChart = lazy(() => import('./charts/HeavyChart'));

// Hydrate only interactive parts
hydrate(() => <InteractiveWidget />, '#widget-root');
```

### 7.2 Forms

```typescript
import { useForm, Form, Input } from 'emberkit';

interface ContactFormData {
  email: string;
  message: string;
}

function ContactForm() {
  const form = useForm<ContactFormData>({
    action: '/api/contact',
    onSuccess: () => alert('Sent!'),
  });

  return (
    <Form handler={form.handler}>
      <Input name="email" type="email" required />
      <Input name="message" />
      <button type="submit">Send</button>
    </Form>
  );
}
```

### 7.3 State Management

**Minimal local state:**
```typescript
import { signal } from 'emberkit';

function Counter(): JSX.Element {
  const count = signal<number>(0);
  return (
    <button onClick={() => count.value++}>
      Count: {count.value}
    </button>
  );
}
```

**Shared state via context:**
```typescript
import { createContext } from 'emberkit';

const ThemeContext = createContext<'light' | 'dark'>('theme');

// Provider
<ThemeContext.Provider value="dark">

// Consumer
const theme = ThemeContext.use();
```

---

## 7. Performance Targets

| Metric | Target |
|--------|--------|
| Initial Bundle (runtime) | < 5KB gzipped |
| First Contentful Paint | < 1s (3G) |
| Time to Interactive | < 2s (3G) |
| Hydration cost | < 50ms |
| Lighthouse Performance | > 95 |

### 7.1 Optimization Strategies

1. **Streaming SSR** - Progressive HTML delivery
2. **Selective Hydration** - Only hydrate interactive elements
3. **Static Generation** - Pre-render where possible
4. **Edge Deployment** - Run at the edge closest to users
5. **Asset Optimization** - Automatic image optimization, font subsetting

---

## 8. API Reference (Planned)

### 8.1 Core Imports

```typescript
// Framework core
import { render, hydrate, createElement } from 'emberkit';

// Routing
import { navigate, redirect, useParams, useQuery } from 'emberkit/router';

// State
import { signal, effect, createContext } from 'emberkit/state';

// Utilities
import { lazy, Suspense, Show, For } from 'emberkit';
```

### 8.2 Configuration

```typescript
import { defineConfig } from 'emberkit';
import { drizzle } from '@emberkit/drizzle';

export default defineConfig({
  mode: 'hybrid',           // static | ssr | spa | hybrid
  output: 'dist',
  jsx: 'automatic',        // automatic | classic
  target: 'es2020',
  vite: {
    // Vite configuration merged with internal config
    define: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    },
    build: {
      minify: 'esbuild',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['emberkit'],
          },
        },
      },
    },
  },
  plugins: [],
});
```

### 8.3 Vite Plugin API

```typescript
// emberkit:vite-plugin internals

interface EmberKitPluginOptions {
  mode: 'static' | 'ssr' | 'spa' | 'hybrid';
  jsx?: 'automatic' | 'classic';
  routeDir?: string;
  outputDir?: string;
}

function emberkitVitePlugin(options: EmberKitPluginOptions): Plugin;
```

The plugin handles:
1. JSX transform (using esbuild or SWC under the hood)
2. Route discovery and code generation
3. Type checking integration (via vite-plugin-checker)
4. SSR boundary marking for Node.js bundles

---

## 9. Implementation Roadmap

### Phase 1: Core (v0.1.0 - v0.2.0)
- [ ] Project scaffolding CLI
- [ ] Vite plugin for EmberKit (emberkit:vite-plugin)
- [ ] JSX compiler with static output mode
- [ ] Basic file-based routing
- [ ] SSR renderer
- [ ] Template literals JSX transform

### Phase 2: Data & Forms (v0.3.0 - v0.4.0)
- [ ] Data loading API
- [ ] Form handling primitives
- [ ] Error boundaries
- [ ] Loading states

### Phase 3: Interactivity (v0.5.0 - v0.6.0)
- [ ] Hydration system
- [ ] Signal-based state
- [ ] Lazy loading
- [ ] Context API

### Phase 4: Ecosystem (v0.7.0+)
- [ ] Plugin system
- [ ] Dev server with HMR
- [ ] Image optimization
- [ ] Static generation adapter
- [ ] Edge runtime support

---

## 10. Comparison with Existing Solutions

| Feature | Next.js | Remix | SvelteKit | EmberKit |
|---------|---------|-------|-----------|---------|
| Bundle Size | ~150KB | ~45KB | ~1KB* | <5KB |
| JSX | React | React | Svelte | Vanilla JSX |
| TypeScript | Optional | Optional | Optional | **First-class** |
| Routing | File-based | File-based | File-based | File-based |
| SSR | Yes | Yes | Yes | Yes |
| Static Gen | Yes | Yes | Yes | Yes |
| Hydration | Full | Full | Selective | Selective |
| Learning Curve | Medium | Medium | Low | Low |

*Svelte compiled output, not runtime

---

## 11. File Naming Conventions

| Pattern | Meaning |
|---------|---------|
| `index.tsx` | Route or folder index |
| `[param].tsx` | Dynamic segment |
| `[...rest].tsx` | Catch-all route |
| `_layout.tsx` | Layout component |
| `_error.tsx` | Error boundary |
| `_loading.tsx` | Loading boundary |
| `_api/*.ts` | API routes (server-only) |

---

## 12. Open Questions

- [x] ~~Will we support TypeScript-first or JavaScript?~~ **Answer: TypeScript-first**
- [ ] How to handle CSS/styling? (CSS-in-JS, Tailwind, CSS Modules)
- [ ] Image optimization built-in or plugin?
- [x] ~~Internationalization strategy?~~ **Answer: Built-in `@emberkit/core` i18n** — message catalogs, context provider, SSR locale resolution, `Intl` formatters; optional path-prefix routing
- [ ] Database ORM integration? (Drizzle, Prisma, none)
- [ ] Authentication strategy built-in or middleware?
- [ ] Deployment targets: Node.js, Deno, Bun, Edge (Cloudflare Workers)?

---

## Appendix A: Glossary

- **Hydration**: Attaching JavaScript event handlers to pre-rendered HTML
- **Selective Hydration**: Hydrating only interactive parts, not full page
- **Code Splitting**: Breaking bundle into smaller chunks loaded on demand
- **Streaming SSR**: Progressive HTML delivery while still generating
- **Edge Runtime**: Execution at CDN edge nodes for lowest latency

---

*This specification is a living document and will evolve with implementation feedback.*