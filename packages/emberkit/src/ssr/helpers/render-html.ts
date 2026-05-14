import { renderToString } from '../../runtime/helpers/render.js';
import type { JSXNode, DOMElement } from '../../runtime/types.js';

export function renderToHTMLString(element: JSXNode | null): string {
  if (!element) return '';
  if (typeof element === 'string') return element;
  if (typeof element === 'number') return String(element);
  if (typeof element === 'object' && element !== null && 'type' in element) {
    return renderToString(element as DOMElement);
  }
  return '';
}

export function renderChildrenToHTML(children: (string | number | JSXNode)[]): string {
  return children.map((child) => renderToHTMLString(child)).join('');
}

export function createHtmlDocument(
  html: string,
  options: {
    title?: string;
    lang?: string;
    doctype?: string;
    baseUrl?: string;
    headExtra?: string;
  } = {},
): string {
  const {
    title = '',
    lang = 'en',
    doctype = '<!DOCTYPE html>',
    baseUrl = '',
    headExtra = '',
  } = options;

  const fullHtml =
    doctype +
    '\n' +
    `<html${lang ? ` lang="${lang}"` : ''}>\n` +
    '<head>\n' +
    `<meta charset="utf-8">\n` +
    `<meta name="viewport" content="width=device-width, initial-scale=1">\n` +
    (title ? `<title>${escapeHtml(title)}</title>\n` : '') +
    (baseUrl ? `<base href="${baseUrl}">\n` : '') +
    (headExtra ? headExtra + '\n' : '') +
    '</head>\n' +
    `<body>\n${html}\n</body>\n` +
    '</html>';

  return fullHtml;
}

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function createMetaTags(meta: Record<string, string>): string {
  return Object.entries(meta)
    .map(([name, content]) => `<meta name="${escapeHtml(name)}" content="${escapeHtml(content)}">`)
    .join('\n');
}

export function createLinkTags(links: Record<string, string>): string {
  return Object.entries(links)
    .map(([rel, href]) => `<link rel="${escapeHtml(rel)}" href="${escapeHtml(href)}">`)
    .join('\n');
}

export function createScriptTags(scripts: string[]): string {
  return scripts.map((src) => `<script src="${escapeHtml(src)}"></script>`).join('\n');
}

export function createStyleTags(styles: string[]): string {
  return styles.map((href) => `<link rel="stylesheet" href="${escapeHtml(href)}">`).join('\n');
}
