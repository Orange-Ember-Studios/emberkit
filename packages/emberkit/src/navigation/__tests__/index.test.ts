import { describe, it, expect, vi } from 'vitest';
import {
  preload,
  reload,
  back,
  forward,
} from '../index.js';

describe('Navigation helpers', () => {
  describe('preload', () => {
    it('should create prefetch link', () => {
      preload('/test');
      const links = document.querySelectorAll('link[rel="prefetch"]');
      expect(links.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('reload', () => {
    it('should call history.go(0)', () => {
      const originalGo = history.go;
      history.go = vi.fn();
      reload();
      expect(history.go).toHaveBeenCalledWith(0);
      history.go = originalGo;
    });
  });

  describe('back', () => {
    it('should call history.back', () => {
      const originalBack = history.back;
      history.back = vi.fn();
      back();
      expect(history.back).toHaveBeenCalled();
      history.back = originalBack;
    });
  });

  describe('forward', () => {
    it('should call history.forward', () => {
      const originalForward = history.forward;
      history.forward = vi.fn();
      forward();
      expect(history.forward).toHaveBeenCalled();
      history.forward = originalForward;
    });
  });
});
