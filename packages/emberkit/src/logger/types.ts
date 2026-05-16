export type LogLevel = 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace';

export interface LoggerOptions {
  name?: string;
  level?: LogLevel;
  transport?: false | {
    target: string;
    options?: Record<string, unknown>;
  };
}

export interface Logger {
  fatal(msg: string, err?: Error | Record<string, unknown>): void;
  error(msg: string, err?: Error | Record<string, unknown>): void;
  warn(msg: string, obj?: Record<string, unknown>): void;
  info(msg: string, obj?: Record<string, unknown>): void;
  debug(msg: string, obj?: Record<string, unknown>): void;
  trace(msg: string, obj?: Record<string, unknown>): void;
  child(bindings: Record<string, unknown>): Logger;
}

export interface RequestLog {
  method: string;
  url: string;
  statusCode?: number;
  responseTime?: number;
  contentLength?: number;
  userAgent?: string;
  remoteAddress?: string;
}

export interface ResponseLog {
  statusCode: number;
  contentLength?: number;
  responseTime: number;
}
