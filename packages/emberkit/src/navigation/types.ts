export type NavigationType = 'push' | 'replace' | 'pop' | 'reload';

export interface NavigationOptions {
  replace?: boolean;
  state?: Record<string, unknown>;
  viewTransition?: boolean | ViewTransitionOptions;
}

export interface ViewTransitionOptions {
  skipTransition?: boolean;
  documentViewTransition?: boolean;
  name?: string;
  types?: string[];
}

export interface NavigationState {
  type: NavigationType;
  from: string;
  to: string;
  options?: NavigationOptions;
}

export interface NavigationTrigger {
  type: NavigationType;
  delta?: number;
}

export const VIEW_TRANSITION_API_SUPPORTED =
  typeof document !== 'undefined' && 'startViewTransition' in document;
