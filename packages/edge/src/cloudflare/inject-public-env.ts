export interface InjectPublicEnvOptions {
  /** Keys from worker `env` exposed on `window.__CF_ENV__` (default: all string values). */
  pick?: (env: Record<string, unknown>) => Record<string, string>;
  /** HTML marker to inject after (default: `<head>`). */
  marker?: string;
  /** Global name (default: `__CF_ENV__`). */
  globalName?: string;
}

function defaultPublicPick(env: Record<string, unknown>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(env)) {
    if (key.startsWith('PUBLIC_') && typeof value === 'string') {
      out[key] = value;
    }
  }
  return out;
}

/** Inject public worker env into HTML for client-only `PUBLIC_*` bindings. */
export async function injectPublicEnv(
  response: Response,
  env: Record<string, unknown>,
  options: InjectPublicEnvOptions = {},
): Promise<Response> {
  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.includes('text/html')) {
    return response;
  }

  const marker = options.marker ?? '<head>';
  const globalName = options.globalName ?? '__CF_ENV__';
  const pick = options.pick ?? defaultPublicPick;
  const payload = JSON.stringify(pick(env));
  const html = await response.text();
  const injected = html.replace(
    marker,
    `${marker}<script>window.${globalName}=${payload}</script>`,
  );

  return new Response(injected, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });
}
