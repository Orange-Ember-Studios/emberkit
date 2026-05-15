import type { Plugin } from 'vite';
import type { EmberKitPluginOptions, EmberKitMode } from './types.js';
import { DEFAULT_CONFIG } from './types.js';
import { readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { compile } from '@mdx-js/mdx';
import remarkGfm from 'remark-gfm';
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

    async config() {
      const pkgRoot = resolve(__dirname, '..', '..');
      const srcDir = join(pkgRoot, 'src');

      const plugins: Plugin[] = [];
      if (options.compression?.gzip) {
        const { compression } = await import('vite-plugin-compression2');
        plugins.push(compression({ algorithm: 'gzip' } as any));
      }
      if (options.compression?.brotli) {
        const { compression } = await import('vite-plugin-compression2');
        plugins.push(compression({ algorithm: 'brotliCompress' } as any));
      }

      const isWorkspace = existsSync(join(pkgRoot, 'src', 'index.ts'));

      return {
        plugins,
        resolve: {
          alias: isWorkspace ? {
            '@emberkit/core': srcDir,
          } : {},
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

      if (isMDX) {
        return transformMDX(code, id);
      }

      if (isMD) {
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

async function transformMDX(code: string, id: string): Promise<{ code: string } | null> {
  const frontmatterMatch = code.match(/^---\n([\s\S]*?)\n---\n?/);

  let frontmatter: Record<string, unknown> = {};
  let content = code;

  if (frontmatterMatch) {
    const fmContent = frontmatterMatch[1];
    frontmatter = parseFrontmatter(fmContent);
    content = code.slice(frontmatterMatch[0].length);
  }

  // Extract code blocks before MDX compilation to preserve syntax
  const codeBlocks: { html: string; index: number }[] = [];
  const processedContent = content.replace(
    /```(\w*)\n([\s\S]*?)```/g,
    (_match, lang, blockCode) => {
      const html = renderCodeBlock(lang, blockCode);
      codeBlocks.push({ html, index: codeBlocks.length });
      return `<CodeBlock_${codeBlocks.length - 1} />`;
    },
  );

  const compiled = await compile(processedContent, {
    outputFormat: 'program',
    development: false,
    jsx: false,
    jsxImportSource: '@emberkit/core',
    remarkPlugins: [remarkGfm],
  });

  let compiledCode = String(compiled);

  // Build code block component definitions
  const codeBlockComponents = codeBlocks
    .map((block) => {
      const escapedHtml = JSON.stringify(block.html);
      return `function CodeBlock_${block.index}() {
  return createElement('div', { 
    dangerouslySetInnerHTML: { __html: ${escapedHtml} }
  });
}`;
    })
    .join('\n\n');

  // Rename the MDX default export so we can wrap it
  compiledCode = compiledCode.replace('export default function MDXContent', 'function _MDXContent');

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

  // Build components override object
  const componentsOverride =
    codeBlocks.length > 0
      ? `
const _codeBlockComponents = {
  ${codeBlocks.map((b) => `CodeBlock_${b.index}`).join(', ')}
};
`
      : '';

  const componentCode = `
import { createElement } from '@emberkit/core';

${exportLines.join('\n')}

${codeBlockComponents}
${componentsOverride}

${compiledCode}

function _GfmTable(props) {
  return createElement('div', { className: 'table-wrapper' },
    createElement('table', { className: 'gfm-table' }, props.children)
  );
}

function _GfmUl(props) {
  return createElement('ul', { className: 'task-list' }, props.children);
}

function _GfmLi(props) {
  return createElement('li', { className: 'task-item' }, props.children);
}

function _GfmDel(props) {
  return createElement('span', { className: 'strikethrough' }, props.children);
}

function _GfmSup(props) {
  return createElement('span', { className: 'footnote-ref' }, props.children);
}

export default function MDXComponent(props) {
  const components = {
    ...(props.components || {}),
    ${codeBlocks.map((b) => `CodeBlock_${b.index}`).join(', ')}
  };
  
  return createElement('div', {
    className: 'md-content md-doc',
    'data-file': ${JSON.stringify(id)},
    children: createElement(_MDXContent, { 
      ...props, 
      components: {
        ...components,
        table: _GfmTable,
        ul: _GfmUl,
        li: _GfmLi,
        del: _GfmDel,
        sup: _GfmSup,
      }
    })
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
      value = value
        .replace(/[\[\]]/g, '')
        .split(',')
        .map((s) => s.trim());
    }

    result[key] = value;
  }

  return result;
}

function markdownToJSX(
  content: string,
  options: { gfm?: boolean; breaks?: boolean; html?: boolean; tables?: boolean },
): string {
  // Step 1: Extract all fenced code blocks before any markdown processing
  const codeBlocks: string[] = [];
  let html = content.replace(/```(\w*)\n([\s\S]*?)```/g, (_match, lang, code) => {
    codeBlocks.push(renderCodeBlock(lang, code));
    return `\n__CODE_BLOCK_${codeBlocks.length - 1}__\n`;
  });

  // Step 2: Process all other markdown (no backticks in code blocks to interfere)
  html = processHeadings(html);
  html = processHorizontalRules(html);
  html = processTables(html);
  html = processImages(html);
  html = processLinks(html);
  html = processLists(html);
  html = processBlockquotes(html);
  html = processEmphasis(html);
  html = processParagraphs(html, options.breaks);

  // Step 3: Restore code blocks
  html = html.replace(/__CODE_BLOCK_(\d+)__/g, (_, index) => codeBlocks[Number(index)]);

  return html;
}

function processHeadings(html: string): string {
  return html.replace(/^(#{1,6})\s+(.+)$/gm, (_match, hashes, text) => {
    const id = text.toLowerCase().replace(/[^\w]+/g, '-');
    return `<h${hashes.length} id="${id}">${text}</h${hashes.length}>`;
  });
}

function renderCodeBlock(lang: string, code: string): string {
  let highlighted = code.trim();

  if (
    lang === 'ts' ||
    lang === 'tsx' ||
    lang === 'js' ||
    lang === 'jsx' ||
    lang === 'typescript' ||
    lang === 'javascript'
  ) {
    highlighted = highlightTS(highlighted);
  } else if (lang === 'bash' || lang === 'sh' || lang === 'shell') {
    highlighted = highlightBash(highlighted);
  } else if (lang === 'json') {
    highlighted = highlightJSON(highlighted);
  } else {
    highlighted = escapeHtml(highlighted);
  }

  const langAttr = lang ? ` data-lang="${lang}"` : '';
  return `<pre${langAttr}><button class="copy-btn" onclick="(async()=>{await navigator.clipboard.writeText(this.closest('pre').querySelector('code').textContent);this.textContent='Copied!';setTimeout(()=>this.textContent='Copy',1500)})()"><svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"9\" y=\"9\" width=\"13\" height=\"13\" rx=\"2\" ry=\"2\"/><path d=\"M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1\"/></svg> Copy</button><code class="language-${lang}">${highlighted}</code></pre>`;
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function highlightTS(code: string): string {
  const tokens: string[] = [];
  let remaining = code;

  const controlFlow = new Set([
    'if',
    'else',
    'for',
    'while',
    'do',
    'switch',
    'case',
    'break',
    'continue',
    'return',
    'throw',
    'try',
    'catch',
    'finally',
  ]);
  const declarations = new Set([
    'import',
    'export',
    'from',
    'const',
    'let',
    'var',
    'function',
    'class',
    'extends',
    'super',
    'enum',
    'type',
    'interface',
    'module',
    'namespace',
    'declare',
    'new',
    'delete',
    'typeof',
    'instanceof',
    'in',
    'of',
    'default',
    'as',
    'satisfies',
    'keyof',
    'infer',
    'is',
    'asserts',
    'abstract',
    'implements',
  ]);
  const modifiers = new Set([
    'readonly',
    'public',
    'private',
    'protected',
    'static',
    'abstract',
    'async',
    'override',
  ]);
  const literals = new Set(['true', 'false', 'null', 'undefined', 'this']);
  const builtins = new Set([
    'console',
    'document',
    'window',
    'Math',
    'JSON',
    'Array',
    'Object',
    'String',
    'Number',
    'Boolean',
    'Promise',
    'Map',
    'Set',
    'RegExp',
    'Date',
    'Error',
    'Symbol',
    'Record',
    'Partial',
    'Required',
    'Pick',
    'Omit',
    'Exclude',
    'Extract',
    'ReturnType',
    'Parameters',
    'JSX',
    'FC',
    'Props',
    'State',
    'Effect',
    'Memo',
    'Signal',
    'Ref',
    'Context',
    'React',
  ]);

  while (remaining.length > 0) {
    let m: RegExpMatchArray | null;

    // Multi-line comment
    m = remaining.match(/^\/\*[\s\S]*?\*\//);
    if (m) {
      tokens.push(`<span class="cm">${escapeHtml(m[0])}</span>`);
      remaining = remaining.slice(m[0].length);
      continue;
    }

    // Single-line comment
    m = remaining.match(/^\/\/.*/);
    if (m) {
      tokens.push(`<span class="cm">${escapeHtml(m[0])}</span>`);
      remaining = remaining.slice(m[0].length);
      continue;
    }

    // Template literal with interpolations
    m = remaining.match(/^`/);
    if (m) {
      let tmpl = '`';
      remaining = remaining.slice(1);
      while (remaining.length > 0) {
        if (remaining[0] === '`') {
          tmpl += '`';
          remaining = remaining.slice(1);
          break;
        }
        if (remaining.startsWith('\\')) {
          tmpl += remaining.slice(0, 2);
          remaining = remaining.slice(2);
          continue;
        }
        if (remaining.startsWith('${')) {
          tmpl += '${';
          remaining = remaining.slice(2);
          // Parse interpolation until matching }
          let depth = 1;
          let expr = '';
          while (remaining.length > 0 && depth > 0) {
            if (remaining[0] === '{') depth++;
            if (remaining[0] === '}') {
              depth--;
              if (depth === 0) {
                remaining = remaining.slice(1);
                break;
              }
            }
            expr += remaining[0];
            remaining = remaining.slice(1);
          }
          tmpl += highlightInlineExpr(expr) + '}';
          continue;
        }
        tmpl += remaining[0];
        remaining = remaining.slice(1);
      }
      tokens.push(`<span class="str">${tmpl}</span>`);
      continue;
    }

    // String (single, double)
    m = remaining.match(/^('[^']*'|"[^"]*")/);
    if (m) {
      tokens.push(`<span class="str">${escapeHtml(m[0])}</span>`);
      remaining = remaining.slice(m[0].length);
      continue;
    }

    // Arrow function =>
    m = remaining.match(/^=>/);
    if (m) {
      tokens.push(`<span class="op">=&gt;</span>`);
      remaining = remaining.slice(2);
      continue;
    }

    // JSX closing tag </Component>
    m = remaining.match(/^(<\/)([A-Za-z][\w.]*)(>)/);
    if (m) {
      tokens.push(`${escapeHtml(m[1])}<span class="tag">${m[2]}</span>${escapeHtml(m[3])}`);
      remaining = remaining.slice(m[0].length);
      continue;
    }

    // JSX self-closing or opening tag <Component or <div
    m = remaining.match(/^(<)([A-Za-z][\w.]*)/);
    if (m) {
      tokens.push(`${escapeHtml(m[1])}<span class="tag">${m[2]}</span>`);
      remaining = remaining.slice(m[0].length);
      continue;
    }

    // JSX prop name (word followed by =)
    m = remaining.match(/^([a-zA-Z_][\w.]*)\s*(?==)/);
    if (
      m &&
      ![
        'if',
        'else',
        'for',
        'while',
        'switch',
        'case',
        'return',
        'import',
        'export',
        'from',
        'const',
        'let',
        'var',
        'function',
        'class',
        'new',
        'typeof',
        'instanceof',
        'void',
        'null',
        'undefined',
        'true',
        'false',
        'this',
      ].includes(m[1])
    ) {
      tokens.push(`<span class="attr">${escapeHtml(m[1])}</span>`);
      remaining = remaining.slice(m[1].length);
      continue;
    }

    // Decorator @Decorator
    m = remaining.match(/^@([A-Za-z_]\w*)/);
    if (m) {
      tokens.push(`<span class="dec">${m[0]}</span>`);
      remaining = remaining.slice(m[0].length);
      continue;
    }

    // Number (with underscores and scientific notation)
    m = remaining.match(/^(\d[\d_]*\.?[\d_]*([eE][+-]?\d+)?)/);
    if (m) {
      tokens.push(`<span class="num">${m[0]}</span>`);
      remaining = remaining.slice(m[0].length);
      continue;
    }

    // Multi-char operators (check before single-char)
    m = remaining.match(/^(&&|\|\||===|!==|==|!=|<=|>=|\+\+|--|\*\*|=>|\.\.\.)/);
    if (m) {
      tokens.push(`<span class="op">${escapeHtml(m[0])}</span>`);
      remaining = remaining.slice(m[0].length);
      continue;
    }

    // Word (keyword, type, builtin, function, identifier)
    m = remaining.match(/^([A-Za-z_$][\w$]*)/);
    if (m) {
      const word = m[1];
      let cls = '';
      if (controlFlow.has(word)) cls = 'kw';
      else if (declarations.has(word)) cls = 'kw';
      else if (modifiers.has(word)) cls = 'kw';
      else if (literals.has(word)) cls = 'val';
      else if (builtins.has(word)) cls = 'type';
      else if (/^[A-Z]/.test(word) && word.length > 1) cls = 'type';
      else {
        // Check if followed by ( → function call
        const ahead = remaining.slice(word.length);
        if (/^\s*\(/.test(ahead)) cls = 'fn';
      }
      tokens.push(cls ? `<span class="${cls}">${word}</span>` : word);
      remaining = remaining.slice(word.length);
      continue;
    }

    // Single-char operators and punctuation
    m = remaining.match(/^([{}()\[\];:,.=<>\-*/|!?~^%])/);
    if (m) {
      tokens.push(`<span class="op">${escapeHtml(m[0])}</span>`);
      remaining = remaining.slice(m[0].length);
      continue;
    }

    // Whitespace
    m = remaining.match(/^(\s+)/);
    if (m) {
      tokens.push(m[0]);
      remaining = remaining.slice(m[0].length);
      continue;
    }

    // Anything else
    tokens.push(escapeHtml(remaining[0]));
    remaining = remaining.slice(1);
  }

  return tokens.join('');
}

// Highlight a short inline expression (for template literal interpolations)
function highlightInlineExpr(code: string): string {
  return escapeHtml(code)
    .replace(
      /\b(const|let|var|return|if|else|new|typeof|instanceof|async|await|function|import|from|export)\b/g,
      '<span class="kw">$1</span>',
    )
    .replace(/\b(true|false|null|undefined|this)\b/g, '<span class="val">$1</span>')
    .replace(/(\d+)/g, '<span class="num">$1</span>')
    .replace(/([A-Z][\w]+)/g, '<span class="type">$1</span>');
}

function highlightBash(code: string): string {
  const lines = code.split('\n');
  return lines
    .map((line) => {
      const trimmed = line.trimStart();
      // Comment
      if (trimmed.startsWith('#')) {
        return `<span class="cm">${line}</span>`;
      }
      // Content is already HTML-escaped by processCodeBlocks
      // Tokenize directly without double-escaping
      const tokens: string[] = [];
      let remaining = line;
      while (remaining.length > 0) {
        // HTML entity — pass through
        let m = remaining.match(/^(&\w+;)/);
        if (m) {
          tokens.push(m[1]);
          remaining = remaining.slice(m[1].length);
          continue;
        }
        // Quoted string
        m = remaining.match(/^(&quot;[^&]*?&quot;|&apos;[^&]*?&apos;)/);
        if (m) {
          tokens.push(`<span class="str">${m[1]}</span>`);
          remaining = remaining.slice(m[1].length);
          continue;
        }
        // Flag
        m = remaining.match(/^(\s+)(--?[\w-]+)/);
        if (m) {
          tokens.push(`${m[1]}<span class="attr">${m[2]}</span>`);
          remaining = remaining.slice(m[0].length);
          continue;
        }
        // Word (potential command)
        m = remaining.match(/^([a-zA-Z][\w-]*)/);
        if (m) {
          const cmds = new Set([
            'sudo',
            'cd',
            'mkdir',
            'rm',
            'cp',
            'mv',
            'ls',
            'cat',
            'echo',
            'npm',
            'pnpm',
            'yarn',
            'git',
            'curl',
            'chmod',
            'export',
            'source',
            'node',
            'npx',
            'bun',
            'deno',
            'grep',
            'awk',
            'sed',
            'find',
            'docker',
            'kubectl',
          ]);
          tokens.push(cmds.has(m[1]) ? `<span class="kw">${m[1]}</span>` : m[1]);
          remaining = remaining.slice(m[1].length);
          continue;
        }
        // Anything else
        tokens.push(remaining[0]);
        remaining = remaining.slice(1);
      }
      return tokens.join('');
    })
    .join('\n');
}

function highlightJSON(code: string): string {
  let result = escapeHtml(code);
  // Keys
  result = result.replace(/(&quot;[^&]*&quot;|"[^"]*")\s*:/g, '<span class="attr">$1</span>:');
  // String values
  result = result.replace(/:\s*(&quot;[^&]*&quot;|"[^"]*")/g, ': <span class="val">$1</span>');
  // Numbers
  result = result.replace(/:\s*(\d+\.?\d*)/g, ': <span class="num">$1</span>');
  // Booleans and null
  result = result.replace(/:\s*(true|false|null)/g, ': <span class="kw">$1</span>');
  return result;
}

function processTables(html: string): string {
  const lines = html.split('\n');
  const result: string[] = [];
  let i = 0;

  while (i < lines.length) {
    // Check if this line and the next look like a table
    if (
      i + 1 < lines.length &&
      lines[i].trim().startsWith('|') &&
      lines[i].trim().endsWith('|') &&
      lines[i + 1].trim().match(/^\|[\s\-:|]+\|$/)
    ) {
      // Parse header row
      const headerCells = lines[i]
        .trim()
        .split('|')
        .filter((c) => c.trim() !== '');
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
        const cells = lines[i]
          .trim()
          .split('|')
          .filter((c) => c.trim() !== '');
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
  const lines = html.split('\n');
  const result: string[] = [];
  let inBlockquote = false;
  let depth = 0;

  for (const line of lines) {
    const match = line.match(/^(\s*)>\s?(.*)/);
    if (match) {
      const indent = match[1].length;
      const content = match[2];
      const newDepth = Math.floor(indent / 2) + 1;

      if (!inBlockquote) {
        for (let i = 0; i < newDepth; i++) {
          result.push('<blockquote>');
        }
        depth = newDepth;
        inBlockquote = true;
      } else if (newDepth > depth) {
        for (let i = depth; i < newDepth; i++) {
          result.push('<blockquote>');
        }
        depth = newDepth;
      } else if (newDepth < depth) {
        for (let i = depth; i > newDepth; i--) {
          result.push('</blockquote>');
        }
        depth = newDepth;
      }

      result.push(content || '<br>');
    } else {
      if (inBlockquote) {
        for (let i = depth; i > 0; i--) {
          result.push('</blockquote>');
        }
        inBlockquote = false;
        depth = 0;
      }
      result.push(line);
    }
  }

  if (inBlockquote) {
    for (let i = depth; i > 0; i--) {
      result.push('</blockquote>');
    }
  }

  return result.join('\n');
}

function processHorizontalRules(html: string): string {
  return html.replace(/^([-*_])\s*\1\s*\1[\s-]*$/gm, '<hr>');
}

function processEmphasis(html: string): string {
  return html
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/~~(.+?)~~/g, '<del>$1</del>')
    .replace(/`([^`]+)`/g, (_match, code) => `<code>${escapeHtml(code)}</code>`);
}

function processParagraphs(html: string, breaks?: boolean): string {
  // Split on pre blocks to avoid processing code content
  const parts = html.split(/(<pre[\s\S]*?<\/pre>)/);

  return parts
    .map((part) => {
      // Don't process content inside pre tags
      if (part.startsWith('<pre')) return part;

      const paragraphs = part.split('\n\n');

      return paragraphs
        .map((p) => {
          p = p.trim();
          if (!p) return '';

          if (
            p.startsWith('<h') ||
            p.startsWith('<ul') ||
            p.startsWith('<ol') ||
            p.startsWith('<pre') ||
            p.startsWith('<blockquote') ||
            p.startsWith('<table') ||
            p.startsWith('<hr')
          ) {
            return p;
          }

          p = p.replace(/\n/g, breaks ? '<br>' : ' ');

          return `<p>${p}</p>`;
        })
        .join('\n');
    })
    .join('');
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
    if (
      relativePath.includes('_layout') ||
      relativePath.includes('_error') ||
      relativePath.includes('_loading')
    ) {
      continue;
    }
    // Skip API routes
    if (relativePath.startsWith('_api/') || relativePath.includes('/_api/')) {
      continue;
    }

    let routePath = relativePath
      .replace(/\.(tsx|ts|jsx|js|md|mdx)$/, '')
      .replace(/(^|\/)index$/, '$1')
      .replace(/\[\.\.\.(\w+)\]/g, ':$1*')
      .replace(/\[([^\]]+)\]/g, ':$1');

    if (routePath === '' || routePath === '/') {
      routePath = '/';
    } else {
      routePath = '/' + routePath;
    }

    const importPath = file.replace(/\\/g, '/');

    if (isMarkdown) {
      routeEntries.push(
        `  { path: ${JSON.stringify(routePath)}, component: () => import(${JSON.stringify(importPath)}), isMarkdown: true }`,
      );
    } else {
      routeEntries.push(
        `  { path: ${JSON.stringify(routePath)}, component: () => import(${JSON.stringify(importPath)}) }`,
      );
    }
  }

  return `export const routes = [\n${routeEntries.join(',\n')}\n];`;
}
