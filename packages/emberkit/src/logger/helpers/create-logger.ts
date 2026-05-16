import pino from 'pino';
import type { Logger as PinoLogger } from 'pino';
import type { Logger, LoggerOptions, LogLevel } from '../types.js';

const LOG_LEVEL_TO_PINO: Record<LogLevel, number> = {
  trace: 10,
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  fatal: 60,
};

/**
 * Create a logger instance with configurable log level and transport
 * @param options Logger configuration
 * @returns Logger instance
 */
export function createLogger(options: LoggerOptions = {}): Logger {
  const isProduction = process.env.NODE_ENV === 'production';
  const isDev = !isProduction;

  const pinoOptions: Record<string, unknown> = {
    name: options.name ?? '@emberkit/core',
    level: options.level ?? 'info',
  };

  let pinoLogger: PinoLogger;

  if (options.transport === false) {
    // No transport, just use basic pino
    pinoLogger = pino(pinoOptions as any);
  } else if (options.transport) {
    // Use custom transport
    pinoOptions.transport = options.transport;
    pinoLogger = pino(pinoOptions as any) as PinoLogger;
  } else if (isDev && !process.env.CI && typeof window === 'undefined') {
    // Development: try to use pino-pretty if available, fallback to basic
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
      pinoLogger = pino(pinoOptions as any) as PinoLogger;
    } catch {
      // Fallback to basic pino if pino-pretty is not available
      delete pinoOptions.transport;
      pinoLogger = pino(pinoOptions as any);
    }
  } else {
    // Production: use basic pino
    pinoLogger = pino(pinoOptions as any);
  }

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
    child: (bindings: Record<string, unknown>) => {
      const childPino = pinoLogger.child(bindings);
      return {
        fatal: (msg: string, err?: Error | Record<string, unknown>) => {
          if (err instanceof Error) {
            childPino.fatal({ err }, msg);
          } else if (err) {
            childPino.fatal(err, msg);
          } else {
            childPino.fatal(msg);
          }
        },
        error: (msg: string, err?: Error | Record<string, unknown>) => {
          if (err instanceof Error) {
            childPino.error({ err }, msg);
          } else if (err) {
            childPino.error(err, msg);
          } else {
            childPino.error(msg);
          }
        },
        warn: (msg: string, obj?: Record<string, unknown>) => {
          if (obj) {
            childPino.warn(obj, msg);
          } else {
            childPino.warn(msg);
          }
        },
        info: (msg: string, obj?: Record<string, unknown>) => {
          if (obj) {
            childPino.info(obj, msg);
          } else {
            childPino.info(msg);
          }
        },
        debug: (msg: string, obj?: Record<string, unknown>) => {
          if (obj) {
            childPino.debug(obj, msg);
          } else {
            childPino.debug(msg);
          }
        },
        trace: (msg: string, obj?: Record<string, unknown>) => {
          if (obj) {
            childPino.trace(obj, msg);
          } else {
            childPino.trace(msg);
          }
        },
        child: (bindings: Record<string, unknown>) => {
          return createLogger(options).child(bindings);
        },
      };
    },
  };
}

/**
 * Default logger instance
 */
export const logger = createLogger();
