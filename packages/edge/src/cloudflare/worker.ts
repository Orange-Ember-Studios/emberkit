import { injectPublicEnv, type InjectPublicEnvOptions } from './inject-public-env.js';

export interface CloudflareAssetsBinding {
  fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
}

export interface CloudflareAssetsEnv {
  ASSETS: CloudflareAssetsBinding;
}

export interface CloudflareWorkerOptions<
  Env extends CloudflareAssetsEnv = CloudflareAssetsEnv,
> {
  /** Static asset binding (default `ASSETS`). */
  assetsBinding?: keyof Env & string;
  /** API prefix (default `/api`). */
  apiPrefix?: string;
  /** Handle `/api/*` before static assets. */
  handleApi?: (request: Request, env: Env) => Response | Promise<Response>;
  /**
   * Run after API routing, before `ASSETS.fetch`.
   * Return a `Response` to short-circuit (redirects, auth).
   */
  beforeAssets?: (
    request: Request,
    env: Env,
  ) => Response | Promise<Response | null | undefined>;
  /** Inject `window.__CF_ENV__` (or custom global) into HTML asset responses. */
  injectPublicEnv?: boolean | InjectPublicEnvOptions;
}

function matchesApiPrefix(pathname: string, prefix: string): boolean {
  const normalized = prefix.endsWith('/') ? prefix.slice(0, -1) : prefix;
  return pathname === normalized || pathname.startsWith(`${normalized}/`);
}

/**
 * Production Worker entry pattern: `/api/*` handler + `ASSETS` SPA fallback.
 * Used by orangeember.com; customize with `beforeAssets` for i18n or auth.
 */
export function createCloudflareWorker<
  Env extends CloudflareAssetsEnv = CloudflareAssetsEnv,
>(options: CloudflareWorkerOptions<Env> = {}): {
  fetch(request: Request, env: Env): Promise<Response>;
} {
  const assetsBinding = (options.assetsBinding ?? 'ASSETS') as keyof Env & string;
  const apiPrefix = options.apiPrefix ?? '/api';

  return {
    async fetch(request, env) {
      const url = new URL(request.url);
      const pathname = url.pathname;

      if (options.handleApi && matchesApiPrefix(pathname, apiPrefix)) {
        return options.handleApi(request, env);
      }

      if (options.beforeAssets) {
        const early = await options.beforeAssets(request, env);
        if (early) return early;
      }

      const assets = env[assetsBinding] as CloudflareAssetsBinding | undefined;
      if (!assets?.fetch) {
        return new Response('ASSETS binding is not configured', { status: 500 });
      }

      let response = await assets.fetch(request);

      if (options.injectPublicEnv) {
        const injectOpts =
          options.injectPublicEnv === true
            ? {}
            : options.injectPublicEnv;
        response = await injectPublicEnv(
          response,
          env as Record<string, unknown>,
          injectOpts,
        );
      }

      return response;
    },
  };
}
