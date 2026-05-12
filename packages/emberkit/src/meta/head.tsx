import type { JSXNode } from '../runtime/types.js';
import { renderToString } from '../runtime/helpers/render.js';
import { registerHeadContent } from './head-registry.js';
import { escapeHtml } from '../ssr/helpers/render-html.js';

const MANAGED_ATTR = 'data-ek-head';

export interface HeadProps {
  children?: JSXNode | JSXNode[];
  title?: string;
  description?: string;
  og?: {
    title?: string;
    description?: string;
    type?: string;
    url?: string;
    image?: string;
    locale?: string;
    siteName?: string;
  };
  twitter?: {
    card?: string;
    site?: string;
    creator?: string;
    title?: string;
    description?: string;
    image?: string;
  };
  canonical?: string;
  robots?: string;
  keywords?: string[];
  author?: string;
}

function buildShorthandTags(props: HeadProps): string {
  const tags: string[] = [];

  if (props.title) {
    tags.push(`<title ${MANAGED_ATTR}>${escapeHtml(props.title)}</title>`);
    tags.push(`<meta ${MANAGED_ATTR} name="title" content="${escapeHtml(props.title)}">`);
  }
  if (props.description) {
    tags.push(`<meta ${MANAGED_ATTR} name="description" content="${escapeHtml(props.description)}">`);
  }
  if (props.keywords?.length) {
    tags.push(`<meta ${MANAGED_ATTR} name="keywords" content="${escapeHtml(props.keywords.join(', '))}">`);
  }
  if (props.author) {
    tags.push(`<meta ${MANAGED_ATTR} name="author" content="${escapeHtml(props.author)}">`);
  }
  if (props.robots) {
    tags.push(`<meta ${MANAGED_ATTR} name="robots" content="${escapeHtml(props.robots)}">`);
  }
  if (props.canonical) {
    tags.push(`<link ${MANAGED_ATTR} rel="canonical" href="${escapeHtml(props.canonical)}">`);
  }
  if (props.og) {
    const og = props.og;
    if (og.type) tags.push(`<meta ${MANAGED_ATTR} property="og:type" content="${escapeHtml(og.type)}">`);
    if (og.title) tags.push(`<meta ${MANAGED_ATTR} property="og:title" content="${escapeHtml(og.title)}">`);
    if (og.description) tags.push(`<meta ${MANAGED_ATTR} property="og:description" content="${escapeHtml(og.description)}">`);
    if (og.url) tags.push(`<meta ${MANAGED_ATTR} property="og:url" content="${escapeHtml(og.url)}">`);
    if (og.image) tags.push(`<meta ${MANAGED_ATTR} property="og:image" content="${escapeHtml(og.image)}">`);
    if (og.locale) tags.push(`<meta ${MANAGED_ATTR} property="og:locale" content="${escapeHtml(og.locale)}">`);
    if (og.siteName) tags.push(`<meta ${MANAGED_ATTR} property="og:site_name" content="${escapeHtml(og.siteName)}">`);
  }
  if (props.twitter) {
    const tc = props.twitter;
    if (tc.card) tags.push(`<meta ${MANAGED_ATTR} name="twitter:card" content="${escapeHtml(tc.card)}">`);
    if (tc.site) tags.push(`<meta ${MANAGED_ATTR} name="twitter:site" content="${escapeHtml(tc.site)}">`);
    if (tc.creator) tags.push(`<meta ${MANAGED_ATTR} name="twitter:creator" content="${escapeHtml(tc.creator)}">`);
    if (tc.title) tags.push(`<meta ${MANAGED_ATTR} name="twitter:title" content="${escapeHtml(tc.title)}">`);
    if (tc.description) tags.push(`<meta ${MANAGED_ATTR} name="twitter:description" content="${escapeHtml(tc.description)}">`);
    if (tc.image) tags.push(`<meta ${MANAGED_ATTR} name="twitter:image" content="${escapeHtml(tc.image)}">`);
  }

  return tags.join('\n');
}

function updateClientHead(html: string): void {
  if (typeof document === 'undefined') return;

  const parsed = new DOMParser().parseFromString(
    `<root>${html}</root>`,
    'text/html',
  );
  const newTags = parsed.body.firstChild?.childNodes ?? [];

  const existing = document.querySelectorAll(`[${MANAGED_ATTR}]`);
  existing.forEach((el) => el.remove());

  for (const node of Array.from(newTags)) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      if (el.tagName === 'TITLE') {
        document.title = el.textContent ?? '';
      } else {
        document.head.appendChild(document.importNode(el, true));
      }
    }
  }
}

export function Head(props: HeadProps): JSXNode {
  let html = '';

  if (props.children) {
    const children = Array.isArray(props.children) ? props.children : [props.children];
    html = children
      .map((child) => {
        if (child == null || child === false) return '';
        return renderToString(child as Parameters<typeof renderToString>[0]);
      })
      .join('\n');
  } else {
    html = buildShorthandTags(props);
  }

  registerHeadContent(html);

  if (typeof document !== 'undefined') {
    updateClientHead(html);
  }

  return null;
}

(Head as { displayName?: string }).displayName = 'Head';
