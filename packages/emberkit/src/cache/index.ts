export interface CacheConfig {
  staleWhileRevalidate?: number;
  maxAge?: number;
  immutable?: boolean;
  mustRevalidate?: boolean;
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
  headers: Record<string, string>;
}

export interface PrefetchOptions {
  priority?: 'high' | 'low';
  as?: 'fetch' | 'image' | 'script' | 'style';
  crossOrigin?: 'anonymous' | 'use-credentials';
}

export interface CacheStrategy {
  type: 'cache-first' | 'network-first' | 'stale-while-revalidate' | 'only-cache';
  cacheConfig?: CacheConfig;
}

export class DataCache<T = unknown> {
  private defaultTTL: number;
  private maxSize: number;
  private store = new Map<string, CacheEntry<T>>();

  constructor(maxSize = 100, defaultTTL = 60000) {
    this.maxSize = maxSize;
    this.defaultTTL = defaultTTL;
  }

  clear(): void {
    this.store.clear();
  }

  delete(key: string): void {
    this.store.delete(key);
  }

  get(key: string): T | null {
    const entry = this.store.get(key);

    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return entry.data;
  }

  has(key: string): boolean {
    const entry = this.store.get(key);
    if (!entry) return false;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return false;
    }
    return true;
  }

  set(key: string, data: T, ttl?: number): void {
    if (this.store.size >= this.maxSize) {
      const oldest = this.findOldest();
      if (oldest) this.store.delete(oldest);
    }

    const now = Date.now();

    this.store.set(key, {
      data,
      timestamp: now,
      expiresAt: now + (ttl ?? this.defaultTTL),
      headers: {},
    });
  }

  size(): number {
    return this.store.size;
  }

  private findOldest(): string | null {
    let oldest: string | null = null;
    let minTime = Infinity;

    for (const [key, entry] of this.store.entries()) {
      if (entry.timestamp < minTime) {
        minTime = entry.timestamp;
        oldest = key;
      }
    }

    return oldest;
  }
}

export const globalCache = new DataCache();

export function createCache<T>(ttl?: number): DataCache<T> {
  return new DataCache<T>(100, ttl);
}

export function getCached<T>(key: string): T | null {
  return globalCache.get(key) as T | null;
}

export function setCache<T>(key: string, data: T, ttl?: number): void {
  globalCache.set(key, data, ttl);
}

export function invalidateCache(key: string): void {
  globalCache.delete(key);
}

export function clearAllCache(): void {
  globalCache.clear();
}

export async function fetchWithCache(
  url: string,
  options: {
    cache?: CacheConfig;
    ttl?: number;
  } = {},
): Promise<Response> {
  const cacheKey = `fetch:${url}`;
  const cached = globalCache.get(cacheKey);

  if (cached) {
    const cachedResponse = cached as unknown as {
      body: string;
      status: number;
      headers: Record<string, string>;
    };
    return new Response(cachedResponse.body, {
      status: cachedResponse.status,
      headers: cachedResponse.headers,
    });
  }

  const response = await fetch(url, {
    headers: options.cache ? { 'Cache-Control': buildCacheHeader(options.cache) } : undefined,
  });

  const body = await response.text();
  const headers: Record<string, string> = {};

  response.headers.forEach((value, key) => {
    headers[key] = value;
  });

  globalCache.set(cacheKey, { body, status: response.status, headers }, options.ttl);

  return new Response(body, {
    status: response.status,
    headers,
  });
}

export function buildCacheHeader(config: CacheConfig): string {
  const parts: string[] = [];

  if (config.immutable) {
    parts.push('immutable');
  }

  if (config.maxAge !== undefined) {
    parts.push(`max-age=${config.maxAge}`);
  }

  if (config.staleWhileRevalidate !== undefined) {
    parts.push(`stale-while-revalidate=${config.staleWhileRevalidate}`);
  }

  if (config.mustRevalidate) {
    parts.push('must-revalidate');
  }

  return parts.join(', ');
}

export function parseCacheHeader(header: string): CacheConfig {
  const config: CacheConfig = {};

  const maxAgeMatch = header.match(/max-age=(\d+)/);
  if (maxAgeMatch) config.maxAge = parseInt(maxAgeMatch[1]);

  const swrMatch = header.match(/stale-while-revalidate=(\d+)/);
  if (swrMatch) config.staleWhileRevalidate = parseInt(swrMatch[1]);

  config.immutable = header.includes('immutable');
  config.mustRevalidate = header.includes('must-revalidate');

  return config;
}

export function prefetch(url: string, options: PrefetchOptions = {}): void {
  if (typeof document === 'undefined') return;

  const { priority = 'low', as = 'fetch', crossOrigin } = options;

  if (as === 'fetch') {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    fetch(url, {
      signal: controller.signal,
      mode: crossOrigin === 'use-credentials' ? 'cors' : 'no-cors',
    }).finally(() => clearTimeout(timeoutId));
  } else {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    link.setAttribute('as', as);

    if (priority === 'high') {
      link.setAttribute('fetchpriority', 'high');
    }

    if (crossOrigin) {
      link.crossOrigin = crossOrigin;
    }

    document.head.appendChild(link);
  }
}

export function prefetchRoutes(routes: string[], options?: PrefetchOptions): void {
  for (const route of routes) {
    prefetch(route, options);
  }
}

export function prefetchOnHover(element: Element, url: string, options?: PrefetchOptions): void {
  if (typeof document === 'undefined') return;

  const handler = () => {
    prefetch(url, options);
    element.removeEventListener('mouseenter', handler);
  };

  element.addEventListener('mouseenter', handler, { once: true });
}

export function prefetchOnVisible(
  element: Element,
  url: string,
  options?: PrefetchOptions & { rootMargin?: string },
): void {
  if (typeof IntersectionObserver === 'undefined') {
    prefetch(url, options);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0]?.isIntersecting) {
        prefetch(url, options);
        observer.disconnect();
      }
    },
    { rootMargin: options?.rootMargin ?? '100px' },
  );

  observer.observe(element);
}

export async function getCachedLoaderData<T>(
  route: string,
  loader: () => Promise<T>,
  ttl?: number,
): Promise<T> {
  const cacheKey = `loader:${route}`;

  const cached = globalCache.get(cacheKey) as T | null;

  if (cached !== null) {
    return cached;
  }

  const data = await loader();
  globalCache.set(cacheKey, data, ttl);

  return data;
}

export function invalidateLoaderData(route: string): void {
  globalCache.delete(`loader:${route}`);
}

export interface SWRCacheOptions {
  ttl: number;
  staleTime: number;
}

export async function staleWhileRevalidate<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: SWRCacheOptions,
): Promise<T> {
  const cacheKey = `swr:${key}`;

  const cached = globalCache.get(cacheKey) as { data: T; timestamp: number } | null;

  if (cached && Date.now() - cached.timestamp < options.staleTime) {
    return cached.data;
  }

  if (cached) {
    fetcher()
      .then((data) => {
        globalCache.set(cacheKey, { data, timestamp: Date.now() }, options.ttl);
      })
      .catch(() => {});
    return cached.data;
  }

  const data = await fetcher();
  globalCache.set(cacheKey, { data, timestamp: Date.now() }, options.ttl);

  return data;
}
