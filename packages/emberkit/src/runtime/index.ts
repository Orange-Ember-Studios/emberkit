import type { JSXElementProps, JSXNode, DOMElement, JSXElement } from './types.js';
import { renderToString, getHandler, clearHandlers } from './helpers/render.js';
import { getSignalByIndex } from '../signals/helpers/core.js';
import { matchRoute } from './helpers/match.js';
import { hydrateLazyInView } from '../viewport/index.js';
import { runLoader } from '../loader/helpers/loader.js';
import type { LoaderFunction } from '../loader/types.js';
import { readLoaderStateFromDocument, clearLoaderStateScript } from '../ssr/helpers/loader-state.js';
import { buildRoutePropsFromLoader } from '../ssr/helpers/matched-route.js';
import { resyncInteractiveAttributesFromRender } from '../hydration/helpers/sync-ssr-attributes.js';

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

export function attachEventHandlers(container: Element): void {
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

function hasServerRenderedContent(target: Element): boolean {
  for (const child of target.childNodes) {
    if (child.nodeType === Node.ELEMENT_NODE) {
      const el = child as Element;
      if (el.tagName === 'SCRIPT') {
        const scriptType = el.getAttribute('type');
        if (scriptType === 'module' || scriptType === 'application/json') {
          continue;
        }
      }
      return true;
    }
    if (child.nodeType === Node.TEXT_NODE && child.textContent?.trim()) {
      return true;
    }
  }
  return false;
}

function renderToTarget(
  layout: (props: Record<string, unknown>) => JSXNode,
  target: Element,
  routeComponent?: (props: Record<string, unknown>) => JSXNode,
  routeProps?: RouteProps,
  options?: { hydrate?: boolean },
): void {
  clearHandlers();

  const componentProps = routeComponent && routeProps ? routeProps : {};

  const jsxElement: JSXElement = {
    type: layout,
    props: routeComponent ? { children: [createElement(routeComponent, componentProps)] } : {},
  } as JSXElement;

  const shouldHydrate =
    options?.hydrate === true ||
    (options?.hydrate !== false && hasServerRenderedContent(target));

  if (!shouldHydrate) {
    const html = renderToString(jsxElement);
    target.innerHTML = html;
  } else {
    resyncInteractiveAttributesFromRender(target, jsxElement);
  }

  hydrateSubtree(target);
  hydrateLazyInView(target);
}

export function hydrateSignalBindings(container: Element): void {
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

export function hydrateSubtree(container: Element): void {
  attachEventHandlers(container);
  hydrateSignalBindings(container);
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

  let isInitialNavigation = true;
  let initialLoaderState = readLoaderStateFromDocument();

  async function resolveRouteProps(
    mod: Record<string, unknown>,
    matchedPath: string,
    hydrate: boolean,
  ): Promise<RouteProps & Record<string, unknown>> {
    const params = extractParamsFromPath(matchedPath, window.location.pathname);
    const query = parseQueryString(window.location.search);
    const request = new Request(window.location.href);
    const base: RouteProps & Record<string, unknown> = { params, query, request };
    const pathname = window.location.pathname;

    if (hydrate && initialLoaderState && initialLoaderState.pathname === pathname) {
      const props = buildRoutePropsFromLoader(
        initialLoaderState.loaderResult ?? { data: undefined },
        { ...base, pathname },
      );
      initialLoaderState = null;
      clearLoaderStateScript();
      return props as RouteProps & Record<string, unknown>;
    }

    const loader = mod.loader as LoaderFunction | undefined;
    if (loader) {
      const loaderResult = await runLoader(loader, { params, query, request });
      return buildRoutePropsFromLoader(loaderResult, { ...base, pathname }) as RouteProps &
        Record<string, unknown>;
    }

    return { ...base, pathname };
  }

  async function renderCurrentRoute() {
    const matched = matchRoute(routes, window.location.pathname);
    const hydrate = isInitialNavigation;
    isInitialNavigation = false;

    if (matched) {
      const mod = await matched.component();
      const routeProps = await resolveRouteProps(mod, matched.path, hydrate);
      renderToTarget(
        layout,
        target,
        mod.default as (props: Record<string, unknown>) => JSXNode,
        routeProps,
        { hydrate },
      );
    } else {
      renderToTarget(layout, target, undefined, undefined, { hydrate });
    }
  }

  renderCurrentRoute();

  // Global link interceptor for SPA navigation
  document.addEventListener('click', (e) => {
    const link = (e.target as HTMLElement).closest('a');
    if (!link) return;
    const href = link.getAttribute('href');
    if (!href || href.startsWith('http') || link.target === '_blank') return;

    // Handle anchor links
    if (href.startsWith('#')) return; // Pure anchor link (e.g., #section)

    // Check if link is to an anchor on the same page (e.g., /current-page#section)
    if (href.includes('#')) {
      const [linkPath] = href.split('#');
      const currentPath = window.location.pathname;
      
      // If the path portion matches current page, it's a same-page anchor
      if (linkPath === currentPath || linkPath === '') {
        return; // Allow default browser behavior to scroll to anchor
      }
    }

    e.preventDefault();
    history.pushState(null, '', href);
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
