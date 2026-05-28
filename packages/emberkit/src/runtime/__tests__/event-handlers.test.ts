import { describe, it, expect, beforeEach } from 'vitest';
import { createElement, attachEventHandlers } from '../index.js';
import { renderToString, clearHandlers } from '../helpers/render.js';

describe('event handler hydration', () => {
  beforeEach(() => {
    clearHandlers();
    document.body.innerHTML = '';
  });

  it('attaches onChange handlers to select elements', () => {
    let selected = '';
    const tree = createElement(
      'select',
      {
        onChange: (e) => {
          selected = (e.currentTarget as HTMLSelectElement).value;
        },
      },
      createElement('option', { value: 'en' }, 'English'),
      createElement('option', { value: 'es' }, 'Español'),
    );

    const html = renderToString(tree);
    expect(html).toContain('data-ekchange=');

    const container = document.createElement('div');
    container.innerHTML = html;
    document.body.appendChild(container);

    attachEventHandlers(container);

    const select = container.querySelector('select') as HTMLSelectElement;
    select.value = 'es';
    select.dispatchEvent(new Event('change', { bubbles: true }));

    expect(selected).toBe('es');
  });
});
