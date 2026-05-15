import inquirer from "inquirer";
import { dev } from "./commands/dev.js";
import { build } from "./commands/build.js";
import { preview } from "./commands/preview.js";
import { create } from "./commands/create.js";
import { TEMPLATES } from "./commands/create.js";

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
    case "create":
      await handleCreate(restArgs);
      break;
    case "generate":
      await runGenerate(restArgs);
      break;
    case "--version":
    case "-v":
      console.log("EmberKit CLI v0.1.0");
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
🔥 EmberKit CLI v0.1.0

Usage: emberkit <command> [options]

Commands:
  create [name]        Create a new EmberKit project
  dev                  Start development server
  build                Build for production
  preview              Preview production build
  generate <type>      Generate code (routes, components, etc.)

Options:
  --template, -t <id>  Project template to use
  --no-install         Skip dependency installation
  --help, -h           Show this help message
  --version, -v        Show version number

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
🔥 EmberKit — Create a new project

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

async function runGenerate(args: string[]): Promise<void> {
  const [type, name] = args;
  if (!type || !name) {
    console.error("Usage: emberkit generate <type> <name>");
    process.exit(1);
  }
  console.log(`🎨 Generating ${type}: ${name}`);
  console.log("(Not yet implemented)");
}
