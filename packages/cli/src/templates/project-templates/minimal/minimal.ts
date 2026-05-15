export const minimalTemplate: Record<string, string> = {
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
    "lib": ["ES2022", "DOM", "DOM.Iterable"]
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}`,

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
<body id="app">
  <script type="module" src="/src/index.tsx"></script>
</body>
</html>`,

  "src/index.tsx": `import { render } from '@emberkit/core';
import { routes } from 'virtual:emberkit-routes';
import App from './routes/index';

const root = document.getElementById('app');

if (root) {
  try {
    render(App, root, { routes });
  } catch (error) {
    console.error('[entry] Render error:', error);
  }
}`,

  "src/routes/index.tsx": `import type { RouteComponent } from '@emberkit/core';

const Home: RouteComponent = () => {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: '600px', margin: '2rem auto', padding: '0 1rem' }}>
      <h1>{{name}}</h1>
      <p>Built with EmberKit</p>
    </div>
  );
};

export default Home;`,
};