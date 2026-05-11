export function createDenoAdapter() {
  return {
    name: 'deno-deploy',
    async fetch(request: Request): Promise<Response> {
      const url = new URL(request.url);
      const path = url.pathname;

      if (path.startsWith('/api/')) {
        return handleAPI(request);
      }

      return handlePage(request, path);
    },
  };
}

async function handleAPI(request: Request): Promise<Response> {
  const method = request.method;
  const body = method !== 'GET' && method !== 'HEAD' ? await request.text() : null;

  return new Response(
    JSON.stringify({ method, body: body ? JSON.parse(body) : null }),
    {
      headers: {
        'Content-Type': 'application/json',
        'X-Powered-By': 'EmberKit/Deno',
      },
    },
  );
}

async function handlePage(request: Request, path: string): Promise<Response> {
  const html = await renderPageToHTML(path);

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

async function renderPageToHTML(path: string): Promise<string> {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>EmberKit on Deno</title>
</head>
<body>
  <div id="app">
    <h1>${escapeHtml(path)}</h1>
    <p>Running on Deno Deploy with EmberKit</p>
  </div>
  <script type="module">
    // Zero JS by default - add hydration only when needed
  </script>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str.replace(/[<>&"']/g, (c) => ({
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    '"': '&quot;',
    "'": '&#39;',
  })[c] ?? c);
}

export function createKVStore(namespace: string) {
  const store = new Map<string, { value: string; expireAt?: number }>();

  return {
    async get(key: string): Promise<string | null> {
      const item = store.get(key);
      if (!item) return null;
      if (item.expireAt && Date.now() > item.expireAt) {
        store.delete(key);
        return null;
      }
      return item.value;
    },

    async put(
      key: string,
      value: string,
      options?: { expirationTtl?: number },
    ): Promise<void> {
      store.set(key, {
        value,
        expireAt: options?.expirationTtl ? Date.now() + options.expirationTtl * 1000 : undefined,
      });
    },

    async delete(key: string): Promise<void> {
      store.delete(key);
    },

    async list(): Promise<string[]> {
      return [...store.keys()];
    },
  };
}