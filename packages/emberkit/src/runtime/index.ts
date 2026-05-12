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

function renderToTarget(
  layout: (props: Record<string, unknown>) => JSXNode,
  target: Element,
  routeComponent?: (props: Record<string, unknown>) => JSXNode,
): void {
  const jsxElement: JSXElement = {
    type: layout,
    props: routeComponent ? { children: [createElement(routeComponent, {})] } : {},
  } as JSXElement;

  const html = renderToString(jsxElement);
  target.innerHTML = html;
}

export function render(
  element: JSXElement | string | null | ((props: Record<string, unknown>) => JSXNode),
  container: Element | string,
  options?: { hydrate?: boolean; routes?: Array<{ path: string; component: () => Promise<{ default: (props: Record<string, unknown>) => JSXNode }> }> },
): void {
  if (!element) return;

  const target =
    typeof container === 'string' ? document.querySelector(container) : container;

  if (!target) {
    throw new Error(`Container element not found: ${container}`);
  }

  const layout = typeof element === 'function'
    ? element as (props: Record<string, unknown>) => JSXNode
    : null;

  if (!layout) {
    const html = renderToString(element as JSXElement);
    target.innerHTML = html;
    return;
  }

  const routes = options?.routes;

  if (!routes || routes.length === 0) {
    renderToTarget(layout, target);
    return;
  }

  function matchRoute(pathname: string): typeof routes[number] | undefined {
    const normalized = pathname === '/' ? '/' : pathname.replace(/\/$/, '');
    for (const route of routes) {
      const routePath = route.path === '/' ? '/' : route.path.replace(/\/$/, '');
      if (routePath === normalized) return route;
      if (routePath !== '/' && normalized.startsWith(routePath + '/')) return route;
      if (routePath !== '/' && routePath.includes(':')) {
        const routeParts = routePath.split('/');
        const pathParts = normalized.split('/');
        if (routeParts.length === pathParts.length) {
          let match = true;
          for (let i = 0; i < routeParts.length; i++) {
            if (routeParts[i].startsWith(':')) continue;
            if (routeParts[i] !== pathParts[i]) { match = false; break; }
          }
          if (match) return route;
        }
      }
    }
    return undefined;
  }

  async function renderCurrentRoute() {
    const matched = matchRoute(window.location.pathname);
    if (matched) {
      const mod = await matched.component();
      renderToTarget(layout, target, mod.default);
    } else {
      renderToTarget(layout, target);
    }
  }

  renderCurrentRoute();

  window.addEventListener('popstate', () => {
    renderCurrentRoute();
  });

  const originalPushState = history.pushState.bind(history);
  history.pushState = function (...args) {
    originalPushState(...args);
    renderCurrentRoute();
  };

  const originalReplaceState = history.replaceState.bind(history);
  history.replaceState = function (...args) {
    originalReplaceState(...args);
    renderCurrentRoute();
  };
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
