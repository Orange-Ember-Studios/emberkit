import { existsSync, mkdirSync } from "fs";
import { join } from "path";
import { pathToFileURL } from "url";
import type { UserConfig } from "vite";

/**
 * Loads a TypeScript or JavaScript config file in any Node environment.
 *
 * Direct `import()` of `.ts` files only works on runtimes with TypeScript
 * support (e.g. tsx, ts-node, Node ≥ 22 with --experimental-strip-types).
 * Cloudflare Pages CI runs plain Node 18/20, so `.ts` imports silently fail.
 *
 * We use esbuild (a transitive dep of Vite, always present) to bundle the
 * config to a temporary `.mjs` file and import that instead.
 */
async function transpileAndImport<T>(
  filePath: string,
  root: string,
): Promise<T | null> {
  // Use a cache dir that survives across the two viteBuild calls
  const cacheDir = join(root, "node_modules", ".cache", "emberkit");
  mkdirSync(cacheDir, { recursive: true });

  const outFile = join(cacheDir, `config-${Date.now()}-${Math.random().toString(36).slice(2)}.mjs`);

  try {
    // esbuild is always available as a transitive dependency of Vite
    const { build: esbuild } = await import("esbuild") as typeof import("esbuild");

    await esbuild({
      entryPoints: [filePath],
      bundle: true,
      format: "esm",
      platform: "node",
      outfile: outFile,
      // Preserve all package imports so they resolve from node_modules at runtime
      packages: "external",
      logLevel: "silent",
    });

    const mod = await import(pathToFileURL(outFile).href);
    return (mod.default ?? mod) as T;
  } catch {
    return null;
  }
}

/**
 * Loads the `emberkit.config.ts` (or `.js` / `.mjs`) for a project root.
 * Returns `null` when no config file is found or loading fails.
 */
export async function loadEmberKitConfig(
  root: string,
): Promise<Record<string, unknown> | null> {
  const candidates = [
    join(root, "emberkit.config.ts"),
    join(root, "emberkit.config.js"),
    join(root, "emberkit.config.mjs"),
  ];

  for (const filePath of candidates) {
    if (!existsSync(filePath)) continue;

    const ext = filePath.split(".").pop();

    // Plain JS/MJS files can be imported directly
    if (ext === "js" || ext === "mjs") {
      try {
        const mod = await import(pathToFileURL(filePath).href);
        return (mod.default ?? mod) as Record<string, unknown>;
      } catch {
        continue;
      }
    }

    // TypeScript files need transpilation
    const result = await transpileAndImport<Record<string, unknown>>(filePath, root);
    if (result !== null) return result;
  }

  return null;
}

/**
 * Loads the `vite.config.ts` (or `.js`) for a project root.
 * Returns `null` when no config file is found or loading fails.
 */
export async function loadViteConfig(
  root: string,
  command: "serve" | "build" = "build",
): Promise<UserConfig | null> {
  const candidates = [
    join(root, "vite.config.ts"),
    join(root, "vite.config.js"),
  ];

  for (const filePath of candidates) {
    if (!existsSync(filePath)) continue;

    const ext = filePath.split(".").pop();

    let raw: unknown = null;

    if (ext === "js") {
      try {
        const mod = await import(pathToFileURL(filePath).href);
        raw = mod.default ?? mod;
      } catch {
        continue;
      }
    } else {
      raw = await transpileAndImport<unknown>(filePath, root);
    }

    if (raw === null) continue;

    const resolved =
      typeof raw === "function"
        ? (raw as (env: { mode: string; command: string }) => UserConfig)({
            mode: command === "serve" ? "development" : "production",
            command,
          })
        : (raw as UserConfig);

    return resolved;
  }

  return null;
}
