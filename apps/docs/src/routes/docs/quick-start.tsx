import type { RouteComponent } from '@emberkit/core';
import { renderMarkdown } from '@emberkit/core';

const content = `# Quick Start

Build your first EmberKit page in 5 minutes.

## Create Your First Route

Routes live in \`src/routes/\`. Create \`index.tsx\`:

\`\`\`tsx
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
\`\`\`

## Add Dynamic Routes

Create \`[slug].tsx\` for dynamic paths:

\`\`\`tsx
import type { Loader } from '@emberkit/loader';

export const loader: Loader = async ({ params }) => {
  return { slug: params.slug };
};

export default function PostPage({ data }: { data: { slug: string } }) {
  return <h1>Post: {data.slug}</h1>;
}
\`\`\`

## Use Signals for State

\`\`\`tsx
import { createSignal } from '@emberkit/core';

function Counter() {
  const [count, setCount] = createSignal(0);

  return (
    <div>
      <p>Count: {count()}</p>
      <button onClick={() => setCount(c => c + 1)}>
        Increment
      </button>
    </div>
  );
}
\`\`\`

## Add Navigation

\`\`\`tsx
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
\`\`\`

## Add a Layout

Create \`_layout.tsx\` to wrap all routes:

\`\`\`tsx
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
\`\`\`

## Build for Production

\`\`\`bash
pnpm build
\`\`\`

Output will be in \`dist/\`.

## What's Next?

- [Components](/docs/components) - Learn about component patterns
- [Routing](/docs/routing) - Deep dive into file-based routing
- [Signals](/docs/signals) - Reactive state management`;

const QuickStartPage: RouteComponent = () => {
  const html = renderMarkdown(content);

  return (
    <div className="md-content" dangerouslySetInnerHTML={{ __html: html }} />
  );
};

export default QuickStartPage;