import { createElement } from '../../runtime/index.js';
import type { JSXNode } from '../../runtime/types.js';
import { runLoader } from '../../loader/helpers/loader.js';
import type { LoaderContext, LoaderFunction, LoaderResult } from '../../loader/types.js';
import { renderToHTMLString } from './render-html.js';
import type { LoaderStatePayload } from './loader-state.js';

export interface RouteModuleExports {
  default: (props: Record<string, unknown>) => JSXNode;
  loader?: LoaderFunction;
  metadata?: unknown;
}

export interface RenderMatchedRouteOptions {
  url: string;
  pathname: string;
  params: Record<string, string>;
  routeModule: RouteModuleExports;
  wrapWithRootLayout: (
    Route: (props: Record<string, unknown>) => JSXNode,
  ) => Promise<(props: Record<string, unknown>) => JSXNode>;
}

export interface RenderMatchedRouteResult {
  appHtml: string;
  status: number;
  loaderState: LoaderStatePayload;
}

export function parseUrlForLoader(url: string, params: Record<string, string>): LoaderContext {
  const urlObj = new URL(url, 'http://localhost');
  const query: Record<string, string | string[]> = {};
  for (const [key, value] of urlObj.searchParams) {
    if (key in query) {
      const existing = query[key];
      query[key] = Array.isArray(existing) ? [...existing, value] : [existing as string, value];
    } else {
      query[key] = value;
    }
  }
  return {
    params,
    query,
    request: new Request(urlObj.href),
  };
}

export function buildRoutePropsFromLoader(
  loaderResult: LoaderResult<unknown>,
  base: Record<string, unknown>,
): Record<string, unknown> {
  if ('error' in loaderResult) {
    return { ...base, error: loaderResult.error };
  }
  return { ...base, data: loaderResult.data };
}

export function getStatusFromLoaderResult(loaderResult: LoaderResult<unknown> | null): number {
  if (loaderResult && 'error' in loaderResult) {
    return loaderResult.error.status;
  }
  return 200;
}

export async function renderMatchedRouteModule(
  options: RenderMatchedRouteOptions,
): Promise<RenderMatchedRouteResult> {
  const { url, pathname, params, routeModule, wrapWithRootLayout } = options;
  const loaderContext = parseUrlForLoader(url, params);
  const loaderFn = routeModule.loader as LoaderFunction | undefined;
  const loaderResult = await runLoader(loaderFn, loaderContext);
  const status = getStatusFromLoaderResult(loaderResult);

  const baseProps: Record<string, unknown> = {
    params,
    pathname,
    query: loaderContext.query,
    request: loaderContext.request,
  };
  const routeProps = buildRoutePropsFromLoader(loaderResult, baseProps);

  const Route = routeModule.default;
  const Page = await wrapWithRootLayout(Route);
  const element = createElement(Page, routeProps);
  const appHtml = renderToHTMLString(element);

  return {
    appHtml,
    status,
    loaderState: { pathname, loaderResult },
  };
}

export function createWrapWithRootLayout(
  rootLayout: (() => Promise<RouteModuleExports>) | null,
  createEl: typeof createElement,
): (
  Route: (props: Record<string, unknown>) => JSXNode,
) => Promise<(props: Record<string, unknown>) => JSXNode> {
  return async (RouteComponent) => {
    if (!rootLayout) {
      return RouteComponent;
    }
    const layoutMod = await rootLayout();
    const Layout = (layoutMod.default || layoutMod) as (
      props: Record<string, unknown>,
    ) => JSXNode;
    return (routeProps: Record<string, unknown>) =>
      createEl(Layout, {
        pathname: routeProps?.pathname,
        children: createEl(RouteComponent, routeProps),
      });
  };
}

export interface PrerenderConfig {
  paths?: string[];
  exclude?: string[];
  discover?: () => Promise<string[]>;
}

export async function resolvePrerenderPaths(
  staticRoutePaths: string[],
  config?: PrerenderConfig,
): Promise<string[]> {
  const paths = new Set<string>(staticRoutePaths);

  if (config?.paths) {
    for (const path of config.paths) {
      paths.add(path);
    }
  }

  if (config?.discover) {
    const discovered = await config.discover();
    for (const path of discovered) {
      paths.add(path);
    }
  }

  if (config?.exclude) {
    for (const path of config.exclude) {
      paths.delete(path);
    }
  }

  return [...paths].sort();
}
