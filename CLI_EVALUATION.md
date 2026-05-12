# EmberKit CLI - Feasibility Evaluation: Vite Replacement

## Executive Summary

**Status: ✅ HIGHLY FEASIBLE**

It is absolutely possible and **highly recommended** to replace direct Vite commands with an `emberkit` CLI wrapper similar to Astro. The infrastructure is already in place, and implementation is straightforward.

---

## Current State Analysis

### ✅ What's Already in Place

1. **CLI Package Exists** (`@emberkit/cli`)
   - Located in `packages/cli`
   - Binary entry point: `bin/emberkit.js`
   - Already configured in `package.json` with `"bin": { "emberkit": "./bin/emberkit.js" }`

2. **Basic CLI Structure**
   - Commander.js ready (in dependencies)
   - Inquirer.js ready (for interactive prompts)
   - TypeScript setup with proper compilation

3. **Placeholder Commands**
   - `emberkit init` - Create new projects
   - `emberkit dev` - Development server
   - `emberkit build` - Production build
   - `emberkit generate` - Code generation

### ⚠️ Current Issues (Non-blocking)

1. **Build Errors in CLI**
   - `runCLI` redeclaration (fixable)
   - `replaceAll` compatibility (ES2021 target needed)
   - Unused variables (code cleanup needed)

2. **Commands Not Implemented**
   - Dev/build currently just log "Starting..." messages
   - No actual Vite integration yet

---

## Proposed Implementation Plan

### Phase 1: Fix CLI Build Issues (Quick Win - 30 mins)

```
1. Fix TypeScript errors in packages/cli/src/cli.ts
2. Fix tsconfig.json compiler options
3. Verify CLI builds without errors
```

### Phase 2: Implement Vite Integration (Core Work - 2-3 hours)

#### 2.1 Dev Server Command
```typescript
async function runDev(args: string[]): Promise<void> {
  const { spawn } = await import('child_process');
  const vite = spawn('vite', args, { stdio: 'inherit' });
  vite.on('exit', (code) => process.exit(code ?? 0));
}
```

#### 2.2 Build Command
```typescript
async function runBuild(args: string[]): Promise<void> {
  const { spawn } = await import('child_process');
  const vite = spawn('vite', ['build', ...args], { stdio: 'inherit' });
  vite.on('exit', (code) => process.exit(code ?? 0));
}
```

#### 2.3 Preview Command (Bonus)
```typescript
async function runPreview(args: string[]): Promise<void> {
  const { spawn } = await import('child_process');
  const vite = spawn('vite', ['preview', ...args], { stdio: 'inherit' });
  vite.on('exit', (code) => process.exit(code ?? 0));
}
```

### Phase 3: Smart Project Detection (Enhancement)

Detect `emberkit.config.ts` and locate the target app:

```typescript
function findProjectRoot(): string {
  // Check for emberkit.config.ts in current directory or up the tree
  // Return the app directory (apps/docs, apps/blog, etc.)
}
```

### Phase 4: Multi-App Support (Advanced)

For monorepo with multiple apps:

```bash
emberkit dev                    # Auto-detect if single app
emberkit dev --app docs        # Explicit app selection
emberkit dev apps/docs         # Direct path
```

---

## Architecture Comparison

### Current Setup (App-Level)

```bash
cd apps/docs
pnpm dev      # Runs vite from app's package.json
pnpm build    # Runs vite build
pnpm preview  # Runs vite preview
```

### Proposed Setup (Monorepo Root)

```bash
emberkit dev                   # Smart detection
emberkit dev --app docs       # Explicit selection
emberkit build                # Build current/default app
emberkit build --app blog     # Build specific app
```

### Astro Comparison

```bash
# Astro (what we're emulating)
astro dev      # Start dev server
astro build    # Build for production
astro preview  # Preview prod build

# Our EmberKit (proposed)
emberkit dev   # Start dev server
emberkit build # Build for production
emberkit preview # Preview prod build
```

---

## Implementation Steps

### Step 1: Fix CLI Build

**File:** `packages/cli/tsconfig.json`
```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "lib": ["ES2021", "DOM"],  // Add ES2021
    "target": "ES2021"
  }
}
```

**File:** `packages/cli/src/cli.ts`
```typescript
// Remove duplicate function declarations
// Fix unused variables with underscore prefix
```

### Step 2: Update CLI Commands

**File:** `packages/cli/src/commands/dev.ts` (NEW)
```typescript
import { spawn } from 'child_process';

export async function dev(args: string[]): Promise<void> {
  const vite = spawn('vite', args, {
    stdio: 'inherit',
    shell: true,
  });
  
  vite.on('exit', (code) => process.exit(code ?? 0));
}
```

### Step 3: Update Main CLI File

**File:** `packages/cli/src/cli.ts`
```typescript
import { dev } from './commands/dev.js';
import { build } from './commands/build.js';
import { preview } from './commands/preview.js';

export async function runCLI(args: string[]): Promise<void> {
  const [command, ...restArgs] = args.slice(2);
  
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
    // ... other commands
  }
}
```

### Step 4: Update Bin File

**File:** `packages/cli/bin/emberkit.js`
```javascript
#!/usr/bin/env node
import { runCLI } from '../dist/cli.js';

runCLI(process.argv).catch((error) => {
  console.error('EmberKit CLI error:', error);
  process.exit(1);
});
```

### Step 5: Update Root Package.json

```json
{
  "scripts": {
    "dev": "emberkit dev",
    "build": "emberkit build",
    "preview": "emberkit preview"
  }
}
```

### Step 6: Update App Package.json

```json
{
  "scripts": {
    "dev": "emberkit dev",
    "build": "emberkit build",
    "preview": "emberkit preview"
  }
}
```

---

## File Structure After Implementation

```
packages/cli/
├── bin/
│   └── emberkit.js                 (Entry point)
├── src/
│   ├── cli.ts                      (Main CLI logic)
│   ├── index.ts                    (Exports)
│   └── commands/                   (NEW)
│       ├── dev.ts                  (Dev server)
│       ├── build.ts                (Build production)
│       ├── preview.ts              (Preview build)
│       └── index.ts                (Exports)
├── dist/                           (Compiled output)
├── package.json
└── tsconfig.json
```

---

## Development Workflow After Implementation

### For App Developers

```bash
# Navigate to app directory
cd apps/docs

# Use familiar commands
emberkit dev        # Start dev server
emberkit build      # Build for production
emberkit preview    # Preview prod build

# Or from monorepo root
emberkit dev --app docs
```

### For Monorepo Maintainers

```bash
# From root - builds all apps
pnpm build          # Builds all packages and apps

# Or individual commands
emberkit build --app docs
emberkit build --app blog
```

---

## Dependencies Required

Current dependencies in `@emberkit/cli`:
- ✅ `commander` (v11.1.0) - CLI framework
- ✅ `inquirer` (v9.2.0) - Interactive prompts

Additional (optional):
- `chalk` - Colored output (nice-to-have)
- `ora` - Progress spinners (nice-to-have)

---

## Benefits of This Approach

### 1. **Consistency with Astro/Next.js/Nuxt**
```bash
# Familiar API for developers
emberkit dev
emberkit build
emberkit preview
```

### 2. **Abstraction Layer**
- Hide Vite complexity
- Easy to swap build tools in future
- Add custom pre/post-hooks

### 3. **Framework Features**
- Route generation
- Component scaffolding
- Project initialization
- All through one command

### 4. **Monorepo Support**
- Handle multiple apps seamlessly
- Environment-aware builds
- Shared CLI for consistency

### 5. **Better Error Messages**
- Custom error handling
- Helpful suggestions
- Branded output

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Vite API changes | Low | Medium | Version lock, update notice |
| Windows compatibility | Low | Medium | Test on Windows, use cross-platform packages |
| Node version conflicts | Low | Medium | Document min Node version |
| Subprocess spawning issues | Low | Low | Use proper stream handling |

---

## Testing Strategy

### Unit Tests
- Command parsing
- Project detection
- Argument forwarding

### Integration Tests
- Full `emberkit dev` flow
- Full `emberkit build` flow
- Multi-app scenarios

### Manual Testing
- Windows, Mac, Linux
- With/without existing node_modules
- Different directory structures

---

## Timeline Estimate

| Phase | Task | Estimate | Status |
|-------|------|----------|--------|
| 1 | Fix CLI build errors | 30 min | Ready |
| 2 | Implement dev/build commands | 1.5 hours | Ready |
| 3 | Smart project detection | 1 hour | Optional |
| 4 | Multi-app support | 1.5 hours | Optional |
| 5 | Testing & documentation | 1 hour | Ready |
| **Total** | | **~4-5 hours** | |

---

## Migration Path

### Current (Today)
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

### Phase 1 (Immediate)
```json
{
  "scripts": {
    "dev": "emberkit dev",
    "build": "emberkit build",
    "preview": "emberkit preview"
  }
}
```

### Phase 2 (Future)
```bash
# At root level
pnpm dev           # Auto-detects or prompts for app
pnpm build         # Builds all or specific app
```

---

## Recommendation

**Proceed with implementation.** The benefits far outweigh the effort, and the infrastructure is already in place.

### Suggested Priority

1. **Immediate** - Fix CLI build, implement dev/build (2-3 hours)
2. **Soon** - Add project detection (1 hour)
3. **Later** - Polish, testing, multi-app support (2-3 hours)

---

## Examples After Implementation

### Basic Usage
```bash
# From app directory
cd apps/docs
emberkit dev
# Starts Vite with proper config

# From root
emberkit dev --app docs
```

### Advanced Usage
```bash
# Build specific app
emberkit build --app docs

# Preview build
emberkit preview

# Generate routes
emberkit generate route about

# Create new component
emberkit generate component Header
```

---

## Comparison: Before & After

### Before
```bash
cd apps/docs
npm run dev    # Runs vite
npm run build  # Runs vite build
```

### After
```bash
cd apps/docs
npm run dev    # Runs emberkit dev → vite
npm run build  # Runs emberkit build → vite build

# OR from root
emberkit dev --app docs
```

**✨ Better DX, consistent with industry standards, framework-level control**

---

## Open Questions Resolved

| Question | Answer |
|----------|--------|
| Is it possible? | ✅ Yes, absolutely |
| Is it worth it? | ✅ Yes, high impact |
| How long? | 2-5 hours depending on scope |
| Complexity? | Low-Medium |
| Breaking changes? | No, backward compatible |

---

## Next Steps

1. ✅ **Approved** - Proceed with CLI implementation
2. **Quick fix** - Resolve TypeScript errors in CLI
3. **Core implementation** - Add vite spawning to dev/build
4. **Testing** - Verify across platforms
5. **Documentation** - Update CLI docs and getting started
6. **Release** - Include in next version with migration guide

