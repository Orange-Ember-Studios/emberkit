import pino from 'pino';
import type { Logger as PinoLogger } from 'pino';
import type { Logger, LoggerOptions } from '../types.js';

function wrapPino(pinoLogger: PinoLogger): Logger {
  return {
    fatal: (msg: string, err?: Error | Record<string, unknown>) => {
      if (err instanceof Error) {
        pinoLogger.fatal({ err }, msg);
      } else if (err) {
        pinoLogger.fatal(err, msg);
      } else {
        pinoLogger.fatal(msg);
      }
    },
    error: (msg: string, err?: Error | Record<string, unknown>) => {
      if (err instanceof Error) {
        pinoLogger.error({ err }, msg);
      } else if (err) {
        pinoLogger.error(err, msg);
      } else {
        pinoLogger.error(msg);
      }
    },
    warn: (msg: string, obj?: Record<string, unknown>) => {
      if (obj) {
        pinoLogger.warn(obj, msg);
      } else {
        pinoLogger.warn(msg);
      }
    },
    info: (msg: string, obj?: Record<string, unknown>) => {
      if (obj) {
        pinoLogger.info(obj, msg);
      } else {
        pinoLogger.info(msg);
      }
    },
    debug: (msg: string, obj?: Record<string, unknown>) => {
      if (obj) {
        pinoLogger.debug(obj, msg);
      } else {
        pinoLogger.debug(msg);
      }
    },
    trace: (msg: string, obj?: Record<string, unknown>) => {
      if (obj) {
        pinoLogger.trace(obj, msg);
      } else {
        pinoLogger.trace(msg);
      }
    },
    child: (bindings: Record<string, unknown>) => wrapPino(pinoLogger.child(bindings)),
  };
}

/**
 * Node-only logger backed by pino. Do not import from client bundles.
 */
export function createLogger(options: LoggerOptions = {}): Logger {
  const isProduction = process.env.NODE_ENV === 'production';
  const isDev = !isProduction;

  const pinoOptions: Record<string, unknown> = {
    name: options.name ?? '@emberkit/core',
    level: options.level ?? 'info',
  };

  let pinoBase: PinoLogger;

  if (options.transport === false) {
    pinoBase = pino(pinoOptions as any);
  } else if (options.transport) {
    pinoOptions.transport = options.transport;
    pinoBase = pino(pinoOptions as any);
  } else if (isDev && !process.env.CI && typeof window === 'undefined') {
    try {
      pinoOptions.transport = {
        target: 'pino-pretty',
        options: {
          colorize: true,
          singleLine: false,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      };
      pinoBase = pino(pinoOptions as any);
    } catch {
      delete pinoOptions.transport;
      pinoBase = pino(pinoOptions as any);
    }
  } else {
    pinoBase = pino(pinoOptions as any);
  }

  return wrapPino(pinoBase);
}

/** Default Node logger; import only from server code */
export const logger = createLogger();
