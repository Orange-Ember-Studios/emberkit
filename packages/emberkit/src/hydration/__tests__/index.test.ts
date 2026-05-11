import { describe, it, expect } from 'vitest';
import { createElement } from '../../runtime/index.js';
import {
  analyzeTree,
  analyzeElement,
  extractEventHandlers,
  buildSelector,
  determineHydrationStrategy,
  getHydrationCandidates,
} from '../index.js';

describe('Hydration Analyzer', () => {
  describe('analyzeElement', () => {
    it('should detect interactive button', () => {
      const element = createElement('button', { onClick: () => {} }) as DOMElement;
      const result = analyzeElement(element);

      expect(result).not.toBeNull();
      expect(result?.needsHydration).toBe(true);
      expect(result?.strategy.type).toBe('eager');
    });

    it('should detect non-interactive paragraph', () => {
      const element = createElement('p', null, 'Text') as DOMElement;
      const result = analyzeElement(element);

      expect(result?.needsHydration).toBe(false);
      expect(result?.strategy.type).toBe('none');
    });

    it('should respect data-hydrate=false', () => {
      const element = createElement('button', {
        'data-hydrate': 'false',
        onClick: () => {},
      }) as DOMElement;
      const result = analyzeElement(element);

      expect(result?.strategy.type).toBe('none');
    });

    it('should respect data-hydrate=lazy', () => {
      const element = createElement('div', {
        'data-hydrate': 'lazy',
        onClick: () => {},
      }) as DOMElement;
      const result = analyzeElement(element);

      expect(result?.strategy.type).toBe('lazy');
    });
  });

  describe('extractEventHandlers', () => {
    it('should extract onClick', () => {
      const handlers = extractEventHandlers({ onClick: () => {} });
      expect(handlers.has('onClick')).toBe(true);
    });

    it('should extract multiple handlers', () => {
      const handlers = extractEventHandlers({
        onClick: () => {},
        onMouseEnter: () => {},
        class: 'test',
      });
      expect(handlers.has('onClick')).toBe(true);
      expect(handlers.has('onMouseEnter')).toBe(true);
      expect(handlers.has('class')).toBe(false);
    });

    it('should return empty set for no handlers', () => {
      const handlers = extractEventHandlers({ class: 'test' });
      expect(handlers.size).toBe(0);
    });
  });

  describe('buildSelector', () => {
    it('should build selector with id', () => {
      const selector = buildSelector('div', { id: 'my-div' });
      expect(selector).toBe('#my-div');
    });

    it('should build selector with class', () => {
      const selector = buildSelector('button', { class: 'primary large' });
      expect(selector).toBe('button.primary.large');
    });

    it('should use tag name as fallback', () => {
      const selector = buildSelector('span', {});
      expect(selector).toBe('span');
    });
  });

  describe('determineHydrationStrategy', () => {
    it('should prioritize onClick handlers', () => {
      const strategy = determineHydrationStrategy('div', { onClick: () => {} });
      expect(strategy.type).toBe('eager');
      expect(strategy.priority).toBe('high');
    });

    it('should mark form as medium priority', () => {
      const strategy = determineHydrationStrategy('form', {});
      expect(strategy.type).toBe('eager');
      expect(strategy.priority).toBe('medium');
    });

    it('should mark static content as none', () => {
      const strategy = determineHydrationStrategy('p', { class: 'text' });
      expect(strategy.type).toBe('none');
    });
  });

  describe('analyzeTree', () => {
    it('should analyze nested elements', () => {
      const element = createElement('div', null,
        createElement('button', { onClick: () => {} }),
        createElement('p', null, 'Static text'),
      ) as DOMElement;

      const manifest = analyzeTree(element);

      expect(manifest.totalElements).toBe(3);
      expect(manifest.hydrationRequired).toBe(1);
      expect(manifest.hydrationSkipped).toBe(2);
    });

    it('should handle empty tree', () => {
      const manifest = analyzeTree(null);
      expect(manifest.totalElements).toBe(0);
      expect(manifest.hydrationRequired).toBe(0);
    });
  });

  describe('getHydrationCandidates', () => {
    it('should filter by strategy type', () => {
      const element = createElement('div', null,
        createElement('button', { onClick: () => {} }),
        createElement('p', { 'data-hydrate': 'lazy' }, 'Lazy'),
        createElement('span', null, 'Static'),
      ) as DOMElement;

      const manifest = analyzeTree(element);
      const eager = getHydrationCandidates(manifest, 'eager');
      const lazy = getHydrationCandidates(manifest, 'lazy');

      expect(eager.length).toBe(1);
      expect(lazy.length).toBe(1);
    });
  });
});

interface DOMElement {
  type: string;
  props: Record<string, unknown>;
}
