import type { DOMElement } from '../../runtime/types.js';
import { createElement } from '../../runtime/index.js';
import { analyzeTree, getHydrationCandidates } from './analyzer.js';
import type { InteractiveElement } from '../types.js';
import { observeOnce } from '../../viewport/observe-once.js';

const hydrationCache = new Map<string, Promise<void>>();
let lazyHydrationIdCounter = 0;

export interface HydrationOptions {
  hydrateInteractive?: boolean;
  rootSelector?: string;
  timeout?: number;
  onHydrated?: (element: InteractiveElement) => void;
  onError?: (element: InteractiveElement, error: Error) => void;
}

export async function hydrateSelective(
  container: Element | string,
  element: DOMElement | null,
  options: HydrationOptions = {},
): Promise<void> {
  const root = typeof container === 'string' ? document.querySelector(container) : container;
  if (!root || !element) return;

  const { hydrateInteractive = true, onHydrated, onError } = options;

  const manifest = analyzeTree(element);

  if (!hydrateInteractive) {
    return;
  }

  const candidates = getHydrationCandidates(manifest, 'eager');

  await Promise.allSettled(
    candidates.map((candidate) => hydrateElement(root, candidate, element, onHydrated, onError)),
  );
}

async function hydrateElement(
  root: Element,
  candidate: InteractiveElement,
  element: DOMElement,
  onHydrated?: (element: InteractiveElement) => void,
  onError?: (element: InteractiveElement, error: Error) => void,
): Promise<void> {
  const cacheKey = candidate.selector;

  if (hydrationCache.has(cacheKey)) {
    await hydrationCache.get(cacheKey);
    return;
  }

  const promise = new Promise<void>((resolve) => {
    const targetElement = root.querySelector(candidate.selector);

    if (!targetElement) {
      resolve();
      return;
    }

    try {
      attachEventHandlers(targetElement, candidate.eventHandlers);

      if (onHydrated) {
        onHydrated(candidate);
      }

      resolve();
    } catch (err) {
      if (onError && err instanceof Error) {
        onError(candidate, err);
      }
      resolve();
    }
  });

  hydrationCache.set(cacheKey, promise);
  await promise;
}

export function attachEventHandlers(element: Element, handlers: Set<string>): void {
  for (const handler of handlers) {
    const attribute = handler.toLowerCase();
    const attrValue = element.getAttribute(attribute);

    if (attrValue) {
      try {
        const fn = new Function('event', attrValue) as EventListener;
        element.addEventListener(mapHandlerToEvent(handler) as keyof ElementEventMap, fn);
      } catch {
        // Invalid handler, skip
      }
    }
  }
}

function mapHandlerToEvent(handler: string): string {
  const mapping: Record<string, string> = {
    onClick: 'click',
    onMouseDown: 'mousedown',
    onMouseUp: 'mouseup',
    onMouseEnter: 'mouseenter',
    onMouseLeave: 'mouseleave',
    onFocus: 'focus',
    onBlur: 'blur',
    onChange: 'change',
    onInput: 'input',
    onSubmit: 'submit',
    onKeyDown: 'keydown',
    onKeyUp: 'keyup',
    onKeyPress: 'keypress',
    onScroll: 'scroll',
    onTouchStart: 'touchstart',
    onTouchEnd: 'touchend',
    onTouchMove: 'touchmove',
    onDragStart: 'dragstart',
    onDrag: 'drag',
    onDragEnd: 'dragend',
    onWheel: 'wheel',
    onAnimationStart: 'animationstart',
    onAnimationEnd: 'animationend',
  };

  return mapping[handler] ?? handler.toLowerCase().replace('on', '');
}

export function createLazyHydration<T>(
  loader: () => Promise<T>,
  options: {
    fallback?: DOMElement | null;
    timeout?: number;
    onLoaded?: (value: T) => void;
    onError?: (error: Error) => void;
  } = {},
): DOMElement {
  const {
    fallback = createElement('div', { 'data-loading': '' }, 'Loading...'),
    timeout,
    onLoaded,
    onError,
  } = options;
  const lazyId = `ek-hydrate-${++lazyHydrationIdCounter}`;

  const container = createElement(
    'div',
    {
      'data-lazy': '',
      'data-lazy-id': lazyId,
      'data-loader': loader.toString(),
    },
    fallback,
  );

  if (typeof IntersectionObserver !== 'undefined') {
    requestAnimationFrame(() => {
      observeAndHydrate(lazyId, loader, timeout, onLoaded, onError);
    });
  } else {
    loadImmediately(loader, onLoaded, onError);
  }

  return container;
}

function observeAndHydrate<T>(
  lazyId: string,
  loader: () => Promise<T>,
  timeout: number | undefined,
  onLoaded: ((value: T) => void) | undefined,
  onError: ((error: Error) => void) | undefined,
): void {
  const root = document.querySelector(`[data-lazy-id="${lazyId}"]`);

  if (!root) {
    return;
  }

  observeOnce(
    root,
    () => {
      void timeout;
      void loadImmediately(loader, onLoaded, onError);
    },
    { rootMargin: '100px' },
  );
}

async function loadImmediately<T>(
  loader: () => Promise<T>,
  onLoaded: ((value: T) => void) | undefined,
  onError: ((error: Error) => void) | undefined,
): Promise<void> {
  try {
    const result = await loader();
    onLoaded?.(result);
  } catch (err) {
    if (err instanceof Error && onError) {
      onError(err);
    }
  }
}

export function clearHydrationCache(): void {
  hydrationCache.clear();
}
