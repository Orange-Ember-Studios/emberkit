import type { NavigationOptions, ViewTransitionOptions } from '../types.js';
import { navigateWithViewTransition, withViewTransition } from './view-transitions.js';

export async function navigate(to: string, options: NavigationOptions = {}): Promise<void> {
  const { replace = false, state, viewTransition } = options;

  const applyHistory = (): void => {
    if (replace) {
      history.replaceState(state ? { ...history.state, ...state } : history.state, '', to);
    } else {
      history.pushState(state ?? null, '', to);
    }
  };

  if (viewTransition) {
    const viewTransitionOptions = typeof viewTransition === 'boolean' ? {} : viewTransition;
    if (viewTransitionOptions.skipTransition) {
      applyHistory();
      return;
    }
    await navigateWithViewTransition(to, { replace });
    return;
  }

  applyHistory();
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

export async function startViewTransition(options: ViewTransitionOptions = {}): Promise<void> {
  const { skipTransition = false, documentViewTransition = true } = options;

  if (skipTransition || !documentViewTransition) {
    return;
  }

  await withViewTransition(() => undefined);
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
