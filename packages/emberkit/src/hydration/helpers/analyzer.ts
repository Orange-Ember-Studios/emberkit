import type { DOMElement } from '../../runtime/types.js';
import {
  hasEventHandlers,
  isInteractiveTag,
  INTERACTIVE_ATTRIBUTES,
  type InteractiveElement,
  type HydrationManifest,
  type HydrationStrategy,
} from '../types.js';

export function analyzeElement(element: DOMElement): InteractiveElement | null {
  const { type, props } = element;

  if (typeof type !== 'string') {
    return null;
  }

  const needsHydration = isInteractiveTag(type) || hasEventHandlers(props ?? {});
  const eventHandlers = extractEventHandlers(props ?? {});

  const strategy = determineHydrationStrategy(type, props ?? {});

  return {
    selector: buildSelector(type, props ?? {}),
    eventHandlers,
    needsHydration,
    strategy,
  };
}

export function extractEventHandlers(props: Record<string, unknown>): Set<string> {
  const handlers = new Set<string>();

  for (const key of Object.keys(props)) {
    if (INTERACTIVE_ATTRIBUTES.has(key)) {
      handlers.add(key);
    }
  }

  return handlers;
}

export function buildSelector(tagName: string, props: Record<string, unknown>): string {
  let selector = tagName.toLowerCase();

  if (props.id && typeof props.id === 'string') {
    selector = `#${props.id}`;
  } else if (props.class && typeof props.class === 'string') {
    const classes = props.class.split(' ').filter(Boolean).join('.');
    if (classes) {
      selector = `${tagName.toLowerCase()}.${classes}`;
    }
  }

  return selector;
}

export function determineHydrationStrategy(
  tagName: string,
  props: Record<string, unknown>,
): HydrationStrategy {
  if (props['data-hydrate'] === 'false') {
    return { type: 'none' };
  }

  if (props['data-hydrate'] === 'lazy') {
    return { type: 'lazy', priority: 'low' };
  }

  if (props['data-hydrate'] === 'deferred') {
    return { type: 'deferred', priority: 'low', timeout: 2000 };
  }

  const hasClickHandler = Object.keys(props).some((key) => key === 'onClick');

  if (hasClickHandler) {
    return { type: 'eager', priority: 'high' };
  }

  if (isInteractiveTag(tagName)) {
    return { type: 'eager', priority: 'medium' };
  }

  return { type: 'none' };
}

export function analyzeTree(element: DOMElement | null): HydrationManifest {
  const elements: InteractiveElement[] = [];
  let hydrationRequired = 0;
  let hydrationSkipped = 0;

  function traverse(node: DOMElement | null): void {
    if (!node) return;

    const analyzed = analyzeElement(node);
    if (analyzed) {
      elements.push(analyzed);
      if (analyzed.needsHydration) {
        hydrationRequired++;
      } else {
        hydrationSkipped++;
      }
    }

    const children = (node.props?.children ?? []) as DOMElement[];
    if (Array.isArray(children)) {
      for (const child of children) {
        if (typeof child === 'object' && child !== null && 'type' in child) {
          traverse(child as DOMElement);
        }
      }
    }
  }

  traverse(element);

  return {
    elements,
    totalElements: elements.length,
    hydrationRequired,
    hydrationSkipped,
  };
}

export function getHydrationCandidates(
  manifest: HydrationManifest,
  strategy: HydrationStrategy['type'],
): InteractiveElement[] {
  return manifest.elements.filter((el) => el.strategy.type === strategy);
}
