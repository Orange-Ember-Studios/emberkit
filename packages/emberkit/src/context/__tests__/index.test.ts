import { describe, it, expect } from 'vitest';
import {
  createContext,
  getContextValue,
  hasContext,
  clearAllContexts,
  useContext,
} from '../index.js';

describe('createContext', () => {
  it('should create a context with undefined default', () => {
    const context = createContext();
    expect(context).toHaveProperty('id');
    expect(context.defaultValue).toBeUndefined();
  });

  it('should create a context with default value', () => {
    const context = createContext('default');
    expect(context.defaultValue).toBe('default');
  });

  it('should create unique contexts', () => {
    const ctx1 = createContext();
    const ctx2 = createContext();
    expect(ctx1.id).not.toBe(ctx2.id);
  });
});

describe('getContextValue', () => {
  it('should return default value', () => {
    const context = createContext('test');
    expect(getContextValue(context)).toBe('test');
  });
});

describe('hasContext', () => {
  it('should return true for existing context', () => {
    const context = createContext();
    expect(hasContext(context)).toBe(true);
  });

  it('should return false after clearing', () => {
    const context = createContext();
    clearAllContexts();
    expect(hasContext(context)).toBe(false);
  });
});

describe('clearAllContexts', () => {
  it('should clear all contexts', () => {
    const ctx1 = createContext('a');
    const ctx2 = createContext('b');
    clearAllContexts();
    expect(hasContext(ctx1)).toBe(false);
    expect(hasContext(ctx2)).toBe(false);
  });
});

describe('useContext', () => {
  it('should return default value', () => {
    const context = createContext('default');
    expect(useContext(context)).toBe('default');
  });

  it('should throw for missing context without default', () => {
    const context = createContext();
    clearAllContexts();
    expect(() => useContext(context)).toThrow();
  });
});
