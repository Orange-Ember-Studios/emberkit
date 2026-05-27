import { describe, it, expect, vi } from 'vitest';
import { createCloudflareWorker } from '../worker.js';
import { injectPublicEnv } from '../inject-public-env.js';
import { defineWranglerConfig } from '../wrangler-config.js';

describe('createCloudflareWorker', () => {
  it('routes /api to handleApi and other paths to ASSETS', async () => {
    const handleApi = vi.fn(async () => new Response('api'));
    const fetchAssets = vi.fn(async () => new Response('<html><head></head></html>', {
      headers: { 'content-type': 'text/html' },
    }));

    const worker = createCloudflareWorker({
      handleApi,
    });

    const env = { ASSETS: { fetch: fetchAssets } };

    await worker.fetch(new Request('https://example.com/api/health'), env as never);
    expect(handleApi).toHaveBeenCalled();
    expect(fetchAssets).not.toHaveBeenCalled();

    await worker.fetch(new Request('https://example.com/en'), env as never);
    expect(fetchAssets).toHaveBeenCalled();
  });

  it('short-circuits when beforeAssets returns a response', async () => {
    const worker = createCloudflareWorker({
      beforeAssets: async () => Response.redirect('https://example.com/en/', 302),
    });

    const env = {
      ASSETS: { fetch: vi.fn() },
    };

    const res = await worker.fetch(new Request('https://example.com/'), env as never);
    expect(res.status).toBe(302);
    expect(env.ASSETS.fetch).not.toHaveBeenCalled();
  });
});

describe('injectPublicEnv', () => {
  it('injects PUBLIC_* keys into HTML', async () => {
    const html = '<!DOCTYPE html><html><head></head><body></body></html>';
    const response = new Response(html, {
      headers: { 'content-type': 'text/html; charset=utf-8' },
    });

    const out = await injectPublicEnv(response, {
      PUBLIC_TURNSTILE_SITE_KEY: 'site-key',
      JWT_SECRET: 'secret',
    });

    const text = await out.text();
    expect(text).toContain('window.__CF_ENV__');
    expect(text).toContain('PUBLIC_TURNSTILE_SITE_KEY');
    expect(text).not.toContain('JWT_SECRET');
  });
});

describe('defineWranglerConfig', () => {
  it('merges website defaults with app overrides', () => {
    const config = defineWranglerConfig({
      name: 'website',
      main: 'worker.ts',
    });

    expect(config.assets.binding).toBe('ASSETS');
    expect(config.assets.not_found_handling).toBe('single-page-application');
    expect(config.compatibility_flags).toContain('nodejs_compat');
    expect(config.observability?.enabled).toBe(true);
  });
});
