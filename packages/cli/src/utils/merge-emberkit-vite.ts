import type { Plugin, UserConfig } from "vite";

function pluginsToArray(plugins: UserConfig["plugins"]): NonNullable<UserConfig["plugins"]> {
  if (plugins == null) return [];
  return Array.isArray(plugins) ? plugins : [plugins];
}

function hasEmberkitPlugin(plugins: NonNullable<UserConfig["plugins"]>): boolean {
  return plugins.some((p) => {
    if (!p) return false;
    const name = typeof p === "object" && "name" in p ? p.name : null;
    return name === "emberkit:vite-plugin";
  });
}

export function injectEmberkitPlugin(plugins: NonNullable<UserConfig["plugins"]>, emberkitPlugin: Plugin): Plugin[] {
  if (hasEmberkitPlugin(plugins)) {
    return plugins.filter((p): p is Plugin => p != null);
  }
  return [emberkitPlugin, ...plugins.filter((p): p is Plugin => p != null)];
}

/**
 * Merges `emberkit.config` `vite` block with optional `vite.config.*` (file wins on top-level keys;
 * `plugins` from both are concatenated in order).
 */
export function mergeEmberkitViteConfig(
  emberkitConfig: Record<string, unknown> | null,
  viteFileConfig: UserConfig | null,
): UserConfig {
  const fromEmber = (emberkitConfig?.vite as UserConfig | undefined) ?? {};
  const fromFile = viteFileConfig ?? {};

  return {
    ...fromEmber,
    ...fromFile,
    plugins: [...pluginsToArray(fromEmber.plugins), ...pluginsToArray(fromFile.plugins)],
    server: { ...fromEmber.server, ...fromFile.server },
    define: {
      ...(fromEmber.define as Record<string, unknown> | undefined),
      ...(fromFile.define as Record<string, unknown> | undefined),
    },
    css: { ...fromEmber.css, ...fromFile.css },
    optimizeDeps: { ...fromEmber.optimizeDeps, ...fromFile.optimizeDeps },
    resolve: { ...fromEmber.resolve, ...fromFile.resolve },
    esbuild: { ...fromEmber.esbuild, ...fromFile.esbuild },
    build: {
      ...fromEmber.build,
      ...fromFile.build,
      rollupOptions: {
        ...(fromEmber.build?.rollupOptions ?? {}),
        ...(fromFile.build?.rollupOptions ?? {}),
      },
    },
  };
}
