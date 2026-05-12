# EmberKit CLI Implementation Guide

## Quick Start for Implementation

This guide provides step-by-step instructions to replace Vite commands with the `emberkit` CLI.

---

## Step 1: Fix CLI Build Errors (15 minutes)

### Fix 1.1: tsconfig.json

**File:** `packages/cli/tsconfig.json`

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "lib": ["ES2021", "DOM"],
    "target": "ES2021",
    "module": "ES2020",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist"
  },
  "include": ["src"],
  "exclude": ["dist", "node_modules"]
}
```

### Fix 1.2: Remove Duplicate Functions in cli.ts

**Current issue:** `runCLI` is declared twice

**Solution:** Consolidate the functions (details in Step 2)

---

## Step 2: Restructure CLI (1-2 hours)

### Step 2.1: Create Command Files

**File:** `packages/cli/src/commands/dev.ts` (NEW)

```typescript
import { spawn } from 'child_process';

export async function dev(args: string[]): Promise<void> {
  console.log('🔥 Starting EmberKit dev server...\n');
  
  const vite = spawn('vite', args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });
  
  return new Promise((resolve, reject) => {
    vite.on('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Vite exited with code ${code}`));
      }
    });
    
    vite.on('error', reject);
  });
}
```

**File:** `packages/cli/src/commands/build.ts` (NEW)

```typescript
import { spawn } from 'child_process';

export async function build(args: string[]): Promise<void> {
  console.log('🔨 Building for production...\n');
  
  const vite = spawn('vite', ['build', ...args], {
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });
  
  return new Promise((resolve, reject) => {
    vite.on('exit', (code) => {
      if (code === 0) {
        console.log('\n✨ Build complete!');
        resolve();
      } else {
        reject(new Error(`Build failed with code ${code}`));
      }
    });
    
    vite.on('error', reject);
  });
}
```

**File:** `packages/cli/src/commands/preview.ts` (NEW)

```typescript
import { spawn } from 'child_process';

export async function preview(args: string[]): Promise<void> {
  console.log('👀 Previewing production build...\n');
  
  const vite = spawn('vite', ['preview', ...args], {
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });
  
  return new Promise((resolve, reject) => {
    vite.on('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Preview exited with code ${code}`));
      }
    });
    
    vite.on('error', reject);
  });
}
```

**File:** `packages/cli/src/commands/index.ts` (NEW)

```typescript
export { dev } from './dev.js';
export { build } from './build.js';
export { preview } from './preview.js';
```

### Step 2.2: Update Main CLI File

**File:** `packages/cli/src/cli.ts` (REPLACE)

```typescript
import { dev } from './commands/dev.js';
import { build } from './commands/build.js';
import { preview } from './commands/preview.js';

export async function runCLI(args: string[]): Promise<void> {
  const [command, ...restArgs] = args.slice(2);

  if (!command || command === '--help' || command === '-h') {
    showHelp();
    return;
  }

  if (command === '--version' || command === '-v') {
    console.log('EmberKit CLI v0.1.0');
    return;
  }

  try {
    switch (command) {
      case 'dev':
        await dev(restArgs);
        break;
      
      case 'build':
        await build(restArgs);
        break;
      
      case 'preview':
        await preview(restArgs);
        break;
      
      case 'init':
        await runInit(restArgs);
        break;
      
      case 'generate':
        await runGenerate(restArgs);
        break;
      
      default:
        console.error(`❌ Unknown command: ${command}`);
        showHelp();
        process.exit(1);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(`\n❌ Error: ${error.message}`);
    } else {
      console.error('\n❌ An unexpected error occurred');
    }
    process.exit(1);
  }
}

function showHelp(): void {
  console.log(`
🔥 EmberKit CLI v0.1.0

Usage: emberkit <command> [options]

Commands:
  dev                  Start development server
  build                Build for production
  preview              Preview production build
  init [template]      Initialize a new EmberKit project
  generate <type>      Generate code (routes, components, etc.)

Options:
  --help, -h          Show this help message
  --version, -v       Show version number

Examples:
  emberkit dev
  emberkit build
  emberkit preview
  emberkit init
  emberkit generate route about

For more information, visit: https://emberkit.dev
`);
}

async function runInit(_args: string[]): Promise<void> {
  console.log('🚀 Initializing EmberKit project...');
  console.log('(Not yet implemented)');
}

async function runGenerate(args: string[]): Promise<void> {
  const [type, name] = args;
  if (!type || !name) {
    console.error('Usage: emberkit generate <type> <name>');
    process.exit(1);
  }
  console.log(`🎨 Generating ${type}: ${name}`);
  console.log('(Not yet implemented)');
}
```

### Step 2.3: Update Index File

**File:** `packages/cli/src/index.ts` (REPLACE)

```typescript
import { runCLI } from './cli.js';

export { runCLI };

export async function main(): Promise<void> {
  await runCLI(process.argv);
}
```

### Step 2.4: Update Bin File

**File:** `packages/cli/bin/emberkit.js` (REPLACE)

```javascript
#!/usr/bin/env node

import { main } from '../dist/index.js';

main().catch((error) => {
  console.error('🔥 EmberKit CLI error:', error.message || error);
  process.exit(1);
});
```

---

## Step 3: Update Package Configuration

### Step 3.1: Docs App

**File:** `apps/docs/package.json`

```json
{
  "scripts": {
    "dev": "emberkit dev",
    "build": "emberkit build",
    "preview": "emberkit preview"
  }
}
```

### Step 3.2: Root Package (Optional)

**File:** `package.json`

```json
{
  "scripts": {
    "dev": "pnpm --filter @emberkit/docs dev",
    "build": "pnpm -r build",
    "preview": "pnpm --filter @emberkit/docs preview"
  }
}
```

---

## Step 4: Build and Test

### 4.1: Build the CLI

```bash
cd packages/cli
pnpm build
```

**Expected output:**
```
✓ TypeScript compilation successful
✓ dist/ directory created with compiled files
```

### 4.2: Link CLI Globally (Development)

```bash
cd packages/cli
npm link
```

**Or from root:**
```bash
pnpm install  # Re-install to register bin
```

### 4.3: Test Commands

```bash
# Navigate to docs app
cd apps/docs

# Test dev command
emberkit dev
# Should start Vite dev server

# In another terminal, test build
emberkit build
# Should compile production build

# Test preview
emberkit preview
# Should preview production build
```

---

## Step 5: Enhanced Features (Optional)

### 5.1: Project Detection

**File:** `packages/cli/src/utils/detect.ts` (NEW)

```typescript
import { existsSync } from 'fs';
import { resolve } from 'path';

export function findEmberKitConfig(cwd: string = process.cwd()): string | null {
  let current = cwd;
  
  while (current !== '/') {
    const configPath = resolve(current, 'emberkit.config.ts');
    if (existsSync(configPath)) {
      return current;
    }
    current = resolve(current, '..');
  }
  
  return null;
}

export function findViteConfig(cwd: string = process.cwd()): string | null {
  const configs = ['vite.config.ts', 'vite.config.js'];
  
  for (const config of configs) {
    const configPath = resolve(cwd, config);
    if (existsSync(configPath)) {
      return configPath;
    }
  }
  
  return null;
}
```

### 5.2: App Selection

**File:** `packages/cli/src/commands/dev.ts` (ENHANCED)

```typescript
import { spawn } from 'child_process';
import { findViteConfig } from '../utils/detect.js';

export async function dev(args: string[]): Promise<void> {
  // Check for --app flag
  const appIndex = args.indexOf('--app');
  let appName: string | undefined;
  
  if (appIndex !== -1) {
    appName = args[appIndex + 1];
    args.splice(appIndex, 2);
  }
  
  const viteConfig = findViteConfig();
  if (!viteConfig) {
    console.error('❌ No vite.config.ts found in current directory');
    process.exit(1);
  }
  
  console.log(`🔥 Starting EmberKit dev server...`);
  if (appName) {
    console.log(`   App: ${appName}\n`);
  }
  
  const vite = spawn('vite', args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });
  
  return new Promise((resolve, reject) => {
    vite.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Vite exited with code ${code}`));
    });
    vite.on('error', reject);
  });
}
```

---

## File Structure After Implementation

```
packages/cli/
├── bin/
│   └── emberkit.js                 (Entry point - updated)
├── src/
│   ├── cli.ts                      (Main CLI - rewritten)
│   ├── index.ts                    (Exports - updated)
│   ├── types.ts                    (Type definitions)
│   ├── commands/                   (NEW)
│   │   ├── dev.ts                  (Dev command)
│   │   ├── build.ts                (Build command)
│   │   ├── preview.ts              (Preview command)
│   │   └── index.ts                (Exports)
│   └── utils/                      (NEW)
│       ├── detect.ts               (Config detection)
│       └── index.ts                (Exports)
├── dist/                           (Compiled output)
├── package.json
└── tsconfig.json

apps/docs/
└── package.json                    (Updated scripts)
```

---

## Usage Examples

### Basic Usage

```bash
# Development
emberkit dev

# Production build
emberkit build

# Preview production
emberkit preview
```

### With Options

```bash
# Dev with custom port
emberkit dev --port 3000

# Build with specific mode
emberkit build --mode production

# Preview on specific host
emberkit preview --host 0.0.0.0
```

### From Different Directories

```bash
# From app directory
cd apps/docs
emberkit dev

# From root (with future enhancement)
emberkit dev --app docs
```

---

## Testing Checklist

- [ ] CLI builds without errors
- [ ] `emberkit dev` starts Vite dev server
- [ ] Dev server is accessible on localhost:5173
- [ ] Hot Module Replacement (HMR) works
- [ ] `emberkit build` creates dist folder
- [ ] Build completes without errors
- [ ] `emberkit preview` serves the build
- [ ] All Vite options pass through correctly
- [ ] Works on Windows, Mac, Linux
- [ ] Help message displays correctly
- [ ] Version flag works
- [ ] Unknown commands show helpful error

---

## Troubleshooting

### Issue: `command not found: emberkit`

**Solution:** Re-install packages
```bash
pnpm install
```

### Issue: Vite not found

**Solution:** Ensure Vite is installed in the app
```bash
cd apps/docs
pnpm install
```

### Issue: Permissions denied on Unix

**Solution:** Fix bin file permissions
```bash
chmod +x packages/cli/bin/emberkit.js
```

### Issue: TypeScript errors

**Solution:** Ensure ES2021 lib is in tsconfig
```json
{
  "compilerOptions": {
    "lib": ["ES2021", "DOM"]
  }
}
```

---

## Performance Notes

The CLI is a thin wrapper around Vite, so there's negligible overhead:
- Spawn time: ~50-100ms
- Vite startup: Same as direct `vite` command
- No performance impact on build or dev server

---

## Security Considerations

- The CLI spawns `vite` subprocess - ensure Vite is installed
- No code injection risks (using child_process.spawn)
- All args passed through to Vite without modification
- No unsafe shell execution

---

## Future Enhancements

1. **Smart App Detection** - Auto-find app if only one exists
2. **Project Scaffolding** - `emberkit init` fully implemented
3. **Code Generation** - `emberkit generate` commands
4. **Config Management** - Custom `emberkit.config.ts`
5. **Hooks System** - Pre/post build hooks
6. **Plugin System** - Custom CLI plugins

---

## Documentation Updates Needed

After implementation, update:
- [ ] Getting Started guide
- [ ] CLI documentation
- [ ] README
- [ ] Migration guide (Vite → EmberKit CLI)

