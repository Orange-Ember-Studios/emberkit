# Logger

A comprehensive logging system for EmberKit with configurable log levels, transports, and support for creating custom loggers.

## Features

- 🎯 Pino-based structured logging
- 📊 Six log levels: `trace`, `debug`, `info`, `warn`, `error`, `fatal`
- 🔧 Configurable transports (pretty-printing in dev, JSON in production)
- 👶 Child loggers with inherited bindings
- 🌍 Request/response HTTP logging
- ♿ Works with the dev server and custom implementations

## Import path (important)

`@emberkit/core` does **not** bundle `createLogger` on the main entry, so **pino is never loaded in the browser**. Import from the logger subpath instead:

```ts
import { createLogger } from '@emberkit/core/logger';
```

Bundlers use the **`browser`** export in client builds (console-backed logger) and the **Node** implementation for SSR/dev servers (pino).

Logger **types** still come from the main package:

```ts
import type { Logger, LogLevel, LoggerOptions } from '@emberkit/core';
```

On **Node only**, `@emberkit/core/logger` also exports `createHttpLogger` and `logger`. Do not import those from client-only modules.

To force the **pino** implementation in a monorepo (where `@emberkit/core` may alias to `src/`), import:

```ts
import { createLogger, createHttpLogger } from '@emberkit/core/logger/node';
```

## Basic Usage

```typescript
import { createLogger } from '@emberkit/core/logger';

// Create a logger with default options
const logger = createLogger();

// Log messages
logger.info('Application started');
logger.warn('This is a warning');
logger.error('An error occurred', error);
logger.debug('Detailed debug information', { userId: 123 });
```

## Log Levels

- **`trace`** (10): Very detailed diagnostic information
- **`debug`** (20): Debugging information useful during development
- **`info`** (30): General informational messages (default)
- **`warn`** (40): Warning messages for potentially problematic situations
- **`error`** (50): Error messages for serious problems
- **`fatal`** (60): Fatal messages indicating system failure

## Configuration

```typescript
import { createLogger } from '@emberkit/core/logger';
import type { LoggerOptions } from '@emberkit/core';

// Create a logger with custom options
const logger = createLogger({
  name: 'my-app',
  level: 'debug',
  transport: false, // Disable transport (basic pino only)
});

// With custom transport (Node / pino only; ignored in browser builds)
const prodLogger = createLogger({
  name: 'my-app',
  level: 'info',
  transport: {
    target: 'pino-http-send', // Custom transport module
    options: {
      url: 'https://logs.example.com',
    },
  },
});
```

## Child Loggers

Create child loggers that inherit parent context:

```typescript
const requestLogger = logger.child({
  requestId: 'req-123',
  userId: 456,
});

requestLogger.info('Request received'); // Includes requestId and userId
```

## Request/Response Logging

Use the HTTP logger middleware with dev servers:

```typescript
import { createHttpLogger } from '@emberkit/core/logger';

const httpLogger = createHttpLogger();

// Use with Express or other HTTP frameworks
app.use(httpLogger);
```

## Dev Server Integration

The dev server automatically logs all requests:

```typescript
import { createDevServer } from '@emberkit/core';
import { createLogger } from '@emberkit/core/logger';

// With default logging (info level)
const server = await createDevServer({
  port: 3000,
  logLevel: 'debug', // Set log level
});

// With custom logger
const customLogger = createLogger({ name: 'my-server' });
const server = await createDevServer({
  port: 3000,
  logger: customLogger,
});
```

## Logging Pattern

```typescript
// Simple message
logger.info('User logged in');

// Message with context object
logger.debug('Database query executed', {
  query: 'SELECT * FROM users',
  duration: 125,
});

// Error logging
try {
  // ...
} catch (error) {
  logger.error('Failed to process request', error);
}

// Multiple messages
logger
  .child({ requestId: '123' })
  .info('Starting request processing')
  .debug('Loaded user preferences')
  .info('Request completed');
```

## Environment-Based Configuration

- **Browser builds** (`import` + `browser` condition): `console` only; `transport` is ignored.
- **Node / SSR** (default `./logger` export): **pino** — pretty-print in dev when `pino-pretty` is available, JSON in production.

## Type Safety

Full TypeScript support with proper types:

```typescript
import type { Logger, LogLevel } from '@emberkit/core';
import { createLogger } from '@emberkit/core/logger';

const createAppLogger = (): Logger => {
  return createLogger({ level: 'info' });
};
```

## Examples

### API Request Logging

```typescript
const handleRequest = (req: Request) => {
  const requestLogger = logger.child({
    method: req.method,
    path: req.url,
    timestamp: new Date().toISOString(),
  });

  requestLogger.debug('Request started');

  try {
    const response = await processRequest(req);
    requestLogger.info('Request completed', { statusCode: response.status });
    return response;
  } catch (error) {
    requestLogger.error('Request failed', error);
    throw error;
  }
};
```

### Structured Logging

```typescript
logger.info('User action', {
  action: 'purchase',
  userId: 123,
  amount: 99.99,
  currency: 'USD',
  items: ['item-1', 'item-2'],
});
```

### Conditional Logging

```typescript
if (logger.level <= 20) { // debug level
  logger.debug('Expensive debug computation', {
    data: complexDataStructure,
  });
}
```
