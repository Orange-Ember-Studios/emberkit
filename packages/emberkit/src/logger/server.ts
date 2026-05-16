// Server-only HTTP logger export
// This file should only be imported in server contexts, not browser

export function createHttpLogger(loggerInstance?: import('./types.js').Logger) {
  // Lazy load pino modules only when called (server-side)
  const pinoHttp = require('pino-http');
  const { createLogger: create } = require('./helpers/create-logger.js');

  const logger = loggerInstance ?? create({ name: '@emberkit/http' });

  return pinoHttp(
    {
      logger: logger as any,
      customErrorMessage: (error: Error) => error.message,
      customSuccessMessage: () => 'Request processed',
    },
    logger as any,
  );
}
