import type { NavigationOptions, ViewTransitionOptions } from '../types.js';

export async function navigate(
  to: string,
  options: NavigationOptions = {},
): Promise<void> {
  const { replace = false, state, viewTransition } = options;

  if (replace) {
    history.replaceState(state ? { ...history.state, ...state } : history.state, '', to);
  } else {
    history.pushState(state ?? null, '', to);
  }

  if (viewTransition) {
    const viewTransitionOptions = typeof viewTransition === 'boolean'
      ? {}
      : viewTransition;

    await startViewTransition(viewTransitionOptions);
  }

  window.dispatchEvent(new PopStateEvent('popstate', { state: history.state }));
}

export function redirect(to: string, status: number = 302): never {
  const response = new Response(null, {
    status,
    headers: {
      Location: to,
    },
  });
  throw response;
}

export function preload(path: string): void {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = path;
  link.as = 'document';
  document.head.appendChild(link);
}

export async function startViewTransition(
  options: ViewTransitionOptions = {},
): Promise<void> {
  const { skipTransition = false, documentViewTransition = true } = options;

  if (skipTransition) {
    return;
  }

  if (documentViewTransition && typeof document !== 'undefined' && 'startViewTransition' in document) {
    const transition = (document as unknown as {
      startViewTransition: (callback: () => void | Promise<void>) => ViewTransition
    }).startViewTransition(async () => {
      await Promise.resolve();
    });

    await transition.finished;
  }
}

export interface ViewTransition {
  readonly finished: Promise<void>;
  readonly ready: Promise<void>;
  readonly updateCallbackDone: Promise<void>;
  skipTransition: () => void;
}

export function reload(): void {
  history.go(0);
}

export function back(): void {
  history.back();
}

export function forward(): void {
  history.forward();
}
