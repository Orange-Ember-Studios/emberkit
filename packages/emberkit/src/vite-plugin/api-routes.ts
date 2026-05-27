/** Map `src/routes/_api/**` files to `/api/*` URL paths. */

import { relative } from 'node:path';

export function isApiRouteRelativePath(relativePath: string): boolean {
  return relativePath.startsWith('_api/') || relativePath.includes('/_api/');
}

export function relativeApiPathToRoutePath(relativePath: string): string {
  let path = relativePath.replace(/^\/+/, '');

  if (path.startsWith('_api/')) {
    path = path.slice('_api/'.length);
  } else {
    const apiIndex = path.indexOf('/_api/');
    if (apiIndex >= 0) {
      path = path.slice(apiIndex + '/_api/'.length);
    }
  }

  path = path
    .replace(/\.(tsx|ts|jsx|js|md|mdx)$/, '')
    .replace(/(^|\/)index$/, '$1')
    .replace(/\[\.\.\.(\w+)\]/g, ':$1*')
    .replace(/\[([^\]]+)\]/g, ':$1');

  if (!path || path === '/') {
    return '/api';
  }

  return `/api/${path.replace(/^\/+/, '')}`;
}

export interface ApiRouteManifestEntry {
  path: string;
  importPath: string;
}

export function collectApiRouteEntries(files: string[], routeDir: string): ApiRouteManifestEntry[] {
  const entries: ApiRouteManifestEntry[] = [];

  for (const file of files) {
    const relativePath = relative(routeDir, file).replace(/\\/g, '/');
    if (!isApiRouteRelativePath(relativePath)) {
      continue;
    }

    entries.push({
      path: relativeApiPathToRoutePath(relativePath),
      importPath: file.replace(/\\/g, '/'),
    });
  }

  entries.sort((a, b) => scoreApiRoutePath(b.path) - scoreApiRoutePath(a.path));
  return entries;
}

function scoreApiRoutePath(routePath: string): number {
  let score = 100;
  const segments = routePath.split('/').filter(Boolean);

  score -= segments.length * 20;

  for (const segment of segments) {
    if (segment.startsWith(':') || segment.startsWith('*') || segment.endsWith('*')) {
      score -= 30;
    } else {
      score += 10;
    }
  }

  if (routePath.includes('*')) {
    score -= 50;
  }

  return Math.max(0, score);
}

export function generateApiRoutesManifestCode(entries: ApiRouteManifestEntry[]): string {
  if (entries.length === 0) {
    return '';
  }

  const routeLines = entries
    .map(
      (entry) =>
        `  { path: ${JSON.stringify(entry.path)}, load: () => import(${JSON.stringify(entry.importPath)}) }`,
    )
    .join(',\n');

  return `import { handleFileBasedApiRequest } from '@emberkit/core/vite-plugin';

export const apiRoutes = [
${routeLines}
];

export async function handleDevApiRequest(request: Request): Promise<Response> {
  return handleFileBasedApiRequest(apiRoutes, request);
}
`;
}
