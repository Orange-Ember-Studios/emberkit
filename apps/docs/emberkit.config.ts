import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from '@emberkit/core';
import { emberkitVitePlugin } from '@emberkit/core/vite-plugin';
import { docsMetaPlugin } from './src/vite/docs-meta-plugin.js';
import { DEFAULT_DESCRIPTION, DOCS_TITLE_SUFFIX, OG_IMAGE_URL, SITE_NAME, SITE_URL } from './src/lib/site-meta.js';

export default defineConfig({
  mode: 'ssr',
  site: {
    url: SITE_URL,
    name: SITE_NAME,
    titleSuffix: DOCS_TITLE_SUFFIX,
    description: DEFAULT_DESCRIPTION,
    ogImage: OG_IMAGE_URL,
  },
  routes: {
    dir: 'src/routes',
  },
  server: {
    port: 9876,
    host: 'localhost',
  },
  build: {
    outDir: 'dist',
    target: 'esnext',
  },
  markdown: {
    gfm: true,
    tables: true,
  },
  vite: {
    plugins: [emberkitVitePlugin(), docsMetaPlugin(), tailwindcss()],
    esbuild: {
      jsxImportSource: '@emberkit/core',
    },
  },
});
