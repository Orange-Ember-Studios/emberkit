import type { ContextDefaultValue } from './types.js';

export interface Context<T> {
  readonly id: symbol;
  readonly defaultValue: ContextDefaultValue<T>;
}

export interface ContextProviderState {
  value: unknown;
}

const contextRegistry = new Map<symbol, Context<unknown>>();
const contextValues = new Map<symbol, unknown>();

export interface ContextBridge<T> {
  id: symbol;
  defaultValue: T | undefined;
  Provider: (props: { value: T; children?: unknown }) => { type: string; props: Record<string, unknown> };
  use: () => T;
}

export function createContext<T>(defaultValue?: T): ContextBridge<T> {
  const context: Context<T> = {
    id: Symbol('emberkit.context'),
    defaultValue,
  };

  contextRegistry.set(context.id, context);

  const Provider = createContextProvider(context);

  return {
    id: context.id,
    defaultValue,
    Provider,
    use: () => useContext(context),
  };
}

export function setContextValue<T>(context: Context<T>, value: T): void {
  contextValues.set(context.id, value);
}

export function getContextValue<T>(context: Context<T>): T | undefined {
  const value = contextValues.get(context.id) as T | undefined;
  if (value === undefined) return context.defaultValue as T | undefined;
  return value;
}

export function hasContext<T>(context: Context<T>): boolean {
  return contextRegistry.has(context.id);
}

export function clearAllContexts(): void {
  contextRegistry.clear();
  contextValues.clear();
}

export function useContext<T>(context: Context<T>): T {
  const value = contextValues.get(context.id);
  if (value === undefined) {
    if (context.defaultValue === undefined) {
      throw new Error(`Context ${String(context.id)} has no value`);
    }
    return context.defaultValue as T;
  }
  return value as T;
}

export function createContextProvider<T>(context: Context<T>) {
  return function Provider(props: { value: T; children?: unknown }): { type: string; props: Record<string, unknown> } {
    setContextValue(context, props.value);
    return {
      type: 'Fragment',
      props: { children: props.children },
    };
  };
}