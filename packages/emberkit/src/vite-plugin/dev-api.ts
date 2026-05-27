import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Plugin, ViteDevServer } from 'vite';
import type { DevApiPluginOptions } from './types.js';
import { normalizeHandlerModulePath } from './dev-api-helpers.js';

export const VIRTUAL_API_DEV_ENTRY = 'virtual:emberkit-api-dev-entry';

export type DevApiHandler = (
  req: IncomingMessage,
  res: ServerResponse,
) => void | Promise<void>;

function isApiRequest(url: string): boolean {
  const pathname = url.split('?')[0] ?? url;
  return pathname === '/api' || pathname.startsWith('/api/');
}

function incomingMessageToHeaders(req: IncomingMessage): Headers {
  const headers = new Headers();
  const raw = req.rawHeaders;
  for (let i = 0; i < raw.length; i += 2) {
    const name = raw[i];
    const value = raw[i + 1];
    if (value === undefined) continue;
    headers.append(name, value);
  }
  return headers;
}

async function readNodeBody(req: IncomingMessage): Promise<Buffer | undefined> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.from(chunk as Buffer));
  }
  const body = Buffer.concat(chunks);
  return body.length > 0 ? body : undefined;
}

export async function incomingMessageToRequest(req: IncomingMessage): Promise<Request> {
  const host = req.headers.host ?? 'localhost';
  const url = `http://${host}${req.url ?? '/'}`;
  const body =
    req.method === 'GET' || req.method === 'HEAD' ? undefined : await readNodeBody(req);

  return new Request(url, {
    method: req.method,
    headers: incomingMessageToHeaders(req),
    body: body ? new Uint8Array(body) : undefined,
  });
}

function getSetCookieLines(response: Response): string[] {
  const headers = response.headers;
  if (typeof headers.getSetCookie === 'function') {
    return headers.getSetCookie();
  }
  const single = headers.get('Set-Cookie');
  return single ? [single] : [];
}

export async function writeFetchResponseToNode(
  res: ServerResponse,
  response: Response,
): Promise<void> {
  res.statusCode = response.status;

  const setCookies = getSetCookieLines(response);
  if (setCookies.length) {
    res.setHeader('Set-Cookie', setCookies);
  }

  response.headers.forEach((value, key) => {
    if (key.toLowerCase() === 'set-cookie') return;
    res.setHeader(key, value);
  });

  const body = Buffer.from(await response.arrayBuffer());
  res.end(body);
}

export function registerDevApiMiddleware(
  server: ViteDevServer,
  options: DevApiPluginOptions,
): void {
  const prefix = options.prefix ?? '/api/';
  const exportName = options.export ?? 'default';
  const modulePath = normalizeHandlerModulePath(options.handler);
  let handler: DevApiHandler | null = null;

  server.middlewares.use(async (req, res, next) => {
    const url = req.url ?? '';
    if (!url.startsWith(prefix)) {
      next();
      return;
    }

    try {
      if (!handler) {
        const mod = (await server.ssrLoadModule(modulePath)) as Record<string, DevApiHandler>;
        handler = mod[exportName];
        if (!handler) {
          throw new Error(
            `Dev API handler "${exportName}" not exported from ${modulePath}`,
          );
        }
      }
      await handler(req, res);
    } catch (error) {
      console.error('[emberkit:dev-api]', error);
      if (!res.headersSent) {
        res.statusCode = 500;
        res.end('API error');
      }
    }
  });
}

/** Dev middleware for file-based `src/routes/_api/*` routes (auto-enabled when present). */
export function registerFileBasedDevApiMiddleware(server: ViteDevServer): void {
  server.middlewares.use(async (req, res, next) => {
    const url = req.url ?? '';
    if (!isApiRequest(url)) {
      next();
      return;
    }

    try {
      const mod = (await server.ssrLoadModule(VIRTUAL_API_DEV_ENTRY)) as {
        handleDevApiRequest: (request: Request) => Promise<Response>;
      };
      const request = await incomingMessageToRequest(req);
      const response = await mod.handleDevApiRequest(request);
      await writeFetchResponseToNode(res, response);
    } catch (error) {
      console.error('[emberkit:dev-api]', error);
      if (!res.headersSent) {
        res.statusCode = 500;
        res.end('API error');
      }
    }
  });
}

/** Dev-only Vite middleware that forwards `/api/*` to a custom Node handler module. */
export function devApiPlugin(options: DevApiPluginOptions): Plugin {
  return {
    name: 'emberkit-dev-api',
    configureServer(server) {
      registerDevApiMiddleware(server, options);
    },
  };
}
