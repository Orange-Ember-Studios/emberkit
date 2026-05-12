import type { Plugin } from 'vite';
import type { EmberKitPluginOptions, EmberKitMode } from './types.js';
import { DEFAULT_CONFIG } from './types.js';
import { readdirSync, statSync } from 'node:fs';
import { join, relative, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const VIRTUAL_EMBERKIT_CONFIG = 'virtual:emberkit-config';
const VIRTUAL_EMBERKIT_ROUTES = 'virtual:emberkit-routes';

function resolveConfig(userOptions: EmberKitPluginOptions = {}) {
  return {
    ...DEFAULT_CONFIG,
    ...userOptions,
    markdown: { ...DEFAULT_CONFIG.markdown, ...userOptions.markdown },
  };
}

export function emberkitVitePlugin(userOptions: EmberKitPluginOptions = {}): Plugin {
  const options = resolveConfig(userOptions);
  let routesCode = `export const routes = [];`;

  return {
    name: 'emberkit:vite-plugin',
    enforce: 'pre',

    config() {
      const pkgRoot = resolve(__dirname, '..', '..');
      const srcDir = join(pkgRoot, 'src');

      return {
        resolve: {
          alias: {
            '@emberkit/core': srcDir,
          },
        },
        esbuild: {
          jsxImportSource: '@emberkit/core',
        },
        optimizeDeps: {
          exclude: ['@emberkit/core'],
        },
      };
    },

    configResolved(config) {
      const root = config.root;
      const routeDir = join(root, options.routeDir ?? 'src/routes');
      const files = scanRouteFiles(routeDir);
      routesCode = generateRoutesCode(files, routeDir);
    },

    resolveId(id: string) {
      if (id === VIRTUAL_EMBERKIT_CONFIG) {
        return VIRTUAL_EMBERKIT_CONFIG;
      }
      if (id === VIRTUAL_EMBERKIT_ROUTES) {
        return VIRTUAL_EMBERKIT_ROUTES;
      }
      return null;
    },

    load(id: string) {
      if (id === VIRTUAL_EMBERKIT_CONFIG) {
        return `export const config = ${JSON.stringify(options)};`;
      }
      if (id === VIRTUAL_EMBERKIT_ROUTES) {
        return routesCode;
      }
      return null;
    },

    transform(code: string, id: string) {
      if (id.includes('\u0000')) return null;

      const ext = id.split('.').pop() ?? '';
      const isMD = ext === 'md';
      const isMDX = ext === 'mdx';

      if (!isMD && !isMDX) {
        if (ext !== 'tsx' && ext !== 'ts' && ext !== 'jsx' && ext !== 'js') {
          return null;
        }
        return null;
      }

      if (isMD || isMDX) {
        return transformMarkdownToJSX(code, id, options);
      }

      return code;
    },
  };
}

function transformMarkdownToJSX(
  code: string,
  id: string,
  options: ReturnType<typeof resolveConfig>,
): { code: string; map?: string } | null {
  const frontmatterMatch = code.match(/^---\n([\s\S]*?)\n---\n?/);

  let frontmatter: Record<string, unknown> = {};
  let content = code;

  if (frontmatterMatch) {
    const fmContent = frontmatterMatch[1];
    frontmatter = parseFrontmatter(fmContent);
    content = code.slice(frontmatterMatch[0].length);
  }

  const jsxContent = markdownToJSX(content, options.markdown);

  const exportLines: string[] = [];

  if (frontmatter.title) {
    exportLines.push(`export const title = ${JSON.stringify(frontmatter.title)};`);
  }
  if (frontmatter.description) {
    exportLines.push(`export const description = ${JSON.stringify(frontmatter.description)};`);
  }
  if (frontmatter.author) {
    exportLines.push(`export const author = ${JSON.stringify(frontmatter.author)};`);
  }
  if (frontmatter.date) {
    exportLines.push(`export const date = ${JSON.stringify(frontmatter.date)};`);
  }

  exportLines.push(`export const metadata = ${JSON.stringify(frontmatter)};`);

  const componentCode = `
import { createElement } from '@emberkit/core';

${exportLines.join('\n')}

const defaultContent = ${JSON.stringify(jsxContent)};

function MDContent(props) {
  return createElement('div', {
    className: 'md-content',
    dangerouslySetInnerHTML: { __html: defaultContent }
  });
}

export default function MDComponent(props) {
  return createElement('article', {
    className: 'md-doc',
    'data-file': ${JSON.stringify(id)},
    children: [
      createElement(MDContent, props)
    ]
  });
}
`;

  return { code: componentCode };
}

function parseFrontmatter(content: string): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  const lines = content.split('\n');

  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;

    const key = line.slice(0, colonIndex).trim();
    let value: unknown = line.slice(colonIndex + 1).trim();

    if (value === 'true') value = true;
    else if (value === 'false') value = false;
    else if (!isNaN(Number(value))) value = Number(value);
    else if (typeof value === 'string' && value.startsWith('[')) {
      value = value.replace(/[\[\]]/g, '').split(',').map((s) => s.trim());
    }

    result[key] = value;
  }

  return result;
}

function markdownToJSX(
  content: string,
  options: { gfm?: boolean; breaks?: boolean; html?: boolean; tables?: boolean },
): string {
  let html = content;

  html = processHeadings(html);
  html = processCodeBlocks(html);
  html = processTables(html);
  html = processLinks(html);
  html = processImages(html);
  html = processLists(html);
  html = processBlockquotes(html);
  html = processEmphasis(html);
  html = processParagraphs(html, options.breaks);

  return html;
}

function processHeadings(html: string): string {
  return html.replace(/^(#{1,6})\s+(.+)$/gm, (_match, hashes, text) => {
    const id = text.toLowerCase().replace(/[^\w]+/g, '-');
    return `<h${hashes.length} id="${id}">${text}</h${hashes.length}>`;
  });
}

function processCodeBlocks(html: string): string {
  return html.replace(/```(\w*)\n([\s\S]*?)```/g, (_match, lang, code) => {
    const escaped = code.trim().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const langAttr = lang ? ` data-lang="${lang}"` : '';
    return `<pre${langAttr}><code class="language-${lang}">${escaped}</code></pre>`;
  });
}

function processTables(html: string): string {
  const lines = html.split('\n');
  const result: string[] = [];
  let i = 0;

  while (i < lines.length) {
    // Check if this line and the next look like a table
    if (i + 1 < lines.length &&
        lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|') &&
        lines[i + 1].trim().match(/^\|[\s\-:|]+\|$/)) {

      // Parse header row
      const headerCells = lines[i].trim().split('|').filter(c => c.trim() !== '');
      result.push('<table>');
      result.push('<thead><tr>');
      for (const cell of headerCells) {
        result.push(`<th>${cell.trim()}</th>`);
      }
      result.push('</tr></thead>');
      result.push('<tbody>');

      // Skip separator row
      i += 2;

      // Parse data rows
      while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
        const cells = lines[i].trim().split('|').filter(c => c.trim() !== '');
        result.push('<tr>');
        for (const cell of cells) {
          result.push(`<td>${cell.trim()}</td>`);
        }
        result.push('</tr>');
        i++;
      }

      result.push('</tbody>');
      result.push('</table>');
    } else {
      result.push(lines[i]);
      i++;
    }
  }

  return result.join('\n');
}

function processLinks(html: string): string {
  return html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, text, href) => {
    return `<a href="${href}">${text}</a>`;
  });
}

function processImages(html: string): string {
  return html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_match, alt, src) => {
    return `<img src="${src}" alt="${alt}" loading="lazy">`;
  });
}

function processLists(html: string): string {
  return html
    .replace(/^- \[([ x])\]\s+(.+)/gm, (_match, checked, text) => {
      const isChecked = checked === 'x';
      return `<li class="task"><input type="checkbox" ${isChecked ? 'checked' : ''} disabled>${text}</li>`;
    })
    .replace(/^[-*+]\s+(.+)/gm, '<li>$1</li>')
    .replace(/^\d+\.\s+(.+)/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, (match) => {
      if (match.includes('class="task"')) {
        return `<ul class="task-list">${match}</ul>`;
      }
      return `<ul>${match}</ul>`;
    });
}

function processBlockquotes(html: string): string {
  return html.replace(/^>\s+(.+)/gm, '<blockquote>$1</blockquote>');
}

function processEmphasis(html: string): string {
  return html
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>');
}

function processParagraphs(html: string, breaks?: boolean): string {
  const paragraphs = html.split('\n\n');

  return paragraphs
    .map((p) => {
      p = p.trim();
      if (!p) return '';

      if (p.startsWith('<h') || p.startsWith('<ul') || p.startsWith('<ol') ||
          p.startsWith('<pre') || p.startsWith('<blockquote') || p.startsWith('<table')) {
        return p;
      }

      p = p.replace(/\n/g, breaks ? '<br>' : ' ');

      return `<p>${p}</p>`;
    })
    .join('\n');
}

export type { EmberKitPluginOptions, EmberKitMode };

function scanRouteFiles(dir: string): string[] {
  const files: string[] = [];
  const extensions = new Set(['tsx', 'ts', 'jsx', 'js', 'md', 'mdx']);

  function walk(currentDir: string) {
    let entries;
    try {
      entries = readdirSync(currentDir);
    } catch {
      return;
    }

    for (const entry of entries) {
      const fullPath = join(currentDir, entry);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        walk(fullPath);
      } else {
        const ext = entry.split('.').pop() ?? '';
        if (extensions.has(ext)) {
          files.push(fullPath);
        }
      }
    }
  }

  walk(dir);
  return files;
}

function generateRoutesCode(files: string[], routeDir: string): string {
  const routeEntries: string[] = [];

  for (const file of files) {
    const relativePath = relative(routeDir, file).replace(/\\/g, '/');
    const ext = file.split('.').pop() ?? '';
    const isMarkdown = ext === 'md' || ext === 'mdx';

    // Skip special files
    if (relativePath.includes('_layout') || relativePath.includes('_error') || relativePath.includes('_loading')) {
      continue;
    }
    // Skip API routes
    if (relativePath.startsWith('_api/') || relativePath.includes('/_api/')) {
      continue;
    }

    let routePath = relativePath
      .replace(/\.(tsx|ts|jsx|js|md|mdx)$/, '')
      .replace(/\/index$/, '')
      .replace(/\[\.\.\.(\w+)\]/g, ':$1*')
      .replace(/\[([^\]]+)\]/g, ':$1');

    if (routePath === '') routePath = '/';

    const importPath = file.replace(/\\/g, '/');

    if (isMarkdown) {
      routeEntries.push(`  { path: ${JSON.stringify('/' + routePath)}, component: () => import(${JSON.stringify(importPath)}), isMarkdown: true }`);
    } else {
      routeEntries.push(`  { path: ${JSON.stringify('/' + routePath)}, component: () => import(${JSON.stringify(importPath)}) }`);
    }
  }

  return `export const routes = [\n${routeEntries.join(',\n')}\n];`;
}