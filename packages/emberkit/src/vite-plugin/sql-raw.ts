import { readFileSync } from 'node:fs';
import type { Plugin } from 'vite';

function bundleSqlAsString(filePath: string): { code: string; map: null } {
  const sql = readFileSync(filePath, 'utf-8');
  return {
    code: `export default ${JSON.stringify(sql)}`,
    map: null,
  };
}

/** Bundles `*.sql` and `*.sql?raw` as string literals (no filesystem at runtime on Workers). */
export function sqlRawPlugin(): Plugin {
  return {
    name: 'emberkit-sql-raw',
    enforce: 'pre',
    load(id) {
      if (id.endsWith('.sql?raw')) {
        return bundleSqlAsString(id.slice(0, -'?raw'.length));
      }
      if (id.endsWith('.sql') && !id.includes('?')) {
        return bundleSqlAsString(id);
      }
      return undefined;
    },
  };
}

/** Alias for `sqlRawPlugin` — matches Wrangler Text module / bare `.sql` import style. */
export const sqlTextPlugin = sqlRawPlugin;
