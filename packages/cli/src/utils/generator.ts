import { existsSync, mkdirSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import type { GeneratorOptions } from "../types.js";
import {
  getTemplate,
  formatTemplate,
  toKebabCase,
} from "../templates/index.js";

export interface GenerateResult {
  success: boolean;
  path: string;
  content?: string;
  error?: string;
}

export async function generate(
  options: GeneratorOptions,
): Promise<GenerateResult> {
  const { name, path, template, params = {} } = options;

  const fullPath = join(process.cwd(), path);
  const formattedParams = {
    name: toPascalCase(name),
    kebabName: toKebabCase(name),
    ...params,
  };

  const templateContent = getTemplate(template);
  const content = formatTemplate(templateContent, formattedParams);

  try {
    const dir = dirname(fullPath);

    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    if (existsSync(fullPath)) {
      return {
        success: false,
        path: fullPath,
        error: `File already exists: ${fullPath}`,
      };
    }

    writeFileSync(fullPath, content, "utf-8");

    return {
      success: true,
      path: fullPath,
      content,
    };
  } catch (err) {
    return {
      success: false,
      path: fullPath,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

export async function initProject(options: {
  template?: string;
  targetDir?: string;
  name?: string;
}): Promise<void> {
  const { template = "basic", targetDir = process.cwd(), name } = options;

  console.log(`Initializing EmberKit project with ${template} template...`);

  const projectName = name ?? "emberkit-app";

  console.log(`Project: ${projectName}`);
  console.log(`Location: ${targetDir}`);
}

function toPascalCase(str: string): string {
  return str
    .split(/[-_\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");
}

export { toPascalCase, toKebabCase };
