import { describe, it, expect } from 'vitest';
import {
  compileToTemplate,
  compileSelfClosing,
  compileTextContent,
  assembleTemplate,
} from '../compiler.js';

describe('compileToTemplate', () => {
  it('should compile a simple div with text children', () => {
    const result = compileToTemplate('div', {}, ['Hello']);
    const assembled = assembleTemplate(result.parts);

    expect(assembled).toBe('<div>Hello</div>');
  });

  it('should compile a div with multiple text children', () => {
    const result = compileToTemplate('div', {}, ['Hello', ' ', 'World']);
    const assembled = assembleTemplate(result.parts);

    expect(assembled).toBe('<div>Hello World</div>');
  });

  it('should compile a div with class attribute', () => {
    const result = compileToTemplate('div', { class: 'container' }, ['Hello']);
    const assembled = assembleTemplate(result.parts);

    expect(assembled).toBe('<div class="container">Hello</div>');
  });

  it('should compile a self-closing input with type attribute', () => {
    const result = compileSelfClosing('input', { type: 'text', name: 'username' });
    const assembled = assembleTemplate(result.parts);

    expect(assembled).toBe('<input type="text" name="username"/>');
  });

  it('should compile a self-closing input with boolean attributes', () => {
    const result = compileSelfClosing('input', { type: 'checkbox', checked: true, disabled: false });
    const assembled = assembleTemplate(result.parts);

    expect(assembled).toBe('<input type="checkbox" checked/>');
  });

  it('should compile text content', () => {
    const result = compileTextContent('Hello World');
    const assembled = assembleTemplate(result.parts);

    expect(assembled).toBe('Hello World');
  });

  it('should handle dynamic attributes as expressions', () => {
    const result = compileToTemplate('div', { id: 'dynamicId' }, ['Content']);
    const assembled = assembleTemplate(result.parts);

    expect(assembled).toBe('<div id="dynamicId">Content</div>');
  });

  it('should skip key and children from attributes', () => {
    const result = compileToTemplate(
      'div',
      { class: 'box', key: 'unique-1', children: ['inner'] },
      ['inner'],
    );
    const assembled = assembleTemplate(result.parts);

    expect(assembled).toBe('<div class="box">inner</div>');
  });

  it('should handle empty props', () => {
    const result = compileToTemplate('span', {}, ['Text']);
    const assembled = assembleTemplate(result.parts);

    expect(assembled).toBe('<span>Text</span>');
  });
});
