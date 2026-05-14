import type { DOMElement, JSXElement, JSXElementProps, JSXNode } from '../types.js';

const SELF_CLOSING_TAGS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr',
]);

let handlerCounter = 0;
const handlerRegistry = new Map<string, (e: Event) => void>();
let renderDepth = 0;
const MAX_RENDER_DEPTH = 100;

export function getHandler(id: string): ((e: Event) => void) | undefined {
  return handlerRegistry.get(id);
}

export function clearHandlers(): void {
  handlerRegistry.clear();
  handlerCounter = 0;
}

export function renderElementToHTML(element: JSXElement): string {
  if (!element) return '';
  if (renderDepth > MAX_RENDER_DEPTH) {
    renderDepth = 0;
    return '';
  }
  renderDepth++;
  
  let currentType: string | ((props: Record<string, unknown>) => unknown) = element.type;
  let props = element.props ?? {};
  let depth = 0;

  while (typeof currentType === 'function' && depth < 50) {
    depth++;
    try {
      const result = (currentType as (props: Record<string, unknown>) => unknown)(props);
      if (result && typeof result === 'object' && 'type' in result) {
        currentType = (result as JSXElement).type;
        props = (result as JSXElement).props ?? {};
      } else if (typeof result === 'string' || typeof result === 'number') {
        renderDepth--;
        return String(result);
      } else if (Array.isArray(result)) {
        const r = result.map((item) => renderToString(item as JSXElement | string)).join('');
        renderDepth--;
        return r;
      } else {
        renderDepth--;
        return '';
      }
    } catch (error) {
      renderDepth--;
      console.error('[EmberKit render error]', error);
      return `<div style="color: red;">Error rendering component</div>`;
    }
  }

  const rawChildren = props.children ?? [];
  const children = Array.isArray(rawChildren) ? rawChildren : [rawChildren];
  const childHtml = children
    .map((child) => renderToString(child as JSXElement | string))
    .join('');

  if (currentType === 'Fragment' || currentType === 'React.Fragment') {
    return childHtml;
  }

  // Handle dangerouslySetInnerHTML
  let innerHtml = childHtml;
  for (const [, value] of Object.entries(props)) {
    if (typeof value === 'object' && value !== null && '__html' in (value as Record<string, unknown>)) {
      innerHtml = String((value as { __html: unknown }).__html);
      break;
    }
  }

  const attributes = Object.entries(props)
    .filter(([key, value]) => {
      if (key === 'children' || key === 'key') return false;
      if (typeof value === 'object' && value !== null && '__html' in (value as Record<string, unknown>)) return false;
      if (value == null) return false;
      if (typeof value === 'function' && key !== 'data-ek-bind') return false;
      return true;
    })
    .map(([key, value]) => {
      if (key === 'className') key = 'class';
      if (key === 'strokeWidth' || key === 'strokeLinecap' || key === 'strokeLinejoin') {
        key = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      }
      if (key === 'data-ek-bind' && typeof value === 'function' && (value as any).__idx != null) {
        return ` data-ek-bind="${(value as any).__idx}"`;
      }
      if (value === true) return ` ${key}`;
      if (value === false) return '';
      if (key === 'style' && typeof value === 'object' && value !== null) {
        const styleStr = Object.entries(value as Record<string, unknown>)
          .filter(([, v]) => v != null)
          .map(([prop, val]) => {
            const cssProp = prop.replace(/([A-Z])/g, '-$1').toLowerCase();
            return `${cssProp}: ${val}`;
          })
          .join('; ');
        return ` ${key}="${styleStr}"`;
      }
      return ` ${key}="${value}"`;
    })
    .join('');

  // Register onClick handler as data attribute
  const onClick = props.onClick as ((e: Event) => void) | undefined;
  let onclickAttr = '';
  if (typeof onClick === 'function') {
    const id = `ekh${++handlerCounter}`;
    handlerRegistry.set(id, onClick);
    onclickAttr = ` data-ekclick="${id}"`;
  }

  if (SELF_CLOSING_TAGS.has(currentType as string)) {
    renderDepth--;
    return `<${currentType}${attributes}${onclickAttr}/>`;
  }

  renderDepth--;
  return `<${currentType}${attributes}${onclickAttr}>${innerHtml}</${currentType}>`;
}

export function renderToString(element: JSXElement | string | null | number | unknown[]): string {
  if (!element && element !== 0) return '';
  if (typeof element === 'string') return element;
  if (typeof element === 'number') return String(element);
  if (Array.isArray(element)) return element.map((item) => renderToString(item as JSXElement | string)).join('');
  return renderElementToHTML(element as JSXElement);
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
