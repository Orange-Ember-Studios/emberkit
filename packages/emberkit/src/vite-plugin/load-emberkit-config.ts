import { existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import type { EmberKitPluginOptions } from './types.js';

/**
 * Loads `emberkit.config.{ts,js,mjs}` so plugin options (e.g. devApi) work under
 * plain Node dev servers that cannot `import()` TypeScript directly.
 */
export async function loadEmberKitConfig(root: string): Promise<Partial<EmberKitPluginOptions>> {
  const candidates = [
    join(root, 'emberkit.config.ts'),
    join(root, 'emberkit.config.js'),
    join(root, 'emberkit.config.mjs'),
  ];

  for (const filePath of candidates) {
    if (!existsSync(filePath)) continue;

    const ext = filePath.split('.').pop();

    if (ext === 'js' || ext === 'mjs') {
      try {
        const mod = await import(pathToFileURL(filePath).href);
        return (mod.default ?? mod) as Partial<EmberKitPluginOptions>;
      } catch {
        continue;
      }
    }

    const result = await transpileAndImportConfig(filePath, root);
    if (result !== null) {
      return result;
    }
  }

  return {};
}

async function transpileAndImportConfig(
  filePath: string,
  root: string,
): Promise<Partial<EmberKitPluginOptions> | null> {
  const cacheDir = join(root, 'node_modules', '.cache', 'emberkit');
  mkdirSync(cacheDir, { recursive: true });

  const outFile = join(
    cacheDir,
    `config-${Date.now()}-${Math.random().toString(36).slice(2)}.mjs`,
  );

  try {
    const { build: esbuild } = await import('esbuild');

    await esbuild({
      entryPoints: [filePath],
      bundle: true,
      format: 'esm',
      platform: 'node',
      outfile: outFile,
      packages: 'external',
      logLevel: 'silent',
    });

    const mod = await import(pathToFileURL(outFile).href);
    return (mod.default ?? mod) as Partial<EmberKitPluginOptions>;
  } catch {
    return null;
  }
}
