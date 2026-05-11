export * from './adapters/core.js';
export * from './adapters/cloudflare.js';
export * from './adapters/deno.js';

export const EDGE_BUNDLE_SIZE_WARNING = 1024;
export const MAX_BUNDLE_SIZE = 8 * 1024;

export interface BundleStats {
  size: number;
  warnings: string[];
  errors: string[];
}

export function analyzeBundle(code: string): BundleStats {
  const size = new Blob([code]).size;
  const warnings: string[] = [];
  const errors: string[] = [];

  if (size > MAX_BUNDLE_SIZE) {
    errors.push(`Bundle exceeds maximum size: ${size} > ${MAX_BUNDLE_SIZE}`);
  } else if (size > EDGE_BUNDLE_SIZE_WARNING) {
    warnings.push(`Bundle size is large: ${size} bytes`);
  }

  return { size, warnings, errors };
}

export function treeShake(code: string): string {
  const lines = code.split('\n');
  const pruned: string[] = [];

  for (const line of lines) {
    if (!line.includes('__DEV__') || line.includes('if (true)')) {
      pruned.push(line);
    }
  }

  return pruned.join('\n');
}

export function minifyHTML(html: string): string {
  return html
    .replace(/\s+/g, ' ')
    .replace(/>\s+</g, '><')
    .trim();
}

export function inlineCriticalCSS(css: string, maxSize = 512): string {
  if (css.length <= maxSize) {
    return css;
  }

  return css.slice(0, maxSize) + '...';
}