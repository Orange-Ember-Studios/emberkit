import type { HMRContext, HotModule } from './types.js';
import {
  registerHotModule,
  disposeHotModule,
  getHotModule,
} from './types.js';

declare global {
  interface ImportMeta {
    readonly hot?: HotModuleAPI;
  }
}

export interface HotModuleAPI {
  accept(deps?: string | string[], callback?: () => void): void;
  decline(): void;
  dispose(callback: () => void): void;
  data: Record<string, unknown>;
  on(event: string, callback: (data: unknown) => void): void;
  send(event: string, data: unknown): void;
}

export function createHotAPI(
  context: HMRContext,
  moduleId: string,
  moduleUrl: string,
): HotModuleAPI {
  const hotModule: HotModule = {
    id: moduleId,
    url: moduleUrl,
    needsAccept: false,
    acceptCallbacks: [],
    disposeCallbacks: [],
  };

  registerHotModule(context, hotModule);

  return {
    accept(deps?: string | string[], callback?: () => void): void {
      if (typeof deps === 'function') {
        callback = deps;
        deps = undefined;
      }

      hotModule.needsAccept = true;

      if (callback) {
        hotModule.acceptCallbacks.push(callback);
      }

      if (deps && typeof deps === 'string') {
        import(deps);
      } else if (Array.isArray(deps)) {
        Promise.all(deps.map((d) => import(d)));
      }
    },

    decline(): void {
      import.meta.hot = undefined;
    },

    dispose(callback: () => void): void {
      hotModule.disposeCallbacks.push(callback);
    },

    data: {},

    on(event: string, callback: (data: unknown) => void): void {
      if (event === 'vite:beforeUpdate') {
        const module = getHotModule(context, moduleId);
        if (module) {
          module.acceptCallbacks.push(() => callback({ type: 'update' }));
        }
      }
    },

    send(event: string, data: unknown): void {
      console.log('[HMR] Send:', event, data);
    },
  };
}

export function setupHMRClient(context: HMRContext): void {
  if (typeof window === 'undefined') return;

  const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
  const wsUrl = `${protocol}//${location.host}/__emberkit_hmr`;

  const ws = new WebSocket(wsUrl);

  ws.onopen = () => {
    console.log('[HMR Client] Connected');
  };

  ws.onmessage = async (event) => {
    try {
      const data = JSON.parse(event.data);

      if (data.type === 'update') {
        await import(/* @vite-ignore */ data.url + '?t=' + Date.now());
      }
    } catch (error) {
      console.error('[HMR Client] Error:', error);
    }
  };

  ws.onclose = () => {
    console.log('[HMR Client] Disconnected, reconnecting...');
    setTimeout(() => setupHMRClient(context), 1000);
  };

  ws.onerror = (error) => {
    console.error('[HMR Client] Error:', error);
  };

  context.connections.set('main', ws);
}

export function cleanupHMRClient(): void {
  if (typeof window === 'undefined') return;

  const ws = (window as unknown as { __emberkit_hmr_ws?: WebSocket }).__emberkit_hmr_ws;
  if (ws) {
    ws.close();
  }
}