import { describe, it, expect } from 'vitest';
import { createElement } from '../../runtime/index.js';
import { renderSSR, renderSSRWithError, createStreamingRenderer, injectScripts } from '../index.js';
import { renderToHTMLString, createHtmlDocument, escapeHtml } from '../helpers/render-html.js';
import { getStatusText } from '../types.js';
import type { LoaderResult } from '../../loader/types.js';

describe('renderSSR', () => {
  it('should render element to HTML string', () => {
    const element = createElement('div', { class: 'container' }, 'Hello');
    const result = renderSSR(element);

    expect(result.html).toContain('<div class="container">Hello</div>');
    expect(result.status).toBe(200);
    expect(result.headers.get('Content-Type')).toBe('text/html');
  });

  it('should wrap content in HTML document', () => {
    const element = createElement('h1', null, 'Title');
    const result = renderSSR(element);

    expect(result.html).toContain('<!DOCTYPE html>');
    expect(result.html).toContain('<html');
    expect(result.html).toContain('</html>');
  });

  it('should include title in document', () => {
    const element = createElement('div', null, 'Content');
    const result = renderSSR(element, { title: 'My Page' });

    expect(result.html).toContain('<title>My Page</title>');
  });

  it('should include lang attribute', () => {
    const element = createElement('div', null, 'Content');
    const result = renderSSR(element, { lang: 'es' });

    expect(result.html).toContain('lang="es"');
  });

  it('should handle null element', () => {
    const result = renderSSR(null);
    expect(result.status).toBe(200);
  });
});

describe('renderSSRWithError', () => {
  it('should render error page with status', () => {
    const element = createElement('div', null, 'Content');
    const error: LoaderResult<unknown> = {
      error: { code: 'NOT_FOUND', message: 'Page not found', status: 404 },
    };

    const result = renderSSRWithError(element, error);

    expect(result.status).toBe(404);
    expect(result.html).toContain('404');
    expect(result.html).toContain('Page not found');
  });

  it('should use 500 for unknown errors', () => {
    const element = createElement('div', null, 'Content');
    const result = renderSSRWithError(element, null);

    expect(result.status).toBe(500);
  });
});

describe('createStreamingRenderer', () => {
  it('should accumulate chunks', () => {
    const renderer = createStreamingRenderer();
    renderer.write('<div>');
    renderer.write('Content');
    renderer.write('</div>');

    expect(renderer.end()).toBe('<div>Content</div>');
  });

  it('should reset chunks', () => {
    const renderer = createStreamingRenderer();
    renderer.write('<div>Content</div>');
    renderer.reset();

    expect(renderer.end()).toBe('');
  });

  it('should write status chunks', () => {
    const renderer = createStreamingRenderer();
    renderer.writeChunk('status', '301');
    renderer.write('<div>Redirecting...</div>');

    expect(renderer.end()).toContain('<!--status:301-->');
  });

  it('should write error chunks', () => {
    const renderer = createStreamingRenderer();
    renderer.writeChunk('error', 'Not Found');
    renderer.write('<div>Error page</div>');

    expect(renderer.end()).toContain('<!--error:Not Found-->');
  });
});

describe('injectScripts', () => {
  it('should inject scripts before body close', () => {
    const html = '<html><body><div>Content</div></body></html>';
    const scripts = ['/app.js', '/vendor.js'];
    const result = injectScripts(html, scripts);

    expect(result).toContain('<script src="/app.js"></script>');
    expect(result).toContain('<script src="/vendor.js"></script>');
  });

  it('should return original HTML if no scripts', () => {
    const html = '<html><body>Content</body></html>';
    const result = injectScripts(html, []);

    expect(result).toBe(html);
  });
});

describe('renderToHTMLString', () => {
  it('should render simple elements', () => {
    const element = createElement('p', null, 'Paragraph');
    expect(renderToHTMLString(element)).toBe('<p>Paragraph</p>');
  });

  it('should handle null', () => {
    expect(renderToHTMLString(null)).toBe('');
  });

  it('should handle strings', () => {
    expect(renderToHTMLString('Hello World')).toBe('Hello World');
  });

  it('should handle numbers', () => {
    expect(renderToHTMLString(42)).toBe('42');
  });
});

describe('createHtmlDocument', () => {
  it('should create complete HTML document', () => {
    const html = createHtmlDocument('<div>Content</div>', {
      title: 'Test',
      lang: 'en',
    });

    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('<html lang="en">');
    expect(html).toContain('<title>Test</title>');
    expect(html).toContain('<div>Content</div>');
  });

  it('should handle empty options', () => {
    const html = createHtmlDocument('<div>Content</div>');
    expect(html).toContain('<html lang="en">');
  });
});

describe('escapeHtml', () => {
  it('should escape HTML special characters', () => {
    expect(escapeHtml('<div>"test"&</div>')).toBe(
      '&lt;div&gt;&quot;test&quot;&amp;&lt;/div&gt;',
    );
  });

  it('should handle normal text', () => {
    expect(escapeHtml('Hello World')).toBe('Hello World');
  });
});

describe('getStatusText', () => {
  it('should return known status texts', () => {
    expect(getStatusText(200)).toBe('OK');
    expect(getStatusText(404)).toBe('Not Found');
    expect(getStatusText(500)).toBe('Internal Server Error');
  });

  it('should return Unknown for unknown codes', () => {
    expect(getStatusText(999)).toBe('Unknown');
  });
});
