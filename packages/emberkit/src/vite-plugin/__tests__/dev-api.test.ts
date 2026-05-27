import { describe, it, expect, vi } from 'vitest';
import { normalizeHandlerModulePath } from '../dev-api-helpers.js';

describe('dev-api helpers', () => {
  it('normalizes relative handler paths from project root', () => {
    expect(normalizeHandlerModulePath('./src/server/api-router.node.ts')).toBe(
      '/src/server/api-router.node.ts',
    );
    expect(normalizeHandlerModulePath('src/server/api-router.node.ts')).toBe(
      '/src/server/api-router.node.ts',
    );
    expect(normalizeHandlerModulePath('/src/server/api-router.node.ts')).toBe(
      '/src/server/api-router.node.ts',
    );
  });
});

describe('devApiPlugin', () => {
  it('registers middleware that forwards matching requests to the handler', async () => {
    const { devApiPlugin } = await import('../dev-api.js');

    const handler = vi.fn(async (_req, res) => {
      res.statusCode = 200;
      res.end('ok');
    });

    const use = vi.fn();
    const server = {
      ssrLoadModule: vi.fn(async () => ({ handleApi: handler })),
      middlewares: { use },
    };

    const plugin = devApiPlugin({
      handler: './src/server/api-router.node.ts',
      export: 'handleApi',
    });
    plugin.configureServer?.(server as never);

    expect(use).toHaveBeenCalledTimes(1);
    const middleware = use.mock.calls[0][0] as (
      req: { url?: string },
      res: { statusCode: number; end: (body: string) => void; headersSent: boolean },
      next: () => void,
    ) => Promise<void>;

    const res = { statusCode: 0, end: vi.fn(), headersSent: false };
    await middleware({ url: '/api/health' }, res, vi.fn());
    expect(handler).toHaveBeenCalled();
    expect(res.statusCode).toBe(200);

    const next = vi.fn();
    await middleware({ url: '/en/blog' }, res, next);
    expect(next).toHaveBeenCalled();
  });
});
