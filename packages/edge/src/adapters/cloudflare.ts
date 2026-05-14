export function createCloudflareAdapter() {
  return {
    name: "cloudflare-workers",
    async fetch(
      request: Request,
      env: Record<string, unknown>,
      ctx: {
        waitUntil: (promise: Promise<unknown>) => void;
      },
    ): Promise<Response> {
      const url = new URL(request.url);
      const path = url.pathname;

      if (path.startsWith("/api/")) {
        return handleAPIRequest(request, env);
      }

      return handlePageRequest(request, env, ctx);
    },
  };
}

async function handleAPIRequest(
  request: Request,
  env: Record<string, unknown>,
): Promise<Response> {
  const method = request.method;
  const url = new URL(request.url);
  const route = url.pathname.replace("/api/", "");

  const cacheKey = `api:${route}:${method}`;
  const cached = await KV_CACHE.get(cacheKey);

  if (cached && method === "GET") {
    return new Response(cached, {
      headers: {
        "Content-Type": "application/json",
        "X-Cache": "HIT",
      },
    });
  }

  const handler = getAPIHandler(route, method);
  if (!handler) {
    return new Response("Not Found", { status: 404 });
  }

  const response = await handler(request, env);

  if (method === "GET") {
    await KV_CACHE.put(cacheKey, await response.clone().text(), {
      expirationTtl: 60,
    });
  }

  return response;
}

async function handlePageRequest(
  request: Request,
  _env: Record<string, unknown>,
  ctx: { waitUntil: (promise: Promise<unknown>) => void },
): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;

  const staticPage = await getStaticPage(path);
  if (staticPage) {
    return new Response(staticPage, {
      headers: {
        "Content-Type": "text/html",
        "Cache-Control": "public, max-age=3600",
      },
    });
  }

  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue("<!DOCTYPE html><html><head>");
      controller.enqueue('<meta charset="utf-8">');
      controller.enqueue(`<title>${escapeHtml(path)}</title>`);
      controller.enqueue("</head><body>");
      controller.enqueue('<div id="app">');

      ctx.waitUntil(
        renderPage(url.pathname, {
          write(chunk) {
            controller.enqueue(chunk);
          },
          end() {
            controller.enqueue("</div></body></html>");
            controller.close();
          },
        }),
      );
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "X-Powered-By": "EmberKit/Edge",
    },
  });
}

interface RenderContext {
  write(chunk: string): void;
  end(): void;
}

async function renderPage(path: string, ctx: RenderContext): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 0));

  ctx.write("<h1>Page</h1>");
  ctx.write(`<p>Path: ${escapeHtml(path)}</p>`);
  ctx.end();
}

async function getStaticPage(_path: string): Promise<string | null> {
  return null;
}

function getAPIHandler(
  _route: string,
  _method: string,
):
  | ((request: Request, env: Record<string, unknown>) => Promise<Response>)
  | null {
  return null;
}

function escapeHtml(str: string): string {
  return str.replace(
    /[<>&"']/g,
    (c) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        '"': "&quot;",
        "'": "&#39;",
      })[c] ?? c,
  );
}

declare const KV_CACHE: {
  get(key: string): Promise<string | null>;
  put(
    key: string,
    value: string,
    options?: { expirationTtl?: number },
  ): Promise<void>;
};
