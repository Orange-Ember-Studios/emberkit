import { describe, it, expect } from 'vitest';
import { createElement, isElement, flushSync } from '../index.js';
import { resolveComponent, flattenChildren } from '../helpers/element.js';
import { renderToString } from '../helpers/render.js';
import type { JSXElementProps, JSXNode } from '../types.js';

describe('createElement', () => {
  it('should create a simple element', () => {
    const element = createElement('div', { class: 'container' }, 'Hello');

    expect(element).toHaveProperty('type', 'div');
    expect(element.props).toHaveProperty('class', 'container');
    expect(element.props.children).toContain('Hello');
  });

  it('should create element without props', () => {
    const element = createElement('span', null, 'Text');

    expect(element.type).toBe('span');
    expect(element.props.children).toContain('Text');
  });

  it('should flatten array children', () => {
    const element = createElement('div', null, ['A', 'B'], 'C');

    expect(element.props.children).toEqual(['A', 'B', 'C']);
  });

  it('should filter out null and false children', () => {
    const element = createElement('div', null, 'A', null, false, 'B');

    expect(element.props.children).toEqual(['A', 'B']);
  });

  it('should create element with multiple props', () => {
    const element = createElement(
      'input',
      { type: 'text', name: 'username', disabled: false },
    );

    expect(element.props.type).toBe('text');
    expect(element.props.name).toBe('username');
    expect(element.props.disabled).toBe(false);
  });
});

describe('isElement', () => {
  it('should return true for valid elements', () => {
    const element = createElement('div', null, 'Hello');
    expect(isElement(element)).toBe(true);
  });

  it('should return false for null', () => {
    expect(isElement(null)).toBe(false);
  });

  it('should return false for strings', () => {
    expect(isElement('Hello')).toBe(false);
  });

  it('should return false for plain objects', () => {
    expect(isElement({ type: 'div' })).toBe(false);
  });
});

describe('flattenChildren', () => {
  it('should flatten nested arrays', () => {
    const result = flattenChildren([['A', 'B'], ['C', ['D']]]);
    expect(result).toEqual(['A', 'B', 'C', 'D']);
  });

  it('should filter null and false', () => {
    const result = flattenChildren(['A', null, false, 'B', undefined]);
    expect(result).toEqual(['A', 'B']);
  });

  it('should handle empty arrays', () => {
    const result = flattenChildren([]);
    expect(result).toEqual([]);
  });
});

describe('renderToString', () => {
  it('should render a simple div', () => {
    const element = createElement('div', { class: 'container' }, 'Hello');
    const html = renderToString(element);

    expect(html).toBe('<div class="container">Hello</div>');
  });

  it('should render nested elements', () => {
    const element = createElement(
      'div',
      null,
      createElement('span', null, 'Nested'),
    );
    const html = renderToString(element);

    expect(html).toBe('<div><span>Nested</span></div>');
  });

  it('should render self-closing elements', () => {
    const element = createElement('input', { type: 'text', name: 'test' });
    const html = renderToString(element);

    expect(html).toBe('<input type="text" name="test"/>');
  });

  it('should render boolean attributes correctly', () => {
    const element = createElement('input', { type: 'checkbox', checked: true });
    const html = renderToString(element);

    expect(html).toContain('checked');
  });

  it('should return empty string for null', () => {
    expect(renderToString(null)).toBe('');
  });

  it('should render text content directly', () => {
    expect(renderToString('Hello World')).toBe('Hello World');
  });

  it('should render Fragment as just children', () => {
    const element = createElement('Fragment', null, 'A', 'B');
    const html = renderToString(element);

    expect(html).toBe('AB');
  });
});

describe('resolveComponent', () => {
  it('should resolve function components', () => {
    const Component = (props: { name: string }) =>
      createElement('span', null, `Hello ${props.name}`) as unknown;

    const element = resolveComponent(Component as (props: JSXElementProps) => JSXNode, { name: 'World' });

    expect(element.type).toBe('span');
    expect(element.props.children).toContain('Hello World');
  });

  it('should handle component returning string', () => {
    const Component = () => 'Just text' as unknown;

    const element = resolveComponent(Component as (props: JSXElementProps) => JSXNode, {});

    expect(element.type).toBe('span');
    expect(element.props.children).toContain('Just text');
  });
});

describe('flushSync', () => {
  it('should execute function immediately', () => {
    let count = 0;
    flushSync(() => {
      count = 5;
    });
    expect(count).toBe(5);
  });
});
