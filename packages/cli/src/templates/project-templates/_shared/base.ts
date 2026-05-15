/**
 * Shared builders for project template boilerplate.
 * Each template composes from these instead of duplicating identical config files.
 */

export interface PackageJsonOptions {
  hasTailwind?: boolean;
  hasUI?: boolean;
}

export function buildPackageJson(options: PackageJsonOptions = {}): string {
  const { hasTailwind = false, hasUI = false } = options;

  const deps: Record<string, string> = { "@emberkit/core": "^0.2.4" };
  if (hasUI) deps["@emberkit/ui"] = "^0.2.3";

  const devDeps: Record<string, string> = {
    "@emberkit/cli": "^0.2.4",
    typescript: "^5.7.0",
    vite: "^6.0.0",
  };
  if (hasTailwind) {
    devDeps["tailwindcss"] = "^4.0.0";
    devDeps["@tailwindcss/vite"] = "^4.0.0";
  }

  return JSON.stringify(
    {
      name: "{{name}}",
      version: "0.1.0",
      private: true,
      type: "module",
      scripts: {
        dev: "emberkit dev",
        build: "emberkit build",
        preview: "emberkit preview",
        lint: "eslint src --ext .ts,.tsx",
        format: 'prettier --write "src/**/*.{ts,tsx}"',
      },
      dependencies: deps,
      devDependencies: devDeps,
    },
    null,
    2,
  );
}

export function buildTsConfig(hasPaths = true): string {
  const pathsEntry = hasPaths
    ? `,
    "paths": {
      "@/*": ["./src/*"]
    }`
    : "";

  return `{
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
    "lib": ["ES2022", "DOM", "DOM.Iterable"]${pathsEntry}
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}`;
}

export function buildViteConfig(hasTailwind = false): string {
  if (hasTailwind) {
    return `import { defineConfig } from 'vite';
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
});`;
  }

  return `import { defineConfig } from 'vite';
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
});`;
}

export interface IndexHtmlOptions {
  title?: string;
  fonts?: string[];
}

export function buildIndexHtml(options: IndexHtmlOptions = {}): string {
  const { title = "{{name}}", fonts = [] } = options;

  const fontLinks =
    fonts.length > 0
      ? `\n  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
${fonts.map((href) => `  <link href="${href}" rel="stylesheet">`).join("\n")}`
      : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>${fontLinks}
</head>
<body id="app">
  <script type="module" src="/src/index.tsx"></script>
</body>
</html>`;
}

export interface EntryFileOptions {
  hasLayout?: boolean;
  hasCss?: boolean;
}

export function buildEntryFile(options: EntryFileOptions = {}): string {
  const { hasLayout = false, hasCss = false } = options;
  const appImport = hasLayout
    ? `import App from './routes/_layout';`
    : `import App from './routes/index';`;
  const cssImport = hasCss ? `\nimport './styles.css';` : "";

  return `import { render } from '@emberkit/core';
import { routes } from 'virtual:emberkit-routes';
${appImport}${cssImport}

const root = document.getElementById('app');

if (root) {
  try {
    render(App, root, { routes });
  } catch (error) {
    console.error('[entry] Render error:', error);
  }
}`;
}

export const GITIGNORE = `node_modules/
dist/
.env
.env.local
*.local
.DS_Store
*.tsbuildinfo
`;
