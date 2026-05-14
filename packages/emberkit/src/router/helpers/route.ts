import type { Route, RouteMatch } from '../types.js';
import { normalizePath, matchPath, scoreRoute, extractSegments } from './path.js';

export function createRoute(filePath: string, routeDir: string = 'src/routes'): Route | null {
  const relativePath = filePath
    .replace(/\\/g, '/')
    .replace(routeDir, '')
    .replace(/\.(tsx|ts|jsx|js|md|mdx)$/, '');

  if (
    relativePath.startsWith('/_api/') ||
    relativePath.startsWith('_api/') ||
    relativePath.includes('/_api/')
  ) {
    return null;
  }

  const isLayout = filePath.includes('/_layout.tsx') || filePath.includes('/_layout.ts');
  const isError = filePath.includes('/_error.tsx') || filePath.includes('/_error.ts');
  const isLoading = filePath.includes('/_loading.tsx') || filePath.includes('/_loading.ts');

  let cleanPath = relativePath
    .replace(/\/_layout$/, '')
    .replace(/\/_layout\/index$/, '')
    .replace(/^\/_layout/, '')
    .replace(/\/_error$/, '')
    .replace(/\/_loading$/, '');

  cleanPath = cleanPath
    .replace(/\/index$/, '')
    .replace(/\/\[/g, '/:')
    .replace(/\[/g, ':')
    .replace(/\]/g, '')
    .replace(/\.\.\./g, '');

  if (cleanPath === '' || cleanPath === '/') {
    return {
      path: '/',
      pattern: /^\/$/,
      paramNames: [],
      filePath,
      fileName: filePath.split('/').pop() ?? '',
      isLayout,
      isError,
      isLoading,
      isApi: false,
    };
  }

  const { pattern, paramNames } = createPatternFromPath(cleanPath);

  return {
    path: normalizePath(cleanPath),
    pattern,
    paramNames,
    filePath,
    fileName: filePath.split('/').pop() ?? '',
    isLayout,
    isError,
    isLoading,
    isApi: false,
  };
}

function createPatternFromPath(path: string): { pattern: RegExp; paramNames: string[] } {
  const paramNames: string[] = [];
  const segments = path.split('/').filter(Boolean);

  const regexSegments = segments.map((segment) => {
    if (segment.startsWith(':')) {
      const paramName = segment.slice(1);
      paramNames.push(paramName);
      return '([^/]+)';
    }
    if (segment.startsWith('*')) {
      return '(.*)';
    }
    return segment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  });

  return {
    pattern: new RegExp('^/' + regexSegments.join('/') + '$'),
    paramNames,
  };
}

export function matchRoute(routes: Route[], pathname: string): RouteMatch | null {
  const normalizedPath = normalizePath(pathname);
  let bestMatch: RouteMatch | null = null;

  for (const route of routes) {
    const paramValues = matchPath(route.pattern, normalizedPath);
    if (paramValues !== null) {
      const params: Record<string, string> = {};
      for (let i = 0; i < route.paramNames.length; i++) {
        const paramName = route.paramNames[i];
        const paramValue = paramValues[i];
        if (paramName !== undefined && paramValue !== undefined) {
          params[paramName] = paramValue;
        }
      }

      const score = scoreRoute(route.path);
      if (!bestMatch || score > bestMatch.score) {
        bestMatch = { route, params, score };
      }
    }
  }

  return bestMatch;
}

export function sortRoutes(routes: Route[]): Route[] {
  return [...routes].sort((a, b) => scoreRoute(b.path) - scoreRoute(a.path));
}

export function findLayoutChain(routes: Route[], pathname: string): Route[] {
  const normalizedPath = normalizePath(pathname);
  const segments = extractSegments(normalizedPath);

  const layouts: Route[] = [];

  for (let i = 0; i <= segments.length; i++) {
    const pathPrefix = '/' + segments.slice(0, i).join('/');

    const layout = routes.find(
      (r) =>
        r.isLayout &&
        (r.path === pathPrefix ||
          r.path === pathPrefix + '/_layout' ||
          r.path === pathPrefix + '/index'),
    );

    if (layout) {
      layouts.push(layout);
    }
  }

  const rootLayout = routes.find((r) => r.isLayout && (r.path === '/' || r.path === '/_layout'));
  if (rootLayout && !layouts.includes(rootLayout)) {
    layouts.unshift(rootLayout);
  }

  return layouts;
}
