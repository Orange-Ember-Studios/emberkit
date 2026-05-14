import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Plugin } from 'vite';
import { emberkitVitePlugin } from '../index.js';

describe('emberkitVitePlugin', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  it('should create a plugin with the correct name', () => {
    const plugin = emberkitVitePlugin();
    expect(plugin.name).toBe('emberkit:vite-plugin');
  });

  it('should enforce pre order', () => {
    const plugin = emberkitVitePlugin();
    expect(plugin.enforce).toBe('pre');
  });

  it('should return a valid plugin object', () => {
    const plugin = emberkitVitePlugin();
    expect(plugin).toBeTypeOf('object');
    expect(plugin).toHaveProperty('name');
    expect(plugin).toHaveProperty('enforce');
    expect(plugin).toHaveProperty('config');
    expect(plugin).toHaveProperty('resolveId');
    expect(plugin).toHaveProperty('load');
    expect(plugin).toHaveProperty('transform');
  });

  it('should use default options when none provided', () => {
    const plugin = emberkitVitePlugin();
    expect(plugin).toBeTypeOf('object');
  });

  it('should accept custom options', () => {
    const plugin = emberkitVitePlugin({
      mode: 'ssr',
      routeDir: 'custom-routes',
      outputDir: 'custom-dist',
    });
    expect(plugin.name).toBe('emberkit:vite-plugin');
  });

  it('should have config function that returns vite config', async () => {
    const plugin = emberkitVitePlugin() as Plugin;
    expect(plugin.config).toBeTypeOf('function');
  });

  it('should have resolveId function for virtual modules', async () => {
    const plugin = emberkitVitePlugin() as Plugin;
    expect(plugin.resolveId).toBeTypeOf('function');
    const configId = (plugin.resolveId as (id: string) => string | null)('virtual:emberkit-config');
    const routesId = (plugin.resolveId as (id: string) => string | null)('virtual:emberkit-routes');
    expect(configId).toBe('virtual:emberkit-config');
    expect(routesId).toBe('virtual:emberkit-routes');
    expect((plugin.resolveId as (id: string) => string | null)('other')).toBeNull();
  });

  it('should have load function that returns virtual module content', async () => {
    const plugin = emberkitVitePlugin({ mode: 'ssr' }) as Plugin;
    expect(plugin.load).toBeTypeOf('function');
    const configLoad = (plugin.load as (id: string) => string | null)('virtual:emberkit-config');
    expect(configLoad).not.toBeNull();
    expect(typeof configLoad).toBe('string');
    expect(configLoad).toContain('"ssr"');
  });

  it('should return null for unknown module IDs in load', async () => {
    const plugin = emberkitVitePlugin() as Plugin;
    const unknownLoad = (plugin.load as (id: string) => string | null)('unknown:module');
    expect(unknownLoad).toBeNull();
  });

  it('should preserve backticks inside code blocks', async () => {
    const plugin = emberkitVitePlugin() as Plugin;
    const transform = plugin.transform as (code: string, id: string) => { code: string } | null;

    const markdownContent = `---
title: Test
---

\`\`\`tsx
function Button({ children, variant = 'primary' }: { children: unknown; variant?: string }) {
  return (
    <button className={\`btn btn-\${variant}\`}>
      {children}
    </button>
  );
}
\`\`\`

Use \`console.log()\` for debugging.
`;

    const result = transform(markdownContent, '/test.md');
    expect(result).not.toBeNull();

    // Extract the defaultContent string from the result
    const contentMatch = result!.code.match(/const defaultContent = "([\s\S]*?)";/);
    expect(contentMatch).not.toBeNull();
    const html = contentMatch![1].replace(/\\"/g, '"').replace(/\\n/g, '\n').replace(/\\\\/g, '\\');

    console.log('=== HTML around template literal ===');
    const idx = html.indexOf('btn btn-');
    if (idx !== -1) {
      console.log(html.substring(idx - 100, idx + 100));
    }
    console.log('=== END ===');

    // Backticks in code blocks should be preserved as literal text
    expect(html).toContain('`btn btn-${variant}`');

    // Inline code outside code blocks should still be processed
    expect(html).toContain('<code>console.log()</code>');
  });

  it('should ignore all markdown tags inside code blocks', async () => {
    const plugin = emberkitVitePlugin() as Plugin;
    const transform = plugin.transform as (code: string, id: string) => { code: string } | null;

    const markdownContent = `---
title: Test
---

# This heading should be processed

\`\`\`md
# This heading should NOT be processed
## Nor this

**This bold should NOT be processed**
*This italic should NOT be processed*

- This list should NOT be processed

[This link should NOT be processed](https://example.com)

> This blockquote should NOT be processed

\`This inline code should NOT be processed\`
\`\`\`

This text after code block **should be processed** as markdown.
`;

    const result = transform(markdownContent, '/test.md');
    expect(result).not.toBeNull();

    // Extract the defaultContent string from the result
    const contentMatch = result!.code.match(/const defaultContent = "([\s\S]*?)";/);
    expect(contentMatch).not.toBeNull();
    const html = contentMatch![1].replace(/\\"/g, '"').replace(/\\n/g, '\n').replace(/\\\\/g, '\\');

    // Headings outside code blocks should be processed
    expect(html).toContain('<h1 id="this-heading-should-be-processed">');

    // Text after code block should be processed
    expect(html).toContain('<strong>should be processed</strong>');

    // Inside code block: headings should NOT be processed
    expect(html).toContain('# This heading should NOT be processed');
    expect(html).toContain('## Nor this');

    // Inside code block: bold/italic should NOT be processed
    expect(html).toContain('**This bold should NOT be processed**');
    expect(html).toContain('*This italic should NOT be processed*');

    // Inside code block: lists should NOT be processed
    expect(html).toContain('- This list should NOT be processed');

    // Inside code block: links should NOT be processed
    expect(html).toContain('[This link should NOT be processed](https://example.com)');

    // Inside code block: blockquotes should NOT be processed
    expect(html).toContain('&gt; This blockquote should NOT be processed');

    // Inside code block: backticks should NOT be processed as inline code
    expect(html).toContain('`This inline code should NOT be processed`');
  });
});
