import { matchRoute } from '../runtime/helpers/match.js';

export interface ApiRouteEntry {
  path: string;
  load: () => Promise<Record<string, unknown>>;
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
  const routeParts = routePath.split('/').filter(Boolean);
  const pathParts = pathname.split('/').filter(Boolean);

  for (let i = 0; i < routeParts.length; i++) {
    const part = routeParts[i];
    if (part.startsWith(':')) {
      const paramName = part.slice(1).replace(/\*$/, '');
      params[paramName] = decodeURIComponent(pathParts[i] ?? '');
    }
  }

  return params;
}

function loaderResultToResponse(result: unknown): Response {
  if (result instanceof Response) {
    return result;
  }

  if (result && typeof result === 'object' && ('data' in result || 'error' in result)) {
    const payload = result as {
      data?: unknown;
      error?: { code?: string; message?: string; status?: number };
    };

    if (payload.error) {
      return new Response(JSON.stringify(payload.error), {
        status: payload.error.status ?? 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(payload.data ?? null), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify(result ?? null), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function handleFileBasedApiRequest(
  routes: ApiRouteEntry[],
  request: Request,
): Promise<Response> {
  const url = new URL(request.url);
  const pathname = url.pathname === '/' ? '/' : url.pathname.replace(/\/$/, '');
  const matched = matchRoute(routes, pathname);

  if (!matched) {
    return new Response(JSON.stringify({ error: 'Not Found', status: 404 }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const mod = await matched.load();
  const method = request.method.toUpperCase();
  const handler = mod[method];

  if (typeof handler !== 'function') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed', status: 405 }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const params = extractParamsFromPath(matched.path, pathname);
  const query = parseQueryString(url.search);
  const result = await (handler as (ctx: Record<string, unknown>) => unknown)({
    params,
    query,
    request,
  });

  return loaderResultToResponse(result);
}
