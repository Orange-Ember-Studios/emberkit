import type { ContextDefaultValue } from './types.js';

export interface Context<T> {
  readonly id: symbol;
  readonly defaultValue: ContextDefaultValue<T>;
}

export interface ContextProviderState {
  value: unknown;
}

const contextRegistry = new Map<symbol, Context<unknown>>();

export function createContext<T>(defaultValue?: T): Context<T> {
  const context: Context<T> = {
    id: Symbol('emberkit.context'),
    defaultValue,
  };

  contextRegistry.set(context.id, context);

  return context;
}

export function getContextValue<T>(context: Context<T>): T | undefined {
  return contextRegistry.get(context.id)?.defaultValue as T | undefined;
}

export function hasContext<T>(context: Context<T>): boolean {
  return contextRegistry.has(context.id);
}

export function clearAllContexts(): void {
  contextRegistry.clear();
}

export interface ContextBridge<T> {
  id: symbol;
  defaultValue: T | undefined;
  Provider: {
    (props: { value: T; children?: unknown }): unknown;
  };
  use: () => T;
}

export function useContext<T>(context: Context<T>): T {
  const value = contextRegistry.get(context.id)?.defaultValue;
  if (value === undefined) {
    if (context.defaultValue === undefined) {
      throw new Error(`Context ${String(context.id)} has no value`);
    }
    return context.defaultValue as T;
  }
  return value as T;
}
