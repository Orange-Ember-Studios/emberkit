import type { Logger, LoggerOptions, LogLevel } from '../types.js';

const LEVEL_RANK: Record<LogLevel, number> = {
  trace: 10,
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  fatal: 60,
};

function enabled(threshold: LogLevel | undefined, level: LogLevel): boolean {
  return LEVEL_RANK[level] >= LEVEL_RANK[threshold ?? 'info'];
}

/**
 * Browser-safe logger (console). Use when `import` resolves with the `browser` condition.
 */
export function createLogger(options: LoggerOptions = {}): Logger {
  const name = options.name ?? '@emberkit/core';
  const threshold = options.level ?? 'info';

  function createWithBindings(baseBindings: Record<string, unknown>): Logger {
    const prefix = `[${name}]`;

    const out = (
      level: LogLevel,
      consoleFn: (...args: unknown[]) => void,
      msg: string,
      errOrObj?: Error | Record<string, unknown>,
    ): void => {
      if (!enabled(threshold, level)) return;
      const ctx = { ...baseBindings };
      if (errOrObj instanceof Error) {
        consoleFn(prefix, msg, ctx, errOrObj);
      } else if (errOrObj) {
        Object.assign(ctx, errOrObj);
        consoleFn(prefix, msg, ctx);
      } else if (Object.keys(ctx).length) {
        consoleFn(prefix, msg, ctx);
      } else {
        consoleFn(prefix, msg);
      }
    };

    return {
      fatal: (msg, err?) => out('fatal', console.error.bind(console), msg, err),
      error: (msg, err?) => out('error', console.error.bind(console), msg, err),
      warn: (msg, obj?) => out('warn', console.warn.bind(console), msg, obj),
      info: (msg, obj?) => out('info', console.info.bind(console), msg, obj),
      debug: (msg, obj?) => out('debug', console.debug.bind(console), msg, obj),
      trace: (msg, obj?) => out('trace', console.debug.bind(console), msg, obj),
      child: (bindings: Record<string, unknown>) =>
        createWithBindings({ ...baseBindings, ...bindings }),
    };
  }

  return createWithBindings({});
}
