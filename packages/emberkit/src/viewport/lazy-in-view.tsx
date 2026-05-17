import { createElement } from '../runtime/index.js';
import type { JSXElementProps, JSXNode } from '../runtime/types.js';
import { nextLazyId, registerLazyContent } from './registry.js';

export interface LazyInViewProps extends Omit<JSXElementProps, 'children'> {
  as?: string;
  children: JSXNode | (() => JSXNode);
  className?: string;
  fallback?: JSXNode;
  minHeight?: number | string;
  once?: boolean;
  rootMargin?: string;
  ssr?: 'lazy' | 'eager';
}

function resolveLazyContent(children: LazyInViewProps['children']): JSXNode {
  return typeof children === 'function' ? (children as () => JSXNode)() : children;
}

export function LazyInView({
  as = 'div',
  children,
  className,
  fallback = null,
  minHeight,
  once = true,
  rootMargin = '200px',
  ssr = 'lazy',
  style,
  ...rest
}: LazyInViewProps): JSXNode {
  const id = nextLazyId();
  const loader = () => resolveLazyContent(children);

  registerLazyContent(id, loader);

  const shouldRenderLazy = ssr === 'lazy';
  const resolvedStyle =
    minHeight == null
      ? style
      : {
          ...(typeof style === 'object' && style !== null ? (style as Record<string, unknown>) : {}),
          minHeight,
        };

  return createElement(
    as,
    {
      ...rest,
      'aria-busy': shouldRenderLazy ? 'true' : undefined,
      className,
      'data-ek-lazy-in-view': id,
      'data-ek-lazy-once': String(once),
      'data-ek-lazy-root-margin': rootMargin,
      'data-ek-lazy-loaded': shouldRenderLazy ? undefined : 'true',
      style: resolvedStyle,
    },
    shouldRenderLazy ? fallback : loader(),
  );
};
