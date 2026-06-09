export interface MiddlewareContext {
  request: Request;
  params: Record<string, string>;
  locals: Record<string, unknown>;
}

export type MiddlewareHandler = (
  context: MiddlewareContext,
) => Promise<Response | undefined> | Response | undefined;

export interface MiddlewareNext {
  (): Promise<Response | undefined>;
}
