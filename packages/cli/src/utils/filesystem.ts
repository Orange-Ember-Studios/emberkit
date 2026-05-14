export { generate, toPascalCase, toKebabCase } from "./generator.js";

export interface FileSystemOptions {
  encoding?: BufferEncoding;
  flag?: string;
}

export function ensureDirSync(dirPath: string): void {
  const { mkdirSync, existsSync } = require("fs");
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
  }
}

export function readFileSync(filePath: string): string {
  const { readFileSync } = require("fs");
  return readFileSync(filePath, "utf-8");
}

export function writeFileSync(
  filePath: string,
  content: string,
  options?: FileSystemOptions,
): void {
  const fs = require("fs");
  const dir = require("path").dirname(filePath);
  ensureDirSync(dir);
  fs.writeFileSync(filePath, content, options ?? { encoding: "utf-8" });
}

export function fileExists(filePath: string): boolean {
  const { existsSync } = require("fs");
  return existsSync(filePath);
}

export function resolvePath(...segments: string[]): string {
  return require("path").resolve(...segments);
}

export function getPackageManager(): "pnpm" | "npm" | "yarn" {
  const userAgent = process.env.npm_config_user_agent ?? "";

  if (userAgent.startsWith("pnpm")) return "pnpm";
  if (userAgent.startsWith("yarn")) return "yarn";
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
