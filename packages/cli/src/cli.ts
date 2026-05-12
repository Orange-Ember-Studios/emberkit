import { dev } from './commands/dev.js';
import { build } from './commands/build.js';
import { preview } from './commands/preview.js';

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
    case 'dev':
      await dev(restArgs);
      break;
    case 'build':
      await build(restArgs);
      break;
    case 'preview':
      await preview(restArgs);
      break;
    case 'init':
      await runInit(restArgs);
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
  dev                  Start development server
  build                Build for production
  preview              Preview production build
  init [template]      Initialize a new EmberKit project
  generate <type>      Generate code (routes, components, etc.)

Options:
  --help, -h          Show this help message
  --version, -v       Show version number

Examples:
  emberkit dev
  emberkit build
  emberkit preview
  emberkit init
  emberkit generate route about
`);
}

async function runInit(_args: string[]): Promise<void> {
  console.log('🚀 Initializing EmberKit project...');
  console.log('(Not yet implemented)');
}

async function runGenerate(args: string[]): Promise<void> {
  const [type, name] = args;
  if (!type || !name) {
    console.error('Usage: emberkit generate <type> <name>');
    process.exit(1);
  }
  console.log(`🎨 Generating ${type}: ${name}`);
  console.log('(Not yet implemented)');
}