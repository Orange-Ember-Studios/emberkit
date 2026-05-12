interface JSXNode {
  type: string | ((props: Record<string, unknown>) => unknown);
  props: Record<string, unknown>;
}

export function jsxDEV(type: string | ((props: Record<string, unknown>) => unknown), props: Record<string, unknown>): JSXNode {
  return { type, props };
}