interface JSXNode {
  type: string | ((props: Record<string, unknown>) => unknown);
  props: Record<string, unknown>;
}

export function jsx(
  type: string | ((props: Record<string, unknown>) => unknown),
  props: Record<string, unknown>,
): JSXNode {
  return { type, props };
}

export const Fragment = ({ children }: { children?: unknown[] }) => {
  return children;
};

export const jsxs = jsx;
