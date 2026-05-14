import type { JSXNode } from '../../runtime/types.js';
import type { LoaderResult } from '../../loader/types.js';
import { renderToHTMLString, createHtmlDocument } from './render-html.js';
import { drainHeadContent } from '../../meta/head-registry.js';
import type { SSRRenderOptions, SSRRenderResult } from '../types.js';
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
