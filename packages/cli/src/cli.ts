import inquirer from "inquirer";
import { getCliPackageVersion } from "./cli-package-version.js";
import { dev } from "./commands/dev.js";
import { build } from "./commands/build.js";
import { preview } from "./commands/preview.js";
import { serve } from "./commands/serve.js";
import { create, TEMPLATES } from "./commands/create.js";
import { generate } from "./utils/generator.js";
import { toKebabCase } from "./templates/index.js";
import { cliBrand } from "./brand.js";

export interface CLIConfig {
  version: string;
  projectRoot: string;
}

export async function runCLI(args: string[]): Promise<void> {
  const [command, ...restArgs] = args.slice(2);

  if (!command) {
    showHelp();
    return;
  }

  switch (command) {
    case "dev":
      await dev(restArgs);
      break;
    case "build":
      await build(restArgs);
      break;
    case "preview":
      await preview(restArgs);
      break;
    case "serve":
    case "start":
      await serve(restArgs);
      break;
    case "create":
      await handleCreate(restArgs);
      break;
    case "generate":
      await runGenerate(restArgs);
      break;
    case "--version":
    case "-v":
      console.log(`EmberKit CLI v${getCliPackageVersion()}`);
      break;
    case "--help":
    case "-h":
      showHelp();
      break;
    default:
      console.error(`Unknown command: ${command}`);
      showHelp();
      process.exit(1);
  }
}

function showHelp(): void {
  console.log(`
${cliBrand.logo()} EmberKit CLI v${getCliPackageVersion()}

Usage: emberkit <command> [options]

Commands:
  create [name]        Create a new EmberKit project
  dev                  Start development server
  build                Build for production (SSR/hybrid/static/SPA)
  preview              Preview production build locally
  serve                Start production server (SSR/hybrid)
  generate <type> <name>  Generate a file from a template

Options:
  --template, -t <id>  Project template to use
  --no-install         Skip dependency installation
  --path, -p <path>    Output path for generate (overrides default)
  --help, -h           Show this help message
  --version, -v        Show version number

Generate types:
  route      Route component (src/routes/)
  component  UI component (src/components/)
  layout     Layout component (src/layouts/)
  loader     Data loader (src/loaders/)
  action     Form action (src/actions/)
  api        API route handler (src/routes/_api/)

Project templates:
  basic      Simple starter with Tailwind CSS (default)
  with-ui    Starter with EmberKit UI components
  minimal    Barebones project, no CSS framework
  blog       Blog with file-based routing and Tailwind
  saas       SaaS landing page with auth routes
  dashboard  Admin dashboard with sidebar layout
  api        REST API server with CRUD endpoints

Examples:
  emberkit create my-app
  emberkit create my-blog --template blog
  emberkit create my-saas -t saas
  emberkit create
`);
}

async function handleCreate(args: string[]): Promise<void> {
  if (args.includes("--help") || args.includes("-h")) {
    showCreateHelp();
    return;
  }

  const name = extractFlag(args, 0);
  const template = extractFlagValue(args, "--template", "-t");
  const noInstall = args.includes("--no-install");

  if (!name) {
    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "name",
        message: "What is your project name?",
        default: "my-emberkit-app",
      },
      {
        type: "list",
        name: "template",
        message: "Choose a template:",
        choices: TEMPLATES.map((t) => ({
          name: `${t.name.padEnd(12)} — ${t.desc}`,
          value: t.id,
        })),
        default: "basic",
      },
    ]);

    await create({
      name: answers.name,
      template: answers.template,
      noInstall,
    });
    return;
  }

  await create({
    name,
    template,
    noInstall,
  });
}

function showCreateHelp(): void {
  console.log(`
${cliBrand.logo()} EmberKit — Create a new project

Usage: emberkit create [name] [options]

Arguments:
  name                 Project name (optional, prompts if omitted)

Options:
  --template, -t <id>  Project template to use
  --no-install         Skip dependency installation
  --help, -h           Show this help

Templates:
  basic      Simple starter with Tailwind CSS (default)
  with-ui    Starter with EmberKit UI components
  minimal    Barebones project, no CSS framework
  blog       Blog with file-based routing and Tailwind
  saas       SaaS landing page with auth routes
  dashboard  Admin dashboard with sidebar layout
  api        REST API server with CRUD endpoints

Examples:
  emberkit create my-app
  emberkit create my-blog --template blog
  emberkit create my-saas -t saas
  emberkit create              (interactive mode)
`);
}

function extractFlag(args: string[], index: number): string | undefined {
  return args.filter((a) => !a.startsWith("-"))[index];
}

function extractFlagValue(
  args: string[],
  longFlag: string,
  shortFlag?: string,
): string | undefined {
  const flags = shortFlag ? [longFlag, shortFlag] : [longFlag];
  for (let i = 0; i < args.length; i++) {
    if (flags.includes(args[i])) {
      return args[i + 1];
    }
    if (args[i].startsWith(`${longFlag}=`)) {
      return args[i].split("=")[1];
    }
    if (shortFlag && args[i].startsWith(`${shortFlag}=`)) {
      return args[i].split("=")[1];
    }
  }
  return undefined;
}

const GENERATE_TYPES: Record<string, { dir: string; ext: string }> = {
  route: { dir: "src/routes", ext: ".tsx" },
  component: { dir: "src/components", ext: ".tsx" },
  layout: { dir: "src/layouts", ext: ".tsx" },
  error: { dir: "src/routes", ext: ".tsx" },
  loader: { dir: "src/loaders", ext: ".ts" },
  action: { dir: "src/actions", ext: ".ts" },
  api: { dir: "src/routes/_api", ext: ".ts" },
};

async function runGenerate(args: string[]): Promise<void> {
  const nonFlagArgs = args.filter((a) => !a.startsWith("-"));
  const [type, name] = nonFlagArgs;

  if (!type || !name) {
    console.error(
      `Usage: emberkit generate <type> <name> [--path <file-path>]\n\nTypes: ${Object.keys(GENERATE_TYPES).join(", ")}`,
    );
    process.exit(1);
  }

  const explicitPath = extractFlagValue(args, "--path", "-p");
  const typeConfig = GENERATE_TYPES[type];

  if (!typeConfig && !explicitPath) {
    console.error(
      `Unknown type "${type}". Valid types: ${Object.keys(GENERATE_TYPES).join(", ")}`,
    );
    process.exit(1);
  }

  const filePath =
    explicitPath ??
    `${typeConfig.dir}/${toKebabCase(name)}${typeConfig.ext}`;

  const result = await generate({ name, path: filePath, template: type });

  if (result.success) {
    console.log(`${cliBrand.spark()} Generated ${type}: ${result.path}`);
  } else {
    console.error(`${cliBrand.fail()} ${result.error}`);
    process.exit(1);
  }
}
