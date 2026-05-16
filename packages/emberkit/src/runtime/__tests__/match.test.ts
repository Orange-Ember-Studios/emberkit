import { describe, it, expect } from 'vitest';
import { scoreRoute, matchRoute } from '../helpers/match.js';

describe('scoreRoute', () => {
  it('scores a static single-segment route higher than a dynamic one', () => {
    expect(scoreRoute('/admin')).toBeGreaterThan(scoreRoute('/:language'));
  });

  it('scores a static two-segment route higher than a mixed one', () => {
    expect(scoreRoute('/blog/post')).toBeGreaterThan(scoreRoute('/blog/:id'));
  });

  it('scores a catch-all route lower than a dynamic param route', () => {
    expect(scoreRoute('/:id')).toBeGreaterThan(scoreRoute('/:slug*'));
  });

  it('scores a fully static route higher than fully dynamic with same depth', () => {
    expect(scoreRoute('/en/docs')).toBeGreaterThan(scoreRoute('/:lang/:page'));
  });
});

describe('matchRoute — static-over-dynamic priority', () => {
  type RouteEntry = { path: string; component: () => Promise<unknown> };
  const noop = async () => ({});

  it('static route wins over dynamic when dynamic appears first in array', () => {
    const routes: RouteEntry[] = [
      { path: '/:language', component: noop },
      { path: '/admin', component: noop },
    ];
    expect(matchRoute(routes, '/admin')?.path).toBe('/admin');
  });

  it('static route wins over dynamic when static appears first in array', () => {
    const routes: RouteEntry[] = [
      { path: '/admin', component: noop },
      { path: '/:language', component: noop },
    ];
    expect(matchRoute(routes, '/admin')?.path).toBe('/admin');
  });

  it('dynamic route still matches when no static route exists for the path', () => {
    const routes: RouteEntry[] = [
      { path: '/:language', component: noop },
      { path: '/admin', component: noop },
    ];
    expect(matchRoute(routes, '/en')?.path).toBe('/:language');
  });

  it('deeper static segment beats mixed dynamic route at same depth', () => {
    const routes: RouteEntry[] = [
      { path: '/:lang/docs', component: noop },
      { path: '/en/docs', component: noop },
    ];
    expect(matchRoute(routes, '/en/docs')?.path).toBe('/en/docs');
  });

  it('matches root path exactly', () => {
    const routes: RouteEntry[] = [{ path: '/', component: noop }];
    expect(matchRoute(routes, '/')?.path).toBe('/');
  });

  it('returns undefined when no route matches', () => {
    const routes: RouteEntry[] = [
      { path: '/admin', component: noop },
      { path: '/:language', component: noop },
    ];
    expect(matchRoute(routes, '/a/b/c/d')).toBeUndefined();
  });

  it('ignores trailing slash on the visited URL', () => {
    const routes: RouteEntry[] = [{ path: '/admin', component: noop }];
    expect(matchRoute(routes, '/admin/')?.path).toBe('/admin');
  });

  it('static route at the same level wins with three competing routes', () => {
    const routes: RouteEntry[] = [
      { path: '/:language', component: noop },
      { path: '/admin', component: noop },
      { path: '/settings', component: noop },
    ];
    expect(matchRoute(routes, '/settings')?.path).toBe('/settings');
    expect(matchRoute(routes, '/admin')?.path).toBe('/admin');
    expect(matchRoute(routes, '/fr')?.path).toBe('/:language');
  });
});

describe('matchRoute — parent route must NOT steal child URLs', () => {
  type RouteEntry = { path: string; component: () => Promise<unknown> };
  const noop = async () => ({});

  it('/admin must NOT match /admin/blog — exact child route wins', () => {
    const routes: RouteEntry[] = [
      { path: '/:lang/blog', component: noop },
      { path: '/admin/blog', component: noop },
      { path: '/admin', component: noop },
    ];
    expect(matchRoute(routes, '/admin/blog')?.path).toBe('/admin/blog');
  });

  it('/admin must NOT match /admin/login', () => {
    const routes: RouteEntry[] = [
      { path: '/:lang', component: noop },
      { path: '/admin', component: noop },
      { path: '/admin/login', component: noop },
    ];
    expect(matchRoute(routes, '/admin/login')?.path).toBe('/admin/login');
  });

  it('static child beats dynamic child at the same depth', () => {
    const routes: RouteEntry[] = [
      { path: '/:lang/blog', component: noop },
      { path: '/admin/blog', component: noop },
    ];
    expect(matchRoute(routes, '/admin/blog')?.path).toBe('/admin/blog');
  });

  it('dynamic child matches when no static child exists', () => {
    const routes: RouteEntry[] = [
      { path: '/:lang/blog', component: noop },
      { path: '/admin', component: noop },
    ];
    expect(matchRoute(routes, '/en/blog')?.path).toBe('/:lang/blog');
  });

  it('three-level deep static beats dynamic with same depth', () => {
    const routes: RouteEntry[] = [
      { path: '/:lang/blog/:slug', component: noop },
      { path: '/admin/blog/:id', component: noop },
    ];
    expect(matchRoute(routes, '/admin/blog/42')?.path).toBe('/admin/blog/:id');
  });

  it('no route matches a deeper URL when no matching depth route exists', () => {
    const routes: RouteEntry[] = [
      { path: '/admin', component: noop },
      { path: '/:lang', component: noop },
    ];
    expect(matchRoute(routes, '/admin/blog')).toBeUndefined();
  });
});

describe('matchRoute — real-world website routes', () => {
  type RouteEntry = { path: string; component: () => Promise<unknown> };
  const noop = async () => ({});

  const websiteRoutes: RouteEntry[] = [
    { path: '/404', component: noop },
    { path: '/:lang/blog/:slug', component: noop },
    { path: '/:lang/blog', component: noop },
    { path: '/:lang', component: noop },
    { path: '/:lang/privacy', component: noop },
    { path: '/admin/blog', component: noop },
    { path: '/admin/blog/:id', component: noop },
    { path: '/admin/case_study', component: noop },
    { path: '/admin/case_study/:id', component: noop },
    { path: '/admin', component: noop },
    { path: '/admin/login', component: noop },
    { path: '/admin/profile', component: noop },
    { path: '/admin/project', component: noop },
    { path: '/admin/project/:id', component: noop },
    { path: '/', component: noop },
  ];

  it('/admin → /admin (not /:lang)', () => {
    expect(matchRoute(websiteRoutes, '/admin')?.path).toBe('/admin');
  });

  it('/admin/blog → /admin/blog (not /:lang/blog or /admin)', () => {
    expect(matchRoute(websiteRoutes, '/admin/blog')?.path).toBe('/admin/blog');
  });

  it('/admin/login → /admin/login', () => {
    expect(matchRoute(websiteRoutes, '/admin/login')?.path).toBe('/admin/login');
  });

  it('/admin/blog/42 → /admin/blog/:id (not /:lang/blog/:slug)', () => {
    expect(matchRoute(websiteRoutes, '/admin/blog/42')?.path).toBe('/admin/blog/:id');
  });

  it('/en → /:lang', () => {
    expect(matchRoute(websiteRoutes, '/en')?.path).toBe('/:lang');
  });

  it('/en/blog → /:lang/blog', () => {
    expect(matchRoute(websiteRoutes, '/en/blog')?.path).toBe('/:lang/blog');
  });

  it('/en/blog/hello → /:lang/blog/:slug', () => {
    expect(matchRoute(websiteRoutes, '/en/blog/hello')?.path).toBe('/:lang/blog/:slug');
  });

  it('/ → /', () => {
    expect(matchRoute(websiteRoutes, '/')?.path).toBe('/');
  });

  it('/404 → /404', () => {
    expect(matchRoute(websiteRoutes, '/404')?.path).toBe('/404');
  });

  it('/admin/project/7 → /admin/project/:id', () => {
    expect(matchRoute(websiteRoutes, '/admin/project/7')?.path).toBe('/admin/project/:id');
  });
});
