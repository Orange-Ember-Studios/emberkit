import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join, resolve } from "path";
import { execSync } from "child_process";
import { starterFiles } from "../templates/starter.js";
import { getPackageManager, getInstallCommand } from "../utils/filesystem.js";

export interface CreateOptions {
  name: string;
  directory?: string;
  template?: string;
  noInstall?: boolean;
}

function formatTemplate(
  template: string,
  vars: Record<string, string>,
): string {
  let result = template;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), value);
  }
  return result;
}

function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
}

function getNpmPackageName(name: string): string {
  const kebab = toKebabCase(name);
  return kebab.startsWith("@") ? kebab : kebab.replace(/^emberkit-/, "");
}

export async function create(options: CreateOptions): Promise<void> {
  const { name, noInstall = false } = options;
  const directory = options.directory ?? toKebabCase(name);
  const targetDir = resolve(process.cwd(), directory);

  console.log(`\n🔥 Creating EmberKit project: ${name}\n`);

  if (existsSync(targetDir)) {
    console.error(`Error: Directory "${directory}" already exists.`);
    process.exit(1);
  }

  const templateVars = {
    name,
    packageName: getNpmPackageName(name),
    kebabName: toKebabCase(name),
  };

  console.log(`  Creating project in ${targetDir}...`);

  mkdirSync(targetDir, { recursive: true });

  for (const [filePath, content] of Object.entries(starterFiles)) {
    const fullPath = join(targetDir, filePath);
    const dir = join(targetDir, filePath.split("/").slice(0, -1).join("/"));

    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    writeFileSync(fullPath, formatTemplate(content, templateVars), "utf-8");
  }

  console.log(`  Project created successfully!\n`);

  if (!noInstall) {
    const pm = getPackageManager();
    const installCmd = getInstallCommand();

    console.log(`  Installing dependencies with ${pm}...`);
    try {
      execSync(installCmd, { cwd: targetDir, stdio: "inherit" });
      console.log(`\n  Dependencies installed!\n`);
    } catch {
      console.log(
        `\n  Failed to install dependencies. Run "${installCmd}" manually.\n`,
      );
    }
  }

  console.log(`  Get started:\n`);
  console.log(`    cd ${directory}`);
  if (noInstall) {
    console.log(`    ${getInstallCommand()}`);
  }
  console.log(`    emberkit dev\n`);
}
