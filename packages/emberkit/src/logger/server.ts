import pinoHttp from 'pino-http';
import type { Logger } from './types.js';
import { createLogger } from './helpers/create-logger-node.js';

/**
 * HTTP request logger middleware (Node only). Pass a pino-backed logger from {@link createLogger} on the server.
 */
export function createHttpLogger(loggerInstance?: Logger): ReturnType<typeof pinoHttp> {
  const log = loggerInstance ?? createLogger({ name: '@emberkit/http' });

  return pinoHttp(
    {
      logger: log as any,
      customErrorMessage: (error: Error) => error.message,
      customSuccessMessage: () => 'Request processed',
    },
    log as any,
  );
}
