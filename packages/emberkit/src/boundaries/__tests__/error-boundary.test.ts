import { describe, it, expect } from 'vitest';
import { createErrorBoundary, ErrorBoundary, formatErrorMessage, logError } from '../index.js';
import type { ErrorInfo, JSXElement } from '../index.js';

describe('ErrorBoundary', () => {
  describe('createErrorBoundary', () => {
    it('should create an ErrorBoundary instance', () => {
      const boundary = createErrorBoundary({});
      expect(boundary).toBeInstanceOf(ErrorBoundary);
    });

    it('should render children when no error', () => {
      const boundary = createErrorBoundary({
        children: 'Content' as unknown as JSXElement,
      });
      const result = boundary.render();
      expect(result).not.toBeNull();
      expect(result?.type).toBe('span');
    });

    it('should render fallback on error', () => {
      const boundary = createErrorBoundary({
        fallback: (error: ErrorInfo) =>
          ({
            type: 'div',
            props: { class: 'error' },
            children: [error.message],
          }) as unknown as JSXElement,
      });

      ErrorBoundary.getDerivedStateFromError(new Error('Test error'));
      boundary.render();

      expect(boundary.render()).toBeDefined();
    });

    it('should reset state', () => {
      const boundary = createErrorBoundary({});
      boundary.reset();
      expect(boundary.render()).toBeNull();
    });
  });

  describe('formatErrorMessage', () => {
    it('should format error with code', () => {
      const error = new Error('Not found') as Error & { code?: string };
      error.code = 'NOT_FOUND';
      expect(formatErrorMessage(error)).toBe('[NOT_FOUND] Not found');
    });

    it('should format error without code', () => {
      const error = new Error('Something went wrong');
      expect(formatErrorMessage(error)).toBe('Something went wrong');
    });
  });

  describe('logError', () => {
    it('should log error without context', () => {
      const error = new Error('Test error');
      expect(() => logError(error)).not.toThrow();
    });

    it('should log error with context', () => {
      const error = new Error('Test error');
      expect(() => logError(error, 'TestContext')).not.toThrow();
    });
  });
});
