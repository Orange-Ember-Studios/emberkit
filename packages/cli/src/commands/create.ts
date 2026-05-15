import { existsSync, mkdirSync, writeFileSync } from "fs";
import { resolve, join } from "path";
import { execSync } from "child_process";
import { getPackageManager, getInstallCommand } from "../utils/filesystem.js";

export interface CreateOptions {
  name: string;
  directory?: string;
  template?: string;
  noInstall?: boolean;
}

const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";
const DIM = "\x1b[2m";

const BRIGHT_BLACK = "\x1b[90m";
const BRIGHT_RED = "\x1b[91m";
const BRIGHT_GREEN = "\x1b[92m";
const BRIGHT_BLUE = "\x1b[94m";
const BRIGHT_CYAN = "\x1b[96m";
const BRIGHT_WHITE = "\x1b[97m";

const ORANGE_BG = "\x1b[48;5;208m";

function printHeader() {
  const header = `
${BRIGHT_BLACK}╭─────────────────────────────────────────────────────╮${RESET}
${BRIGHT_BLACK}│${RESET}   ${ORANGE_BG}${BRIGHT_BLACK} EmberKit ${RESET}                                         ${BRIGHT_BLACK}│${RESET}
${BRIGHT_BLACK}│${RESET}   ${DIM}A minimalist TypeScript-first JSX framework${RESET}     ${BRIGHT_BLACK}│${RESET}
${BRIGHT_BLACK}╰─────────────────────────────────────────────────────╯${RESET}
`;
  console.log(header);
}

function printStep(step: number, total: number, message: string) {
  void total;
  const numStr = BRIGHT_CYAN + String(step).padStart(2, "0") + RESET;
  const bar = DIM + "━".repeat(40 - message.length) + RESET;
  console.log(`  ${numStr} ${BRIGHT_WHITE + message + RESET} ${bar}`);
}

function printSuccess(message: string) {
  const check = BRIGHT_GREEN + "✓" + RESET;
  console.log(`\n  ${check} ${BRIGHT_GREEN + message + RESET}\n`);
}

function printError(message: string) {
  const err = BRIGHT_RED + "✗" + RESET;
  console.log(`\n  ${err} ${BRIGHT_RED + message + RESET}\n`);
}

function printInfo(message: string) {
  const info = BRIGHT_BLUE + "›" + RESET;
  console.log(`  ${info} ${DIM + message + RESET}`);
}

function formatTemplate(
  template: string,
  vars: Record<string, string>,
): string {
  let result = template;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), value);
  }
  return result;
}

function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
}

function getNpmPackageName(name: string): string {
  const kebab = toKebabCase(name);
  return kebab.startsWith("@") ? kebab : kebab.replace(/^emberkit-/, "");
}

const starterFiles: Record<string, string> = {
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
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', sans-serif; background: #0f172a; color: #e2e8f0; }
    a { color: inherit; text-decoration: none; }
  </style>
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
      <div className="app">
        <header className="header">
          <div className="logo">
            <span className="logo-icon">🔥</span>
            <span className="logo-text">{{name}}</span>
          </div>
          <nav className="nav">
            <a href="/" className="nav-link">Home</a>
            <a href="/about" className="nav-link">About</a>
            <a href="https://emberkit.dev/docs" className="nav-link" target="_blank">Docs →</a>
          </nav>
        </header>
        <main className="main">{children}</main>
        <footer className="footer">
          <p>Built with <a href="https://emberkit.dev" className="footer-link">EmberKit</a></p>
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
    <div className="home">
      <section className="hero">
        <h1 className="hero-title">
          Welcome to <span className="gradient-text">{{name}}</span>
        </h1>
        <p className="hero-desc">
          A minimalist TypeScript-first JSX framework built for speed and simplicity.
          Get started in seconds with hot module replacement and zero-config routing.
        </p>
        <div className="hero-actions">
          <a href="/about" className="btn btn-primary">
            Learn More
          </a>
          <a href="https://emberkit.dev/docs" target="_blank" className="btn btn-secondary">
            Read Docs →
          </a>
        </div>
      </section>

      <section className="features">
        <div className="feature-card">
          <div className="feature-icon">⚡</div>
          <h3>Lightning Fast</h3>
          <p>Sub-10KB runtime with tree-shakeable architecture</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🔷</div>
          <h3>TypeScript First</h3>
          <p>Full type safety with intelligent autocomplete</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🛤️</div>
          <h3>File-Based Routing</h3>
          <p>Routes automatically created from your file structure</p>
        </div>
      </section>

      <section className="counter">
        <h2>Try the Counter</h2>
        <div className="counter-display">
          <button
            className="counter-btn"
            onClick={() => count.value--}
          >
            −
          </button>
          <span className="counter-value">{count}</span>
          <button
            className="counter-btn"
            onClick={() => count.value++}
          >
            +
          </button>
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
    <div className="about">
      <Head>
        <title>About - {{name}}</title>
      </Head>
      <div className="about-content">
        <h1>About {{name}}</h1>
        <p>
          EmberKit is a minimalist TypeScript-first JSX framework built for speed and simplicity.
          It combines the best of modern frontend development with a lightweight runtime.
        </p>
        <div className="about-features">
          <div className="about-feature">
            <span className="feature-badge">SPA & SSR</span>
            <span>Works in both modes</span>
          </div>
          <div className="about-feature">
            <span className="feature-badge">Zero Config</span>
            <span>Sensible defaults</span>
          </div>
          <div className="about-feature">
            <span className="feature-badge">HMR</span>
            <span>Hot module replacement</span>
          </div>
        </div>
        <a href="/" className="back-link">← Back to Home</a>
      </div>
    </div>
  );
};

export default AboutPage;`,

  "src/styles.css": `.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #1e293b;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo-icon {
  font-size: 1.5rem;
}

.logo-text {
  font-weight: 700;
  font-size: 1.25rem;
  background: linear-gradient(135deg, #f97316, #fb923c);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav {
  display: flex;
  gap: 1.5rem;
}

.nav-link {
  color: #94a3b8;
  font-weight: 500;
  transition: color 0.2s;
}

.nav-link:hover {
  color: #f97316;
}

.main {
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 3rem 2rem;
}

.footer {
  padding: 2rem;
  text-align: center;
  border-top: 1px solid #1e293b;
  color: #64748b;
}

.footer-link {
  color: #f97316;
}

.home {
  display: flex;
  flex-direction: column;
  gap: 4rem;
}

.hero {
  text-align: center;
  padding: 2rem 0;
}

.hero-title {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  line-height: 1.1;
}

.gradient-text {
  background: linear-gradient(135deg, #f97316, #fb923c, #fdba74);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-desc {
  font-size: 1.25rem;
  color: #94a3b8;
  max-width: 600px;
  margin: 0 auto 2rem;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn {
  display: inline-block;
  padding: 0.875rem 1.75rem;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-primary {
  background: #f97316;
  color: white;
}

.btn-primary:hover {
  background: #ea580c;
  transform: translateY(-1px);
}

.btn-secondary {
  background: #1e293b;
  color: #e2e8f0;
  border: 1px solid #334155;
}

.btn-secondary:hover {
  background: #334155;
  border-color: #475569;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.feature-card {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 0.75rem;
  padding: 1.5rem;
  transition: all 0.2s;
}

.feature-card:hover {
  border-color: #f97316;
  transform: translateY(-2px);
}

.feature-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.feature-card p {
  color: #64748b;
  font-size: 0.875rem;
}

.counter {
  text-align: center;
  padding: 2rem;
  background: #1e293b;
  border-radius: 1rem;
}

.counter h2 {
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.counter-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
}

.counter-btn {
  width: 48px;
  height: 48px;
  border-radius: 0.5rem;
  border: 1px solid #334155;
  background: #0f172a;
  color: #f97316;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.counter-btn:hover {
  background: #f97316;
  color: white;
  border-color: #f97316;
}

.counter-value {
  font-size: 2.5rem;
  font-weight: 700;
  min-width: 60px;
}

.about {
  max-width: 700px;
  margin: 0 auto;
}

.about h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.about > div > p {
  color: #94a3b8;
  font-size: 1.125rem;
  line-height: 1.7;
  margin-bottom: 2rem;
}

.about-features {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}

.about-feature {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #1e293b;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
}

.feature-badge {
  background: #f97316;
  color: white;
  padding: 0.125rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.back-link {
  display: inline-block;
  color: #f97316;
  font-weight: 500;
}

.back-link:hover {
  text-decoration: underline;
}`,
};

export async function create(options: CreateOptions): Promise<void> {
  printHeader();

  const { name, noInstall = false } = options;
  const directory = options.directory ?? toKebabCase(name);
  const targetDir = resolve(process.cwd(), directory);
  const templateId = options.template || "basic";

  printStep(1, 3, "Collecting project info");
  console.log(`    ${DIM}Project name:${RESET} ${BRIGHT_WHITE + name + RESET}`);
  console.log(`    ${DIM}Directory:${RESET} ${BRIGHT_WHITE + directory + RESET}`);
  console.log(`    ${DIM}Template:${RESET} ${BRIGHT_WHITE + templateId + RESET}\n`);

  if (existsSync(targetDir)) {
    printError(`Directory "${directory}" already exists.`);
    process.exit(1);
  }

  printStep(2, 3, "Scaffolding project");
  printInfo(`Creating ${directory}/`);

  mkdirSync(targetDir, { recursive: true });

  const templateVars = {
    name,
    packageName: getNpmPackageName(name),
    kebabName: toKebabCase(name),
  };

  const templateFiles = templateId === "with-ui" ? withUiTemplate : starterFiles;

  for (const [filePath, content] of Object.entries(templateFiles)) {
    const fullPath = join(targetDir, filePath);
    const dir = join(targetDir, filePath.split("/").slice(0, -1).join("/"));

    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    writeFileSync(fullPath, formatTemplate(content, templateVars), "utf-8");
    printInfo(`Created ${filePath}`);
  }

  printSuccess("Project scaffolded");

  if (!noInstall) {
    printStep(3, 3, "Installing dependencies");

    const pm = getPackageManager();
    const installCmd = getInstallCommand();

    console.log(`    ${DIM}Using:${RESET} ${BRIGHT_CYAN + pm + RESET}\n`);

    try {
      execSync(installCmd, { cwd: targetDir, stdio: "inherit" });
      printSuccess("Dependencies installed");
    } catch {
      printError("Failed to install dependencies");
      console.log(`  ${DIM}Run "${installCmd}" manually in ${directory}/${RESET}\n`);
    }
  }

  console.log(`\n${BRIGHT_WHITE}╭────────────────────────────────────────╮${RESET}`);
  console.log(`${BRIGHT_WHITE}│${RESET}  ${BRIGHT_GREEN + BOLD}Success!${RESET} Your project is ready.      ${BRIGHT_WHITE}│${RESET}`);
  console.log(`${BRIGHT_WHITE}╰────────────────────────────────────────╯${RESET}\n`);

  console.log(`  ${DIM}To start development:${RESET}`);
  console.log(`    ${BRIGHT_CYAN}cd${RESET} ${directory}`);
  if (noInstall) {
    console.log(`    ${BRIGHT_CYAN}${getInstallCommand()}${RESET}`);
  }
  console.log(`    ${BRIGHT_CYAN}emberkit dev${RESET}\n`);

  console.log(`  ${DIM}To build for production:${RESET}`);
  console.log(`    ${BRIGHT_CYAN}emberkit build${RESET}\n`);

  console.log(`  ${DIM}To preview the build:${RESET}`);
  console.log(`    ${BRIGHT_CYAN}emberkit preview${RESET}\n`);
}

const withUiTemplate: Record<string, string> = {
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
    "format": "prettier --write \\"src/**/*.{ts,tsx}\\"",
    "build:css": "tailwindcss -i ./src/styles.css -o ./dist/styles.css"
  },
  "dependencies": {
    "@emberkit/core": "^0.2.4",
    "@emberkit/ui": "^0.2.3"
  },
  "devDependencies": {
    "@emberkit/cli": "^0.2.4",
    "typescript": "^5.7.0",
    "vite": "^6.0.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
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

  "tailwind.config.js": `/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}', './index.html'],
  theme: {
    extend: {
      colors: {
        ember: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};`,

  "postcss.config.js": `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};`,

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
  css: {
    postcss: './postcss.config.js',
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
  <link href="/styles.css" rel="stylesheet">
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

  "src/styles.css": `@import "tailwindcss";

:root {
  --color-bg: #0f172a;
  --color-bg-secondary: #1e293b;
  --color-text: #e2e8f0;
  --color-text-muted: #94a3b8;
  --color-primary: #f97316;
  --color-primary-hover: #ea580c;
  --color-border: #334155;
}

body {
  background-color: var(--color-bg);
  color: var(--color-text);
  font-family: 'Inter', system-ui, sans-serif;
}

a {
  color: inherit;
  text-decoration: none;
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
        logo={<span className="text-ember-500 font-bold text-xl">🔥 {{name}}</span>}
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
          Create Project →
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
          <span className="text-ember-500 text-2xl">✓</span>
          <Text>TypeScript-first development</Text>
        </div>
        <div className="flex items-center gap-3 p-4 bg-slate-800 rounded-lg">
          <span className="text-ember-500 text-2xl">✓</span>
          <Text>Pre-built UI components</Text>
        </div>
        <div className="flex items-center gap-3 p-4 bg-slate-800 rounded-lg">
          <span className="text-ember-500 text-2xl">✓</span>
          <Text>Tailwind CSS integration</Text>
        </div>
        <div className="flex items-center gap-3 p-4 bg-slate-800 rounded-lg">
          <span className="text-ember-500 text-2xl">✓</span>
          <Text>File-based routing</Text>
        </div>
      </div>
      <div className="mt-8">
        <Button variant="secondary">← Back to Home</Button>
      </div>
    </div>
  );
};

export default AboutPage;`,
};