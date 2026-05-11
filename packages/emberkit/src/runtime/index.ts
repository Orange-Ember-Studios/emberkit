import type { JSXElementProps, JSXNode, DOMElement, JSXElement } from './types.js';
import { renderToString } from './helpers/render.js';

export function createElement(
  type: string | ((props: JSXElementProps) => JSXNode),
  props?: Record<string, unknown> | null,
  ...children: unknown[]
): DOMElement {
  const resolvedProps = props ?? {};
  const flatChildren = children.flat().filter((child) => child != null && child !== false);

  if (flatChildren.length > 0) {
    resolvedProps.children = flatChildren;
  }

  return {
    type: type as string,
    props: resolvedProps as DOMElement['props'],
  };
}

export function render(
  element: JSXElement | string | null,
  container: Element | string,
  _options?: { hydrate?: boolean },
): void {
  void _options;
  if (!element) return;

  const target =
    typeof container === 'string' ? document.querySelector(container) : container;

  if (!target) {
    throw new Error(`Container element not found: ${container}`);
  }

  const html = renderToString(element as DOMElement);
  target.innerHTML = html;
}

export function hydrate(
  element: JSXElement | string | null,
  container: Element | string,
): void {
  render(element, container, { hydrate: true });
}

export function flushSync(fn: () => void): void {
  fn();
}

export function isElement(element: unknown): element is JSXElement {
  return (
    typeof element === 'object' &&
    element !== null &&
    'type' in element &&
    'props' in element
  );
}

export { type JSXElement, type JSXNode };
