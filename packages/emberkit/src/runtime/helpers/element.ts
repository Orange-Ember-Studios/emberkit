import type { JSXElementProps, JSXNode, DOMElement } from '../types.js';

export function createElement(
  type: string | ((props: JSXElementProps) => JSXNode),
  props: JSXElementProps | null,
  ...children: JSXNode[]
): DOMElement {
  const resolvedProps: JSXElementProps = props ?? {};

  if (children.length > 0) {
    const flatChildren = children.flat().filter((child) => child != null && child !== false);
    if (flatChildren.length > 0) {
      resolvedProps.children = flatChildren;
    }
  }

  return {
    type: type as string,
    props: resolvedProps,
  };
}

export function isValidElement(element: unknown): element is DOMElement {
  if (typeof element !== 'object' || element === null) return false;
  const obj = element as Record<string, unknown>;
  return typeof obj['type'] === 'string' && typeof obj['props'] === 'object';
}

export function isComponent(type: unknown): type is (props: JSXElementProps) => JSXNode {
  return typeof type === 'function';
}

export function flattenChildren(children: unknown[]): JSXNode[] {
  const result: JSXNode[] = [];

  for (const child of children) {
    if (child == null || child === false || child === undefined) continue;
    if (typeof child === 'string' || typeof child === 'number') {
      result.push(child);
    } else if (Array.isArray(child)) {
      result.push(...flattenChildren(child));
    } else {
      result.push(child as JSXNode);
    }
  }

  return result;
}

export function resolveComponent(
  type: string | ((props: JSXElementProps) => JSXNode),
  props: JSXElementProps,
): DOMElement {
  if (isComponent(type)) {
    const result = type(props);
    if (typeof result === 'string' || typeof result === 'number') {
      return createElement('span', null, result);
    }
    if (isValidElement(result)) {
      return result as DOMElement;
    }
    return createElement('span', null, String(result));
  }

  return createElement(type, props);
}
