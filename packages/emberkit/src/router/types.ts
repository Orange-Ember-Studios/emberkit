export interface RouteMetadata {
  prerender?: boolean;
  ssr?: boolean;
  ssrOnly?: boolean;
}

export interface Route {
  path: string;
  pattern: RegExp;
  paramNames: string[];
  filePath: string;
  fileName: string;
  isLayout: boolean;
  isError: boolean;
  isLoading: boolean;
  isApi: boolean;
  metadata?: RouteMetadata;
}

export interface RouteMatch {
  route: Route;
  params: Record<string, string>;
  score: number;
}

export interface NavigateOptions {
  replace?: boolean;
  state?: Record<string, unknown>;
}

export interface RouteParams<T extends Record<string, string> = Record<string, string>> {
  params: T;
  query: Record<string, string | string[]>;
  request: Request;
}

export type RouteHandler = (params: RouteParams) => Promise<unknown> | unknown;

export const SPECIAL_FILES = new Set(['_layout', '_error', '_loading', 'index']);

export const PARAM_REGEX = /\[([^\]]+)\]/g;
export const CATCH_ALL_REGEX = /\[\.\.\.(\w+)\]/g;
