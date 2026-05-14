import type { Signal, ReadonlySignal } from '../types.js';

export function isSignal(value: unknown): value is Signal<unknown> {
  if (typeof value !== 'object' || value === null) return false;
  return 'value' in value && 'peek' in value;
}

export function isReadonlySignal<T>(signal: Signal<T>): signal is ReadonlySignal<T> {
  return !('value' in signal && Object.getOwnPropertyDescriptor(signal, 'value')?.set);
}

export function getSignalValue<T>(signal: Signal<T>): T {
  return signal.value;
}

export function setSignalValue<T>(signal: Signal<T>, value: T): void {
  if ('value' in signal) {
    const descriptor = Object.getOwnPropertyDescriptor(signal, 'value');
    if (descriptor && descriptor.writable) {
      (signal as Signal<T> & { value: T }).value = value;
    }
  }
}

export function readSignal<T>(signal: Signal<T>): T {
  return signal.value;
}
