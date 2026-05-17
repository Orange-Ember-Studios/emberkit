import { describe, it, expect, vi } from 'vitest';
import { createElement } from '../../runtime/index.js';
import { createLoaderData, createLoaderError } from '../../loader/types.js';
import {
  buildRoutePropsFromLoader,
  getStatusFromLoaderResult,
  renderMatchedRouteModule,
  resolvePrerenderPaths,
} from '../helpers/matched-route.js';

describe('buildRoutePropsFromLoader', () => {
  it('passes data to route props on success', () => {
    const props = buildRoutePropsFromLoader(createLoaderData({ title: 'Hi' }), {
      params: { slug: 'hi' },
      pathname: '/hi',
    });
    expect(props.data).toEqual({ title: 'Hi' });
    expect(props.params).toEqual({ slug: 'hi' });
  });

  it('passes error to route props on failure', () => {
    const props = buildRoutePropsFromLoader(createLoaderError('NOT_FOUND', 'Missing', 404), {
      pathname: '/x',
    });
    expect(props.error).toEqual({ code: 'NOT_FOUND', message: 'Missing', status: 404 });
  });
});

describe('getStatusFromLoaderResult', () => {
  it('returns loader error status', () => {
    expect(getStatusFromLoaderResult(createLoaderError('X', 'Y', 404))).toBe(404);
  });

  it('returns 200 when no error', () => {
    expect(getStatusFromLoaderResult(createLoaderData({ ok: true }))).toBe(200);
  });
});

describe('renderMatchedRouteModule', () => {
  it('awaits loader and renders HTML with data', async () => {
    const Page = ({ data }: { data?: { message: string } }) =>
      createElement('p', null, data?.message ?? 'empty');

    const result = await renderMatchedRouteModule({
      url: '/hello',
      pathname: '/hello',
      params: {},
      routeModule: {
        default: Page,
        loader: () => createLoaderData({ message: 'From loader' }),
      },
      wrapWithRootLayout: async (Route) => Route,
    });

    expect(result.status).toBe(200);
    expect(result.appHtml).toContain('From loader');
    expect(result.loaderState.pathname).toBe('/hello');
  });
});

describe('resolvePrerenderPaths', () => {
  it('merges static paths with config paths and discover', async () => {
    const discover = vi.fn().mockResolvedValue(['/blog/a', '/blog/b']);
    const paths = await resolvePrerenderPaths(['/', '/about'], {
      paths: ['/contact'],
      discover,
      exclude: ['/about'],
    });
    expect(paths).toEqual(['/', '/blog/a', '/blog/b', '/contact']);
    expect(discover).toHaveBeenCalledOnce();
  });
});
