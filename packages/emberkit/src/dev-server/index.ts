import type { Logger, LogLevel } from '../logger/types.js';
import { createLogger } from '../logger/node.js';

export interface DevServerOptions {
  port?: number;
  host?: string;
  cors?: boolean;
  hmr?: boolean;
  logLevel?: LogLevel;
  logger?: Logger;
}

export interface ServerStats {
  uptime: number;
  requests: number;
  errors: number;
  memoryUsage: NodeJS.MemoryUsage;
}

export class DevServer {
  private errorCount = 0;
  private readonly logger: Logger;
  private readonly options: Required<Omit<DevServerOptions, 'logger' | 'logLevel'>>;
  private requestCount = 0;
  private server: import('http').Server | null = null;
  private startTime = 0;

  constructor(options: DevServerOptions = {}) {
    this.logger = options.logger ?? createLogger({ name: '@emberkit/dev-server', level: options.logLevel ?? 'info' });
    this.options = {
      port: options.port ?? 3000,
      host: options.host ?? 'localhost',
      cors: options.cors ?? true,
      hmr: options.hmr ?? true,
    };
  }

  getStats(): ServerStats {
    return {
      uptime: Date.now() - this.startTime,
      requests: this.requestCount,
      errors: this.errorCount,
      memoryUsage: process.memoryUsage(),
    };
  }

  async start(): Promise<void> {
    this.startTime = Date.now();

    const http = await import('http');
    const handler = this.createRequestHandler();

    this.server = http.createServer(handler);

    await new Promise<void>((resolve, reject) => {
      this.server!.listen(this.options.port, this.options.host, () => {
        this.logger.info(`Dev server running at http://${this.options.host}:${this.options.port}`, {
          port: this.options.port,
          host: this.options.host,
        });
        resolve();
      });

      this.server!.on('error', (err) => {
        this.logger.error('Server error', err);
        reject(err);
      });
    });
  }

  async stop(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.server) {
        resolve();
        return;
      }

      this.server.close((err) => {
        if (err) {
          this.logger.error('Error closing server', err);
          reject(err);
        } else {
          this.logger.info('Dev server stopped');
          this.server = null;
          resolve();
        }
      });
    });
  }

  private createRequestHandler() {
    return async (req: import('http').IncomingMessage, res: import('http').ServerResponse) => {
      this.requestCount++;

      const startTime = Date.now();
      const method = req.method ?? 'GET';
      const path = req.url ?? '/';

      const logContext = {
        method,
        path,
        remoteAddress: req.socket.remoteAddress,
        userAgent: req.headers['user-agent'],
      };

      try {
        await this.handleRequest(req, res);

        const responseTime = Date.now() - startTime;
        this.logger.debug(`${method} ${path}`, {
          ...logContext,
          statusCode: res.statusCode,
          responseTime,
        });
      } catch (error) {
        this.errorCount++;
        const responseTime = Date.now() - startTime;

        this.logger.error(`${method} ${path} - Error`, {
          ...logContext,
          responseTime,
          error: error instanceof Error ? error.message : String(error),
        });

        this.sendError(res, 500, 'Internal Server Error');
      }
    };
  }

  private async generateHTML(pathname: string): Promise<string> {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>EmberKit Dev</title>
  <script type="module" src="/@vite/client"></script>
</head>
<body>
  <div id="app"></div>
</body>
</html>`;
  }

  private async handleRequest(
    req: import('http').IncomingMessage,
    res: import('http').ServerResponse,
  ): Promise<void> {
    const url = new URL(req.url ?? '/', `http://${req.headers.host}`);

    if (url.pathname === '/__emberkit_hmr') {
      this.logger.trace('HMR request', { pathname: url.pathname });
      this.handleWebSocket(req, res);
      return;
    }

    if (this.options.cors) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    }

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 'no-cache');

    const html = await this.generateHTML(url.pathname);
    res.writeHead(200);
    res.end(html);
  }

  private handleWebSocket(
    req: import('http').IncomingMessage,
    res: import('http').ServerResponse,
  ): void {
    res.writeHead(101, {
      Upgrade: 'websocket',
      Connection: 'Upgrade',
    });
    res.end();
  }

  private sendError(res: import('http').ServerResponse, code: number, message: string): void {
    res.writeHead(code, { 'Content-Type': 'text/plain' });
    res.end(message);
  }
}

export async function createDevServer(options?: DevServerOptions): Promise<DevServer> {
  const server = new DevServer(options);
  await server.start();
  return server;
}
