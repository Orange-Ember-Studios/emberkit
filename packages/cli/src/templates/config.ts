export const configTemplate = `import { defineConfig } from '@emberkit/core';

export default defineConfig({
  mode: 'hybrid',
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
    target: 'esnext',
  },
});
`;