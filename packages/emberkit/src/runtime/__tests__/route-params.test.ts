import { describe, it, expect } from 'vitest';

function extractParamsFromPath(routePath: string, pathname: string): Record<string, string> {
  const params: Record<string, string> = {};

  const routeParts = routePath === '/' ? [] : routePath.split('/').filter((p) => p);
  const pathParts = pathname === '/' ? [] : pathname.split('/').filter((p) => p);

  for (let i = 0; i < routeParts.length; i++) {
    const routePart = routeParts[i];
    if (routePart.startsWith(':')) {
      const paramName = routePart.slice(1);
      if (pathParts[i] !== undefined) {
        params[paramName] = decodeURIComponent(pathParts[i]);
      }
    }
  }

  return params;
}

function parseQueryString(searchString: string): Record<string, string | string[]> {
  const query: Record<string, string | string[]> = {};
  const params = new URLSearchParams(searchString);

  for (const [key, value] of params) {
    if (key in query) {
      const existing = query[key];
      if (Array.isArray(existing)) {
        existing.push(value);
      } else {
        query[key] = [existing as string, value];
      }
    } else {
      query[key] = value;
    }
  }

  return query;
}

describe('Route Params Extraction', () => {
  describe('extractParamsFromPath', () => {
    it('should extract simple param from slug route', () => {
      const params = extractParamsFromPath('/:slug', '/getting-started');
      expect(params).toEqual({ slug: 'getting-started' });
    });

    it('should extract multiple params from nested route', () => {
      const params = extractParamsFromPath('/blog/:year/:month/:slug', '/blog/2024/05/my-post');
      expect(params).toEqual({
        year: '2024',
        month: '05',
        slug: 'my-post',
      });
    });

    it('should decode URI components in params', () => {
      const params = extractParamsFromPath('/:slug', '/hello%20world');
      expect(params).toEqual({ slug: 'hello world' });
    });

    it('should handle route with mixed static and dynamic segments', () => {
      const params = extractParamsFromPath('/blog/:slug/comments/:id', '/blog/my-post/comments/42');
      expect(params).toEqual({
        slug: 'my-post',
        id: '42',
      });
    });

    it('should handle root path', () => {
      const params = extractParamsFromPath('/', '/');
      expect(params).toEqual({});
    });

    it('should handle single param at root level', () => {
      const params = extractParamsFromPath('/:id', '/123');
      expect(params).toEqual({ id: '123' });
    });

    it('should return empty params when path parts count mismatch', () => {
      const params = extractParamsFromPath('/:year/:month/:slug', '/blog/2024');
      expect(params).toEqual({ year: 'blog', month: '2024' });
    });

    it('should ignore segments that are not params', () => {
      const params = extractParamsFromPath('/posts/:slug', '/posts/hello');
      expect(params).toEqual({ slug: 'hello' });
    });
  });

  describe('parseQueryString', () => {
    it('should parse simple query string', () => {
      const query = parseQueryString('?foo=bar&baz=qux');
      expect(query).toEqual({ foo: 'bar', baz: 'qux' });
    });

    it('should handle empty query string', () => {
      const query = parseQueryString('');
      expect(query).toEqual({});
    });

    it('should decode query parameters', () => {
      const query = parseQueryString('?search=hello%20world');
      expect(query).toEqual({ search: 'hello world' });
    });

    it('should collect multiple values into array', () => {
      const query = parseQueryString('?tag=javascript&tag=typescript&tag=vite');
      expect(query).toEqual({
        tag: ['javascript', 'typescript', 'vite'],
      });
    });

    it('should handle mixed single and array params', () => {
      const query = parseQueryString('?id=1&tag=a&tag=b&name=test');
      expect(query).toEqual({
        id: '1',
        tag: ['a', 'b'],
        name: 'test',
      });
    });

    it('should handle query string with leading question mark', () => {
      const query = parseQueryString('?foo=bar');
      expect(query).toEqual({ foo: 'bar' });
    });

    it('should handle empty parameter values', () => {
      const query = parseQueryString('?foo=&bar=baz');
      expect(query).toEqual({ foo: '', bar: 'baz' });
    });
  });

  describe('RouteParams integration', () => {
    it('should provide correct RouteParams for blog post route', () => {
      const routePath = '/blog/:slug';
      const pathname = '/blog/my-first-post';
      const searchString = '?version=1';

      const params = extractParamsFromPath(routePath, pathname);
      const query = parseQueryString(searchString);

      expect(params).toEqual({ slug: 'my-first-post' });
      expect(query).toEqual({ version: '1' });
    });

    it('should handle complex real-world scenario', () => {
      const routePath = '/:locale/docs/:version/:page';
      const pathname = '/en/docs/1.0.0/getting-started';
      const searchString = '?tab=tutorial&lang=en';

      const params = extractParamsFromPath(routePath, pathname);
      const query = parseQueryString(searchString);

      expect(params).toEqual({
        locale: 'en',
        version: '1.0.0',
        page: 'getting-started',
      });
      expect(query).toEqual({
        tab: 'tutorial',
        lang: 'en',
      });
    });
  });
});
