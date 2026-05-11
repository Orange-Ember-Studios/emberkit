export interface SignalOptions<T> {
  equals?: (prev: T, next: T) => boolean;
}

export interface Signal<T> {
  value: T;
  readonly peek: () => T;
}

export interface ReadonlySignal<T> {
  readonly value: T;
  readonly peek: () => T;
}

export interface WritableSignal<T> extends Signal<T> {
  value: T;
}

export interface EffectCleanup {
  readonly: () => void;
}

export type EffectCallback = () => void | (() => void);

export type EqualityFn<T> = (prev: T, next: T) => boolean;

export const DEFAULT_EQUALS = <T>(prev: T, next: T) => prev === next;
