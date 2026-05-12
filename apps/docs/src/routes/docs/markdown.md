# Markdown & MDX

EmberKit has built-in Markdown and MDX support. Write content in Markdown, render it as JSX components.

## Basic Usage

```tsx
import { renderMarkdown } from '@emberkit/core';

const html = renderMarkdown('# Hello\n\nThis is **bold** and *italic*.');
```

## Inline Markdown in Routes

The simplest approach — write Markdown as template literals:

```tsx
import type { RouteComponent } from '@emberkit/core';
import { renderMarkdown } from '@emberkit/core';

const content = `# My Page

This is a paragraph with **bold** and *italic* text.

## Section

- Item 1
- Item 2
- Item 3
`;

const MyPage: RouteComponent = () => {
  const html = renderMarkdown(content);
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
};
```

## Native Markdown Files

Place `.md` files in `src/routes/` and they become routes automatically. The Vite plugin wraps them into components:

```markdown
---
title: My Page
description: A page written in Markdown
---

# Hello World

This is a **Markdown** file that becomes a route.

- No TSX needed
- Auto-wrapped into a component
- Frontmatter exports available as named exports
```

## Frontmatter

Extract metadata from Markdown:

```tsx
import { extractFrontmatter } from '@emberkit/core';

const result = extractFrontmatter(`---
title: My Post
date: 2025-01-15
tags: [emberkit, tutorial]
---

# Content here
`);

console.log(result.data); // { title: 'My Post', date: '2025-01-15', tags: [...] }
```

## Markdown Features

| Feature | Syntax | Status |
|---------|--------|--------|
| GFM | `~~strikethrough~~`, `==highlight==` | Supported |
| Tables | Pipe tables | Supported |
| Task Lists | `- [x] Done` | Supported |
| Code Blocks | Fenced with language | Supported |
| Inline Code | Backticks | Supported |
| Links | `[text](url)` | Supported |
| Images | `![alt](src)` | Supported |
| Blockquotes | `> quote` | Supported |

## MDX Compiler

For more complex use cases, use the MDX compiler:

```tsx
import { compileMDX } from '@emberkit/core';

const component = await compileMDX(`
# Title

Some content with **markup**.
`);

// component is a function that returns JSX
const element = component({});
```

## Sync Compilation

```tsx
import { compileSync, useMDX } from '@emberkit/core';

const component = compileSync('# Hello World');
// or
const component = useMDX('# Hello World');
```

## Custom Components

Override how Markdown elements render:

```tsx
import { renderMarkdown } from '@emberkit/core';

const html = renderMarkdown(content, {
  components: {
    h1: 'h2',    // Render h1 as h2
    table: 'div', // Wrap tables in div
  },
});
```

## Reading Time

```tsx
import { getReadingTime } from '@emberkit/core';

const minutes = getReadingTime(content); // ~200 WPM
```

## Word Count

```tsx
import { getWordCount, getCharacterCount } from '@emberkit/core';

const words = getWordCount(content);
const chars = getCharacterCount(content, false); // excluding spaces
```

## Next Steps

- [Components](/docs/components) - Component rendering
- [SEO & Meta](/docs/meta) - Frontmatter meta tags
- [Routing](/docs/routing) - Route-level content
