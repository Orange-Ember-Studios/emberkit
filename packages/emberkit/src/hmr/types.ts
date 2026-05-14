export interface DevServerConfig {
  port: number;
  host: string;
  hmr: boolean;
  open: boolean;
  cors: boolean;
}

export interface HotModule {
  id: string;
  url: string;
  needsAccept: boolean;
  acceptCallbacks: Array<() => void>;
  disposeCallbacks: Array<() => void>;
}

export interface HMRContext {
  connections: Map<string, WebSocket>;
  modules: Map<string, HotModule>;
  listeners: Array<(event: HMREvent) => void>;
}

export interface HMREvent {
  type: 'connected' | 'disconnected' | 'update' | 'error';
  moduleId?: string;
  timestamp: number;
  payload?: unknown;
}

export class HMRConnection {
  private readonly url: string;
  private ws: WebSocket | null = null;

  constructor(url: string) {
    this.url = url;
  }

  close(): void {
    this.ws?.close();
  }

  connect(onMessage: (data: unknown) => void): void {
    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.log('[HMR] Connected to dev server');
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessage(data);
        } catch {
          console.error('[HMR] Failed to parse message');
        }
      };

      this.ws.onerror = (error) => {
        console.error('[HMR] WebSocket error:', error);
      };

      this.ws.onclose = () => {
        console.log('[HMR] Disconnected');
        setTimeout(() => this.reconnect(onMessage), 1000);
      };
    } catch (error) {
      console.error('[HMR] Failed to connect:', error);
      setTimeout(() => this.reconnect(onMessage), 1000);
    }
  }

  send(data: unknown): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  private reconnect(onMessage: (data: unknown) => void): void {
    console.log('[HMR] Attempting to reconnect...');
    this.connect(onMessage);
  }
}

export function createHMRContext(): HMRContext {
  return {
    connections: new Map(),
    modules: new Map(),
    listeners: [],
  };
}

export function subscribeToHMR(
  context: HMRContext,
  callback: (event: HMREvent) => void,
): () => void {
  context.listeners.push(callback);

  return () => {
    const index = context.listeners.indexOf(callback);
    if (index > -1) {
      context.listeners.splice(index, 1);
    }
  };
}

export function emitHMREvent(context: HMRContext, event: HMREvent): void {
  for (const listener of context.listeners) {
    listener(event);
  }
}

export async function handleHMRMessage(
  context: HMRContext,
  data: Record<string, unknown>,
): Promise<void> {
  const type = data.type as string;

  switch (type) {
    case 'hot':
      await handleHotUpdate(context, data);
      break;
    case 'close':
      handleClose(context);
      break;
    default:
      console.warn('[HMR] Unknown message type:', type);
  }
}

async function handleHotUpdate(context: HMRContext, data: Record<string, unknown>): Promise<void> {
  const moduleId = data.moduleId as string;

  const hotModule = context.modules.get(moduleId);
  if (!hotModule) {
    console.warn('[HMR] Module not found:', moduleId);
    return;
  }

  for (const callback of hotModule.acceptCallbacks) {
    try {
      callback();
    } catch (error) {
      console.error('[HMR] Error in accept callback:', error);
    }
  }

  emitHMREvent(context, {
    type: 'update',
    moduleId,
    timestamp: Date.now(),
  });
}

function handleClose(context: HMRContext): void {
  for (const connection of context.connections.values()) {
    connection.close();
  }
  context.connections.clear();
  context.modules.clear();

  emitHMREvent(context, {
    type: 'disconnected',
    timestamp: Date.now(),
  });
}

export function getHotModule(context: HMRContext, id: string): HotModule | undefined {
  return context.modules.get(id);
}

export function registerHotModule(context: HMRContext, module: HotModule): void {
  context.modules.set(module.id, module);
}

export function disposeHotModule(context: HMRContext, id: string): void {
  const module = context.modules.get(id);
  if (module) {
    for (const callback of module.disposeCallbacks) {
      try {
        callback();
      } catch (error) {
        console.error('[HMR] Error in dispose callback:', error);
      }
    }
    context.modules.delete(id);
  }
}
