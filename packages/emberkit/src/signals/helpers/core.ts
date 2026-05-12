import type { Signal, SignalOptions } from '../types.js';
import { DEFAULT_EQUALS } from '../types.js';

export function createSignal<T>(
  initialValue: T,
  options: SignalOptions<T> = {},
): [() => T, (newValue: T) => void] & Signal<T> {
  const { equals = DEFAULT_EQUALS } = options;
  let value = initialValue;

  function notify(): void {
    void equals;
  }

  function getter(): T {
    return value;
  }

  function setter(newValue: T): void {
    if (!equals(value, newValue)) {
      value = newValue;
      notify();
    }
  }

  const signal = {
    get value(): T {
      return value;
    },
    set value(newValue: T) {
      if (!equals(value, newValue)) {
        value = newValue;
        notify();
      }
    },
    peek(): T {
      return value;
    },
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

  // Make it array-like for tuple destructuring: [getter, setter]
  signal[0] = getter;
  signal[1] = setter;
  (signal as any).length = 2;

  return signal;
}

export function createMemo<T>(
  computation: () => T,
  _options?: SignalOptions<T>,
): Signal<T> {
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
