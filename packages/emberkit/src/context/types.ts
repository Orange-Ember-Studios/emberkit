export interface Context<T> {
  readonly id: symbol;
  readonly defaultValue: T | undefined;
}

export interface ContextProvider {
  value: unknown;
}

export type ContextDefaultValue<T> = T | undefined;

export const CONTEXT_MARKER = Symbol.for('emberkit.context');
