import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createElement } from '../../runtime/index.js';
import { resyncInteractiveAttributesFromRender } from '../helpers/sync-ssr-attributes.js';
import { getHandler, clearHandlers } from '../../runtime/helpers/render.js';
import { LazyInView } from '../../viewport/lazy-in-view.js';
import { getLazyContent } from '../../viewport/registry.js';

describe('resyncInteractiveAttributesFromRender', () => {
  beforeEach(() => {
    clearHandlers();
    document.body.innerHTML = '';
  });

  it('maps data-ekclick ids from a fresh render onto SSR markup', () => {
    const Button = () =>
      createElement(
        'button',
        {
          onClick: () => undefined,
        },
        'Go',
      );

    const container = document.createElement('div');
    container.innerHTML = '<button data-ekclick="stale-id">Go</button>';
    document.body.appendChild(container);

    const ok = resyncInteractiveAttributesFromRender(
      container,
      createElement(Button, null) as ReturnType<typeof createElement>,
    );

    expect(ok).toBe(true);
    const id = container.querySelector('button')?.getAttribute('data-ekclick');
    expect(id).toBeTruthy();
    expect(getHandler(id!)).toBeTypeOf('function');
  });

  it('registers lazy loaders for SSR lazy placeholders', () => {
    const container = document.createElement('div');
    container.innerHTML =
      '<div data-ek-lazy-in-view="lazy-ssr-1" aria-busy="true"><p>Loading</p></div>';
    document.body.appendChild(container);

    const ok = resyncInteractiveAttributesFromRender(
      container,
      createElement(
        LazyInView,
        { fallback: createElement('p', null, 'Loading') },
        createElement('p', null, 'Loaded'),
      ) as ReturnType<typeof createElement>,
    );

    expect(ok).toBe(true);
    const id = container
      .querySelector('[data-ek-lazy-in-view]')
      ?.getAttribute('data-ek-lazy-in-view');
    expect(id).toBeTruthy();
    expect(getLazyContent(id!)).toBeTypeOf('function');
  });
});
