# API Reference

Complete API reference for `@emberkit/core`.

## Runtime

### render

```typescript
render(
  element: JSXElement | string | null,
  container: Element | string,
  options?: { hydrate?: boolean }
): void
```

Renders a JSX element into a DOM container.

```tsx
import { render } from '@emberkit/core';

render(<App />, document.getElementById('app')!);
```

### hydrate

```typescript
hydrate(
  element: JSXElement | string | null,
  container: Element | string
): void
```

Hydrates server-rendered HTML with client-side interactivity.

### createElement

```typescript
createElement(
  type: string | ((props) => JSXNode),
  props?: Record<string, unknown> | null,
  ...children: unknown[]
): DOMElement
```

Creates a JSX element. Used by the JSX transform.

## Signals

### createSignal

```typescript
createSignal<T>(
  initialValue: T,
  options?: { equals?: (prev: T, next: T) => boolean }
): [() => T, (newValue: T) => void] & Signal<T>
```

Creates a reactive signal.

```tsx
const [count, setCount] = createSignal(0);
console.log(count()); // 0
setCount(1);
```

### createMemo

```typescript
createMemo<T>(
  computation: () => T,
  options?: SignalOptions<T>
): Signal<T>
```

Creates a derived value that updates when dependencies change.

```tsx
const doubled = createMemo(() => count() * 2);
console.log(doubled.value); // reactive
```

### createEffect

```typescript
createEffect(
  callback: () => void | (() => void)
): () => void
```

Runs a side effect when dependencies change. Returns a cleanup function.

```tsx
const dispose = createEffect(() => {
  document.title = `Count: ${count()}`;
  return () => { /* cleanup */ };
});
```

### batch

```typescript
batch<T>(fn: () => T): T
```

Groups multiple signal updates into a single notification.

### untrack

```typescript
untrack<T>(fn: () => T): T
```

Reads signals without tracking them as dependencies.

## Context

### createContext

```typescript
createContext<T>(defaultValue?: T): ContextBridge<T>
```

Creates a context with Provider and use methods.

```tsx
const ThemeContext = createContext<'light' | 'dark'>('light');
```

### useContext

```typescript
useContext<T>(context: Context<T>): T
```

Reads the nearest context value above the current component.

## Navigation

### navigate

```typescript
navigate(
  to: string,
  options?: {
    replace?: boolean;
    state?: Record<string, unknown>;
    viewTransition?: boolean | ViewTransitionOptions;
  }
): Promise<void>
```

Programmatic navigation.

```tsx
navigate('/about');
navigate('/new', { replace: true });
```

### preload

```typescript
preload(path: string): void
```

Prefetches a page by adding a prefetch link to the document head.

### redirect

```typescript
redirect(to: string, status?: number): never
```

Server-side redirect. Throws a Response.

## Markdown

### renderMarkdown

```typescript
renderMarkdown(
  content: string,
  options?: MarkdownOptions
): string
```

Renders Markdown to HTML.

### extractFrontmatter

```typescript
extractFrontmatter(
  content: string
): { data: Record<string, unknown>; content: string } | null
```

Extracts YAML frontmatter from Markdown.

### getReadingTime

```typescript
getReadingTime(text: string, wpm?: number): number
```

Estimates reading time in minutes.

## Forms

### handleFormSubmit

```typescript
handleFormSubmit(
  event: SubmitEvent,
  config: FormConfig
): Promise<boolean>
```

Handles form submission with validation.

### createFormValidator

```typescript
createFormValidator(schema: ValidationSchema): FormValidator
```

Creates a form validator from a schema.

### parseFormData

```typescript
parseFormData(form: HTMLFormElement): Record<string, unknown>
```

Extracts form data as a plain object.

## Meta

### generateMeta

```typescript
generateMeta(data: MetaData, baseUrl?: string): string
```

Generates HTML meta tags from metadata.

### generateArticleSchema

```typescript
generateArticleSchema(data: ArticleData): string
```

Generates JSON-LD Article schema.

### generateProductSchema

```typescript
generateProductSchema(data: ProductData): string
```

Generates JSON-LD Product schema.

### generateBreadcrumbs

```typescript
generateBreadcrumbs(items: Array<{ name: string; url: string }>): string
```

Generates JSON-LD BreadcrumbList schema.

## SSR

### renderSSR

```typescript
renderSSR(element: JSXNode, options?: SSRRenderOptions): string
```

Renders a JSX element to an HTML string.

### renderToHTMLString

```typescript
renderToHTMLString(element: JSXNode | null): string
```

Converts a JSX element tree to an HTML string.

### createHtmlDocument

```typescript
createHtmlDocument(
  body: string,
  options?: { title?: string; lang?: string; meta?: Record<string, string> }
): string
```

Wraps body content in a full HTML document.

## Next Steps

- [Components](/docs/components) - Component patterns
- [Signals](/docs/signals) - Reactive state
- [Routing](/docs/routing) - File-based routing
