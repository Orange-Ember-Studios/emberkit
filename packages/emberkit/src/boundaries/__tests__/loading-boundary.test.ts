import { describe, it, expect, vi } from 'vitest';
import { createLoadingBoundary, LoadingBoundary, Skeleton, createAsyncBoundary } from '../index.js';
import type { JSXElement } from '../index.js';

describe('LoadingBoundary', () => {
  describe('createLoadingBoundary', () => {
    it('should create a LoadingBoundary instance', () => {
      const boundary = createLoadingBoundary({});
      expect(boundary).toBeInstanceOf(LoadingBoundary);
    });

    it('should not be loading initially', () => {
      const boundary = createLoadingBoundary({});
      expect(boundary.isLoading()).toBe(false);
    });

    it('should start loading', () => {
      const boundary = createLoadingBoundary({});
      boundary.start();
      expect(boundary.isLoading()).toBe(true);
    });

    it('should stop loading', () => {
      const boundary = createLoadingBoundary({});
      boundary.start();
      boundary.stop();
      expect(boundary.isLoading()).toBe(false);
    });

    it('should reset state', () => {
      const boundary = createLoadingBoundary({});
      boundary.start();
      boundary.reset();
      expect(boundary.isLoading()).toBe(false);
    });

    it('should track elapsed time', () => {
      const boundary = createLoadingBoundary({});
      boundary.start();
      const elapsed = boundary.getElapsedTime();
      expect(elapsed).toBeGreaterThanOrEqual(0);
      boundary.stop();
    });

    it('should render default fallback when loading', () => {
      const boundary = createLoadingBoundary({});
      boundary.start();
      const result = boundary.render();
      expect(result).not.toBeNull();
    });

    it('should render custom fallback when loading', () => {
      const boundary = createLoadingBoundary({
        fallback: 'Custom loading...' as unknown as JSXElement,
      });
      boundary.start();
      const result = boundary.render();
      expect(result).not.toBeNull();
    });

    it('should render children when not loading', () => {
      const boundary = createLoadingBoundary({
        children: 'Content' as unknown as JSXElement,
      });
      const result = boundary.render();
      expect(result).not.toBeNull();
    });
  });

  describe('Skeleton', () => {
    it('should create a skeleton element', () => {
      const skeleton = Skeleton({});
      expect(skeleton).toBeDefined();
      expect(skeleton.type).toBe('div');
    });

    it('should apply width and height', () => {
      const skeleton = Skeleton({ width: '50px', height: '20px' });
      expect(skeleton.props.style).toBeDefined();
    });

    it('should support different variants', () => {
      const circular = Skeleton({ variant: 'circular' });
      const rectangular = Skeleton({ variant: 'rectangular' });

      expect(circular).toBeDefined();
      expect(rectangular).toBeDefined();
    });

    it('should support different animations', () => {
      const pulse = Skeleton({ animation: 'pulse' });
      const wave = Skeleton({ animation: 'wave' });
      const none = Skeleton({ animation: 'none' });

      expect(pulse).toBeDefined();
      expect(wave).toBeDefined();
      expect(none).toBeDefined();
    });
  });

  describe('createAsyncBoundary', () => {
    it('should create an async boundary', async () => {
      const asyncBoundary = createAsyncBoundary(() => Promise.resolve('data'));

      expect(asyncBoundary).toHaveProperty('load');
      expect(asyncBoundary).toHaveProperty('render');
      expect(asyncBoundary).toHaveProperty('reset');
    });

    it('should load data successfully', async () => {
      const asyncBoundary = createAsyncBoundary(() => Promise.resolve({ id: 1 }));

      const result = await asyncBoundary.load();
      expect(result).toEqual({ id: 1 });
    });

    it('should call onSuccess callback', async () => {
      const onSuccess = vi.fn();
      const asyncBoundary = createAsyncBoundary(() => Promise.resolve('data'), {
        onSuccess,
      });

      await asyncBoundary.load();
      expect(onSuccess).toHaveBeenCalledWith('data');
    });

    it('should call onError callback on failure', async () => {
      const onError = vi.fn();
      const asyncBoundary = createAsyncBoundary(() => Promise.reject(new Error('Load failed')), {
        onError,
      });

      await expect(asyncBoundary.load()).rejects.toThrow('Load failed');
      expect(onError).toHaveBeenCalled();
    });
  });
});
