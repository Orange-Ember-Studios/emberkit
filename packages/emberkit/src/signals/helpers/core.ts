import type { Signal, SignalOptions } from '../types.js';

let sigIndex = 0;
const sigRegistry = new Map<number, { subscribe: (fn: (v: unknown) => void) => () => void }>();

export function resetSigIndex(): void {
  sigIndex = 0;
}

export function getSignalByIndex(
  idx: number,
): { subscribe: (fn: (v: unknown) => void) => () => void } | undefined {
  return sigRegistry.get(idx);
}

export function createSignal<T>(
  initialValue: T,
  options: SignalOptions<T> = {},
): [() => T, (newValue: T | ((prev: T) => T)) => void] & Signal<T> {
  let value = initialValue;
  const subs = new Set<(v: T) => void>();

  const idx = sigIndex++;

  function getter(): T {
    return value;
  }
  (getter as any).__idx = idx;

  function setter(newValue: T | ((prev: T) => T)): void {
    const next = typeof newValue === 'function' ? (newValue as (prev: T) => T)(value) : newValue;
    if (value === next) return;
    value = next;
    if (subs.size > 0) {
      const fns = [...subs];
      for (let i = 0; i < fns.length; i++) fns[i](value);
    }
  }

  function subscribe(fn: (v: T) => void): () => void {
    subs.add(fn);
    return () => subs.delete(fn);
  }

  sigRegistry.set(idx, { subscribe: subscribe as (fn: (v: unknown) => void) => () => void });

  const signal = {
    get value(): T {
      return value;
    },
    set value(newValue: T | ((prev: T) => T)) {
      const next = typeof newValue === 'function' ? (newValue as (prev: T) => T)(value) : newValue;
      if (value === next) return;
      value = next;
      if (subs.size > 0) {
        const fns = [...subs];
        for (let i = 0; i < fns.length; i++) fns[i](value);
      }
    },
    peek(): T {
      return value;
    },
    subscribe,
    [Symbol.iterator](): IterableIterator<(() => T) | ((newValue: T) => void)> {
      let index = 0;
      const methods = [getter, setter];
      return {
        next: () => {
          if (index < methods.length) {
            return { value: methods[index++], done: false };
          }
          return { done: true } as IteratorResult<any>;
        },
        [Symbol.iterator](): IterableIterator<(() => T) | ((newValue: T) => void)> {
          return this;
        },
      };
    },
  } as [() => T, (newValue: T) => void] & Signal<T>;

  signal[0] = getter;
  signal[1] = setter;
  (signal as any).length = 2;

  return signal;
}

export function createMemo<T>(computation: () => T, _options?: SignalOptions<T>): Signal<T> {
  void _options;
  let value: T;
  let isStale = true;

  return {
    get value(): T {
      if (isStale) {
        value = computation();
        isStale = false;
      }
      return value;
    },
    peek(): T {
      if (isStale) {
        return computation();
      }
      return value;
    },
    subscribe: () => (() => {}) as () => void,
  };
}

export function createEffect(callback: () => void | (() => void)): () => void {
  let cleanup: (() => void) | void;

  function run(): void {
    if (cleanup) {
      const fn = cleanup as () => void;
      cleanup = undefined;
      fn();
    }
    cleanup = callback();
  }

  run();

  return () => {
    if (cleanup) {
      const fn = cleanup as () => void;
      cleanup = undefined;
      fn();
    }
  };
}

export function batch<T>(fn: () => T): T {
  return fn();
}

export function untrack<T>(fn: () => T): T {
  return fn();
}
