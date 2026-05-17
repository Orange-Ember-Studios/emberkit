import type { JSXNode } from '../runtime/types.js';

const lazyContentRegistry = new Map<string, () => JSXNode>();

let lazyIdCounter = 0;

export function registerLazyContent(id: string, loader: () => JSXNode): void {
  lazyContentRegistry.set(id, loader);
}

export function getLazyContent(id: string): (() => JSXNode) | undefined {
  return lazyContentRegistry.get(id);
}

export function unregisterLazyContent(id: string): void {
  lazyContentRegistry.delete(id);
}

export function clearLazyRegistry(): void {
  lazyContentRegistry.clear();
  lazyIdCounter = 0;
}

export function nextLazyId(): string {
  lazyIdCounter += 1;
  return `ek-lazy-${lazyIdCounter}`;
}
