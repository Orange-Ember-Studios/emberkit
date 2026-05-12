import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 9876,
    host: 'localhost',
  },
  esbuild: {
    jsxImportSource: '@emberkit/core',
  },
});