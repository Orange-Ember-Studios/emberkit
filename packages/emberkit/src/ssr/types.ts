import type { LoaderResult } from '../loader/types.js';

export interface SSRContext {
  request: Request;
  params: Record<string, string>;
  query: Record<string, string | string[]>;
  loaderData: Record<string, LoaderResult<unknown>>;
}

export interface SSRRenderOptions {
  doctype?: string;
  title?: string;
  lang?: string;
  baseUrl?: string;
  streaming?: boolean;
}

export interface SSRRenderResult {
  html: string;
  status: number;
  headers: Headers;
}

export interface StreamChunk {
  type: 'html' | 'error' | 'status';
  content: string;
}

export const DEFAULT_DOCTYPE = '<!DOCTYPE html>';
export const DEFAULT_LANG = 'en';

export const STATUS_CODES: Record<number, string> = {
  200: 'OK',
  201: 'Created',
  204: 'No Content',
  301: 'Moved Permanently',
  302: 'Found',
  304: 'Not Modified',
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  409: 'Conflict',
  422: 'Unprocessable Entity',
  429: 'Too Many Requests',
  500: 'Internal Server Error',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
};

export function getStatusText(status: number): string {
  return STATUS_CODES[status] ?? 'Unknown';
}
