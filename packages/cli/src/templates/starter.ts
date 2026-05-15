export const starterFiles: Record<string, string> = {
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
    "@emberkit/core": "^0.2.3"
  },
  "devDependencies": {
    "@emberkit/cli": "^0.2.3",
    "typescript": "^5.7.0",
    "vite": "^6.0.0"
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

  "emberkit.config.ts": `import { defineConfig } from '@emberkit/core';

export default defineConfig({
  mode: 'spa',
  build: {
    outDir: 'dist',
    target: 'esnext',
  },
});`,

  "vite.config.ts": `import { defineConfig } from 'vite';
import { emberkitVitePlugin } from '@emberkit/core/vite-plugin';

export default defineConfig({
  plugins: [emberkitVitePlugin()],
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
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/index.tsx"></script>
</body>
</html>`,

  "src/index.tsx": `import { render } from '@emberkit/core';
import App from './routes/_layout';

const root = document.getElementById('app');

if (root) {
  render(App, root);
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
      <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
        <header style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>
            <span style={{ color: '#f97316' }}>🔥</span> {{name}}
          </h1>
          <nav style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
            <a href="/" style={{ color: '#f97316', textDecoration: 'none' }}>Home</a>
            <a href="/about" style={{ color: '#666', textDecoration: 'none' }}>About</a>
          </nav>
        </header>
        <main>{children}</main>
      </div>
    </>
  );
};

export default Layout;`,

  "src/routes/index.tsx": `import type { RouteComponent } from '@emberkit/core';

const HomePage: RouteComponent = () => {
  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        Welcome to {{name}}
      </h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        This project was created with EmberKit — a minimalist, TypeScript-first JSX framework.
      </p>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <a
          href="/about"
          style={{
            display: 'inline-block',
            padding: '0.75rem 1.5rem',
            backgroundColor: '#f97316',
            color: 'white',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            fontWeight: 'bold',
          }}
        >
          Learn More
        </a>
        <a
          href="https://emberkit.dev/docs"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            padding: '0.75rem 1.5rem',
            border: '1px solid #ddd',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            color: '#333',
          }}
        >
          Read the Docs →
        </a>
      </div>
    </div>
  );
};

export default HomePage;`,

  "src/routes/about.tsx": `import type { RouteComponent } from '@emberkit/core';
import { Head } from '@emberkit/core';

const AboutPage: RouteComponent = () => {
  return (
    <div>
      <Head>
        <title>About - {{name}}</title>
      </Head>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        About
      </h2>
      <p style={{ color: '#666', marginBottom: '1rem' }}>
        EmberKit is a minimalist TypeScript-first JSX framework built for speed and simplicity.
      </p>
      <p style={{ color: '#666' }}>
        <a href="/" style={{ color: '#f97316', textDecoration: 'none' }}>← Back to Home</a>
      </p>
    </div>
  );
};

export default AboutPage;`,
};
