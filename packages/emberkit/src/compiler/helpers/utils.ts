import type { TemplatePart } from '../types.js';

export function escapeString(str: string): string {
  return str.replace(/[`\\${}]/g, '\\$&');
}

export function generateTemplateParts(
  parts: TemplatePart[],
): { template: string; expressions: string[] } {
  const templateParts: string[] = [];
  const expressions: string[] = [];

  for (const part of parts) {
    if (part.type === 'string') {
      templateParts.push(escapeString(part.value));
    } else {
      templateParts.push('${');
      templateParts.push(part.value);
      templateParts.push('}');
      expressions.push(part.value);
    }
  }

  return {
    template: '`' + templateParts.join('') + '`',
    expressions,
  };
}

export function toKebabCase(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

export function isValidComponentName(name: string): boolean {
  return /^[A-Z]/.test(name) || name === 'Fragment';
}

export function isHtmlElement(name: string): boolean {
  return /^[a-z]/.test(name);
}
