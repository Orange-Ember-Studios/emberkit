export interface RouteParams<T extends Record<string, string> = Record<string, string>> {
  params: T;
  query: Record<string, string | string[]>;
  request: Request;
}

export interface LoaderData<T> {
  data: T;
  error?: never;
}

export interface LoaderError {
  data?: never;
  error: {
    code: string;
    message: string;
    status: number;
  };
}

export type LoaderResult<T> = LoaderData<T> | LoaderError;

export interface LoaderContext {
  params: Record<string, string>;
  query: Record<string, string | string[]>;
  request: Request;
}

export type LoaderFunction<T = unknown> = (
  context: LoaderContext,
) => Promise<LoaderResult<T>> | LoaderResult<T>;

export interface ActionContext {
  params: Record<string, string>;
  request: Request;
}

export type ActionFunction<T = unknown> = (
  context: ActionContext,
) => Promise<LoaderResult<T>> | LoaderResult<T>;

export function isLoaderError<T>(result: LoaderResult<T>): result is LoaderError {
  return 'error' in result;
}

export function isLoaderData<T>(result: LoaderResult<T>): result is LoaderData<T> {
  return 'data' in result;
}

export function createLoaderError(
  code: string,
  message: string,
  status: number = 500,
): LoaderError {
  return {
    error: { code, message, status },
  };
}

export function createLoaderData<T>(data: T): LoaderData<T> {
  return { data };
}
