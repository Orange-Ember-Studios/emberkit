import type { DOMElement, JSXElementProps, JSXNode } from '../types.js';

const SELF_CLOSING_TAGS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr',
]);

export function renderElementToHTML(element: DOMElement): string {
  const { type, props } = element;
  const children = props.children ?? [];
  const childHtml = children
    .map((child) => {
      if (typeof child === 'string' || typeof child === 'number') {
        return String(child);
      }
      if (typeof child === 'object' && child !== null && 'type' in child) {
        return renderElementToHTML(child as DOMElement);
      }
      return '';
    })
    .join('');

  if (type === 'Fragment' || type === 'React.Fragment') {
    return childHtml;
  }

  const attributes = Object.entries(props)
    .filter(([key]) => key !== 'children' && key !== 'key')
    .map(([key, value]) => {
      if (value === true) return ` ${key}`;
      if (value === false) return '';
      return ` ${key}="${value}"`;
    })
    .join('');

  if (SELF_CLOSING_TAGS.has(type)) {
    return `<${type}${attributes}/>`;
  }

  return `<${type}${attributes}>${childHtml}</${type}>`;
}

export function renderToString(element: DOMElement | string | null | number): string {
  if (!element && element !== 0) return '';
  if (typeof element === 'string') return element;
  if (typeof element === 'number') return String(element);
  return renderElementToHTML(element);
}

export function getComponentName(
  type: string | ((props: JSXElementProps) => JSXNode),
): string {
  if (typeof type === 'function') {
    const fn = type as { displayName?: string; name?: string };
    return fn.displayName ?? fn.name ?? 'Anonymous';
  }
  return type;
}

export function createPropsProxy(props: JSXElementProps): JSXElementProps {
  return new Proxy(props, {
    get(target, prop) {
      if (prop === 'toJSON') {
        return () => target;
      }
      return target[prop as string];
    },
  });
}
