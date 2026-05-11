import type { RouteComponent } from '@emberkit/core';
import { renderMarkdown } from '@emberkit/core';

const content = `# Installation

Get up and running with EmberKit in minutes.

## Requirements

- Node.js 18+ (or Bun/Deno)
- pnpm (recommended) or npm/yarn

## Quick Install

\`\`\`bash
# Using pnpm (recommended)
pnpm create emberkit my-app
cd my-app
pnpm install
pnpm dev
\`\`\`

## Manual Setup

If you prefer to set up manually:

\`\`\`bash
# Create project directory
mkdir my-app && cd my-app

# Initialize package
pnpm init

# Install dependencies
pnpm add @emberkit/core

# Install dev dependencies
pnpm add -D vite @emberkit/vite-plugin typescript
\`\`\`

## Configuration

Create \`emberkit.config.ts\` in your project root:

\`\`\`typescript
import { defineConfig } from '@emberkit/core';

export default defineConfig({
  mode: 'ssr',          // 'static' | 'ssr' | 'spa' | 'hybrid'
  server: {
    port: 3000,
    host: 'localhost',
  },
  build: {
    outDir: 'dist',
    target: 'esnext',
  },
});
\`\`\`

## Update package.json

\`\`\`json
{
  "scripts": {
    "dev": "emberkit dev",
    "build": "emberkit build",
    "preview": "emberkit preview"
  }
}
\`\`\`

## Project Structure

\`\`\`
my-app/
├── emberkit.config.ts
├── index.html
├── src/
│   ├── index.tsx
│   └── routes/
│       ├── index.tsx       # → /
│       └── about.tsx       # → /about
└── package.json
\`\`\`

## Verify Installation

Run the development server:

\`\`\`bash
pnpm dev
\`\`\`

Open http://localhost:3000 in your browser. You should see the EmberKit welcome page.

## Troubleshooting

### Port already in use

Change the port in \`emberkit.config.ts\`:

\`\`\`typescript
server: { port: 3001 }
\`\`\`

### Module resolution errors

Ensure your \`tsconfig.json\` includes:

\`\`\`json
{
  "compilerOptions": {
    "jsxImportSource": "@emberkit/core",
    "moduleResolution": "bundler"
  }
}
\`\`\``;

const InstallationPage: RouteComponent = () => {
  const html = renderMarkdown(content);

  return (
    <div className="doc-content" dangerouslySetInnerHTML={{ __html: html }} />
  );
};

export default InstallationPage;