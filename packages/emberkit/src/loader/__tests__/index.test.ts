import { describe, it, expect } from 'vitest';
import { isLoaderError, isLoaderData, createLoaderError, createLoaderData } from '../index.js';
import {
  runLoader,
  extractLoaderData,
  extractLoaderError,
  mergeLoaderResults,
} from '../helpers/loader.js';
import type { LoaderContext, LoaderResult } from '../types.js';

describe('Loader utilities', () => {
  describe('isLoaderError', () => {
    it('should return true for error results', () => {
      const result = createLoaderError('NOT_FOUND', 'User not found', 404);
      expect(isLoaderError(result)).toBe(true);
    });

    it('should return false for data results', () => {
      const result = createLoaderData({ user: 'test' });
      expect(isLoaderError(result)).toBe(false);
    });
  });

  describe('isLoaderData', () => {
    it('should return true for data results', () => {
      const result = createLoaderData({ user: 'test' });
      expect(isLoaderData(result)).toBe(true);
    });

    it('should return false for error results', () => {
      const result = createLoaderError('SERVER_ERROR', 'Internal error', 500);
      expect(isLoaderData(result)).toBe(false);
    });
  });

  describe('createLoaderError', () => {
    it('should create error with default status', () => {
      const error = createLoaderError('TEST_ERROR', 'Test message');
      expect(error.error.code).toBe('TEST_ERROR');
      expect(error.error.message).toBe('Test message');
      expect(error.error.status).toBe(500);
    });

    it('should create error with custom status', () => {
      const error = createLoaderError('NOT_FOUND', 'Not found', 404);
      expect(error.error.status).toBe(404);
    });
  });

  describe('createLoaderData', () => {
    it('should create data result', () => {
      const data = createLoaderData({ id: 1, name: 'Test' });
      expect(data.data).toEqual({ id: 1, name: 'Test' });
    });
  });
});

describe('runLoader', () => {
  const mockContext: LoaderContext = {
    params: { id: '123' },
    query: {},
    request: new Request('http://localhost/users/123'),
  };

  it('should return undefined data when no loader', async () => {
    const result = await runLoader(undefined, mockContext);
    expect(result).toEqual({ data: undefined });
  });

  it('should return loader data', async () => {
    const loader = () => createLoaderData({ user: 'test' });
    const result = await runLoader(loader, mockContext);
    expect(result).toEqual({ data: { user: 'test' } });
  });

  it('should return loader error', async () => {
    const loader = () => createLoaderError('TEST', 'Test error', 400);
    const result = await runLoader(loader, mockContext);
    expect(result).toEqual({ error: { code: 'TEST', message: 'Test error', status: 400 } });
  });

  it('should catch thrown errors', async () => {
    const loader = () => {
      throw new Error('Async error');
    };
    const result = await runLoader(loader, mockContext);
    expect(result).toEqual({
      error: { code: 'LOADER_ERROR', message: 'Async error', status: 500 },
    });
  });

  it('should handle async loaders', async () => {
    const loader = async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
      return createLoaderData({ async: true });
    };
    const result = await runLoader(loader, mockContext);
    expect(result).toEqual({ data: { async: true } });
  });
});

describe('extractLoaderData', () => {
  it('should extract data from successful result', () => {
    const result = { data: { id: 1 } };
    expect(extractLoaderData(result)).toEqual({ id: 1 });
  });

  it('should return null for error result', () => {
    const result = { error: { code: 'ERR', message: 'Error', status: 500 } };
    expect(extractLoaderData(result)).toBeNull();
  });
});

describe('extractLoaderError', () => {
  it('should extract error from error result', () => {
    const result = { error: { code: 'ERR', message: 'Error', status: 500 } };
    expect(extractLoaderError(result)).toEqual(result);
  });

  it('should return null for data result', () => {
    const result = { data: { id: 1 } };
    expect(extractLoaderError(result)).toBeNull();
  });
});

describe('mergeLoaderResults', () => {
  it('should merge all data results', () => {
    const results: LoaderResult<{ item: number }>[] = [
      { data: { item: 1 } },
      { data: { item: 2 } },
    ];
    const merged = mergeLoaderResults(results);
    expect(merged).toEqual({ data: [{ item: 1 }, { item: 2 }] });
  });

  it('should return error if any loader failed', () => {
    const results = [{ data: { a: 1 } }, { error: { code: 'ERR', message: 'Error', status: 500 } }];
    const merged = mergeLoaderResults(results);
    expect('error' in merged).toBe(true);
    if ('error' in merged) {
      expect(merged.error.code).toBe('MULTIPLE_ERRORS');
    }
  });

  it('should handle empty results', () => {
    const merged = mergeLoaderResults([]);
    expect(merged).toEqual({ data: [] });
  });
});
