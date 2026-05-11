import type { Route, RouteMatch, NavigateOptions, RouteParams } from './types.js';
import { createRoute, matchRoute, sortRoutes, findLayoutChain } from './helpers/route.js';
import { normalizePath } from './helpers/path.js';

export type RouterState = {
  pathname: string;
  params: Record<string, string>;
  query: Record<string, string | string[]>;
};

type Listener = (state: RouterState) => void;

class EmberKitRouter {
  private basePath: string = '';
  private currentPath: string = '/';
  private listeners: Set<Listener> = new Set();
  private routes: Route[] = [];

  back(): void {
    history.back();
  }

  createHref(path: string): string {
    return this.basePath + path;
  }

  createRouteParams<T extends Record<string, string>>(params: T): RouteParams<T> {
    return {
      params,
      query: this.parseQuery(this.currentPath),
      request: new Request(this.currentPath),
    };
  }

  forward(): void {
    history.forward();
  }

  getBasePath(): string {
    return this.basePath;
  }

  getCurrentPath(): string {
    return this.currentPath;
  }

  getLayouts(pathname: string): Route[] {
    return findLayoutChain(this.routes, pathname);
  }

  getRoutes(): Route[] {
    return this.routes;
  }

  initialize(routes: Route[]): void {
    this.routes = sortRoutes(routes);
    this.currentPath = normalizePath(window.location.pathname);
  }

  match(pathname: string): RouteMatch | null {
    return matchRoute(this.routes, pathname);
  }

  navigate(path: string, options?: NavigateOptions): void {
    const normalizedPath = normalizePath(path);

    if (options?.replace) {
      history.replaceState(options.state ?? null, '', path);
    } else {
      history.pushState(options?.state ?? null, '', path);
    }

    this.currentPath = normalizedPath;
    this.notify();
  }

  setBasePath(path: string): void {
    this.basePath = path;
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    const state: RouterState = {
      pathname: this.currentPath,
      params: this.match(this.currentPath)?.params ?? {},
      query: this.parseQuery(this.currentPath),
    };

    this.listeners.forEach((listener) => listener(state));
  }

  private parseQuery(pathname: string): Record<string, string | string[]> {
    const query: Record<string, string | string[]> = {};
    const queryIndex = pathname.indexOf('?');

    if (queryIndex === -1) {
      return query;
    }

    const queryString = pathname.slice(queryIndex + 1);
    const pairs = queryString.split('&');

    for (const pair of pairs) {
      const [key, value] = pair.split('=');
      if (!key) continue;

      const decodedKey = decodeURIComponent(key);
      const decodedValue = decodeURIComponent(value ?? '');

      if (query[decodedKey]) {
        const existing = query[decodedKey];
        if (Array.isArray(existing)) {
          existing.push(decodedValue);
        } else {
          query[decodedKey] = [existing, decodedValue];
        }
      } else {
        query[decodedKey] = decodedValue;
      }
    }

    return query;
  }
}

export const router = new EmberKitRouter();

export function createRouter(routes: Route[]): EmberKitRouter {
  const instance = new EmberKitRouter();
  instance.initialize(routes);
  return instance;
}

export function createMemoryRouter(initialPath: string = '/'): EmberKitRouter {
  const instance = new EmberKitRouter();
  instance.navigate(initialPath);
  return instance;
}

export { createRoute, matchRoute, sortRoutes, findLayoutChain };
export type { Route, RouteMatch, NavigateOptions, RouteParams };
