import type { Command } from './types.js';

export interface CLIConfig {
  version: string;
  commands: Map<string, Command>;
  projectRoot: string;
}

export interface CLIContext {
  config: CLIConfig;
  cwd: string;
  args: string[];
  flags: Record<string, string | boolean>;
}

export async function runCLI(args: string[]): Promise<void> {
  const [command, ...restArgs] = args.slice(2);

  if (!command) {
    await showHelp();
    return;
  }

  switch (command) {
    case 'init':
      await runInit(restArgs);
      break;
    case 'dev':
      await runDev(restArgs);
      break;
    case 'build':
      await runBuild(restArgs);
      break;
    case 'generate':
      await runGenerate(restArgs);
      break;
    case '--version':
    case '-v':
      console.log('EmberKit CLI v0.1.0');
      break;
    case '--help':
    case '-h':
      await showHelp();
      break;
    default:
      console.error(`Unknown command: ${command}`);
      await showHelp();
      process.exit(1);
  }
}

async function showHelp(): Promise<void> {
  console.log(`
EmberKit CLI v0.1.0

Usage: emberkit <command> [options]

Commands:
  init [template]     Initialize a new EmberKit project
  dev                Start development server
  build              Build for production
  generate <type>    Generate code (routes, components, etc.)

Options:
  --help, -h         Show this help message
  --version, -v      Show version number

Examples:
  emberkit init
  emberkit dev
  emberkit build
  emberkit generate route about
`);
}

async function runInit(args: string[]): Promise<void> {
  console.log('Initializing EmberKit project...');
}

async function runDev(args: string[]): Promise<void> {
  console.log('Starting development server...');
}

async function runBuild(args: string[]): Promise<void> {
  console.log('Building for production...');
}

async function runGenerate(args: string[]): Promise<void> {
  const [type, name] = args;
  if (!type || !name) {
    console.error('Usage: emberkit generate <type> <name>');
    process.exit(1);
  }
  console.log(`Generating ${type}: ${name}`);
}

export { runCLI };