export interface MarkdownConfig {
  gfm?: boolean;
  breaks?: boolean;
  remarkPlugins?: unknown[];
  rehypePlugins?: unknown[];
  components?: Record<string, string>;
}

export interface MarkdownOptions extends MarkdownConfig {
  html?: boolean;
  tables?: boolean;
  taskLists?: boolean;
  footnotes?: boolean;
}

export interface ParsedMarkdown {
  html: string;
  frontmatter?: Record<string, unknown>;
  headings: Heading[];
  links: string[];
  images: ImageInfo[];
  codeBlocks: CodeBlock[];
}

export interface Heading {
  level: number;
  text: string;
  id: string;
}

export interface ImageInfo {
  src: string;
  alt: string;
  title?: string;
}

export interface CodeBlock {
  lang: string;
  code: string;
}

export interface MarkdownPlugin {
  name: string;
  process: (content: string, options: MarkdownOptions) => string;
}

class MarkdownParser {
  private config: Required<MarkdownOptions>;

  constructor(config: MarkdownOptions = {}) {
    this.config = {
      gfm: config.gfm ?? true,
      breaks: config.breaks ?? false,
      html: config.html ?? true,
      tables: config.tables ?? true,
      taskLists: config.taskLists ?? true,
      footnotes: config.footnotes ?? false,
      remarkPlugins: config.remarkPlugins ?? [],
      rehypePlugins: config.rehypePlugins ?? [],
      components: config.components ?? {},
    };
  }

  parse(markdown: string): ParsedMarkdown {
    const frontmatter = this.extractFrontmatter(markdown);
    const content = frontmatter ? this.removeFrontmatter(markdown) : markdown;

    const html = this.renderMarkdown(content);
    const headings = this.extractHeadings(html);
    const links = this.extractLinks(content);
    const images = this.extractImages(content);
    const codeBlocks = this.extractCodeBlocks(content);

    return { html, frontmatter, headings, links, images, codeBlocks };
  }

  private extractFrontmatter(markdown: string): Record<string, unknown> | undefined {
    const match = markdown.match(/^---\n([\s\S]*?)\n---/);

    if (!match) return undefined;

    const result: Record<string, unknown> = {};
    const lines = match[1].split('\n');

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

  private removeFrontmatter(markdown: string): string {
    return markdown.replace(/^---\n[\s\S]*?\n---\n?/, '');
  }

  private renderMarkdown(content: string): string {
    let html = content;

    html = this.processCodeBlocks(html);
    html = this.processHeadings(html);
    html = this.processHorizontalRules(html);
    html = this.processLists(html);
    html = this.processTaskLists(html);
    html = this.processTables(html);
    html = this.processImages(html);
    html = this.processLinks(html);
    html = this.processBlockquotes(html);
    html = this.processEmphasis(html);
    html = this.processLineBreaks(html);
    html = this.processComponents(html);

    return html;
  }

  private processCodeBlocks(html: string): string {
    return html.replace(/```(\w*)\n([\s\S]*?)```/g, (_match, lang, code) => {
      const escaped = this.escapeHtml(code.trim());
      return `<pre><code class="language-${lang}">${escaped}</code></pre>`;
    });
  }

  private processHeadings(html: string): string {
    return html.replace(/^(#{1,6})\s+(.+)$/gm, (_match, hashes, text) => {
      const level = hashes.length;
      const id = this.slugify(text);
      return `<h${level} id="${id}">${text}</h${level}>`;
    });
  }

  private processLists(html: string): string {
    const lines = html.split('\n');
    const result: string[] = [];
    let inList = false;

    for (const line of lines) {
      const orderedMatch = line.match(/^(\d+)\.\s+(.+)/);
      const unorderedMatch = line.match(/^[-*+]\s+(.+)/);

      if (orderedMatch || unorderedMatch) {
        const tag = orderedMatch ? 'ol' : 'ul';
        const content = orderedMatch ? orderedMatch[2] : unorderedMatch[2];

        if (!inList) {
          result.push(`<${tag}>`);
          inList = true;
        }

        result.push(`<li>${content}</li>`);
      } else {
        if (inList) {
          const lastTag = result[result.length - 1]?.startsWith('<ol') ? 'ol' : 'ul';
          result.push(`</${lastTag}>`);
          inList = false;
        }
        result.push(line);
      }
    }

    if (inList) {
      const lastTag = result[result.length - 1]?.startsWith('<ol') ? 'ol' : 'ul';
      result.push(`</${lastTag}>`);
    }

    return result.join('\n');
  }

  private processTaskLists(html: string): string {
    return html.replace(/^- \[([ x])\]\s+(.+)/gm, (_match, checked, text) => {
      const isChecked = checked === 'x';
      return `<li class="task"><input type="checkbox" ${isChecked ? 'checked' : ''} disabled>${text}</li>`;
    });
  }

  private processTables(html: string): string {
    const rows = html.split('\n');
    let inTable = false;
    const result: string[] = [];
    let headerProcessed = false;

    for (const row of rows) {
      if (row.match(/^\|.*\|$/)) {
        if (!inTable) {
          result.push('<table><thead><tr>');
          inTable = true;
          headerProcessed = false;
        }

        const cells = row.split('|').filter((c) => c.trim()).map((c) => c.trim());

        if (row.match(/^\|[\s-:]+\|$/)) {
          continue;
        }

        if (!headerProcessed) {
          for (const cell of cells) {
            result.push(`<th>${cell}</th>`);
          }
          result.push('</tr></thead><tbody>');
          headerProcessed = true;
        } else {
          result.push('<tr>');
          for (const cell of cells) {
            result.push(`<td>${cell}</td>`);
          }
          result.push('</tr>');
        }
      } else {
        if (inTable) {
          result.push('</tbody></table>');
          inTable = false;
        }
        result.push(row);
      }
    }

    if (inTable) {
      result.push('</tbody></table>');
    }

    return result.join('\n');
  }

  private processLinks(html: string): string {
    return html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, text, href) => {
      const titleMatch = href.match(/^([^"]+)"([^"]+)"/);
      if (titleMatch) {
        return `<a href="${titleMatch[1]}" title="${titleMatch[2]}">${text}</a>`;
      }
      return `<a href="${href}">${text}</a>`;
    });
  }

  private processImages(html: string): string {
    return html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_match, alt, src) => {
      return `<img src="${src}" alt="${alt}" loading="lazy">`;
    });
  }

  private processBlockquotes(html: string): string {
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

  private processEmphasis(html: string): string {
    return html
      .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/~~(.+?)~~/g, '<del>$1</del>')
      .replace(/`([^`]+)`/g, (_match, code) => `<code>${this.escapeHtml(code)}</code>`);
  }

  private processHorizontalRules(html: string): string {
    return html.replace(/^([-*_])\s*\1\s*\1[\s-]*$/gm, '<hr>');
  }

  private processLineBreaks(html: string): string {
    if (this.config.breaks) {
      return html.replace(/\n/g, '<br>');
    }
    return html.replace(/\n\n/g, '</p><p>').replace(/\n/g, ' ');
  }

  private processComponents(html: string): string {
    for (const [component, tag] of Object.entries(this.config.components)) {
      html = html.replace(new RegExp(`<${component}>`, 'g'), `<${tag}>`);
      html = html.replace(new RegExp(`</${component}>`, 'g'), `</${tag}>`);
    }
    return html;
  }

  private extractHeadings(html: string): Heading[] {
    const headings: Heading[] = [];
    const regex = /<h(\d) id="([^"]+)">([^<]+)<\/h\1>/g;
    let match;

    while ((match = regex.exec(html)) !== null) {
      headings.push({
        level: parseInt(match[1]),
        text: match[3],
        id: match[2],
      });
    }

    return headings;
  }

  private extractLinks(content: string): string[] {
    const links: string[] = [];
    const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match;

    while ((match = regex.exec(content)) !== null) {
      const href = match[2];
      if (!href.startsWith('#') && !links.includes(href)) {
        links.push(href);
      }
    }

    return links;
  }

  private extractImages(content: string): ImageInfo[] {
    const images: ImageInfo[] = [];
    const regex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    let match;

    while ((match = regex.exec(content)) !== null) {
      const src = match[2];
      const alt = match[1];
      const titleMatch = src.match(/"([^"]+)"/);
      const title = titleMatch ? titleMatch[1] : undefined;

      images.push({ src, alt, title });
    }

    return images;
  }

  private extractCodeBlocks(content: string): CodeBlock[] {
    const blocks: CodeBlock[] = [];
    const regex = /```(\w*)\n([\s\S]*?)```/g;
    let match;

    while ((match = regex.exec(content)) !== null) {
      blocks.push({
        lang: match[1],
        code: match[2].trim(),
      });
    }

    return blocks;
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
}

export function createMarkdownParser(options?: MarkdownOptions): MarkdownParser {
  return new MarkdownParser(options);
}

export function parseMarkdown(
  content: string,
  options?: MarkdownOptions,
): ParsedMarkdown {
  const parser = new MarkdownParser(options);
  return parser.parse(content);
}

export function renderMarkdown(content: string, options?: MarkdownOptions): string {
  const parser = new MarkdownParser(options);
  return parser.parse(content).html;
}

export function extractFrontmatter(
  content: string,
): { data: Record<string, unknown>; content: string } | null {
  const parser = new MarkdownParser();
  const parsed = parser.parse(content);

  if (!parsed.frontmatter) {
    return null;
  }

  return {
    data: parsed.frontmatter,
    content: parsed.html,
  };
}

export function markdownToPlainText(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
    .replace(/^#+\s+/gm, '')
    .replace(/^>\s+/gm, '')
    .replace(/^[-*+]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '');
}

export function getReadingTime(text: string, wpm = 200): number {
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / wpm);
}

export function getWordCount(text: string): number {
  return text.trim().split(/\s+/).length;
}

export function getCharacterCount(text: string, includeSpaces = false): number {
  if (includeSpaces) {
    return text.length;
  }
  return text.replace(/\s/g, '').length;
}