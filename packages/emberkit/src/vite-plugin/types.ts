import type { Plugin } from 'vite';
import type { MarkdownOptions } from '../markdown/index.js';

export type EmberKitMode = 'static' | 'ssr' | 'spa' | 'hybrid';

export interface EmberKitPluginOptions {
  mode?: EmberKitMode;
  routeDir?: string;
  outputDir?: string;
  jsx?: 'automatic' | 'classic';
  markdown?: MarkdownConfig;
  mdx?: MDXConfig;
}

export interface MarkdownConfig {
  gfm?: boolean;
  breaks?: boolean;
  html?: boolean;
  tables?: boolean;
}

export interface MDXConfig {
  components?: Record<string, string>;
  scope?: Record<string, unknown>;
}

export type EmberKitPlugin = (options?: EmberKitPluginOptions) => Plugin;