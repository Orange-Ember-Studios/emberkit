export type { Logger, LoggerOptions, LogLevel, RequestLog, ResponseLog } from './types.js';

// Only export types and lazy-loaded functions to avoid pino in browser
export { createLogger } from './helpers/create-logger.js';
