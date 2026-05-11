export interface JSXElementNode {
  type: string;
  props: Record<string, unknown>;
  children: (JSXElementNode | string)[];
  key?: string | null;
}

export interface JSXFragmentNode {
  type: 'Fragment';
  props: Record<string, never>;
  children: (JSXElementNode | string)[];
}

export type JSXNode = JSXElementNode | JSXFragmentNode | string;

export interface JSXAttribute {
  type: 'attribute';
  name: string;
  value: unknown;
}

export interface JSXSpreadAttribute {
  type: 'spread';
  argument: unknown;
}

export type JSXAttr = JSXAttribute | JSXSpreadAttribute;

export interface TemplatePart {
  type: 'string' | 'expression';
  value: string;
}

export interface CompiledTemplate {
  parts: TemplatePart[];
  dependencies: string[];
}

export interface TransformContext {
  mode: 'static' | 'ssr' | 'spa' | 'hybrid';
  filePath: string;
  imports: Set<string>;
  variables: Map<string, number>;
}

export const FRAGMENT_TYPE = 'Fragment';
export const KEY_PROPERTY = '__key';
export const CHILDREN_PROPERTY = 'children';
