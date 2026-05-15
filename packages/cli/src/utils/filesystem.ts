import { existsSync, mkdirSync, readFileSync as fsReadFileSync, writeFileSync as fsWriteFileSync } from "fs";
import { resolve, dirname } from "path";
import { execSync } from "child_process";
import { platform } from "os";

export { generate, toPascalCase, toKebabCase } from "./generator.js";

export interface FileSystemOptions {
  encoding?: BufferEncoding;
  flag?: string;
}

export function ensureDirSync(dirPath: string): void {
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
  }
}

export function readFileSync(filePath: string): string {
  return fsReadFileSync(filePath, "utf-8");
}

export function writeFileSync(
  filePath: string,
  content: string,
  options?: FileSystemOptions,
): void {
  const dir = dirname(filePath);
  ensureDirSync(dir);
  fsWriteFileSync(filePath, content, options ?? { encoding: "utf-8" });
}

export function fileExists(filePath: string): boolean {
  return existsSync(filePath);
}

export function resolvePath(...segments: string[]): string {
  return resolve(...segments);
}

export function getPackageManager(): "pnpm" | "npm" | "yarn" {
  const userAgent = process.env.npm_config_user_agent ?? "";

  if (userAgent.startsWith("pnpm")) return "pnpm";
  if (userAgent.startsWith("yarn")) return "yarn";
  if (userAgent.startsWith("npm")) return "npm";

  try {
    if (platform() === "win32") {
      const localAppData = process.env.LOCALAPPDATA ?? "";
      if (existsSync("C:\\Program Files\\pnpm\\pnpm.exe") || existsSync(localAppData + "\\pnpm\\pnpm.exe")) {
        return "pnpm";
      }
    } else {
      execSync("pnpm --version", { stdio: "ignore" });
      return "pnpm";
    }
  } catch {
    return "npm";
  }

  return "npm";
}

export function getInstallCommand(): string {
  const pm = getPackageManager();

  switch (pm) {
    case "pnpm":
      return "pnpm install";
    case "yarn":
      return "yarn";
    default:
      return "npm install";
  }
}
