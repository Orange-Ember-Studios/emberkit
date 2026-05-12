import type { DOMElement, JSXElement, JSXElementProps, JSXNode } from '../types.js';

const SELF_CLOSING_TAGS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr',
]);

export function renderElementToHTML(element: JSXElement): string {
  if (!element) return '';
  
  let currentType: string | ((props: Record<string, unknown>) => unknown) = element.type;
  let props = element.props ?? {};

  while (typeof currentType === 'function') {
    try {
      const result = (currentType as (props: Record<string, unknown>) => unknown)(props);
      if (result && typeof result === 'object' && 'type' in result) {
        currentType = (result as JSXElement).type;
        props = (result as JSXElement).props ?? {};
      } else if (typeof result === 'string' || typeof result === 'number') {
        return String(result);
      } else {
        return '';
      }
    } catch (error) {
      return `<div style="color: red;">Error rendering component</div>`;
    }
  }

  const rawChildren = props.children ?? [];
  const children = Array.isArray(rawChildren) ? rawChildren : [rawChildren];
  const childHtml = children
    .map((child) => {
      if (typeof child === 'string' || typeof child === 'number') {
        return String(child);
      }
      if (typeof child === 'object' && child !== null && 'type' in child) {
        return renderElementToHTML(child as JSXElement);
      }
      return '';
    })
    .join('');

  if (currentType === 'Fragment' || currentType === 'React.Fragment') {
    return childHtml;
  }

  // Handle dangerouslySetInnerHTML
  const dshProp = (props as Record<string, unknown>).dangerouslySetInnerHTML;
  const innerHtml = (dshProp && typeof dshProp === 'object' && '__html' in dshProp)
    ? String((dshProp as { __html: unknown }).__html)
    : childHtml;

  const attributes = Object.entries(props)
    .filter(([key]) => key !== 'children' && key !== 'key' && key !== 'dangerouslySetInnerHTML')
    .filter(([, value]) => typeof value !== 'function' && value != null)
    .map(([key, value]) => {
      // Map React/JSX prop names to HTML attributes
      if (key === 'className') key = 'class';
      if (key === 'strokeWidth' || key === 'strokeLinecap' || key === 'strokeLinejoin') {
        key = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      }
      
      if (value === true) return ` ${key}`;
      if (value === false) return '';
      return ` ${key}="${value}"`;
    })
    .join('');

  if (SELF_CLOSING_TAGS.has(currentType as string)) {
    return `<${currentType}${attributes}/>`;
  }

  return `<${currentType}${attributes}>${innerHtml}</${currentType}>`;
}

export function renderToString(element: JSXElement | string | null | number): string {
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
