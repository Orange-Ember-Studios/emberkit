import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { emberkitVitePlugin } from '@emberkit/core/vite-plugin';

export default defineConfig({
  plugins: [emberkitVitePlugin(), tailwindcss()],
  server: {
    port: 9876,
    host: 'localhost',
  },
  esbuild: {
    jsxImportSource: '@emberkit/core',
  },
});
