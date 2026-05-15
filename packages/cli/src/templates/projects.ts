export const starterFiles: Record<string, string> = {
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
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
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
  --color-ember-50: #fff7ed;
  --color-ember-100: #ffedd5;
  --color-ember-200: #fed7aa;
  --color-ember-300: #fdba74;
  --color-ember-400: #fb923c;
  --color-ember-500: #f97316;
  --color-ember-600: #ea580c;
  --color-ember-700: #c2410c;
  --color-ember-800: #9a3412;
  --color-ember-900: #7c2d12;
  --font-sans: 'Inter', system-ui, sans-serif;
}

body {
  @apply bg-slate-900 text-slate-200 font-sans min-h-screen;
}

a {
  @apply text-inherit no-underline transition-colors;
}`,

  "src/routes/_layout.tsx": `import type { RouteComponent } from '@emberkit/core';
import { Head } from '@emberkit/core';

const Layout: RouteComponent = ({ children }) => {
  return (
    <>
      <Head>
        <title>{{name}}</title>
        <meta name="description" content="Built with EmberKit" />
      </Head>
      <div className="flex flex-col min-h-screen">
        <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2 group">
              <span className="text-2xl">&#128293;</span>
              <span className="text-xl font-bold bg-gradient-to-r from-ember-400 to-ember-500 bg-clip-text text-transparent">
                {{name}}
              </span>
            </a>
            <nav className="flex items-center gap-6">
              <a href="/" className="text-slate-400 hover:text-ember-500 font-medium">Home</a>
              <a href="/about" className="text-slate-400 hover:text-ember-500 font-medium">About</a>
              <a href="https://emberkit.dev/docs" target="_blank" className="text-slate-400 hover:text-ember-500 font-medium">
                Docs <span className="text-xs">&#8599;</span>
              </a>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-slate-800 py-8 text-center text-slate-500">
          <p>Built with <a href="https://emberkit.dev" className="text-ember-500 hover:underline">EmberKit</a></p>
        </footer>
      </div>
    </>
  );
};

export default Layout;`,

  "src/routes/index.tsx": `import type { RouteComponent } from '@emberkit/core';
import { signal } from '@emberkit/core';

const HomePage: RouteComponent = () => {
  const count = signal(0);

  return (
    <div className="max-w-6xl mx-auto px-6 py-16 space-y-20">
      <section className="text-center space-y-6">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
          Welcome to <span className="bg-gradient-to-r from-ember-400 via-ember-500 to-ember-600 bg-clip-text text-transparent">{{name}}</span>
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          A minimalist TypeScript-first JSX framework built for speed and simplicity.
          Get started in seconds with hot module replacement and zero-config routing.
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <a href="/about" className="px-6 py-3 bg-ember-500 hover:bg-ember-600 text-white font-semibold rounded-lg transition-all hover:scale-105">
            Learn More
          </a>
          <a href="https://emberkit.dev/docs" target="_blank" className="px-6 py-3 border border-slate-700 hover:border-ember-500 text-slate-300 hover:text-ember-500 font-semibold rounded-lg transition-all">
            Read Docs &#8594;
          </a>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl border border-slate-800 bg-slate-800/30 hover:border-ember-500/50 transition-colors group">
          <div className="text-3xl mb-4">&#9889;</div>
          <h3 className="text-lg font-semibold mb-2">Lightning Fast</h3>
          <p className="text-slate-400">Sub-10KB runtime with tree-shakeable architecture</p>
        </div>
        <div className="p-6 rounded-xl border border-slate-800 bg-slate-800/30 hover:border-ember-500/50 transition-colors group">
          <div className="text-3xl mb-4">&#128303;</div>
          <h3 className="text-lg font-semibold mb-2">TypeScript First</h3>
          <p className="text-slate-400">Full type safety with intelligent autocomplete</p>
        </div>
        <div className="p-6 rounded-xl border border-slate-800 bg-slate-800/30 hover:border-ember-500/50 transition-colors group">
          <div className="text-3xl mb-4">&#128726;</div>
          <h3 className="text-lg font-semibold mb-2">File-Based Routing</h3>
          <p className="text-slate-400">Routes automatically created from your file structure</p>
        </div>
      </section>

      <section className="p-8 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700 text-center">
        <h2 className="text-2xl font-bold mb-6">Interactive Counter Demo</h2>
        <div className="flex items-center justify-center gap-6">
          <button
            className="w-12 h-12 rounded-lg bg-slate-800 border border-slate-700 hover:bg-ember-500 hover:border-ember-500 text-ember-500 hover:text-white text-xl transition-all"
            onClick={() => count.value--}
          >
            &#8722;
          </button>
          <span className="text-5xl font-bold tabular-nums min-w-[80px]">{count}</span>
          <button
            className="w-12 h-12 rounded-lg bg-slate-800 border border-slate-700 hover:bg-ember-500 hover:border-ember-500 text-ember-500 hover:text-white text-xl transition-all"
            onClick={() => count.value++}
          >
            +
          </button>
        </div>
        <p className="text-slate-500 mt-4 text-sm">Try clicking the buttons!</p>
      </section>

      <section className="text-center py-8">
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-ember-500/10 border border-ember-500/20 text-ember-400">
          <span className="w-2 h-2 rounded-full bg-ember-500 animate-pulse"></span>
          <span className="text-sm font-medium">Ready to build something amazing?</span>
        </div>
      </section>
    </div>
  );
};

export default HomePage;`,

  "src/routes/about.tsx": `import type { RouteComponent } from '@emberkit/core';
import { Head } from '@emberkit/core';

const AboutPage: RouteComponent = () => {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <Head>
        <title>About - {{name}}</title>
      </Head>
      <h1 className="text-4xl font-bold mb-6">About {{name}}</h1>
      <p className="text-slate-400 text-lg leading-relaxed mb-8">
        EmberKit is a minimalist TypeScript-first JSX framework built for speed and simplicity.
        It combines the best of modern frontend development with a lightweight runtime.
      </p>
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
          <span className="text-ember-500 text-sm font-semibold">SPA & SSR</span>
          <p className="text-slate-500 text-sm mt-1">Works in both modes</p>
        </div>
        <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
          <span className="text-ember-500 text-sm font-semibold">Zero Config</span>
          <p className="text-slate-500 text-sm mt-1">Sensible defaults</p>
        </div>
        <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
          <span className="text-ember-500 text-sm font-semibold">HMR</span>
          <p className="text-slate-500 text-sm mt-1">Hot module replacement</p>
        </div>
      </div>
      <a href="/" className="inline-flex items-center gap-2 text-ember-500 hover:text-ember-400 font-medium">
        &#8592; Back to Home
      </a>
    </div>
  );
};

export default AboutPage;`,
};

export const withUiTemplate: Record<string, string> = {
  "package.json": `{
  "name": "{{name}}",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "emberkit dev",
    "build": "emberkit build",
    "preview": "emberkit preview",
    "lint": "eslint src --ext .ts,.tsx",
    "format": "prettier --write \\"src/**/*.{ts,tsx}\\""
  },
  "dependencies": {
    "@emberkit/core": "^0.2.4",
    "@emberkit/ui": "^0.2.3"
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
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
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
  --color-ember-50: #fff7ed;
  --color-ember-100: #ffedd5;
  --color-ember-200: #fed7aa;
  --color-ember-300: #fdba74;
  --color-ember-400: #fb923c;
  --color-ember-500: #f97316;
  --color-ember-600: #ea580c;
  --color-ember-700: #c2410c;
  --color-ember-800: #9a3412;
  --color-ember-900: #7c2d12;
  --font-family-sans: 'Inter', system-ui, sans-serif;
}

body {
  @apply bg-slate-900 text-slate-200 font-sans;
}

a {
  @apply text-inherit no-underline;
}`,

  "src/routes/_layout.tsx": `import type { RouteComponent } from '@emberkit/core';
import { Head } from '@emberkit/core';
import { DefaultLayout } from '@emberkit/ui';

const Layout: RouteComponent = ({ children }) => {
  return (
    <>
      <Head>
        <title>{{name}}</title>
        <meta name="description" content="Built with EmberKit UI" />
      </Head>
      <DefaultLayout
        logo={<span className="text-ember-500 font-bold text-xl">&#128293; {{name}}</span>}
        navItems={[
          { label: 'Home', href: '/' },
          { label: 'About', href: '/about' },
          { label: 'Docs', href: 'https://emberkit.dev/docs', external: true },
        ]}
      >
        {children}
      </DefaultLayout>
    </>
  );
};

export default Layout;`,

  "src/routes/index.tsx": `import type { RouteComponent } from '@emberkit/core';
import { Button, Card, Heading, Text, Badge, Input } from '@emberkit/ui';
import { signal } from '@emberkit/core';

const HomePage: RouteComponent = () => {
  const email = signal('');

  return (
    <div className="space-y-16">
      <section className="text-center py-16">
        <Heading level="h1" size="4xl" weight="bold" className="mb-4">
          Welcome to <span className="text-ember-500">{{name}}</span>
        </Heading>
        <Text size="xl" color="muted" className="max-w-2xl mx-auto mb-8">
          A modern starter template with EmberKit UI components and Tailwind CSS.
          Build beautiful interfaces with our pre-built component library.
        </Text>
        <div className="flex gap-4 justify-center">
          <Button variant="primary" size="lg">
            Get Started
          </Button>
          <Button variant="secondary" size="lg">
            View Docs
          </Button>
        </div>
      </section>

      <section>
        <Heading level="h2" size="2xl" weight="semibold" className="mb-8 text-center">
          UI Components
        </Heading>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card padding="lg">
            <Badge variant="primary" size="sm" className="mb-2">Button</Badge>
            <Heading level="h3" size="lg" weight="semibold" className="mb-2">
              Button Variants
            </Heading>
            <Text color="muted" className="mb-4">
              Primary, secondary, ghost, and more button styles.
            </Text>
            <div className="flex gap-2 flex-wrap">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
          </Card>

          <Card padding="lg">
            <Badge variant="success" size="sm" className="mb-2">Cards</Badge>
            <Heading level="h3" size="lg" weight="semibold" className="mb-2">
              Card Component
            </Heading>
            <Text color="muted" className="mb-4">
              Flexible card layout with padding variants.
            </Text>
            <Card padding="md" className="bg-slate-800">
              <Text>Card content here</Text>
            </Card>
          </Card>

          <Card padding="lg">
            <Badge variant="info" size="sm" className="mb-2">Forms</Badge>
            <Heading level="h3" size="lg" weight="semibold" className="mb-2">
              Form Inputs
            </Heading>
            <Text color="muted" className="mb-4">
              Styled input with label support.
            </Text>
            <Input
              label="Email"
              placeholder="Enter your email"
              value={email.value}
              onChange={(e) => { email.value = e.currentTarget.value; }}
            />
          </Card>
        </div>
      </section>

      <section className="text-center py-16 bg-slate-800/50 rounded-xl">
        <Heading level="h2" size="2xl" weight="semibold" className="mb-4">
          Ready to get started?
        </Heading>
        <Text color="muted" className="max-w-xl mx-auto mb-6">
          Install dependencies and start building your next project with EmberKit.
        </Text>
        <Button variant="primary" size="lg">
          Create Project &#8594;
        </Button>
      </section>
    </div>
  );
};

export default HomePage;`,

  "src/routes/about.tsx": `import type { RouteComponent } from '@emberkit/core';
import { Head } from '@emberkit/core';
import { Heading, Text, Button } from '@emberkit/ui';

const AboutPage: RouteComponent = () => {
  return (
    <div className="max-w-2xl mx-auto py-12">
      <Head>
        <title>About - {{name}}</title>
      </Head>
      <Heading level="h1" size="3xl" weight="bold" className="mb-6">
        About {{name}}
      </Heading>
      <Text size="lg" color="muted" className="mb-8">
        This project was created with EmberKit and the UI component library.
        It demonstrates how to build modern, beautiful interfaces with our
        pre-built components and Tailwind CSS.
      </Text>
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-4 bg-slate-800 rounded-lg">
          <span className="text-ember-500 text-2xl">&#10003;</span>
          <Text>TypeScript-first development</Text>
        </div>
        <div className="flex items-center gap-3 p-4 bg-slate-800 rounded-lg">
          <span className="text-ember-500 text-2xl">&#10003;</span>
          <Text>Pre-built UI components</Text>
        </div>
        <div className="flex items-center gap-3 p-4 bg-slate-800 rounded-lg">
          <span className="text-ember-500 text-2xl">&#10003;</span>
          <Text>Tailwind CSS integration</Text>
        </div>
        <div className="flex items-center gap-3 p-4 bg-slate-800 rounded-lg">
          <span className="text-ember-500 text-2xl">&#10003;</span>
          <Text>File-based routing</Text>
        </div>
      </div>
      <div className="mt-8">
        <Button variant="secondary">&#8592; Back to Home</Button>
      </div>
    </div>
  );
};

export default AboutPage;`,
};
