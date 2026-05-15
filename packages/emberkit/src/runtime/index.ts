import type { JSXElementProps, JSXNode, DOMElement, JSXElement } from './types.js';
import { renderToString, getHandler, clearHandlers } from './helpers/render.js';
import { getSignalByIndex } from '../signals/helpers/core.js';

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

function attachEventHandlers(container: Element): void {
  const elements = container.querySelectorAll('[data-ekclick]');
  elements.forEach((el) => {
    const id = el.getAttribute('data-ekclick');
    if (id) {
      const handler = getHandler(id);
      if (handler) {
        el.addEventListener('click', handler);
        el.removeAttribute('data-ekclick');
      }
    }
  });
}

interface RouteProps {
  params: Record<string, string>;
  query: Record<string, string | string[]>;
  request: Request;
}

function parseQueryString(searchString: string): Record<string, string | string[]> {
  const query: Record<string, string | string[]> = {};
  const params = new URLSearchParams(searchString);

  for (const [key, value] of params) {
    if (key in query) {
      const existing = query[key];
      if (Array.isArray(existing)) {
        existing.push(value);
      } else {
        query[key] = [existing as string, value];
      }
    } else {
      query[key] = value;
    }
  }

  return query;
}

function extractParamsFromPath(routePath: string, pathname: string): Record<string, string> {
  const params: Record<string, string> = {};

  const routeParts = routePath === '/' ? [] : routePath.split('/').filter((p) => p);
  const pathParts = pathname === '/' ? [] : pathname.split('/').filter((p) => p);

  for (let i = 0; i < routeParts.length; i++) {
    const routePart = routeParts[i];
    if (routePart.startsWith(':')) {
      const paramName = routePart.slice(1);
      if (pathParts[i] !== undefined) {
        params[paramName] = decodeURIComponent(pathParts[i]);
      }
    }
  }

  return params;
}

function renderToTarget(
  layout: (props: Record<string, unknown>) => JSXNode,
  target: Element,
  routeComponent?: (props: Record<string, unknown>) => JSXNode,
  routeProps?: RouteProps,
): void {
  clearHandlers();

  const componentProps = routeComponent && routeProps ? routeProps : {};

  const jsxElement: JSXElement = {
    type: layout,
    props: routeComponent ? { children: [createElement(routeComponent, componentProps)] } : {},
  } as JSXElement;

  const html = renderToString(jsxElement);

  target.innerHTML = html;
  attachEventHandlers(target);
  hydrateSignalBindings(target);
}

function hydrateSignalBindings(container: Element): void {
  const els = container.querySelectorAll('[data-ek-bind]');
  els.forEach((el) => {
    const idx = parseInt(el.getAttribute('data-ek-bind') ?? '', 10);
    if (isNaN(idx)) return;
    const sig = getSignalByIndex(idx);
    if (!sig) return;
    const showClasses = el.getAttribute('data-ek-show') ?? '';
    const hideClasses = el.getAttribute('data-ek-hide') ?? '';
    const showWhen = el.getAttribute('data-ek-show-when');
    const hideClass = el.getAttribute('data-ek-hide-class') ?? 'hidden';
    const activeWhen = el.getAttribute('data-ek-active-when');
    const activeClass = el.getAttribute('data-ek-active-class');
    const inactiveClassAttr = el.getAttribute('data-ek-inactive-class');

    sig.subscribe((val: unknown) => {
      if (activeWhen != null && activeClass != null && activeClass.length > 0) {
        const isActive = String(val) === activeWhen;
        activeClass.split(' ').forEach((c) => {
          if (c) el.classList.toggle(c, isActive);
        });
        if (inactiveClassAttr && inactiveClassAttr.length > 0) {
          inactiveClassAttr.split(' ').forEach((c) => {
            if (c) el.classList.toggle(c, !isActive);
          });
        }
        return;
      }
      if (
        activeClass != null &&
        activeClass.length > 0 &&
        (!inactiveClassAttr || inactiveClassAttr.length === 0)
      ) {
        const isVisible = !!val;
        activeClass.split(' ').forEach((c) => {
          if (c) el.classList.toggle(c, isVisible);
        });
        return;
      }
      if (showWhen != null) {
        el.classList.toggle(hideClass, String(val) !== showWhen);
        return;
      }
      if (showClasses || hideClasses) {
        const isVisible = !!val;
        if (showClasses) {
          showClasses.split(' ').forEach((c) => el.classList.toggle(c, isVisible));
        }
        if (hideClasses) {
          hideClasses.split(' ').forEach((c) => el.classList.toggle(c, !isVisible));
        }
        return;
      }
      el.textContent = String(val);
    });
  });
}

export function render(
  element: JSXElement | string | null | ((props: Record<string, unknown>) => JSXNode),
  container: Element | string,
  options?: {
    hydrate?: boolean;
    routes?: Array<{
      path: string;
      component: () => Promise<{ default: (props: Record<string, unknown>) => JSXNode }>;
    }>;
  },
): void {
  if (!element) return;

  const target = typeof container === 'string' ? document.querySelector(container) : container;

  if (!target) {
    throw new Error(`Container element not found: ${container}`);
  }

  const layout =
    typeof element === 'function' ? (element as (props: Record<string, unknown>) => JSXNode) : null;

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

  function matchRoute(pathname: string): (typeof routes)[number] | undefined {
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
            if (routeParts[i] !== pathParts[i]) {
              match = false;
              break;
            }
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

      const params = extractParamsFromPath(matched.path, window.location.pathname);
      const query = parseQueryString(window.location.search);
      const request = new Request(window.location.href);

      const routeProps: RouteProps = { params, query, request };
      renderToTarget(layout, target, mod.default, routeProps);
    } else {
      renderToTarget(layout, target);
    }
  }

  renderCurrentRoute();

  // Global link interceptor for SPA navigation
  document.addEventListener('click', (e) => {
    const link = (e.target as HTMLElement).closest('a');
    if (!link) return;
    const href = link.getAttribute('href');
    if (!href || href.startsWith('http') || href.startsWith('#') || link.target === '_blank')
      return;
    e.preventDefault();
    history.pushState(null, '', href);
    renderCurrentRoute();
  });

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

export function hydrate(element: JSXElement | string | null, container: Element | string): void {
  render(element, container, { hydrate: true });
}

export function flushSync(fn: () => void): void {
  fn();
}

export function isElement(element: unknown): element is JSXElement {
  return typeof element === 'object' && element !== null && 'type' in element && 'props' in element;
}

export { type JSXElement, type JSXNode };
