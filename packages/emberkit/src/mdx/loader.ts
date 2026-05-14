import type { MDXConfig, MDXComponent } from './index.js';
import { compileMDX } from './index.js';

export async function loadMDX(path: string, options?: MDXConfig): Promise<MDXComponent> {
  const fs = await import('node:fs');
  const source = fs.readFileSync(path, 'utf-8');
  return compileMDX(source, options);
}
