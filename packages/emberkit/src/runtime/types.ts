export interface JSXElementProps {
  children?: JSXNode | JSXNode[];
  key?: string;
  ref?: { current: Element | null };
  [key: string]: unknown;
}

export type JSXNode = JSXElement | string | number | null | false | undefined;

export interface JSXElement {
  type: string | ((props: JSXElementProps) => JSXNode);
  props: JSXElementProps;
}

export type RouteChildren = JSXNode;

export interface RouteComponent<P extends JSXElementProps = JSXElementProps> {
  (props: P): JSXNode;
  displayName?: string;
}

/* eslint-disable @typescript-eslint/no-empty-object-type */
declare module 'react' {
  namespace JSX {
    interface Element extends JSXElement {}
    interface IntrinsicElements {
      [elemName: string]: JSXElementProps;
    }
  }
}
/* eslint-enable @typescript-eslint/no-empty-object-type */

export interface FC<P extends JSXElementProps = JSXElementProps> {
  (props: P): JSXNode;
  displayName?: string;
}

export type DOMElement = JSXElement & {
  type: string;
};

export interface RenderOptions {
  container: Element | string;
  hydrate?: boolean;
}

export interface EmberKitConfig {
  mode: 'static' | 'ssr' | 'spa' | 'hybrid';
  output: string;
  jsx: 'automatic' | 'classic';
  target: string;
  vite?: Record<string, unknown>;
  plugins?: unknown[];
}

export interface RouteParams<T extends Record<string, string> = Record<string, string>> {
  params: T;
  query: Record<string, string | string[]>;
  request: Request;
}

export interface LoaderData<T> {
  data: T;
  error?: never;
}

export interface LoaderError {
  data?: never;
  error: {
    code: string;
    message: string;
    status: number;
  };
}

export type LoaderResult<T> = LoaderData<T> | LoaderError;
