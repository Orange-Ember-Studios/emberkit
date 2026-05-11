import type { LoaderContext, LoaderResult, LoaderError } from '../types.js';

export async function runLoader<T>(
  loader: ((context: LoaderContext) => Promise<LoaderResult<T>> | LoaderResult<T>) | undefined,
  context: LoaderContext,
): Promise<LoaderResult<T>> {
  if (!loader) {
    return { data: undefined as T };
  }

  try {
    const result = await loader(context);
    return result;
  } catch (error) {
    if (error instanceof Error) {
      return {
        error: {
          code: 'LOADER_ERROR',
          message: error.message,
          status: 500,
        },
      };
    }
    return {
      error: {
        code: 'UNKNOWN_ERROR',
        message: String(error),
        status: 500,
      },
    };
  }
}

export function extractLoaderData<T>(result: LoaderResult<T>): T | null {
  if ('data' in result) {
    return result.data;
  }
  return null;
}

export function extractLoaderError(result: LoaderResult<unknown>): LoaderError | null {
  if ('error' in result) {
    return result as LoaderError;
  }
  return null;
}

export function mergeLoaderResults<T>(
  results: LoaderResult<T>[],
): LoaderResult<T[]> {
  const errors: LoaderError[] = [];
  const data: T[] = [];

  for (const result of results) {
    if ('error' in result) {
      errors.push(result as LoaderError);
    } else {
      data.push(result.data);
    }
  }

  if (errors.length > 0) {
    return {
      error: {
        code: 'MULTIPLE_ERRORS',
        message: `${errors.length} loaders failed`,
        status: 500,
      },
    };
  }

  return { data };
}
