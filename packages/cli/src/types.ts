export interface Command {
  name: string;
  description: string;
  options: CommandOption[];
  execute(args: string[], context: CLIContext): Promise<void>;
}

export interface CommandOption {
  name: string;
  short?: string;
  description: string;
  type: 'boolean' | 'string' | 'number';
  default?: unknown;
  required?: boolean;
}

export interface GeneratorOptions {
  name: string;
  path: string;
  template: string;
  params?: Record<string, string>;
}