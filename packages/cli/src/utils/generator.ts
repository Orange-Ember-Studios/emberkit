import { existsSync, mkdirSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import type { GeneratorOptions } from "../types.js";
import { formatTemplate, toKebabCase } from "../templates/index.js";
import { routeTemplate } from "../templates/route.js";
import { componentTemplate } from "../templates/component.js";
import { layoutTemplate } from "../templates/layout.js";
import { errorBoundaryTemplate } from "../templates/errorBoundary.js";
import { loaderTemplate } from "../templates/loader.js";
import { actionTemplate } from "../templates/action.js";
import { apiRouteTemplate } from "../templates/apiRoute.js";
import { configTemplate } from "../templates/config.js";
import { indexTemplate } from "../templates/entry.js";
import { layoutRoutesTemplate } from "../templates/layoutRoutes.js";
import { signalTemplate } from "../templates/signal.js";
import { contextTemplate } from "../templates/context.js";
import { formTemplate } from "../templates/form.js";

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

  const templates: Record<string, string> = {
    route: routeTemplate,
    component: componentTemplate,
    layout: layoutTemplate,
    error: errorBoundaryTemplate,
    loader: loaderTemplate,
    action: actionTemplate,
    api: apiRouteTemplate,
    config: configTemplate,
    index: indexTemplate,
    layoutRoutes: layoutRoutesTemplate,
    signal: signalTemplate,
    context: contextTemplate,
    form: formTemplate,
  };

  const templateContent = templates[template] ?? routeTemplate;
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
