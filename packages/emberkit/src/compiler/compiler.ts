import type { TemplatePart, CompiledTemplate } from './types.js';
import { compileAttributes, compileChildren } from './helpers/attributes.js';

export function compileToTemplate(
  tag: string,
  props: Record<string, unknown>,
  children: unknown[],
): CompiledTemplate {
  const parts: TemplatePart[] = [];

  parts.push({ type: 'string', value: `<${tag}` });

  const attributeParts = compileAttributes(props);
  parts.push(...attributeParts);

  parts.push({ type: 'string', value: '>' });

  const childrenParts = compileChildren(children as (string | unknown)[]);
  parts.push(...childrenParts);

  parts.push({ type: 'string', value: `</${tag}>` });

  return {
    parts,
    dependencies: [],
  };
}

export function compileSelfClosing(tag: string, props: Record<string, unknown>): CompiledTemplate {
  const parts: TemplatePart[] = [];

  parts.push({ type: 'string', value: `<${tag}` });

  const attributeParts = compileAttributes(props);
  parts.push(...attributeParts);

  parts.push({ type: 'string', value: '/>' });

  return {
    parts,
    dependencies: [],
  };
}

export function compileTextContent(text: string): CompiledTemplate {
  return {
    parts: [{ type: 'string', value: text }],
    dependencies: [],
  };
}

export function assembleTemplate(parts: TemplatePart[]): string {
  let result = '';

  for (const part of parts) {
    if (part.type === 'string') {
      result += part.value;
    } else {
      result += '${' + part.value + '}';
    }
  }

  return result;
}
