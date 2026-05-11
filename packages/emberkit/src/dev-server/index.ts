export * from './types.js';
export * from './client.js';

export interface DevServerOptions {
  port?: number;
  host?: string;
  cors?: boolean;
  hmr?: boolean;
}

export interface ServerStats {
  uptime: number;
  requests: number;
  errors: number;
  memoryUsage: NodeJS.MemoryUsage;
}

export class DevServer {
  private server: import('http').Server | null = null;
  private readonly options: Required<DevServerOptions>;
  private startTime = 0;
  private requestCount = 0;
  private errorCount = 0;

  constructor(options: DevServerOptions = {}) {
    this.options = {
      port: options.port ?? 3000,
      host: options.host ?? 'localhost',
      cors: options.cors ?? true,
      hmr: options.hmr ?? true,
    };
  }

  async start(): Promise<void> {
    this.startTime = Date.now();

    const http = await import('http');
    const handler = this.createRequestHandler();

    this.server = http.createServer(handler);

    await new Promise<void>((resolve, reject) => {
      this.server!.listen(this.options.port, this.options.host, () => {
        console.log(
          `Dev server running at http://${this.options.host}:${this.options.port}`,
        );
        resolve();
      });

      this.server!.on('error', (err) => {
        console.error('Server error:', err);
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
          reject(err);
        } else {
          this.server = null;
          resolve();
        }
      });
    });
  }

  getStats(): ServerStats {
    return {
      uptime: Date.now() - this.startTime,
      requests: this.requestCount,
      errors: this.errorCount,
      memoryUsage: process.memoryUsage(),
    };
  }

  private createRequestHandler() {
    return async (req: import('http').IncomingMessage, res: import('http').ServerResponse) => {
      this.requestCount++;

      try {
        await this.handleRequest(req, res);
      } catch (error) {
        this.errorCount++;
        console.error('Request error:', error);
        this.sendError(res, 500, 'Internal Server Error');
      }
    };
  }

  private async handleRequest(
    req: import('http').IncomingMessage,
    res: import('http').ServerResponse,
  ): Promise<void> {
    const url = new URL(req.url ?? '/', `http://${req.headers.host}`);

    if (url.pathname === '/__emberkit_hmr') {
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

  private handleWebSocket(req: import('http').IncomingMessage, res: import('http').ServerResponse): void {
    res.writeHead(101, {
      'Upgrade': 'websocket',
      'Connection': 'Upgrade',
    });
    res.end();
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