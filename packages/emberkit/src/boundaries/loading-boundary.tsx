import { createElement } from '../runtime/index.js';
import type { JSXElement } from '../runtime/types.js';

export interface LoadingBoundaryProps {
  fallback?: JSXElement | string;
  timeout?: number;
  children?: JSXElement | string | null;
}

export interface LoadingBoundaryState {
  isLoading: boolean;
  startTime: number | null;
}

const defaultFallback = createElement('div', { class: 'loading' }, 'Loading...');

export class LoadingBoundary {
  private props: LoadingBoundaryProps;
  private state: LoadingBoundaryState = {
    isLoading: false,
    startTime: null,
  };
  private timeoutId: ReturnType<typeof setTimeout> | null = null;

  constructor(props: LoadingBoundaryProps) {
    this.props = props;
  }

  getElapsedTime(): number {
    if (!this.state.startTime) return 0;
    return Date.now() - this.state.startTime;
  }

  isLoading(): boolean {
    return this.state.isLoading;
  }

  render(): JSXElement | null {
    if (this.state.isLoading) {
      const fallback = this.props.fallback ?? defaultFallback;
      if (typeof fallback === 'string') {
        return createElement('div', { class: 'loading-boundary' }, fallback);
      }
      return fallback;
    }

    const children = this.props.children;
    if (children === null || children === undefined) {
      return null;
    }
    if (typeof children === 'string') {
      return createElement('span', null, children);
    }
    return children;
  }

  reset(): void {
    this.stop();
    this.state = { isLoading: false, startTime: null };
  }

  start(): void {
    this.state = { isLoading: true, startTime: Date.now() };

    if (this.props.timeout) {
      this.timeoutId = setTimeout(() => {
        this.handleTimeout();
      }, this.props.timeout);
    }
  }

  stop(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    this.state = { isLoading: false, startTime: null };
  }

  private handleTimeout(): void {
    this.timeoutId = null;
  }
}

export function createLoadingBoundary(props: LoadingBoundaryProps): LoadingBoundary {
  return new LoadingBoundary(props);
}

export interface SkeletonProps {
  width?: string;
  height?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  animation?: 'pulse' | 'wave' | 'none';
}

export function Skeleton({
  width = '100%',
  height = '1em',
  variant = 'text',
  animation = 'pulse',
}: SkeletonProps): JSXElement {
  const style = {
    width,
    height,
    borderRadius: variant === 'circular' ? '50%' : variant === 'text' ? '4px' : '8px',
  };

  return createElement('div', {
    class: `skeleton skeleton-${variant} skeleton-${animation}`,
    style: JSON.stringify(style),
  }) as JSXElement;
}

export interface createAsyncBoundaryOptions<T> {
  fallback?: JSXElement | string;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

export function createAsyncBoundary<T>(
  loader: () => Promise<T>,
  options: createAsyncBoundaryOptions<T> = {},
): {
  load: () => Promise<T>;
  render: () => JSXElement | null;
  reset: () => void;
} {
  const boundaryOptions: LoadingBoundaryProps = {};
  if (options.fallback !== undefined) {
    boundaryOptions.fallback = options.fallback;
  }
  const boundary = createLoadingBoundary(boundaryOptions);
  let error: Error | null = null;

  return {
    load: async () => {
      boundary.start();
      try {
        const result = await loader();
        options.onSuccess?.(result);
        return result;
      } catch (err) {
        error = err instanceof Error ? err : new Error(String(err));
        options.onError?.(error);
        throw error;
      } finally {
        boundary.stop();
      }
    },
    render: () => boundary.render(),
    reset: () => {
      error = null;
      boundary.stop();
      boundary.reset();
    },
  };
}
