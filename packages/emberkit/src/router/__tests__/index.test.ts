import { describe, it, expect } from 'vitest';
import { createRoute, matchRoute, sortRoutes, findLayoutChain } from '../index.js';
import {
  normalizePath,
  pathToRegex,
  matchPath,
  scoreRoute,
  isDynamicSegment,
  isCatchAll,
} from '../helpers/path.js';
import type { Route } from '../types.js';

describe('normalizePath', () => {
  it('should normalize paths by adding leading slash', () => {
    expect(normalizePath('/users/')).toBe('/users');
    expect(normalizePath('/users//posts/')).toBe('/users/posts');
    expect(normalizePath('/')).toBe('/');
  });

  it('should normalize multiple slashes', () => {
    expect(normalizePath('///users///posts///')).toBe('//users/posts/');
  });

  it('should return root for empty path', () => {
    expect(normalizePath('')).toBe('/');
  });
});

describe('pathToRegex', () => {
  it('should create regex for static path', () => {
    const { pattern, paramNames } = pathToRegex('/users/posts');
    expect(pattern).toBeDefined();
    expect(paramNames).toEqual([]);
    expect('/users/posts'.match(pattern)).toBeTruthy();
    expect('/users/posts/'.match(pattern)).toBeFalsy();
  });

  it('should extract param names', () => {
    const { pattern, paramNames } = pathToRegex('/users/[id]');
    expect(paramNames).toEqual(['id']);
    const match = '/users/123'.match(pattern);
    expect(match?.[1]).toBe('123');
  });

  it('should handle catch-all routes', () => {
    const { pattern, paramNames } = pathToRegex('/docs/[...rest]');
    expect(paramNames).toEqual(['rest']);
    const match = '/docs/a/b/c'.match(pattern);
    expect(match?.[1]).toBe('a/b/c');
  });
});

describe('matchPath', () => {
  it('should match static paths', () => {
    const pattern = /^\/users$/;
    expect(matchPath(pattern, '/users')).toEqual([]);
    expect(matchPath(pattern, '/users/')).toBeNull();
  });

  it('should extract params', () => {
    const pattern = /^\/users\/([^/]+)$/;
    expect(matchPath(pattern, '/users/123')).toEqual(['123']);
  });
});

describe('scoreRoute', () => {
  it('should score shorter paths higher', () => {
    const shortScore = scoreRoute('/users');
    const longScore = scoreRoute('/users/posts');
    expect(shortScore).toBeGreaterThan(longScore);
  });
});

describe('isDynamicSegment', () => {
  it('should detect dynamic segments', () => {
    expect(isDynamicSegment('[id]')).toBe(true);
    expect(isDynamicSegment('[slug]')).toBe(true);
    expect(isDynamicSegment('posts')).toBe(false);
  });
});

describe('isCatchAll', () => {
  it('should detect catch-all segments', () => {
    expect(isCatchAll('[...rest]')).toBe(true);
    expect(isCatchAll('[id]')).toBe(false);
  });
});

describe('createRoute', () => {
  it('should create route for index page', () => {
    const route = createRoute('src/routes/index.tsx', 'src/routes');
    expect(route).not.toBeNull();
    expect(route?.path).toBe('/');
  });

  it('should create route for nested static page', () => {
    const route = createRoute('src/routes/about.tsx', 'src/routes');
    expect(route?.path).toBe('/about');
  });

  it('should create route for dynamic segment', () => {
    const route = createRoute('src/routes/users/[id].tsx', 'src/routes');
    expect(route?.path).toBe('/users/:id');
    expect(route?.paramNames).toContain('id');
  });

  it('should create route for catch-all', () => {
    const route = createRoute('src/routes/[...slug].tsx', 'src/routes');
    expect(route?.path).toBe('/:slug');
    expect(route?.paramNames).toContain('slug');
  });

  it('should return null for API routes', () => {
    const route = createRoute('src/routes/_api/users.ts', 'src/routes');
    expect(route).toBeNull();
  });

  it('should mark layout routes', () => {
    const route = createRoute('src/routes/_layout.tsx', 'src/routes');
    expect(route?.isLayout).toBe(true);
  });

  it('should mark error routes', () => {
    const route = createRoute('src/routes/_error.tsx', 'src/routes');
    expect(route?.isError).toBe(true);
  });
});

describe('matchRoute', () => {
  it('should match static route', () => {
    const routes: Route[] = [
      createRoute('src/routes/index.tsx', 'src/routes')!,
      createRoute('src/routes/about.tsx', 'src/routes')!,
    ];

    const match = matchRoute(routes, '/about');
    expect(match).not.toBeNull();
    expect(match?.route.path).toBe('/about');
  });

  it('should match and extract params', () => {
    const routes: Route[] = [createRoute('src/routes/users/[id].tsx', 'src/routes')!];

    const match = matchRoute(routes, '/users/123');
    expect(match).not.toBeNull();
    expect(match?.params.id).toBe('123');
  });

  it('should prefer more specific routes', () => {
    const routes: Route[] = [
      createRoute('src/routes/[...all].tsx', 'src/routes')!,
      createRoute('src/routes/index.tsx', 'src/routes')!,
    ];

    const match = matchRoute(routes, '/');
    expect(match?.route.path).toBe('/');
  });
});

describe('sortRoutes', () => {
  it('should sort by specificity', () => {
    const routes: Route[] = [
      createRoute('src/routes/[...all].tsx', 'src/routes')!,
      createRoute('src/routes/index.tsx', 'src/routes')!,
      createRoute('src/routes/users/[id].tsx', 'src/routes')!,
    ];

    const sorted = sortRoutes(routes);
    const index = sorted.findIndex((r) => r.path === '/users/:id');
    expect(index).toBeGreaterThan(-1);
  });
});

describe('findLayoutChain', () => {
  it('should find applicable layouts', () => {
    const routes: Route[] = [
      createRoute('src/routes/_layout.tsx', 'src/routes')!,
      createRoute('src/routes/blog/_layout.tsx', 'src/routes')!,
      createRoute('src/routes/blog/index.tsx', 'src/routes')!,
    ];

    const layouts = findLayoutChain(routes, '/blog');
    expect(layouts.length).toBeGreaterThan(0);
  });

  it('should include root layout', () => {
    const routes: Route[] = [
      createRoute('src/routes/_layout.tsx', 'src/routes')!,
      createRoute('src/routes/blog/index.tsx', 'src/routes')!,
    ];

    const layouts = findLayoutChain(routes, '/blog');
    expect(layouts.some((l) => l.path === '/')).toBe(true);
  });
});
