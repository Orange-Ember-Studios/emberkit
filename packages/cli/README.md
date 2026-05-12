# @emberkit/cli

The CLI tool for EmberKit — scaffold, develop, and build EmberKit projects.

## Install

```bash
npm install -g @emberkit/cli
# or
pnpm add -g @emberkit/cli
```

## Commands

### `emberkit create <name>`

Create a new EmberKit project.

```bash
emberkit create my-app
cd my-app
emberkit dev
```

Options:
- `--no-install` — Skip dependency installation

### `emberkit dev`

Start the development server with HMR.

```bash
emberkit dev
# or with options
emberkit dev --port 3000 --host localhost
```

### `emberkit build`

Build for production.

```bash
emberkit build
```

### `emberkit preview`

Preview the production build locally.

```bash
emberkit preview
```

## Generated Project Structure

```
my-app/
├── emberkit.config.ts
├── vite.config.ts
├── tsconfig.json
├── index.html
└── src/
    ├── index.tsx
    └── routes/
        ├── _layout.tsx
        ├── index.tsx
        └── about.tsx
```

## Requirements

- Node.js >= 18
- pnpm (recommended), npm, or yarn

## License

Apache-2.0
