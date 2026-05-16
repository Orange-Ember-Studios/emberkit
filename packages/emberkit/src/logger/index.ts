import pinoHttp from 'pino-http';
import type { Logger } from './types.js';
import { createLogger } from './helpers/create-logger.js';

export type { Logger, LoggerOptions, LogLevel, RequestLog, ResponseLog } from './types.js';
export { createLogger } from './helpers/create-logger.js';

/**
 * Create HTTP request/response logger middleware
 * @param loggerInstance Optional logger instance. If not provided, creates a new one.
 * @returns Pino HTTP middleware
 */
export function createHttpLogger(loggerInstance?: Logger) {
  const logger = loggerInstance ?? createLogger({ name: '@emberkit/http' });

  return pinoHttp(
    {
      logger: logger as any,
      customErrorMessage: (error: Error) => error.message,
      customSuccessMessage: () => 'Request processed',
    },
    logger as any,
  );
}
