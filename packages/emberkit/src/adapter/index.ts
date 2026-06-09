export interface AdapterRequest {
  url: string;
  method: string;
  headers: Record<string, string>;
  body?: string | Uint8Array;
}

export interface AdapterResponse {
  status: number;
  headers: Record<string, string>;
  body: string;
}

export interface AdapterContext {
  request: AdapterRequest;
  params: Record<string, string>;
  locals: Record<string, unknown>;
}

export type RequestHandler = (
  context: AdapterContext,
) => Promise<AdapterResponse> | AdapterResponse;

export interface Adapter {
  name: string;
  runtime: 'node' | 'deno' | 'cloudflare' | 'workers' | 'netlify' | 'vercel';
  handler: RequestHandler;
  options?: Record<string, unknown>;
}

export interface AdapterOptions {
  root?: string;
  buildDir?: string;
  serverDir?: string;
  entry?: string;
}

export function createAdapter(
  name: string,
  runtime: Adapter['runtime'],
  handler: RequestHandler,
  options?: Record<string, unknown>,
): Adapter {
  return {
    name,
    runtime,
    handler: async (context) => {
      const result = await handler(context);
      return result;
    },
    options,
  };
}

export function isAdapter(value: unknown): value is Adapter {
  return (
    typeof value === 'object' &&
    value !== null &&
    'name' in value &&
    'runtime' in value &&
    'handler' in value
  );
}