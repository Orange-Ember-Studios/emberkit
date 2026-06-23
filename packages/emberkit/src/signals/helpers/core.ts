import type { Signal, SignalOptions } from '../types.js';

let sigIndex = 0;
const sigRegistry = new Map<
  number,
  { subscribe: (fn: (v: unknown) => void) => () => void; peek: () => unknown }
>();

type EffectRunner = () => void;
type DepSet = Set<EffectRunner>;

let activeEffect: EffectRunner | null = null;
let untrackDepth = 0;
let batchDepth = 0;
let effectDepth = 0;
const batchedEffects = new Set<EffectRunner>();
const batchedSubs = new Set<() => void>();

const MAX_EFFECT_DEPTH = 100;

const effectDeps = new Map<EffectRunner, Set<DepSet>>();

function track(depSet: DepSet): void {
  if (!activeEffect || untrackDepth > 0) return;
  depSet.add(activeEffect);
  let deps = effectDeps.get(activeEffect);
  if (!deps) {
    deps = new Set();
    effectDeps.set(activeEffect, deps);
  }
  deps.add(depSet);
}

function clearEffectDeps(effect: EffectRunner): void {
  const deps = effectDeps.get(effect);
  if (!deps) return;
  for (const depSet of deps) {
    depSet.delete(effect);
  }
  effectDeps.delete(effect);
}

function scheduleEffect(effect: EffectRunner): void {
  if (batchDepth > 0) {
    batchedEffects.add(effect);
    return;
  }
  effect();
}

function scheduleSub(fn: () => void): void {
  if (batchDepth > 0) {
    batchedSubs.add(fn);
    return;
  }
  fn();
}

function flushBatch(): void {
  const effects = [...batchedEffects];
  batchedEffects.clear();
  for (const effect of effects) {
    effect();
  }
  const subs = [...batchedSubs];
  batchedSubs.clear();
  for (const fn of subs) {
    fn();
  }
}

function notifySignal<T>(subs: Set<(v: T) => void>, effects: DepSet, value: T): void {
  for (const effect of [...effects]) {
    scheduleEffect(effect);
  }
  if (subs.size > 0) {
    const fns = [...subs];
    for (let i = 0; i < fns.length; i++) {
      const fn = fns[i] as (v: T) => void;
      scheduleSub(() => fn(value));
    }
  }
}

export function resetSigIndex(): void {
  sigIndex = 0;
  sigRegistry.clear();
  effectDeps.clear();
  activeEffect = null;
  untrackDepth = 0;
  batchDepth = 0;
  effectDepth = 0;
  batchedEffects.clear();
  batchedSubs.clear();
}

export function getSignalByIndex(
  idx: number,
): { subscribe: (fn: (v: unknown) => void) => () => void; peek: () => unknown } | undefined {
  return sigRegistry.get(idx);
}

export function createSignal<T>(
  initialValue: T,
  options: SignalOptions<T> = {},
): [() => T, (newValue: T | ((prev: T) => T)) => void] & Signal<T> {
  let value = initialValue;
  const subs = new Set<(v: T) => void>();
  const effects: DepSet = new Set();
  const equals = options.equals ?? ((a: T, b: T) => a === b);

  const idx = sigIndex++;

  function read(): T {
    track(effects);
    return value;
  }

  function getter(): T {
    return read();
  }
  (getter as { __idx?: number }).__idx = idx;

  function commit(next: T): void {
    if (equals(value, next)) return;
    value = next;
    notifySignal(subs, effects, value);
  }

  function setter(newValue: T | ((prev: T) => T)): void {
    const next = typeof newValue === 'function' ? (newValue as (prev: T) => T)(value) : newValue;
    commit(next);
  }

  function subscribe(fn: (v: T) => void): () => void {
    subs.add(fn);
    return () => subs.delete(fn);
  }

  sigRegistry.set(idx, {
    subscribe: subscribe as (fn: (v: unknown) => void) => () => void,
    peek: () => value,
  });

  const signal = {
    get value(): T {
      return read();
    },
    set value(newValue: T | ((prev: T) => T)) {
      setter(newValue);
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
          return { done: true } as IteratorResult<(() => T) | ((newValue: T) => void)>;
        },
        [Symbol.iterator](): IterableIterator<(() => T) | ((newValue: T) => void)> {
          return this;
        },
      };
    },
  } as [() => T, (newValue: T) => void] & Signal<T>;

  signal[0] = getter;
  signal[1] = setter;
  Object.defineProperty(signal, 'length', { value: 2 });

  return signal;
}

export function createMemo<T>(computation: () => T, _options?: SignalOptions<T>): Signal<T> {
  void _options;
  let value: T;
  const subs = new Set<(v: T) => void>();
  const effects: DepSet = new Set();

  const memoRunner: EffectRunner = () => {
    const prev = value;
    recompute();
    if (prev !== value) {
      notifySignal(subs, effects, value);
    }
  };

  function recompute(): void {
    clearEffectDeps(memoRunner);
    const prevEffect = activeEffect;
    activeEffect = memoRunner;
    try {
      value = computation();
    } finally {
      activeEffect = prevEffect;
    }
  }

  recompute();

  return {
    get value(): T {
      track(effects);
      return value;
    },
    peek(): T {
      return value;
    },
    subscribe(fn: (v: T) => void): () => void {
      subs.add(fn);
      return () => subs.delete(fn);
    },
  };
}

export function createEffect(callback: () => void | (() => void)): () => void {
  if (typeof window === 'undefined') return () => {};

  let cleanup: (() => void) | void;
  let disposed = false;

  const effectRunner: EffectRunner = () => {
    if (disposed) return;
    run();
  };

  function run(): void {
    if (cleanup) {
      const fn = cleanup as () => void;
      cleanup = undefined;
      fn();
    }
    clearEffectDeps(effectRunner);
    const prevEffect = activeEffect;
    activeEffect = effectRunner;
    try {
      effectDepth++;
      if (effectDepth > MAX_EFFECT_DEPTH) {
        throw new Error(
          `createEffect re-ran more than ${MAX_EFFECT_DEPTH} times in a single synchronous pass. ` +
            `This usually means an effect is reading a signal it also writes (for example ` +
            `\`createEffect(() => { setCount(count() + 1); })\`). Derive the value with ` +
            `\`createMemo\` or split read and write across different signals.`,
        );
      }
      cleanup = callback();
    } finally {
      effectDepth--;
      activeEffect = prevEffect;
    }
  }

  run();

  return () => {
    disposed = true;
    clearEffectDeps(effectRunner);
    if (cleanup) {
      const fn = cleanup as () => void;
      cleanup = undefined;
      fn();
    }
  };
}

export function batch<T>(fn: () => T): T {
  batchDepth++;
  try {
    return fn();
  } finally {
    batchDepth--;
    if (batchDepth === 0) {
      flushBatch();
    }
  }
}

export function untrack<T>(fn: () => T): T {
  untrackDepth++;
  try {
    return fn();
  } finally {
    untrackDepth--;
  }
}

export function signal<T>(initialValue: T): Signal<T> {
  return createSignal(initialValue);
}

export function computed<T>(computation: () => T): Signal<T> {
  return createMemo(computation);
}

export function effect(callback: () => void | (() => void)): () => void {
  return createEffect(callback);
}
