import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from '@emberkit/core';
import { emberkitVitePlugin } from '@emberkit/core/vite-plugin';

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
  vite: {
    plugins: [emberkitVitePlugin(), tailwindcss()],
    esbuild: {
      jsxImportSource: '@emberkit/core',
    },
  },
});
