import type { JSXElement } from '../runtime/types.js';
import { parseMarkdown } from '../markdown/index.js';

export interface MDXConfig {
  gfm?: boolean;
  breaks?: boolean;
  tables?: boolean;
  components?: Record<string, (props: Record<string, unknown>) => JSXElement>;
  scope?: Record<string, unknown>;
}

export interface MDXComponent {
  (props: Record<string, unknown>): JSXElement;
  frontmatter?: Record<string, unknown>;
  metadata?: MDXMetadata;
}

export interface MDXMetadata {
  title?: string;
  description?: string;
  author?: string;
  date?: string;
  tags?: string[];
  readingTime?: number;
}

class MDXCompiler {
  private components: Map<string, (props: Record<string, unknown>) => JSXElement>;
  private config: MDXConfig;

  constructor(config: MDXConfig = {}) {
    this.config = config;
    this.components = new Map(Object.entries(config.components ?? {}));
  }

  compile(source: string): (props: Record<string, unknown>) => JSXElement {
    const parsed = parseMarkdown(source, {
      gfm: this.config.gfm,
      breaks: this.config.breaks,
      tables: this.config.tables,
    });
    const { html, frontmatter } = parsed;

    const componentCode = this.generateComponent(html);

    return this.createComponent(componentCode, frontmatter);
  }

  getComponent(name: string): ((props: Record<string, unknown>) => JSXElement) | undefined {
    return this.components.get(name);
  }

  registerComponent(name: string, component: (props: Record<string, unknown>) => JSXElement): void {
    this.components.set(name, component);
  }

  unregisterComponent(name: string): void {
    this.components.delete(name);
  }

  private createComponent(
    code: string,
    frontmatter?: Record<string, unknown>,
  ): (props: Record<string, unknown>) => JSXElement {
    try {
      const fn = new Function('createElement', code);

      const component = (props: Record<string, unknown>) => {
        const element = fn(createElementProxy);
        return element;
      };

      if (frontmatter) {
        (component as MDXComponent).frontmatter = frontmatter;
      }

      return component as MDXComponent;
    } catch (error) {
      console.error('MDX compilation error:', error);
      return () => ({ type: 'div', props: { children: 'MDX Error' } }) as unknown as JSXElement;
    }
  }

  private extractHeadingIds(html: string): string[] {
    const ids: string[] = [];
    const regex = /id="([^"]+)"/g;
    let match;

    while ((match = regex.exec(html)) !== null) {
      ids.push(match[1]);
    }

    return ids;
  }

  private generateComponent(html: string): string {
    const headings = this.extractHeadingIds(html);
    const paragraphs = this.splitParagraphs(html);

    let code = 'return (';

    for (const p of paragraphs) {
      if (p.startsWith('<h')) {
        code += p;
      } else if (p.startsWith('<ul') || p.startsWith('<ol')) {
        code += p;
      } else if (p.startsWith('<pre')) {
        code += p;
      } else if (p.startsWith('<blockquote')) {
        code += p;
      } else if (p.startsWith('<table')) {
        code += p;
      } else {
        code += `<p>${p}</p>`;
      }
    }

    code += ')';

    return code;
  }

  private splitParagraphs(html: string): string[] {
    return html
      .split(/\n\n+/)
      .map((p) => p.trim())
      .filter(Boolean);
  }
}

const createElementProxy = {
  createElement(tag: string, props: Record<string, unknown>, ...children: unknown[]) {
    return {
      type: tag,
      props: {
        ...props,
        children: children.length === 1 ? children[0] : children,
      },
    };
  },
};

export function createMDXCompiler(config?: MDXConfig): MDXCompiler {
  return new MDXCompiler(config);
}

export async function compileMDX(source: string, options?: MDXConfig): Promise<MDXComponent> {
  const compiler = createMDXCompiler(options);
  return compiler.compile(source);
}

export function compileSync(source: string, options?: MDXConfig): MDXComponent {
  const compiler = createMDXCompiler(options);
  return compiler.compile(source);
}

export function useMDX(source: string, options?: MDXConfig): MDXComponent {
  return compileSync(source, options);
}

export const DEFAULT_COMPONENTS: Record<string, (props: Record<string, unknown>) => JSXElement> = {
  pre: (props) => ({ type: 'pre', props }),
  code: (props) => {
    const className = props.className as string | undefined;
    const lang = className?.replace('language-', '') ?? '';
    return {
      type: 'code',
      props: { ...props, className: lang ? `language-${lang}` : undefined },
    };
  },
  h1: (props) => {
    const children = props.children as string;
    const id = children?.toLowerCase().replace(/\s+/g, '-');
    return { type: 'h1', props: { ...props, id } };
  },
  h2: (props) => {
    const children = props.children as string;
    const id = children?.toLowerCase().replace(/\s+/g, '-');
    return { type: 'h2', props: { ...props, id } };
  },
  a: (props) => {
    const href = props.href as string | undefined;
    if (href?.startsWith('/')) {
      return { type: 'a', props: { ...props, 'data-link': '' } };
    }
    return { type: 'a', props: { ...props, target: '_blank', rel: 'noopener noreferrer' } };
  },
  img: (props) => ({
    type: 'img',
    props: { ...props, loading: 'lazy', decoding: 'async' },
  }),
  table: (props) => {
    return {
      type: 'div',
      props: {
        className: 'table-wrapper',
        children: [
          {
            type: 'table',
            props: { children: [props.children] },
          },
        ],
      },
    } as unknown as JSXElement;
  },
};

export function mergeComponents(
  base: Record<string, (props: Record<string, unknown>) => JSXElement>,
  override: Record<string, (props: Record<string, unknown>) => JSXElement>,
): Record<string, (props: Record<string, unknown>) => JSXElement> {
  return { ...base, ...override };
}

export { parseMarkdown };
