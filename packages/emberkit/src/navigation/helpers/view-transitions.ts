/**
 * View Transitions API helpers for EmberKit SPA navigation.
 * Waits for #app DOM updates before the browser captures transition snapshots.
 */

const DEFAULT_APP_ROOT_ID = 'app';
const ROUTE_UPDATE_TIMEOUT_MS = 600;

function getStartViewTransition():
  | ((callback: () => void | Promise<void>) => { finished: Promise<void> })
  | undefined {
  if (typeof document === 'undefined' || !('startViewTransition' in document)) {
    return undefined;
  }
  return (
    document as unknown as {
      startViewTransition: (callback: () => void | Promise<void>) => { finished: Promise<void> };
    }
  ).startViewTransition.bind(document);
}

export function supportsViewTransitions(): boolean {
  return getStartViewTransition() != null;
}

export function withViewTransition(
  callback: () => void | Promise<void>,
): Promise<void> {
  const start = getStartViewTransition();
  if (!start) {
    return Promise.resolve(callback());
  }

  const transition = start(() => Promise.resolve(callback()));

  return transition.finished.catch((error: unknown) => {
    if (error instanceof Error && error.name !== 'AbortError') {
      console.warn('[emberkit:view-transitions] Transition failed:', error);
    }
  });
}

function shouldTransition(anchor: HTMLAnchorElement): boolean {
  if (anchor.origin !== window.location.origin) return false;
  if (anchor.target === '_blank') return false;
  if (anchor.hasAttribute('download')) return false;
  if (anchor.hasAttribute('data-no-transition')) return false;

  const currentPathname = window.location.pathname;
  const targetPathname = new URL(anchor.href, window.location.href).pathname;
  if (currentPathname === targetPathname && anchor.href.includes('#')) {
    return false;
  }

  return true;
}

export function waitForAppUpdate(
  href: string,
  options?: { replace?: boolean; rootId?: string },
): Promise<void> {
  const rootId = options?.rootId ?? DEFAULT_APP_ROOT_ID;

  return new Promise<void>((resolve) => {
    const appRoot = document.getElementById(rootId);
    if (!appRoot) {
      if (options?.replace) {
        history.replaceState(null, '', href);
      } else {
        history.pushState(null, '', href);
      }
      resolve();
      return;
    }

    const observer = new MutationObserver(() => {
      observer.disconnect();
      window.scrollTo({ top: 0, behavior: 'instant' });
      resolve();
    });
    observer.observe(appRoot, { childList: true });

    if (options?.replace) {
      history.replaceState(null, '', href);
    } else {
      history.pushState(null, '', href);
    }

    setTimeout(() => {
      observer.disconnect();
      resolve();
    }, ROUTE_UPDATE_TIMEOUT_MS);
  });
}

let viewTransitionsInitialized = false;

/**
 * Intercepts internal link clicks (capture phase) and wraps SPA navigation in
 * View Transitions when supported. EmberKit's render() link handler is skipped
 * via stopPropagation so navigation runs once.
 */
export function initViewTransitions(options?: { rootId?: string }): void {
  if (typeof window === 'undefined' || viewTransitionsInitialized) return;
  viewTransitionsInitialized = true;

  document.addEventListener(
    'click',
    (event) => {
      const anchor = (event.target as Element).closest('a');
      if (!anchor) return;
      if (!shouldTransition(anchor)) return;

      if (
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.altKey ||
        event.button !== 0
      ) {
        return;
      }

      const href = anchor.getAttribute('href');
      if (!href) return;

      event.preventDefault();
      event.stopPropagation();

      void withViewTransition(() => waitForAppUpdate(href, { rootId: options?.rootId }));
    },
    { capture: true },
  );
}

export function navigateWithViewTransition(
  href: string,
  options?: { replace?: boolean; rootId?: string },
): Promise<void> {
  return withViewTransition(() => waitForAppUpdate(href, options));
}
