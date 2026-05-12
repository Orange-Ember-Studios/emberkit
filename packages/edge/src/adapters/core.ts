export interface EdgeContext {
  request: Request;
  env: Record<string, unknown>;
  params: Record<string, string>;
  waitUntil: (promise: Promise<unknown>) => void;
  passThroughOnException: () => void;
}

export interface EdgeConfig {
  runtime?: 'cloudflare' | 'deno' | 'bun' | 'node';
  streaming?: boolean;
  staticGeneration?: boolean;
}

export interface EdgeAdapter {
  name: string;
  version: string;
  config: EdgeConfig;
  render: (context: EdgeContext, renderFn: () => Promise<string>) => Promise<Response>;
  handleError: (error: Error, context: EdgeContext) => Response;
}

export function createEdgeAdapter(config: EdgeConfig = {}): EdgeAdapter {
  const { runtime = 'cloudflare', streaming = true, staticGeneration = true } = config;

  return {
    name: 'emberkit-edge',
    version: '0.1.0',
    config: { runtime, streaming, staticGeneration },
    async render(context, renderFn) {
      try {
        const html = await renderFn();

        return new Response(html, {
          status: 200,
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'X-Powered-By': 'EmberKit',
          },
        });
      } catch (error) {
        return handleRenderError(error instanceof Error ? error : new Error(String(error)), context);
      }
    },
    handleError(error) {
      return new Response(
        `<!DOCTYPE html>
<html>
<head><title>Error</title></head>
<body>
  <h1>Application Error</h1>
  <p>${escapeHtml(error instanceof Error ? error.message : 'Unknown error')}</p>
</body>
</html>`,
        { status: 500, headers: { 'Content-Type': 'text/html' } },
      );
    },
  };
}

function handleRenderError(error: Error, _context: EdgeContext): Response {
  console.error('[Edge] Render error:', error);

  return new Response(
    `<!DOCTYPE html>
<html>
<head><title>Error</title></head>
<body>
  <h1>Application Error</h1>
  <pre>${escapeHtml(error.stack ?? error.message)}</pre>
</body>
</html>`,
    { status: 500, headers: { 'Content-Type': 'text/html' } },
  );
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function createStreamingResponse(
  content: string,
  options: { status?: number; headers?: Record<string, string> } = {},
): Promise<Response> {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(content));
      controller.close();
    },
  });

  return new Response(stream, {
    status: options.status ?? 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      ...options.headers,
    },
  });
}

export class StaticPage {
  private html: string;
  private scripts: string[] = [];
  private styles: string[] = [];

  constructor(html: string) {
    this.html = html;
  }

  addScript(src: string): this {
    this.scripts.push(src);
    return this;
  }

  addStyle(href: string): this {
    this.styles.push(href);
    return this;
  }

  toHTML(): string {
    const scripts = this.scripts
      .map((src) => `<script src="${escapeHtml(src)}"></script>`)
      .join('\n');
    const styles = this.styles
      .map((href) => `<link rel="stylesheet" href="${escapeHtml(href)}">`)
      .join('\n');

    return this.html
      .replace('</head>', `${styles}\n</head>`)
      .replace('</body>', `${scripts}\n</body>`);
  }
}

export function renderStatic(html: string): StaticPage {
  return new StaticPage(html);
}

export const EDGE_RUNTIME_SYMBOL = Symbol.for('emberkit.edge.runtime');

export function isEdgeEnvironment(): boolean {
  return (
    typeof (globalThis as Record<string, unknown>).__cf !== 'undefined' ||
    typeof (globalThis as Record<string, unknown>).Deno !== 'undefined' ||
    typeof (globalThis as Record<string, unknown>).Bun !== 'undefined'
  );
}

export function getMemoryUsage(): { heapUsed: number; heapTotal: number } {
  if (typeof process !== 'undefined' && process.memoryUsage) {
    const mem = process.memoryUsage();
    return { heapUsed: mem.heapUsed, heapTotal: mem.heapTotal };
  }

  return { heapUsed: 0, heapTotal: 0 };
}

export interface CacheConfig {
  edge?: number;
  browser?: string;
  staleWhileRevalidate?: number;
}

export function createCacheHeaders(config: CacheConfig): Record<string, string> {
  const headers: Record<string, string> = {};

  if (config.edge) {
    headers['Cache-Control'] = `public, max-age=${config.edge}`;
  }

  if (config.browser) {
    headers['Cache-Control'] = config.browser;
  }

  if (config.staleWhileRevalidate) {
    const current = headers['Cache-Control'] ?? '';
    headers['Cache-Control'] = `${current}, stale-while-revalidate=${config.staleWhileRevalidate}`;
  }

  return headers;
}