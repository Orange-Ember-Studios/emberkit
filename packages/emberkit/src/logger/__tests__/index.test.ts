import { describe, it, expect, beforeEach } from 'vitest';
import { createLogger } from '../helpers/create-logger-node.js';
import type { Logger } from '../types.js';

describe('Logger', () => {
  let logger: Logger;

  beforeEach(() => {
    logger = createLogger({
      name: 'test-logger',
      level: 'debug',
      transport: false,
    });
  });

  it('should create a logger instance', () => {
    expect(logger).toBeDefined();
    expect(logger.info).toBeDefined();
    expect(logger.error).toBeDefined();
    expect(logger.debug).toBeDefined();
    expect(logger.warn).toBeDefined();
    expect(logger.trace).toBeDefined();
    expect(logger.fatal).toBeDefined();
  });

  it('should support different log levels', () => {
    const debugLogger = createLogger({ level: 'debug', transport: false });
    const infoLogger = createLogger({ level: 'info', transport: false });
    const errorLogger = createLogger({ level: 'error', transport: false });

    expect(debugLogger).toBeDefined();
    expect(infoLogger).toBeDefined();
    expect(errorLogger).toBeDefined();
  });

  it('should log messages without error', () => {
    expect(() => {
      logger.info('Test message');
      logger.debug('Debug message');
      logger.warn('Warning message');
      logger.error('Error message');
      logger.trace('Trace message');
    }).not.toThrow();
  });

  it('should log with objects', () => {
    expect(() => {
      logger.info('Test message', { userId: 123, action: 'login' });
      logger.debug('Debug message', { data: { key: 'value' } });
      logger.warn('Warning message', { count: 5 });
    }).not.toThrow();
  });

  it('should log errors', () => {
    const error = new Error('Test error');
    expect(() => {
      logger.error('Error occurred', error);
      logger.fatal('Fatal error', error);
    }).not.toThrow();
  });

  it('should create child loggers', () => {
    const childLogger = logger.child({ requestId: 'req-123', userId: 456 });

    expect(childLogger).toBeDefined();
    expect(childLogger.info).toBeDefined();
    expect(childLogger.error).toBeDefined();
  });

  it('should allow nested child loggers', () => {
    const child1 = logger.child({ level: 1 });
    const child2 = child1.child({ level: 2 });

    expect(() => {
      child2.info('Nested child message');
    }).not.toThrow();
  });

  it('should use provided logger options', () => {
    const customLogger = createLogger({
      name: 'custom',
      level: 'warn',
      transport: false,
    });

    expect(customLogger).toBeDefined();
  });
});
