import { defineConfig } from '@emberkit/core';

export default defineConfig({
  mode: 'ssr',
  root: './apps/docs',
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
});