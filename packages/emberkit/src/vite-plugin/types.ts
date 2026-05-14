import type { Plugin } from 'vite';
import type { MarkdownOptions } from '../markdown/index.js';

export type EmberKitMode = 'static' | 'ssr' | 'spa' | 'hybrid';

export interface EmberKitPluginOptions {
  mode?: EmberKitMode;
  routeDir?: string;
  outputDir?: string;
  jsx?: 'automatic' | 'classic';
  markdown?: Partial<MarkdownConfig>;
  mdx?: MDXConfig;
  compression?: {
    gzip?: boolean;
    brotli?: boolean;
  };
}

export interface MarkdownConfig {
  gfm: boolean;
  breaks: boolean;
  html: boolean;
  tables: boolean;
}

export interface MDXConfig {
  components?: Record<string, string>;
  scope?: Record<string, unknown>;
}

export type EmberKitPlugin = (options?: EmberKitPluginOptions) => Plugin;

export const DEFAULT_CONFIG = {
  mode: 'hybrid' as const,
  routeDir: 'src/routes',
  outputDir: 'dist',
  jsx: 'automatic' as const,
  markdown: {
    gfm: true,
    breaks: false,
    html: true,
    tables: true,
  },
  mdx: {},
  compression: {
    gzip: true,
    brotli: true,
  },
} as const;

export type ResolvedConfig = typeof DEFAULT_CONFIG & EmberKitPluginOptions;