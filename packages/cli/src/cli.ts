import { dev } from "./commands/dev.js";
import { build } from "./commands/build.js";
import { preview } from "./commands/preview.js";
import { create } from "./commands/create.js";

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
  create <name>        Create a new EmberKit project
  dev                  Start development server
  build                Build for production
  preview              Preview production build
  generate <type>      Generate code (routes, components, etc.)

Options:
  --help, -h          Show this help message
  --version, -v       Show version number

Examples:
  emberkit create my-app
  emberkit dev
  emberkit build
  emberkit generate route about
`);
}

async function handleCreate(args: string[]): Promise<void> {
  const name = args[0];
  if (!name) {
    console.error("Error: Project name is required.");
    console.error("Usage: emberkit create <project-name>");
    process.exit(1);
  }

  const noInstall = args.includes("--no-install");

  await create({
    name,
    noInstall,
  });
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
