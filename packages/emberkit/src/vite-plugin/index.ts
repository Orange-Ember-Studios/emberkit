import type { Plugin } from 'vite';
import type { EmberKitPluginOptions, EmberKitMode } from './types.js';

const VIRTUAL_EMBERKIT_CONFIG = 'virtual:emberkit-config';
const VIRTUAL_EMBERKIT_ROUTES = 'virtual:emberkit-routes';

const DEFAULT_OPTIONS: Required<EmberKitPluginOptions> = {
  mode: 'hybrid',
  routeDir: 'src/routes',
  outputDir: 'dist',
  jsx: 'automatic',
};

export function emberkitVitePlugin(userOptions: EmberKitPluginOptions = {}): Plugin {
  const options = { ...DEFAULT_OPTIONS, ...userOptions };
  const mode: EmberKitMode = options.mode;

  return {
    name: 'emberkit:vite-plugin',
    enforce: 'pre',

    config() {
      return {
        resolve: {
          alias: {
            '@emberkit/core': new URL('./src/index.ts', import.meta.url).pathname,
          },
        },
        esbuild: {
          jsxImportSource: '@emberkit/core',
        },
        optimizeDeps: {
          include: ['@emberkit/core'],
        },
      };
    },

    resolveId(id: string) {
      if (id === VIRTUAL_EMBERKIT_CONFIG) {
        return VIRTUAL_EMBERKIT_CONFIG;
      }
      if (id === VIRTUAL_EMBERKIT_ROUTES) {
        return VIRTUAL_EMBERKIT_ROUTES;
      }
      return null;
    },

    load(id: string) {
      if (id === VIRTUAL_EMBERKIT_CONFIG) {
        return `export const config = ${JSON.stringify(options)};`;
      }
      if (id === VIRTUAL_EMBERKIT_ROUTES) {
        return `export const routes = [];`;
      }
      return null;
    },

    transform(code: string, id: string) {
      if (id.includes('\u0000')) return null;

      const ext = id.split('.').pop();
      if (ext !== 'tsx' && ext !== 'ts' && ext !== 'jsx' && ext !== 'js') {
        return null;
      }

      return code;
    },

    configureServer(server) {
      server.httpServer?.once('listening', () => {
        console.log('[emberkit] Dev server running');
      });
    },

    closeBundle() {
      if (mode === 'static') {
        console.log('[emberkit] Static build complete');
      } else if (mode === 'ssr') {
        console.log('[emberkit] SSR build complete');
      } else if (mode === 'spa') {
        console.log('[emberkit] SPA build complete');
      } else {
        console.log('[emberkit] Hybrid build complete');
      }
    },
  };
}

export type { EmberKitPluginOptions, EmberKitMode };
