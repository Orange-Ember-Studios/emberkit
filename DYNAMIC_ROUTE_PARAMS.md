# Dynamic Route Params Fix - Implementation Guide

## Overview

This document describes the fix for dynamic route parameters in EmberKit. When using dynamic routes like `[slug].tsx` or `[id].tsx`, the parameters are now automatically extracted from the URL and passed to route components via the `RouteParams` interface.

## What Was Fixed

**Symptom:** App crashes with `TypeError: Cannot read properties of undefined (reading 'slug')` when destructuring `{ params }` in dynamic route components.

**Root Cause:** The `renderToTarget` function was calling `createElement(routeComponent, {})` with empty props, so `params` was never provided to route components.

**Solution:** 
1. Extract dynamic segments from the URL pathname by matching them against the route pattern (e.g., `/blog/[slug].tsx` → `/blog/:slug`)
2. Parse query strings into a structured map
3. Create a Request object from the current location
4. Thread these values through the component props in the shape expected by `RouteParams<T>`

## Implementation Details

### Files Modified

**`packages/emberkit/src/runtime/index.ts`**
- Added `RouteProps` interface matching `RouteParams<T>` shape
- Added `extractParamsFromPath()` function to parse dynamic segments from URLs
- Added `parseQueryString()` function to handle query parameters (including multi-value ones)
- Updated `renderToTarget()` signature to accept optional `routeProps`
- Updated `renderCurrentRoute()` to compute and pass route props to `renderToTarget()`

### Key Functions

#### `extractParamsFromPath(routePath: string, pathname: string): Record<string, string>`

Extracts URL parameters by comparing a route pattern (e.g., `/blog/:slug`) against the actual pathname.

**Examples:**
```typescript
extractParamsFromPath('/:slug', '/getting-started')
// → { slug: 'getting-started' }

extractParamsFromPath('/blog/:year/:month/:slug', '/blog/2024/05/my-post')
// → { year: '2024', month: '05', slug: 'my-post' }
```

**Features:**
- Decodes URI components (e.g., `hello%20world` → `hello world`)
- Handles mixed static and dynamic segments
- Returns empty object for root path or non-parameterized routes

#### `parseQueryString(searchString: string): Record<string, string | string[]>`

Parses URL search parameters, handling both single and multi-value parameters.

**Examples:**
```typescript
parseQueryString('?foo=bar&baz=qux')
// → { foo: 'bar', baz: 'qux' }

parseQueryString('?tag=javascript&tag=typescript&tag=vite')
// → { tag: ['javascript', 'typescript', 'vite'] }
```

**Features:**
- Handles empty query strings
- Decodes URI components
- Collects duplicate parameters into arrays
- Handles empty parameter values

### Updated Route Component Interface

Route components now receive `RouteParams<T>` as props:

```typescript
interface RouteParams<T extends Record<string, string> = Record<string, string>> {
  params: T;
  query: Record<string, string | string[]>;
  request: Request;
}
```

## Usage Examples

### Simple Dynamic Route

**File:** `src/routes/blog/[slug].tsx`

```typescript
import type { RouteParams } from '@emberkit/core';

export default function PostPage({ params }: RouteParams<{ slug: string }>) {
  const { slug } = params;
  return (
    <article>
      <h1>Post: {slug}</h1>
      <p>Loading post "{slug}"...</p>
    </article>
  );
}
```

**Usage:** Navigate to `/blog/getting-started`
- Result: `params.slug === 'getting-started'`

### Multiple Dynamic Segments

**File:** `src/routes/docs/[version]/[page].tsx`

```typescript
import type { RouteParams } from '@emberkit/core';

interface DocParams {
  version: string;
  page: string;
}

export default function DocPage({ params, query }: RouteParams<DocParams>) {
  return (
    <div>
      <h1>
        Docs {params.version}: {params.page}
      </h1>
      {query.lang && <p>Language: {query.lang}</p>}
    </div>
  );
}
```

**Usage:** Navigate to `/docs/1.0.0/installation?lang=en`
- Result: 
  - `params.version === '1.0.0'`
  - `params.page === 'installation'`
  - `query.lang === 'en'`

### Mixed Static and Dynamic Segments

**File:** `src/routes/posts/[id]/comments/[commentId].tsx`

```typescript
import type { RouteParams } from '@emberkit/core';

interface CommentParams {
  id: string;
  commentId: string;
}

export default function CommentPage({ params }: RouteParams<CommentParams>) {
  return (
    <div>
      <h3>Post {params.id} - Comment {params.commentId}</h3>
    </div>
  );
}
```

**Usage:** Navigate to `/posts/42/comments/7`
- Result:
  - `params.id === '42'`
  - `params.commentId === '7'`

### Query Parameters

Any route can access query parameters via the `query` prop:

```typescript
import type { RouteParams } from '@emberkit/core';

export default function SearchPage({ query }: RouteParams) {
  const q = query.q as string;
  const tags = Array.isArray(query.tag) ? query.tag : [query.tag].filter(Boolean);
  
  return (
    <div>
      <h1>Search for: {q}</h1>
      <p>Tags: {tags.join(', ')}</p>
    </div>
  );
}
```

**Usage:** Navigate to `/search?q=emberkit&tag=framework&tag=jsx`
- Result:
  - `query.q === 'emberkit'`
  - `query.tag === ['framework', 'jsx']`

### Accessing Request Object

The `request` prop provides the full Request object for advanced use cases:

```typescript
import type { RouteParams } from '@emberkit/core';

export default function Page({ request }: RouteParams) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const search = url.search;
  
  return <div>Current page: {pathname}{search}</div>;
}
```

## Route Path Matching

Routes are matched with the following logic:

1. **Exact match** - `/about` matches only `/about`
2. **Prefix match** - `/blog` matches `/blog/anything` 
3. **Dynamic segments** - `/:slug` matches `/anything` and extracts `slug`
4. **Nested dynamic** - `/blog/:slug/comments/:id` matches `/blog/my-post/comments/42`

Dynamic segments must have the same length as the pathname. For example:
- Route `/blog/:slug` matches `/blog/my-post` (both have 2 segments)
- Route `/blog/:slug` does NOT match `/blog/my-post/something` (3 segments)

## Special Characters in Parameters

URL parameters are automatically decoded:

```typescript
// URL: /search/hello%20world
extractParamsFromPath('/:query', '/search/hello%20world')
// → { query: 'hello world' }
```

## Testing

All param extraction and query parsing logic is thoroughly tested in:
- `packages/emberkit/src/runtime/__tests__/route-params.test.ts` (17 tests)

Run tests with:
```bash
pnpm --filter @emberkit/core test
```

## Migration Guide

If you have existing code using route components without the `RouteParams` interface:

**Before:**
```typescript
export default function Page(props: Record<string, unknown>) {
  // No params available!
  return <div>Page</div>;
}
```

**After:**
```typescript
import type { RouteParams } from '@emberkit/core';

export default function Page({ params, query, request }: RouteParams) {
  // Now params, query, and request are available!
  return <div>Page</div>;
}
```

## Backwards Compatibility

This change is **fully backwards compatible**:
- Components without `RouteParams` will work as before
- Components not using `params` prop won't be affected
- Layout components still work the same way (layouts wrap children, only leaf routes get `RouteParams`)

## Related Type Definitions

```typescript
// From @emberkit/core/runtime/types.ts
export interface RouteParams<T extends Record<string, string> = Record<string, string>> {
  params: T;
  query: Record<string, string | string[]>;
  request: Request;
}
```
