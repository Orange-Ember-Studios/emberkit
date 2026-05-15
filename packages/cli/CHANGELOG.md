# @emberkit/cli

## 0.5.2

### Patch Changes

- Fix require() not defined error in ESM environment
  - Convert all require() calls to ES module imports in filesystem utils
  - Fixes crash when installing dependencies after project creation

## 0.5.1

### Patch Changes

- Fix --template flag parsing and add interactive wizard for create command
  - Add --template / -t flag parsing (was previously ignored)
  - Add interactive prompts when no project name is provided
  - Users can now select templates via terminal wizard
  - Add detailed help text for create command

## 0.5.0

### Minor Changes

- Add new project templates and fix template signatures
  - Add 5 new project templates: minimal, blog, saas, dashboard, api
  - Fix code generation templates to use RouteComponent instead of FC
  - Fix index template with virtual:emberkit-routes import and try/catch
  - Extract project templates to separate files for better maintainability
  - Remove dead starter.ts template
  - All templates now include correct render() signature with routes config

## 0.4.0

### Minor Changes

- Update templates: basic and with-ui now use Tailwind v4, fix package manager detection to prefer pnpm

## 0.3.1

### Patch Changes

- Update with-ui template to use Tailwind v4 syntax

## 0.3.0

### Minor Changes

- Add with-ui template with @emberkit/ui and Tailwind support

## 0.2.5

### Patch Changes

- 2467e81: Add typecheck, lint, and formatting support to all packages.

## 0.2.1-alpha.0

### Patch Changes

- Add typecheck, lint, and formatting support to all packages.

## 0.1.2

### Patch Changes

- 34d4667: First Release
- Initial stable release of all EmberKit packages.

## 0.1.2-alpha.0

### Patch Changes

- First Release

## 0.1.1

### Patch Changes

- First Package Release
