export interface HydrationConfig {
  hydrateInteractive?: boolean;
  lazyComponents?: boolean;
  streaming?: boolean;
}

export interface HydrationStrategy {
  type: 'eager' | 'lazy' | 'deferred' | 'none';
  priority?: 'high' | 'medium' | 'low';
  timeout?: number;
}

export interface InteractiveElement {
  selector: string;
  eventHandlers: Set<string>;
  needsHydration: boolean;
  strategy: HydrationStrategy;
}

export interface HydrationManifest {
  elements: InteractiveElement[];
  totalElements: number;
  hydrationRequired: number;
  hydrationSkipped: number;
}

export const INTERACTIVE_ATTRIBUTES = new Set([
  'onClick',
  'onMouseDown',
  'onMouseUp',
  'onMouseEnter',
  'onMouseLeave',
  'onFocus',
  'onBlur',
  'onChange',
  'onInput',
  'onSubmit',
  'onKeyDown',
  'onKeyUp',
  'onKeyPress',
  'onScroll',
  'onTouchStart',
  'onTouchEnd',
  'onTouchMove',
  'onDragStart',
  'onDrag',
  'onDragEnd',
  'onWheel',
  'onAnimationStart',
  'onAnimationEnd',
]);

export const HYDRATABLE_TAGS = new Set([
  'button',
  'a',
  'input',
  'select',
  'textarea',
  'form',
  'details',
  'dialog',
  'summary',
]);

export function isInteractiveTag(tagName: string): boolean {
  return HYDRATABLE_TAGS.has(tagName.toLowerCase());
}

export function hasEventHandlers(props: Record<string, unknown>): boolean {
  return Object.keys(props).some((key) => INTERACTIVE_ATTRIBUTES.has(key));
}
