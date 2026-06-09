import type { JSXNode } from '../../runtime/types.js';
import type { LoaderResult } from '../../loader/types.js';
import { renderToHTMLString, createHtmlDocument } from './render-html.js';
import { drainHeadContent } from '../../meta/head-registry.js';
import type { SSRRenderOptions, SSRRenderResult, SSRStreamResult } from '../types.js';
import { getStatusText } from '../types.js';

export function renderSSR(
  element: JSXNode | null,
  options: SSRRenderOptions = {},
): SSRRenderResult {
  const { doctype = '<!DOCTYPE html>', title, lang = 'en', baseUrl, headExtra } = options;

  const html = renderToHTMLString(element);
  const collectedHead = drainHeadContent();
  const allHeadExtra = [headExtra, collectedHead].filter(Boolean).join('\n');

  const docOptions: {
    title?: string;
    lang?: string;
    doctype?: string;
    baseUrl?: string;
    headExtra?: string;
  } = {};
  if (title !== undefined) docOptions.title = title;
  if (lang !== undefined) docOptions.lang = lang;
  if (doctype !== undefined) docOptions.doctype = doctype;
  if (baseUrl !== undefined) docOptions.baseUrl = baseUrl;
  if (allHeadExtra) docOptions.headExtra = allHeadExtra;
  const fullHtml = createHtmlDocument(html, docOptions);

  return {
    html: fullHtml,
    status: 200,
    headers: new Headers({
      'Content-Type': 'text/html',
    }),
  };
}

export function renderSSRWithError(
  element: JSXNode | null,
  error: LoaderResult<unknown> | null,
  options: SSRRenderOptions = {},
): SSRRenderResult {
  const status = error && 'error' in error ? error.error.status : 500;
  const message = error && 'error' in error ? error.error.message : 'Internal Server Error';

  const errorHtml = error
    ? `<div class="error"><h1>Error ${status}</h1><p>${message}</p></div>`
    : '';

  const html = renderToHTMLString(element) + errorHtml;
  const collectedHead = drainHeadContent();
  const allHeadExtra = [options.headExtra, collectedHead].filter(Boolean).join('\n');

  const fullHtml = createHtmlDocument(html, {
    title: `Error ${status} - ${getStatusText(status)}`,
    ...options,
    ...(allHeadExtra ? { headExtra: allHeadExtra } : {}),
  });

  return {
    html: fullHtml,
    status,
    headers: new Headers({
      'Content-Type': 'text/html',
    }),
  };
}

export function renderSSRWithHeaders(
  element: JSXNode | null,
  headers: Record<string, string>,
  options: SSRRenderOptions = {},
): SSRRenderResult {
  const result = renderSSR(element, options);

  for (const [key, value] of Object.entries(headers)) {
    result.headers.set(key, value);
  }

  return result;
}

export function createStreamingRenderer() {
  const chunks: string[] = [];

  return {
    write(html: string): void {
      chunks.push(html);
    },

    writeChunk(type: 'html' | 'status' | 'error', content: string): void {
      if (type === 'status') {
        chunks.push(`<!--status:${content}-->`);
      } else if (type === 'error') {
        chunks.push(`<!--error:${content}-->`);
      } else {
        chunks.push(content);
      }
    },

    end(): string {
      return chunks.join('');
    },

    reset(): void {
      chunks.length = 0;
    },
  };
}

export function injectScripts(html: string, scripts: string[]): string {
  if (scripts.length === 0) return html;

  const scriptTags = scripts.map((src) => `<script src="${src}"></script>`).join('');
  const insertPoint = html.lastIndexOf('</body>');

  if (insertPoint === -1) {
    return html + '\n' + scriptTags;
  }

  return html.slice(0, insertPoint) + scriptTags + html.slice(insertPoint);
}

export interface StreamingRenderer {
  write(html: string): void;
  writeChunk(type: 'html' | 'status' | 'error', content: string): void;
  end(): string;
  reset(): void;
  flush(): Promise<void>;
}

export async function renderToStream(
  element: JSXNode | null,
  options: SSRRenderOptions = {},
): Promise<SSRStreamResult> {
  const encoder = new TextEncoder();
  const chunks: Uint8Array[] = [];
  let flushed = Promise.resolve();

  const write = (html: string) => {
    chunks.push(encoder.encode(html));
  };

  const flush = async () => {
    await flushed;
  };

  const renderer: StreamingRenderer = {
    write,
    writeChunk(type: 'html' | 'status' | 'error', content: string) {
      if (type === 'status') {
        write(`<!--status:${content}-->`);
      } else if (type === 'error') {
        write(`<!--error:${content}-->`);
      } else {
        write(content);
      }
    },
    end: () => chunks.map((c) => new TextDecoder().decode(c)).join(''),
    reset: () => chunks.length = 0,
    flush,
  };

  write(createHtmlDocument(renderToHTMLString(element), {
    doctype: options.doctype,
    lang: options.lang ?? 'en',
  }));

  const stream = new ReadableStream({
    start(controller) {
      for (const chunk of chunks) {
        flushed = flushed.then(() => {
          controller.enqueue(chunk);
        });
      }
      flushed = flushed.then(() => controller.close());
    },
    cancel() {
      chunks.length = 0;
    },
  });

  return {
    html: '',
    status: 200,
    headers: new Headers({ 'Content-Type': 'text/html; charset=utf-8' }),
    stream,
  };
}
