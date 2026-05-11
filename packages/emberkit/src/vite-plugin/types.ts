import type { Plugin } from 'vite';

export type EmberKitMode = 'static' | 'ssr' | 'spa' | 'hybrid';

export interface EmberKitPluginOptions {
  mode?: EmberKitMode;
  routeDir?: string;
  outputDir?: string;
  jsx?: 'automatic' | 'classic';
}

export type EmberKitPlugin = (options?: EmberKitPluginOptions) => Plugin;