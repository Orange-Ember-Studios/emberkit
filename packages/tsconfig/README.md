# @emberkit/tsconfig

Shared TypeScript configuration for EmberKit projects.

## Install

```bash
npm install -D @emberkit/tsconfig
# or
pnpm add -D @emberkit/tsconfig
```

## Usage

Extend the base config in your `tsconfig.json`:

```json
{
  "extends": "@emberkit/tsconfig/base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"]
}
```

## What's Included

The base config sets:

- `target`: ES2022
- `module`: ESNext
- `moduleResolution`: bundler
- `jsx`: react-jsx
- `jsxImportSource`: @emberkit/core
- `strict`: true
- `esModuleInterop`: true
- `skipLibCheck`: true
- `verbatimModuleSyntax`: true

## License

Apache-2.0
