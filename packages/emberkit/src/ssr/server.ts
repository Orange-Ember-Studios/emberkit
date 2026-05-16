import type { IncomingMessage, ServerResponse } from 'node:http';
import type { JSXNode } from '../runtime/types.js';
import { renderToHTMLString } from './helpers/render-html.js';
import { drainHeadContent } from '../meta/head-registry.js';

export interface SSRManifest {
  routes: SSRRouteEntry[];
  clientEntry: string;
  assets: string[];
}

export interface SSRRouteEntry {
  path: string;
  component: () => Promise<{ default: (props: Record<string, unknown>) => JSXNode }>;
  isStatic?: boolean;
  prerendered?: boolean;
}

export interface SSRServerOptions {
  manifest: SSRManifest;
  mode: 'ssr' | 'hybrid' | 'static';
  distDir: string;
  template: string;
}

export interface SSRRequestContext {
  url: string;
  pathname: string;
  params: Record<string, string>;
  query: Record<string, string>;
}

const routeToRegex = (routePath: string): { regex: RegExp; paramNames: string[] } => {
  const paramNames: string[] = [];
  const regexStr = routePath
    .replace(/:([^/]+)\*/g, (_, name) => {
      paramNames.push(name);
      return '(.*)';
    })
    .replace(/:([^/]+)/g, (_, name) => {
      paramNames.push(name);
      return '([^/]+)';
    });
  return { regex: new RegExp('^' + regexStr + '$'), paramNames };
};

const matchRoute = (
  routes: SSRRouteEntry[],
  pathname: string,
): { route: SSRRouteEntry; params: Record<string, string> } | null => {
  const normalizedPath = pathname.replace(/\/+$/, '') || '/';

  for (const route of routes) {
    const pattern = routeToRegex(route.path);
    const match = normalizedPath.match(pattern.regex);
    if (match) {
      const params: Record<string, string> = {};
      pattern.paramNames.forEach((name, i) => {
        params[name] = match[i + 1];
      });
      return { route, params };
    }
  }
  return null;
};

const escapeHtml = (str: string): string => {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

export async function renderRoute(
  options: SSRServerOptions,
  context: SSRRequestContext,
): Promise<{ html: string; status: number }> {
  const { manifest, template } = options;

  const sortedRoutes = [...manifest.routes].sort((a, b) => {
    const aScore = a.path.includes(':') ? 0 : 1;
    const bScore = b.path.includes(':') ? 0 : 1;
    return bScore - aScore;
  });

  const match = matchRoute(sortedRoutes, context.pathname);

  let appHtml = '';
  let headContent = '';
  let status = 200;

  if (match) {
    try {
      const mod = await match.route.component();
      const Component = mod.default;

      const element = Component({ params: match.params });
      appHtml = renderToHTMLString(element);

      const collectedHead = drainHeadContent();
      if (collectedHead) {
        headContent = collectedHead;
      }
    } catch (e) {
      console.error('[SSR] Failed to render route:', context.pathname, e);
      appHtml = `<div style="color: red; padding: 20px;">SSR Error: ${escapeHtml(String(e))}</div>`;
      status = 500;
    }
  } else {
    appHtml = '<div style="padding: 20px;">404 - Page not found</div>';
    status = 404;
  }

  let html = template;

  if (html.includes('<body id="app">')) {
    html = html.replace('<body id="app">', '<body id="app">' + appHtml);
  } else if (html.includes('<div id="app">')) {
    html = html.replace('<div id="app"></div>', '<div id="app">' + appHtml + '</div>');
  } else if (html.includes('<div id="app"/>')) {
    html = html.replace('<div id="app"/>', '<div id="app">' + appHtml + '</div>');
  }

  if (headContent && html.includes('</head>')) {
    html = html.replace('</head>', headContent + '</head>');
  }

  return { html, status };
}

export function createSSRHandler(options: SSRServerOptions) {
  return async (req: IncomingMessage, res: ServerResponse): Promise<boolean> => {
    const url = req.url ?? '/';
    const urlObj = new URL(url, `http://${req.headers.host || 'localhost'}`);
    const pathname = urlObj.pathname;

    if (
      pathname.startsWith('/assets/') ||
      pathname.includes('.') ||
      req.headers.accept?.includes('application/json')
    ) {
      return false;
    }

    if (!req.headers.accept?.includes('text/html')) {
      return false;
    }

    const context: SSRRequestContext = {
      url,
      pathname,
      params: {},
      query: Object.fromEntries(urlObj.searchParams),
    };

    try {
      const { html, status } = await renderRoute(options, context);

      res.statusCode = status;
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.end(html);
      return true;
    } catch (error) {
      console.error('[SSR Server Error]', error);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'text/html');
      res.end('<h1>500 - Internal Server Error</h1>');
      return true;
    }
  };
}

export async function prerenderRoutes(
  options: SSRServerOptions,
  outputDir: string,
): Promise<Map<string, string>> {
  const { writeFile, mkdir } = await import('node:fs/promises');
  const { join, dirname } = await import('node:path');

  const prerendered = new Map<string, string>();

  const staticRoutes = options.manifest.routes.filter(
    (route) => route.isStatic || !route.path.includes(':'),
  );

  for (const route of staticRoutes) {
    const context: SSRRequestContext = {
      url: route.path,
      pathname: route.path,
      params: {},
      query: {},
    };

    try {
      const { html } = await renderRoute(options, context);

      const filePath =
        route.path === '/' ? join(outputDir, 'index.html') : join(outputDir, route.path, 'index.html');

      await mkdir(dirname(filePath), { recursive: true });
      await writeFile(filePath, html, 'utf-8');

      prerendered.set(route.path, filePath);
      console.log(`  ✓ Prerendered: ${route.path}`);
    } catch (error) {
      console.error(`  ✗ Failed to prerender: ${route.path}`, error);
    }
  }

  return prerendered;
}
