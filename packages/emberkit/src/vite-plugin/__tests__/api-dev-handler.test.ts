import { describe, it, expect } from 'vitest';
import { handleFileBasedApiRequest } from '../api-dev-handler.js';

describe('handleFileBasedApiRequest', () => {
  it('invokes the matching HTTP method export and returns JSON data', async () => {
    const routes = [
      {
        path: '/api/health',
        load: async () => ({
          GET: async () => ({ data: { status: 'ok' } }),
        }),
      },
    ];

    const response = await handleFileBasedApiRequest(
      routes,
      new Request('http://localhost/api/health'),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ status: 'ok' });
  });

  it('returns 404 when no route matches', async () => {
    const response = await handleFileBasedApiRequest(
      [],
      new Request('http://localhost/api/missing'),
    );
    expect(response.status).toBe(404);
  });

  it('returns loader errors with the configured status', async () => {
    const routes = [
      {
        path: '/api/users/:id',
        load: async () => ({
          GET: async () => ({
            error: { code: 'NOT_FOUND', message: 'Missing', status: 404 },
          }),
        }),
      },
    ];

    const response = await handleFileBasedApiRequest(
      routes,
      new Request('http://localhost/api/users/9'),
    );

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toMatchObject({ message: 'Missing' });
  });
});
