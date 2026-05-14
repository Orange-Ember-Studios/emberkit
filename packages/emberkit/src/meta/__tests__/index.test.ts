import { describe, it, expect, beforeEach } from 'vitest';
import {
  MetaGenerator,
  createMetaGenerator,
  generateMeta,
  generateBreadcrumbs,
  generateArticleSchema,
  generateProductSchema,
  generateLinks,
  mergeMeta,
} from '../index.js';
import { Head } from '../head.js';
import {
  registerHeadContent,
  drainHeadContent,
  clearHeadContent,
  peekHeadContent,
} from '../head-registry.js';
import { createElement } from '../../runtime/index.js';

describe('Meta', () => {
  describe('MetaGenerator', () => {
    let generator: MetaGenerator;

    beforeEach(() => {
      generator = createMetaGenerator('https://example.com');
    });

    it('should generate title', () => {
      const html = generator.generate({ title: 'Test Page' });

      expect(html).toContain('<title>Test Page</title>');
      expect(html).toContain('<meta name="title" content="Test Page">');
    });

    it('should generate description', () => {
      const html = generator.generate({ description: 'Page description' });

      expect(html).toContain('<meta name="description" content="Page description">');
    });

    it('should generate keywords', () => {
      const html = generator.generate({
        keywords: ['framework', 'js', 'typescript'],
      });

      expect(html).toContain('<meta name="keywords" content="framework, js, typescript">');
    });

    it('should generate Open Graph tags', () => {
      const html = generator.generate({
        title: 'OG Title',
        description: 'OG Description',
        openGraph: {
          type: 'article',
          images: [{ url: 'https://example.com/image.jpg', width: 1200, height: 630 }],
        },
      });

      expect(html).toContain('og:type" content="article"');
      expect(html).toContain('og:image" content="https://example.com/image.jpg"');
      expect(html).toContain('og:image:width" content="1200"');
    });

    it('should generate Twitter cards', () => {
      const html = generator.generate({
        title: 'Twitter Title',
        twitter: {
          card: 'summary_large_image',
          site: '@emberkit',
          creator: '@emberkit',
        },
      });

      expect(html).toContain('twitter:card" content="summary_large_image"');
      expect(html).toContain('twitter:site" content="@emberkit"');
    });

    it('should generate canonical link', () => {
      const html = generator.generate({});

      expect(html).toContain('<link rel="canonical" href="https://example.com">');
    });

    it('should generate structured data', () => {
      const html = generator.generate({
        structuredData: {
          '@type': 'WebPage',
          name: 'Test Page',
        },
      });

      expect(html).toContain('<script type="application/ld+json">');
      expect(html).toContain('"@type":"WebPage"');
    });

    it('should escape HTML', () => {
      const html = generator.generate({ title: '<script>alert("xss")</script>' });

      expect(html).not.toContain('<script>');
      expect(html).toContain('&lt;script&gt;');
    });
  });

  describe('generateMeta', () => {
    it('should generate from data object', () => {
      const html = generateMeta({ title: 'My Page' });

      expect(html).toContain('<title>My Page</title>');
    });
  });

  describe('generateBreadcrumbs', () => {
    it('should generate breadcrumb structured data', () => {
      const html = generateBreadcrumbs([
        { name: 'Home', url: 'https://example.com/' },
        { name: 'Products', url: 'https://example.com/products' },
        { name: 'Widget', url: 'https://example.com/products/widget' },
      ]);

      expect(html).toContain('application/ld+json');
      expect(html).toContain('BreadcrumbList');
      expect(html).toContain('"position":1');
      expect(html).toContain('"position":2');
      expect(html).toContain('"position":3');
    });
  });

  describe('generateArticleSchema', () => {
    it('should generate article structured data', () => {
      const json = generateArticleSchema({
        title: 'My Article',
        description: 'Article description',
        author: 'John Doe',
        publishedAt: '2024-01-01',
        url: 'https://example.com/article',
      });

      const parsed = JSON.parse(json);

      expect(parsed['@type']).toBe('Article');
      expect(parsed.headline).toBe('My Article');
      expect(parsed.author.name).toBe('John Doe');
    });

    it('should include image if provided', () => {
      const json = generateArticleSchema({
        title: 'Test',
        description: 'Test',
        author: 'Test',
        publishedAt: '2024-01-01',
        url: 'https://example.com',
        image: 'https://example.com/image.jpg',
      });

      const parsed = JSON.parse(json);

      expect(parsed.image).toBe('https://example.com/image.jpg');
    });
  });

  describe('generateProductSchema', () => {
    it('should generate product structured data', () => {
      const json = generateProductSchema({
        name: 'Widget',
        description: 'A great widget',
        price: '29.99',
        currency: 'USD',
      });

      const parsed = JSON.parse(json);

      expect(parsed['@type']).toBe('Product');
      expect(parsed.name).toBe('Widget');
      expect(parsed.offers.price).toBe('29.99');
      expect(parsed.offers.priceCurrency).toBe('USD');
    });
  });

  describe('generateLinks', () => {
    it('should generate link tags', () => {
      const html = generateLinks([
        { rel: 'preload', href: '/font.woff2', type: 'font/woff2', as: 'font' },
        { rel: 'stylesheet', href: '/style.css' },
      ]);

      expect(html).toContain('<link rel="preload"');
      expect(html).toContain('type="font/woff2"');
    });
  });

  describe('mergeMeta', () => {
    it('should deep merge meta objects', () => {
      const base = {
        title: 'Base Title',
        openGraph: { type: 'website' as const, images: [] },
      };

      const override = {
        title: 'Override Title',
        openGraph: { title: 'OG Title' },
      };

      const merged = mergeMeta(base, override);

      expect(merged.title).toBe('Override Title');
      expect(merged.openGraph?.type).toBe('website');
      expect(merged.openGraph?.title).toBe('OG Title');
    });
  });

  describe('head registry', () => {
    beforeEach(() => {
      clearHeadContent();
    });

    it('should register and drain content', () => {
      registerHeadContent('<title>Test</title>');
      registerHeadContent('<meta name="description" content="desc">');

      const result = drainHeadContent();

      expect(result).toContain('<title>Test</title>');
      expect(result).toContain('<meta name="description" content="desc">');
    });

    it('should clear after drain', () => {
      registerHeadContent('<title>Test</title>');
      drainHeadContent();

      const result = drainHeadContent();

      expect(result).toBe('');
    });

    it('should peek without clearing', () => {
      registerHeadContent('<title>Test</title>');

      const peeked = peekHeadContent();
      const drained = drainHeadContent();

      expect(peeked).toBe('<title>Test</title>');
      expect(drained).toBe('<title>Test</title>');
    });

    it('should clear explicitly', () => {
      registerHeadContent('<title>Test</title>');
      clearHeadContent();

      const result = drainHeadContent();

      expect(result).toBe('');
    });
  });

  describe('Head component', () => {
    beforeEach(() => {
      clearHeadContent();
    });

    it('should register shorthand title', () => {
      Head({ title: 'My Page' });

      const content = drainHeadContent();

      expect(content).toContain('My Page</title>');
      expect(content).toContain('name="title" content="My Page"');
    });

    it('should register shorthand description', () => {
      Head({ description: 'Page description' });

      const content = drainHeadContent();

      expect(content).toContain('name="description" content="Page description"');
    });

    it('should register shorthand Open Graph tags', () => {
      Head({
        og: {
          type: 'article',
          title: 'OG Title',
          image: 'https://example.com/og.png',
        },
      });

      const content = drainHeadContent();

      expect(content).toContain('property="og:type" content="article"');
      expect(content).toContain('property="og:title" content="OG Title"');
      expect(content).toContain('property="og:image" content="https://example.com/og.png"');
    });

    it('should register shorthand Twitter tags', () => {
      Head({
        twitter: {
          card: 'summary_large_image',
          site: '@emberkit',
        },
      });

      const content = drainHeadContent();

      expect(content).toContain('name="twitter:card" content="summary_large_image"');
      expect(content).toContain('name="twitter:site" content="@emberkit"');
    });

    it('should register canonical link', () => {
      Head({ canonical: 'https://example.com/page' });

      const content = drainHeadContent();

      expect(content).toContain('rel="canonical" href="https://example.com/page"');
    });

    it('should register children as raw HTML', () => {
      const child = createElement('meta', { name: 'author', content: 'Test Author' });
      Head({ children: child });

      const content = drainHeadContent();

      expect(content).toContain('name="author"');
      expect(content).toContain('content="Test Author"');
    });

    it('should register multiple children', () => {
      const children = [
        createElement('title', {}, 'My Page'),
        createElement('meta', { name: 'description', content: 'Desc' }),
      ];
      Head({ children });

      const content = drainHeadContent();

      expect(content).toContain('<title>My Page</title>');
      expect(content).toContain('name="description"');
    });

    it('should return null (renders nothing in body)', () => {
      const result = Head({ title: 'Test' });

      expect(result).toBeNull();
    });

    it('should accumulate from multiple Head calls', () => {
      Head({ title: 'Page 1' });
      Head({ description: 'Desc 1' });

      const content = drainHeadContent();

      expect(content).toContain('Page 1</title>');
      expect(content).toContain('name="description" content="Desc 1"');
    });

    it('should escape HTML in shorthand props', () => {
      Head({ title: '<script>alert("xss")</script>' });

      const content = drainHeadContent();

      expect(content).not.toContain('<script>');
      expect(content).toContain('&lt;script&gt;');
    });
  });
});
