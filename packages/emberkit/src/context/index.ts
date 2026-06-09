import type { ContextDefaultValue } from './types.js';

export interface Context<T> {
  readonly id: symbol;
  readonly defaultValue: ContextDefaultValue<T>;
}

export interface ContextProviderState {
  value: unknown;
}

const contextRegistry = new Map<symbol, Context<unknown>>();

interface RenderScope {
  values: Map<symbol, unknown>;
  parent?: RenderScope;
}

const renderScopeStack: RenderScope[] = [];

function getCurrentScope(): RenderScope {
  return renderScopeStack[renderScopeStack.length - 1] ?? createRootScope();
}

function createRootScope(): RenderScope {
  const scope: RenderScope = {
    values: new Map(),
  };
  renderScopeStack.push(scope);
  return scope;
}

export interface ContextBridge<T> {
  id: symbol;
  defaultValue: T | undefined;
  Provider: (props: { value: T; children?: unknown }) => {
    type: string;
    props: Record<string, unknown>;
  };
  use: () => T;
}

export function createContext<T>(defaultValue?: T): ContextBridge<T> {
  const context: Context<T> = {
    id: Symbol(),
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

export function pushRenderScope(): RenderScope {
  const parent = getCurrentScope();
  const scope: RenderScope = {
    values: new Map(),
    parent,
  };
  renderScopeStack.push(scope);
  return scope;
}

export function popRenderScope(): void {
  renderScopeStack.pop();
}

export function setContextValue<T>(context: Context<T>, value: T): void {
  const scope = getCurrentScope();
  scope.values.set(context.id, value);
}

export function getContextValue<T>(context: Context<T>): T | undefined {
  let scope: RenderScope | undefined = getCurrentScope();
  while (scope) {
    const value = scope.values.get(context.id);
    if (value !== undefined) return value as T;
    scope = scope.parent;
  }
  return context.defaultValue as T | undefined;
}

export function hasContext<T>(context: Context<T>): boolean {
  return contextRegistry.has(context.id);
}

export function clearAllContexts(): void {
  contextRegistry.clear();
  renderScopeStack.length = 0;
}

export function clearRenderScope(): void {
  const scope = getCurrentScope();
  scope.values.clear();
}

export function useContext<T>(context: Context<T>): T {
  let scope: RenderScope | undefined = getCurrentScope();
  while (scope) {
    const value = scope.values.get(context.id);
    if (value !== undefined) return value as T;
    scope = scope.parent;
  }
  if (context.defaultValue !== undefined) {
    return context.defaultValue as T;
  }
  return undefined as unknown as T;
}

export function createContextProvider<T>(context: Context<T>) {
  return function Provider(props: { value: T; children?: unknown }): {
    type: string;
    props: Record<string, unknown>;
  } {
    setContextValue(context, props.value);
    return {
      type: 'Fragment',
      props: { children: props.children },
    };
  };
}

export function runWithRenderScope<T>(fn: () => T): T {
  pushRenderScope();
  try {
    return fn();
  } finally {
    popRenderScope();
  }
}
