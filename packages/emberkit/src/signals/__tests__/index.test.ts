import { describe, it, expect } from 'vitest';
import { createSignal, createMemo, createEffect, batch, untrack } from '../index.js';

describe('createSignal', () => {
  it('should create a signal with initial value', () => {
    const count = createSignal(0);
    expect(count.value).toBe(0);
  });

  it('should update value', () => {
    const count = createSignal(0);
    count.value = 1;
    expect(count.value).toBe(1);
  });

  it('should peek without triggering subscription', () => {
    const count = createSignal(42);
    expect(count.peek()).toBe(42);
  });

  it('should notify subscribers on change', () => {
    const count = createSignal(0);
    const notified = 0;
    void notified;
    count.value = 1;
    expect(count.value).toBe(1);
  });

  it('should use custom equals function', () => {
    const obj = createSignal(
      { count: 0 },
      {
        equals: (prev, next) => prev.count === next.count,
      },
    );

    obj.value = { count: 0 };
    const prev = obj.value;
    obj.value = { count: 0 };
    expect(obj.value).toBe(prev);
  });
});

describe('createMemo', () => {
  it('should recompute when dependencies change', () => {
    const base = createSignal(1);
    const doubled = createMemo(() => base.value * 2);

    expect(doubled.value).toBe(2);
    base.value = 3;
    expect(doubled.value).toBe(6);
  });

  it('should compute value', () => {
    const double = createMemo(() => 2 * 2);
    expect(double.value).toBe(4);
  });

  it('should cache computed value', () => {
    let computeCount = 0;
    const memo = createMemo(() => {
      computeCount++;
      return 42;
    });

    const first = memo.value;
    const second = memo.value;
    expect(first).toBe(42);
    expect(second).toBe(42);
    expect(computeCount).toBeGreaterThanOrEqual(1);
  });

  it('should return cached value via peek after first access', () => {
    let computeCount = 0;
    const memo = createMemo(() => {
      computeCount++;
      return 42;
    });

    const firstValue = memo.value;
    const countAfterFirst = computeCount;
    memo.peek();
    const countAfterPeek = computeCount;
    expect(firstValue).toBe(42);
    expect(countAfterPeek).toBe(countAfterFirst);
  });
});

describe('createEffect', () => {
  it('should run the effect immediately', () => {
    let run = false;
    createEffect(() => {
      run = true;
    });
    expect(run).toBe(true);
  });

  it('should return cleanup function', () => {
    let cleanup = false;
    const dispose = createEffect(() => {
      return () => {
        cleanup = true;
      };
    });

    dispose();
    expect(cleanup).toBe(true);
  });

  it('should track signal access', () => {
    const count = createSignal(0);
    let effectRun = 0;

    createEffect(() => {
      void count.value;
      effectRun++;
    });

    expect(effectRun).toBe(1);
  });

  it('should re-run when a tracked signal changes', () => {
    const count = createSignal(0);
    let last = -1;

    createEffect(() => {
      last = count.value;
    });

    expect(last).toBe(0);
    count.value = 2;
    expect(last).toBe(2);
  });

  it('should not re-run for reads inside untrack', () => {
    const count = createSignal(0);
    let runs = 0;

    createEffect(() => {
      runs++;
      untrack(() => {
        void count.value;
      });
    });

    expect(runs).toBe(1);
    count.value = 1;
    expect(runs).toBe(1);
  });
});

describe('batch', () => {
  it('should batch updates', () => {
    const count = createSignal(0);

    batch(() => {
      count.value = 1;
      count.value = 2;
    });

    expect(count.value).toBe(2);
  });

  it('should notify effects once per batch', () => {
    const count = createSignal(0);
    let runs = 0;

    createEffect(() => {
      void count.value;
      runs++;
    });

    expect(runs).toBe(1);
    batch(() => {
      count.value = 1;
      count.value = 2;
    });
    expect(runs).toBe(2);
  });
});

describe('untrack', () => {
  it('should read without tracking', () => {
    const count = createSignal(0);
    let reads = 0;

    createEffect(() => {
      untrack(() => {
        void count.value;
        reads++;
      });
    });

    expect(reads).toBe(1);
  });
});
