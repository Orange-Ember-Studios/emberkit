import type { MiddlewareHandler } from './types.js';

export interface MiddlewareContext {
  request: Request;
  params: Record<string, string>;
  locals: Record<string, unknown>;
}

export type { MiddlewareHandler };

const middlewareStack: MiddlewareHandler[] = [];

export function addMiddleware(handler: MiddlewareHandler): void {
  middlewareStack.push(handler);
}

export function clearMiddleware(): void {
  middlewareStack.length = 0;
}

export function getMiddleware(): readonly MiddlewareHandler[] {
  return middlewareStack;
}

export async function runMiddleware(
  context: MiddlewareContext,
): Promise<Response | undefined> {
  for (const handler of middlewareStack) {
    const result = await handler(context);
    if (result) {
      return result;
    }
  }
  return undefined;
}

export function createMiddlewareResponse(
  request: Request,
  init?: ResponseInit,
): Response {
  return new Response(null, {
    status: 302,
    headers: {
      Location: new URL(request.url).pathname,
      ...init?.headers,
    },
    ...init,
  });
}
