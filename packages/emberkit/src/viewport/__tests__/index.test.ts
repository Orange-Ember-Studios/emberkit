import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createElement } from '../../runtime/index.js';
import { renderToString } from '../../runtime/helpers/render.js';
import { LazyInView } from '../lazy-in-view.js';
import { observeOnce } from '../observe-once.js';
import {
  clearLazyRegistry,
  getLazyContent,
  nextLazyId,
  registerLazyContent,
  unregisterLazyContent,
} from '../registry.js';

describe('viewport registry', () => {
  beforeEach(() => {
    clearLazyRegistry();
  });

  afterEach(() => {
    clearLazyRegistry();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('generates incrementing lazy ids', () => {
    expect(nextLazyId()).toBe('ek-lazy-1');
    expect(nextLazyId()).toBe('ek-lazy-2');
  });

  it('registers and unregisters lazy content loaders', () => {
    const loader = () => createElement('span', null, 'Loaded');

    registerLazyContent('hero', loader);
    expect(getLazyContent('hero')).toBe(loader);

    unregisterLazyContent('hero');
    expect(getLazyContent('hero')).toBeUndefined();
  });
});

describe('LazyInView', () => {
  beforeEach(() => {
    clearLazyRegistry();
  });

  afterEach(() => {
    clearLazyRegistry();
  });

  it('renders a lazy host with viewport attributes', () => {
    const html = renderToString(
      createElement(LazyInView, {
        children: createElement('strong', null, 'Loaded content'),
        className: 'hero',
        fallback: 'Loading...',
        minHeight: 160,
      }),
    );

    expect(html).toContain('data-ek-lazy-in-view="ek-lazy-1"');
    expect(html).toContain('data-ek-lazy-root-margin="200px"');
    expect(html).toContain('aria-busy="true"');
    expect(html).toContain('class="hero"');
    expect(html).toContain('min-height: 160');
    expect(html).toContain('Loading...');
    expect(html).not.toContain('Loaded content');
  });
});

describe('observeOnce', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('calls the callback when the element intersects', () => {
    let observerCallback: IntersectionObserverCallback | undefined;
    const disconnect = vi.fn();

    class MockIntersectionObserver {
      constructor(callback: IntersectionObserverCallback) {
        observerCallback = callback;
      }

      observe(): void {}

      disconnect = disconnect;
    }

    vi.stubGlobal(
      'IntersectionObserver',
      MockIntersectionObserver as unknown as typeof IntersectionObserver,
    );

    const callback = vi.fn();
    const cleanup = observeOnce(document.createElement('div'), callback);

    observerCallback?.([{ isIntersecting: false } as IntersectionObserverEntry], {} as IntersectionObserver);
    expect(callback).not.toHaveBeenCalled();

    observerCallback?.([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver);
    expect(callback).toHaveBeenCalledOnce();
    expect(disconnect).toHaveBeenCalledOnce();

    cleanup();
    expect(disconnect).toHaveBeenCalledTimes(2);
  });
});
