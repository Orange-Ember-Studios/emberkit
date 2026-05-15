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
