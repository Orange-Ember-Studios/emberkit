export const blogTemplate: Record<string, string> = {
  "package.json": `{
  "name": "{{name}}",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "emberkit dev",
    "build": "emberkit build",
    "preview": "emberkit preview"
  },
  "dependencies": {
    "@emberkit/core": "^0.2.4"
  },
  "devDependencies": {
    "@emberkit/cli": "^0.2.4",
    "typescript": "^5.7.0",
    "vite": "^6.0.0",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/vite": "^4.0.0"
  }
}`,

  "tsconfig.json": `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "jsxImportSource": "@emberkit/core",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}`,

  "vite.config.ts": `import { defineConfig } from 'vite';
import { emberkitVitePlugin } from '@emberkit/core/vite-plugin';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [emberkitVitePlugin(), tailwindcss()],
  server: {
    port: 3000,
    host: 'localhost',
  },
  esbuild: {
    jsxImportSource: '@emberkit/core',
  },
});`,

  "index.html": `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{name}}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Merriweather:wght@400;700&display=swap" rel="stylesheet">
</head>
<body id="app">
  <script type="module" src="/src/index.tsx"></script>
</body>
</html>`,

  "src/index.tsx": `import { render } from '@emberkit/core';
import { routes } from 'virtual:emberkit-routes';
import App from './routes/_layout';
import './styles.css';

const root = document.getElementById('app');

if (root) {
  try {
    render(App, root, { routes });
  } catch (error) {
    console.error('[entry] Render error:', error);
  }
}`,

  "src/styles.css": `@import "tailwindcss";

@theme {
  --font-serif: 'Merriweather', Georgia, serif;
  --font-sans: 'Inter', system-ui, sans-serif;
}

body {
  @apply bg-white text-gray-900 font-sans;
}

.prose {
  @apply max-w-none;
}

.prose h1, .prose h2, .prose h3 {
  @apply font-serif font-bold;
}

.prose p {
  @apply leading-relaxed;
}

.prose a {
  @apply text-blue-600 no-underline hover:underline;
}

.prose code {
  @apply bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono;
}

.prose pre {
  @apply bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto;
}

.prose pre code {
  @apply bg-transparent p-0 text-sm;
}

.prose blockquote {
  @apply border-l-4 border-gray-300 pl-4 italic text-gray-600;
}

.prose img {
  @apply rounded-lg;
}

.prose ul {
  @apply list-disc pl-6;
}

.prose ol {
  @apply list-decimal pl-6;
}`,

  "src/routes/_layout.tsx": `import type { RouteComponent } from '@emberkit/core';
import { Head } from '@emberkit/core';

const Layout: RouteComponent = ({ children }) => {
  return (
    <>
      <Head>
        <title>{{name}}</title>
        <meta name="description" content="A minimal blog built with EmberKit" />
      </Head>
      <div className="min-h-screen flex flex-col">
        <header className="border-b border-gray-200">
          <div className="max-w-3xl mx-auto px-6 py-6 flex items-center justify-between">
            <a href="/" className="text-xl font-bold font-serif">{{name}}</a>
            <nav className="flex gap-6 text-sm text-gray-600">
              <a href="/" className="hover:text-gray-900">Posts</a>
              <a href="/about" className="hover:text-gray-900">About</a>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-gray-200 py-8 text-center text-sm text-gray-500">
          <p>Built with <a href="https://emberkit.dev" className="text-gray-700 hover:underline">EmberKit</a></p>
        </footer>
      </div>
    </>
  );
};

export default Layout;`,

  "src/routes/index.tsx": `import type { RouteComponent } from '@emberkit/core';

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
}

const posts: Post[] = [
  {
    slug: 'getting-started',
    title: 'Getting Started with EmberKit',
    excerpt: 'Learn how to build your first project with EmberKit, a minimalist TypeScript-first JSX framework.',
    date: '2026-05-14',
    readTime: '5 min read',
  },
  {
    slug: 'signals-deep-dive',
    title: 'Signals: A Deep Dive',
    excerpt: 'Understanding reactive signals and how they power the EmberKit runtime.',
    date: '2026-05-10',
    readTime: '8 min read',
  },
  {
    slug: 'file-based-routing',
    title: 'File-Based Routing Explained',
    excerpt: 'How EmberKit automatically creates routes from your file structure.',
    date: '2026-05-05',
    readTime: '4 min read',
  },
];

const HomePage: RouteComponent = () => {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold font-serif mb-4">Latest Posts</h1>
        <p className="text-gray-600 text-lg">Thoughts, tutorials, and updates.</p>
      </div>
      <div className="space-y-10">
        {posts.map((post) => (
          <article key={post.slug} className="group">
            <a href={\`/posts/\${post.slug}\`} className="block">
              <h2 className="text-xl font-semibold font-serif mb-2 group-hover:text-blue-600 transition-colors">
                {post.title}
              </h2>
              <p className="text-gray-600 mb-3">{post.excerpt}</p>
              <div className="flex gap-3 text-sm text-gray-500">
                <time>{post.date}</time>
                <span>&middot;</span>
                <span>{post.readTime}</span>
              </div>
            </a>
          </article>
        ))}
      </div>
    </div>
  );
};

export default HomePage;`,

  "src/routes/[slug].tsx": `import type { RouteComponent, RouteParams } from '@emberkit/core';
import { Head } from '@emberkit/core';

interface PostData {
  title: string;
  date: string;
  author: string;
  content: string;
}

const posts: Record<string, PostData> = {
  'getting-started': {
    title: 'Getting Started with EmberKit',
    date: 'May 14, 2026',
    author: 'Author Name',
    content: \`
      <p>EmberKit is a minimalist TypeScript-first JSX framework built for speed and simplicity.</p>
      <h2>Installation</h2>
      <p>Get started by creating a new project:</p>
      <pre><code>npm create emberkit@latest my-app</code></pre>
      <h2>Project Structure</h2>
      <p>Your routes live in the \`src/routes\` directory. Each file automatically becomes a route.</p>
      <h2>Development</h2>
      <p>Run the dev server with hot module replacement:</p>
      <pre><code>emberkit dev</code></pre>
    \`,
  },
  'signals-deep-dive': {
    title: 'Signals: A Deep Dive',
    date: 'May 10, 2026',
    author: 'Author Name',
    content: \`
      <p>Signals are the reactive primitive at the core of EmberKit.</p>
      <h2>Creating Signals</h2>
      <pre><code>const count = signal(0);</code></pre>
      <h2>Computed Values</h2>
      <pre><code>const doubled = computed(() => count.value * 2);</code></pre>
      <h2>Side Effects</h2>
      <pre><code>effect(() => console.log(count.value));</code></pre>
    \`,
  },
  'file-based-routing': {
    title: 'File-Based Routing Explained',
    date: 'May 5, 2026',
    author: 'Author Name',
    content: \`
      <p>EmberKit uses file-based routing, meaning your file structure defines your routes.</p>
      <h2>Basic Routes</h2>
      <p>\`src/routes/index.tsx\` becomes \`/\`</p>
      <p>\`src/routes/about.tsx\` becomes \`/about\`</p>
      <h2>Dynamic Routes</h2>
      <p>\`src/routes/[slug].tsx\` becomes \`/:slug\`</p>
    \`,
  },
};

interface Params {
  slug: string;
}

const PostPage: RouteComponent<Params> = ({ params }) => {
  const post = posts[params.slug];

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Post not found</h1>
        <a href="/" className="text-blue-600 hover:underline">← Back to posts</a>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{post.title} - {{name}}</title>
        <meta name="description" content={post.title} />
      </Head>
      <article className="max-w-3xl mx-auto px-6 py-12">
        <header className="mb-10">
          <h1 className="text-4xl font-bold font-serif mb-4">{post.title}</h1>
          <div className="flex gap-3 text-sm text-gray-500">
            <time>{post.date}</time>
            <span>&middot;</span>
            <span>By {post.author}</span>
          </div>
        </header>
        <div className="prose" dangerouslySetInnerHTML={{ __html: post.content }} />
        <div className="mt-12 pt-8 border-t border-gray-200">
          <a href="/" className="text-blue-600 hover:underline">← Back to posts</a>
        </div>
      </article>
    </>
  );
};

export default PostPage;`,

  "src/routes/about.tsx": `import type { RouteComponent } from '@emberkit/core';
import { Head } from '@emberkit/core';

const AboutPage: RouteComponent = () => {
  return (
    <>
      <Head>
        <title>About - {{name}}</title>
      </Head>
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold font-serif mb-6">About</h1>
        <div className="prose">
          <p>Hi, I'm the author of this blog. I write about web development, frameworks, and building fast user interfaces.</p>
          <p>This blog is built with <a href="https://emberkit.dev">EmberKit</a>, a minimalist TypeScript-first JSX framework.</p>
          <h2>Tech Stack</h2>
          <ul>
            <li>EmberKit for routing and rendering</li>
            <li>Tailwind CSS for styling</li>
            <li>File-based routing</li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default AboutPage;`,
};
