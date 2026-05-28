import type { JSXElement } from '../../runtime/types.js';
import { renderToString } from '../../runtime/helpers/render.js';

const SYNC_SELECTORS: Array<{ selector: string; attr: string }> = [
  { selector: '[data-ekclick]', attr: 'data-ekclick' },
  { selector: '[data-ekchange]', attr: 'data-ekchange' },
  { selector: '[data-ekinput]', attr: 'data-ekinput' },
  { selector: '[data-eksubmit]', attr: 'data-eksubmit' },
  { selector: '[data-ek-lazy-in-view]', attr: 'data-ek-lazy-in-view' },
  { selector: '[data-ek-bind]', attr: 'data-ek-bind' },
];

function syncAttributeList(
  container: Element,
  freshRoot: Element,
  selector: string,
  attr: string,
): boolean {
  const ssrNodes = container.querySelectorAll(selector);
  const freshNodes = freshRoot.querySelectorAll(selector);

  if (ssrNodes.length !== freshNodes.length) {
    return false;
  }

  ssrNodes.forEach((node, index) => {
    const value = freshNodes[index]?.getAttribute(attr);
    if (value) {
      node.setAttribute(attr, value);
    }
  });

  return true;
}

/**
 * Run a client render to populate handler/lazy/signal registries, then map
 * interactive attribute ids onto the existing SSR DOM so hydration can attach.
 */
export function resyncInteractiveAttributesFromRender(
  container: Element,
  jsxElement: JSXElement,
): boolean {
  const snapshot = container.innerHTML;
  const freshHtml = renderToString(jsxElement);

  if (typeof DOMParser === 'undefined') {
    container.innerHTML = freshHtml;
    return false;
  }

  const doc = new DOMParser().parseFromString(
    `<div data-ek-hydrate-root="true">${freshHtml}</div>`,
    'text/html',
  );
  const freshRoot = doc.querySelector('[data-ek-hydrate-root]');
  if (!freshRoot) {
    container.innerHTML = freshHtml;
    return false;
  }

  container.innerHTML = snapshot;

  for (const { selector, attr } of SYNC_SELECTORS) {
    if (!syncAttributeList(container, freshRoot, selector, attr)) {
      container.innerHTML = freshHtml;
      return false;
    }
  }

  return true;
}
