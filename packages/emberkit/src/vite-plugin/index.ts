import type { Plugin } from 'vite';
import type { EmberKitPluginOptions, EmberKitMode } from './types.js';
import { DEFAULT_CONFIG } from './types.js';

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

  return {
    name: 'emberkit:vite-plugin',
    enforce: 'pre',

    config() {
      return {
        resolve: {
          alias: {
            '@emberkit/core': new URL('./src/index.ts', import.meta.url).pathname,
          },
        },
        esbuild: {
          jsxImportSource: '@emberkit/core',
        },
        optimizeDeps: {
          include: ['@emberkit/core'],
        },
      };
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
        return `export const routes = [];`;
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
      createElement('div', {
        className: 'md-frontmatter',
        children: ${JSON.stringify(JSON.stringify(frontmatter))}
      }),
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
    return `<pre><code class="language-${lang}">${escaped}</code></pre>`;
  });
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