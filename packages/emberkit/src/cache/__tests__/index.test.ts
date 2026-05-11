import { describe, it, expect, beforeEach } from 'vitest';
import {
  DataCache,
  createCache,
  getCached,
  setCache,
  invalidateCache,
  clearAllCache,
  buildCacheHeader,
  parseCacheHeader,
  prefetch,
  staleWhileRevalidate,
} from '../index.js';

describe('Cache', () => {
  describe('DataCache', () => {
    let cache: DataCache<string>;

    beforeEach(() => {
      cache = new DataCache<string>(10, 60000);
    });

    it('should set and get values', () => {
      cache.set('key', 'value');
      expect(cache.get('key')).toBe('value');
    });

    it('should return null for missing keys', () => {
      expect(cache.get('nonexistent')).toBeNull();
    });

    it('should respect TTL', async () => {
      const shortCache = new DataCache<string>(10, 50);
      shortCache.set('key', 'value');

      await new Promise((r) => setTimeout(r, 60));

      expect(shortCache.get('key')).toBeNull();
    });

    it('should check existence', () => {
      cache.set('key', 'value');
      expect(cache.has('key')).toBe(true);
      expect(cache.has('missing')).toBe(false);
    });

    it('should delete entries', () => {
      cache.set('key', 'value');
      cache.delete('key');
      expect(cache.get('key')).toBeNull();
    });

    it('should clear all entries', () => {
      cache.set('a', '1');
      cache.set('b', '2');
      cache.clear();
      expect(cache.size()).toBe(0);
    });

    it('should evict oldest when full', () => {
      const smallCache = new DataCache<string>(3);

      smallCache.set('a', '1');
      smallCache.set('b', '2');
      smallCache.set('c', '3');
      smallCache.set('d', '4');

      expect(smallCache.has('a')).toBe(false);
      expect(smallCache.has('d')).toBe(true);
    });
  });

  describe('globalCache', () => {
    beforeEach(() => {
      clearAllCache();
    });

    it('should set and get cached values', () => {
      setCache('test', { value: 123 });
      const result = getCached<{ value: number }>('test');

      expect(result?.value).toBe(123);
    });

    it('should invalidate entries', () => {
      setCache('key', 'data');
      invalidateCache('key');

      expect(getCached('key')).toBeNull();
    });
  });

  describe('buildCacheHeader', () => {
    it('should build cache headers', () => {
      const header = buildCacheHeader({
        maxAge: 3600,
        staleWhileRevalidate: 86400,
        immutable: false,
        mustRevalidate: false,
      });

      expect(header).toContain('max-age=3600');
      expect(header).toContain('stale-while-revalidate=86400');
    });

    it('should include immutable', () => {
      const header = buildCacheHeader({ immutable: true });

      expect(header).toContain('immutable');
    });
  });

  describe('parseCacheHeader', () => {
    it('should parse cache headers', () => {
      const config = parseCacheHeader('max-age=3600, stale-while-revalidate=86400');

      expect(config.maxAge).toBe(3600);
      expect(config.staleWhileRevalidate).toBe(86400);
    });

    it('should detect immutable', () => {
      const config = parseCacheHeader('public, max-age=31536000, immutable');

      expect(config.immutable).toBe(true);
    });
  });

  describe('staleWhileRevalidate', () => {
    it('should return cached data within stale time', async () => {
      let callCount = 0;
      const fetcher = async () => {
        callCount++;
        return { data: 'fresh' };
      };

      const result1 = await staleWhileRevalidate('key', fetcher, { ttl: 60000, staleTime: 30000 });
      const result2 = await staleWhileRevalidate('key', fetcher, { ttl: 60000, staleTime: 30000 });

      expect(result1.data).toBe('fresh');
      expect(result2.data).toBe('fresh');
      expect(callCount).toBe(1);
    });

    it('should refetch after stale time', async () => {
      let callCount = 0;
      const fetcher = async () => {
        callCount++;
        return { data: 'fetched' };
      };

      await staleWhileRevalidate('test-key', fetcher, { ttl: 60000, staleTime: 50 });

      await new Promise((r) => setTimeout(r, 60));

      await staleWhileRevalidate('test-key', fetcher, { ttl: 60000, staleTime: 50 });

      expect(callCount).toBe(2);
    });
  });
});