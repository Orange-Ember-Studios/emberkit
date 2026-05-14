export interface Plugin {
  name: string;
  version?: string;
  setup: (context: PluginContext) => void | Promise<void>;
}

export interface PluginContext {
  config: ResolvedConfig;
  api: PluginAPI;
  onHook: (name: string, callback: HookCallback) => void;
  addWatchFile: (file: string) => void;
}

export interface ResolvedConfig {
  mode: 'static' | 'ssr' | 'spa' | 'hybrid';
  root: string;
  outDir: string;
  srcDir: string;
  routesDir: string;
  server: ServerConfig;
  build: BuildConfig;
}

export interface ServerConfig {
  port: number;
  host: string;
  cors: boolean;
}

export interface BuildConfig {
  target: string;
  minify: boolean;
  sourcemap: boolean;
}

export interface PluginAPI {
  resolveId: (id: string, options?: ResolveIdOptions) => Promise<ResolvedId | null>;
  load: (id: string) => Promise<string | null>;
  transform: (code: string, id: string) => Promise<TransformResult | null>;
  render: (html: string, context: RenderContext) => Promise<string>;
}

export interface ResolveIdOptions {
  importer?: string;
  skipSelf?: boolean;
}

export interface ResolvedId {
  id: string;
  external?: boolean;
  moduleSideEffects?: boolean | null;
}

export interface TransformResult {
  code: string;
  map?: string;
  mappings?: string;
}

export interface RenderContext {
  url: string;
  params: Record<string, string>;
  head?: string;
  body?: string;
}

export type HookCallback = (context?: unknown) => void | Promise<void>;

export type HookName =
  | 'buildStart'
  | 'buildEnd'
  | 'transform'
  | 'renderStart'
  | 'renderEnd'
  | 'configResolved';

export class PluginPipeline {
  private hookCache = new Map<HookName, HookCallback[]>();
  private plugins: Plugin[] = [];

  addPlugin(plugin: Plugin): void {
    this.plugins.push(plugin);
    this.invalidateCache();
  }

  getPlugins(): Plugin[] {
    return [...this.plugins];
  }

  removePlugin(name: string): void {
    this.plugins = this.plugins.filter((p) => p.name !== name);
    this.invalidateCache();
  }

  async runHook(name: HookName, context?: unknown): Promise<void> {
    const hooks = this.hookCache.get(name) ?? [];

    for (const callback of hooks) {
      await callback(context);
    }
  }

  private invalidateCache(): void {
    this.hookCache.clear();
  }
}

export function createPluginContext(config: ResolvedConfig, api: PluginAPI): PluginContext {
  const hooks = new Map<string, HookCallback[]>();

  return {
    config,
    api,
    onHook(name, callback) {
      const existing = hooks.get(name) ?? [];
      hooks.set(name, [...existing, callback]);
    },
    addWatchFile(_file) {
      // File watching handled by Vite
    },
  };
}

export function createPluginAPI(): PluginAPI {
  return {
    async resolveId(_id, _options) {
      return null;
    },
    async load(_id) {
      return null;
    },
    async transform(_code, _id) {
      return null;
    },
    async render(html) {
      return html;
    },
  };
}

export const CORE_PLUGINS: Plugin[] = [];

export async function loadPlugin(name: string): Promise<Plugin> {
  try {
    const module = await import(name);
    return module.default ?? module;
  } catch {
    throw new Error(`Failed to load plugin: ${name}`);
  }
}

export async function resolvePlugins(
  plugins: Plugin[],
  config: ResolvedConfig,
): Promise<PluginContext[]> {
  const contexts: PluginContext[] = [];
  const api = createPluginAPI();

  for (const plugin of plugins) {
    const context = createPluginContext(config, api);
    await plugin.setup(context);
    contexts.push(context);
  }

  return contexts;
}
