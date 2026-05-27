import { describe, it, expect } from 'vitest';
import {
  isApiRouteRelativePath,
  relativeApiPathToRoutePath,
  collectApiRouteEntries,
} from '../api-routes.js';

describe('api-routes', () => {
  it('detects _api route files', () => {
    expect(isApiRouteRelativePath('_api/users.ts')).toBe(true);
    expect(isApiRouteRelativePath('admin/_api/posts.ts')).toBe(true);
    expect(isApiRouteRelativePath('admin/blog.ts')).toBe(false);
  });

  it('maps _api files to /api URL paths', () => {
    expect(relativeApiPathToRoutePath('_api/health.ts')).toBe('/api/health');
    expect(relativeApiPathToRoutePath('_api/users.ts')).toBe('/api/users');
    expect(relativeApiPathToRoutePath('_api/users/[id].ts')).toBe('/api/users/:id');
    expect(relativeApiPathToRoutePath('_api/index.ts')).toBe('/api');
  });

  it('collects api route entries from scanned files', () => {
    const routeDir = '/project/src/routes';
    const files = [
      '/project/src/routes/_api/health.ts',
      '/project/src/routes/_api/users/[id].ts',
      '/project/src/routes/index.tsx',
    ];

    const entries = collectApiRouteEntries(files, routeDir);
    expect(entries).toHaveLength(2);
    expect(entries.map((entry) => entry.path)).toEqual(['/api/health', '/api/users/:id']);
  });
});
