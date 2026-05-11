import { createElement } from '../runtime/index.js';
import type { JSXElement } from '../runtime/types.js';

export interface ErrorBoundaryProps {
  fallback?: (error: ErrorInfo) => JSXElement | null;
  onError?: (error: Error, errorInfo: string) => void;
  children?: JSXElement | string | null;
}

export interface ErrorInfo {
  message: string;
  stack?: string;
  code?: string;
}

export interface ErrorBoundaryState {
  error: Error | null;
  hasError: boolean;
}

const initialState: ErrorBoundaryState = {
  error: null,
  hasError: false,
};

export class ErrorBoundary {
  private fallbackElement: JSXElement | null = null;
  private props: ErrorBoundaryProps;
  private state: ErrorBoundaryState = { ...initialState };

  constructor(props: ErrorBoundaryProps) {
    this.props = props;
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      error,
      hasError: true,
    };
  }

  componentDidCatch(error: Error, errorInfo: string): void {
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render(): JSXElement | null {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        const info: ErrorInfo = {
          message: this.state.error.message,
        };
        if (this.state.error.stack) {
          info.stack = this.state.error.stack;
        }
        const code = (this.state.error as { code?: string }).code;
        if (code) {
          info.code = code;
        }
        return this.props.fallback(info);
      }

      return createElement('div', { class: 'error-boundary' },
        createElement('h2', null, 'Something went wrong'),
        createElement('p', null, this.state.error.message),
      );
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
    this.state = { ...initialState };
    this.fallbackElement = null;
  }
}

export function createErrorBoundary(props: ErrorBoundaryProps): ErrorBoundary {
  return new ErrorBoundary(props);
}

export function formatErrorMessage(error: Error): string {
  if ('code' in error) {
    return `[${(error as { code: string }).code}] ${error.message}`;
  }
  return error.message;
}

export function logError(error: Error, context?: string): void {
  const prefix = context ? `[${context}] ` : '';
  console.error(`${prefix}${error.name}: ${error.message}`);
  if (error.stack) {
    console.error(error.stack);
  }
}
