import type { Plugin } from 'vite';
import type { MarkdownOptions } from '../markdown/index.js';

export type EmberKitMode = 'static' | 'ssr' | 'spa' | 'hybrid';

export interface SiteConfig {
  url: string;
  name?: string;
  titleSuffix?: string;
  description?: string;
  ogImage?: string;
  twitterSite?: string;
}

export interface PrerenderOptions {
  /** Extra URL paths to pre-render at build time (e.g. `/blog/hello`). */
  paths?: string[];
  /** Paths to skip when pre-rendering. */
  exclude?: string[];
  /** Resolve dynamic or CMS-driven paths at build time. */
  discover?: () => Promise<string[]>;
}

export interface EmberKitPluginOptions {
  mode?: EmberKitMode;
  routeDir?: string;
  outputDir?: string;
  prerender?: PrerenderOptions;
  jsx?: 'automatic' | 'classic';
  markdown?: Partial<MarkdownConfig>;
  mdx?: MDXConfig;
  site?: SiteConfig;
  /** Optional custom dev `/api/*` handler (overrides auto `_api` routing) */
  devApi?: DevApiPluginOptions;
  compression?: {
    gzip?: boolean;
    brotli?: boolean;
  };
}

export interface DevApiPluginOptions {
  handler: string;
  export?: string;
  prefix?: string;
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
