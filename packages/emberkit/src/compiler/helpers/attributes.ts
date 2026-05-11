import type { TemplatePart } from '../types.js';
import { escapeString } from './utils.js';

export function compileAttributes(props: Record<string, unknown>): TemplatePart[] {
  const parts: TemplatePart[] = [];

  for (const [key, value] of Object.entries(props)) {
    if (key === 'children' || key === 'key') continue;

    if (value === true) {
      parts.push({ type: 'string', value: ` ${key}` });
    } else if (value === false) {
      continue;
    } else if (typeof value === 'string') {
      parts.push({ type: 'string', value: ` ${key}="${escapeString(value)}"` });
    } else {
      parts.push({ type: 'string', value: ` ${key}=` });
      parts.push({ type: 'expression', value: String(value) });
      parts.push({ type: 'string', value: '"' });
    }
  }

  return parts;
}

export function compileChildren(children: (string | unknown)[]): TemplatePart[] {
  const parts: TemplatePart[] = [];

  for (const child of children) {
    if (typeof child === 'string') {
      parts.push({ type: 'string', value: escapeString(child) });
    } else {
      parts.push({ type: 'expression', value: String(child) });
    }
  }

  return parts;
}
