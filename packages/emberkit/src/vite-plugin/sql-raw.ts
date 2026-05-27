import { readFileSync } from 'node:fs';
import type { Plugin } from 'vite';

/** Bundles `*.sql?raw` imports as string literals (no filesystem at runtime on Workers). */
export function sqlRawPlugin(): Plugin {
  return {
    name: 'emberkit-sql-raw',
    enforce: 'pre',
    load(id) {
      if (!id.endsWith('.sql?raw')) return;
      const filePath = id.slice(0, -'?raw'.length);
      const sql = readFileSync(filePath, 'utf-8');
      return {
        code: `export default ${JSON.stringify(sql)}`,
        map: null,
      };
    },
  };
}
