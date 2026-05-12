import { runCLI } from './cli.js';

export { runCLI };

export async function main(): Promise<void> {
  await runCLI(process.argv);
}