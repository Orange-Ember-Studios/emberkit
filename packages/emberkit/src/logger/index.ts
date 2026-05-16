export type { Logger, LoggerOptions, LogLevel, RequestLog, ResponseLog } from './types.js';

/**
 * Default entry when tooling resolves the `logger/` folder (e.g. Vite workspace alias
 * `@emberkit/core` → `src/`). Must stay free of pino so the client bundle never loads Node deps.
 */
export { createLogger } from './helpers/create-logger-browser.js';
