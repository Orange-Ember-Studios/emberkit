#!/usr/bin/env node

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const PACKAGE_JSON_PATHS = {
  core: "packages/emberkit/package.json",
  ui: "packages/ui/package.json",
  icons: "packages/icons/package.json",
  cli: "packages/cli/package.json",
  edge: "packages/edge/package.json",
  tsconfig: "packages/tsconfig/package.json",
};

const TARGET_FILE_PATH = "packages/cli/src/emberkit-package-versions.ts";

function readPackageVersion(packageJsonPath) {
  const absolutePath = resolve(REPO_ROOT, packageJsonPath);
  const raw = readFileSync(absolutePath, "utf8");
  const parsed = JSON.parse(raw);

  if (typeof parsed.version !== "string" || parsed.version.length === 0) {
    throw new Error(`Missing valid version in ${packageJsonPath}`);
  }

  return parsed.version;
}

function buildTargetFileContent(versions) {
  return `// Semver ranges for @emberkit/* packages written into generated projects.
// When releasing libraries, bump these to match packages/*/package.json "version".
export const EMBERKIT_PACKAGE_VERSIONS = {
  core: "^${versions.core}",
  ui: "^${versions.ui}",
  icons: "^${versions.icons}",
  cli: "^${versions.cli}",
  edge: "^${versions.edge}",
  tsconfig: "^${versions.tsconfig}",
} as const;
`;
}

function main() {
  const versions = Object.fromEntries(
    Object.entries(PACKAGE_JSON_PATHS).map(([key, packageJsonPath]) => [
      key,
      readPackageVersion(packageJsonPath),
    ]),
  );

  const targetAbsolutePath = resolve(REPO_ROOT, TARGET_FILE_PATH);
  const nextContent = buildTargetFileContent(versions);
  const currentContent = readFileSync(targetAbsolutePath, "utf8");

  if (currentContent === nextContent) {
    console.log(`${TARGET_FILE_PATH} is already up to date.`);
    return;
  }

  writeFileSync(targetAbsolutePath, nextContent, "utf8");
  console.log(`Updated ${TARGET_FILE_PATH}.`);
}

main();
