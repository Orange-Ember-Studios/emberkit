# @emberkit/cli

## 1.0.0

### Patch Changes

- Updated dependencies
  - @emberkit/core@0.8.0

## 0.7.3

### Patch Changes

- Declare @emberkit/core dependency so CLI compiles in clean CI installs

## 0.7.2

### Patch Changes

- SSR loaders with hydration sync, CLI render normalization, and Text contrast on dark UI

## 0.7.1

### Patch Changes

- Fix SSR layout wrapping and per-page Open Graph head injection

## 0.7.0

### Minor Changes

- Add SSR route head builder and site config for Open Graph tags

## 0.6.9

### Patch Changes

- Fix TS config loading in CI via esbuild; add esbuild devDep

## 0.6.8

### Patch Changes

- fix: ssr guard for effects, trailing slash route matching
  - Skip createEffect execution during SSR (window undefined check)
  - Make trailing slash optional in SSR route regex matching
  - Prevents 404 flash on index routes and DOM errors in Node

## 0.6.7

### Patch Changes

- SSR production bundle, MDX compile, markdown fences, and test fixes

## 0.6.6

### Patch Changes

- SSR dev middleware and branded CLI dev server

## 0.6.5

### Patch Changes

- Update scaffold dependency ranges for `@emberkit/edge` to match published ^0.2.4.

## 0.6.4

### Patch Changes

- Pin UI to workspace semver for core/icons; refresh CLI template package ranges

## 0.6.3

### Patch Changes

- Bump scaffold package pins to latest @emberkit releases

## 0.6.2

### Patch Changes

- Automate CLI template version sync script

## 0.6.1

## 0.6.1-alpha.12

### Patch Changes

- CLI: eslint flat config, centralize template dependency versions, read version from package.json. Edge/icons: eslint flat config.

## 0.6.1-alpha.11

### Patch Changes

- Update all project templates to use createSignal() API instead of deprecated signal(). This fixes reactivity patterns in SaaS (pricing toggle), Dashboard (sidebar/search/settings), and With-UI templates.

## 0.6.1-alpha.10

### Patch Changes

- Fix blog template dynamic route component signature to correctly receive route params.

## 0.6.1-alpha.9

### Patch Changes

- Fix blog template to follow EmberKit API correctly. Update routing links, signal API examples, and component types.

## 0.6.1-alpha.8

### Patch Changes

- Fix documentation links to point to root domain (https://emberkit.orangeember.com) instead of /docs path.

## 0.6.1-alpha.7

### Patch Changes

- Update all EmberKit documentation URLs from emberkit.dev to the official domain: emberkit.orangeember.com across all templates.

## 0.6.1-alpha.6

### Patch Changes

- Fix counter demo to use correct EmberKit signal API (createSignal) with proper hydration binding (data-ek-bind). Buttons now update the counter correctly.

## 0.6.1-alpha.5

### Patch Changes

- Fix counter display to render the numeric value instead of the signal object.

## 0.6.1-alpha.4

### Patch Changes

- Use solid text-amber-400 color for counter display instead of gradient. Ensures counter number is clearly visible on all screens.

## 0.6.1-alpha.3

### Patch Changes

- Fix counter visibility in basic template. Change gradient colors from white-slate to ember-amber for better contrast on dark background.

## 0.6.1-alpha.2

### Patch Changes

- Refactor with-ui template to use design system components exclusively. Home page now showcases Button, Card, Heading, Text, Badge, Alert components from @emberkit/ui library.

## 0.6.1-alpha.1

### Patch Changes

- Improve with-ui template: fix navbar layout (now horizontal), correct Tailwind theme config, better mobile responsiveness.

## 0.6.1-alpha.0

### Patch Changes

- Share boilerplate via `_shared/base` builders, wire `emberkit generate`, dedupe template formatting, add `.gitignore` to dashboard/api templates, fix `--version` string.

## 0.6.0

### Minor Changes

- Refactored CLI templates:
  - Split templates into individual files for better maintainability
  - Organized project templates into separate directories
  - Improved code generation utilities

## 0.5.3

### Patch Changes

- Improve visual styling of project templates
  - Implement juicy styles (gradients, animations, ambient glow) for basic and with-ui templates
  - Update layout and page designs for a more premium look and feel

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
