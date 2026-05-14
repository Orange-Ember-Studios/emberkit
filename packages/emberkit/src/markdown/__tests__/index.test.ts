import { describe, it, expect } from 'vitest';
import {
  createMarkdownParser,
  parseMarkdown,
  renderMarkdown,
  extractFrontmatter,
  markdownToPlainText,
  getReadingTime,
  getWordCount,
} from '../index.js';

describe('Markdown', () => {
  describe('parseMarkdown', () => {
    it('should parse basic markdown', () => {
      const result = parseMarkdown('# Hello World');

      expect(result.html).toContain('<h1');
    });

    it('should parse headings with IDs', () => {
      const result = parseMarkdown('## Section Title');

      expect(result.headings).toContainEqual(
        expect.objectContaining({
          level: 2,
          text: 'Section Title',
        }),
      );
    });

    it('should parse bold and italic', () => {
      const result = parseMarkdown('**bold** and *italic*');

      expect(result.html).toContain('<strong>bold</strong>');
      expect(result.html).toContain('<em>italic</em>');
    });

    it('should parse bold italic combined', () => {
      const result = parseMarkdown('***bold italic***');

      expect(result.html).toContain('<strong><em>bold italic</em></strong>');
    });

    it('should parse strikethrough', () => {
      const result = parseMarkdown('~~deleted text~~');

      expect(result.html).toContain('<del>deleted text</del>');
    });

    it('should parse horizontal rules with ---', () => {
      const result = parseMarkdown('---');

      expect(result.html).toContain('<hr>');
    });

    it('should parse horizontal rules with ***', () => {
      const result = parseMarkdown('***');

      expect(result.html).toContain('<hr>');
    });

    it('should parse horizontal rules with ___', () => {
      const result = parseMarkdown('___');

      expect(result.html).toContain('<hr>');
    });

    it('should parse links', () => {
      const result = parseMarkdown('[Click here](https://example.com)');

      expect(result.html).toContain('<a href="https://example.com">Click here</a>');
      expect(result.links).toContain('https://example.com');
    });

    it('should parse code blocks', () => {
      const result = parseMarkdown('```js\nconst x = 1;\n```');

      expect(result.html).toContain('<pre><code class="language-js">');
      expect(result.codeBlocks).toHaveLength(1);
      expect(result.codeBlocks[0].lang).toBe('js');
    });

    it('should parse inline code', () => {
      const result = parseMarkdown('Use `console.log()` for debugging');

      expect(result.html).toContain('<code>console.log()</code>');
    });

    it('should parse blockquotes', () => {
      const result = parseMarkdown('> This is a quote');

      expect(result.html).toContain('<blockquote>');
    });

    it('should parse nested blockquotes', () => {
      const result = parseMarkdown('> Level 1\n>> Level 2');

      expect(result.html).toContain('<blockquote>');
      expect(result.html).toContain('Level 1');
      expect(result.html).toContain('Level 2');
    });

    it('should parse images', () => {
      const result = parseMarkdown('![Alt text](image.png)');

      expect(result.html).toContain('<img src="image.png" alt="Alt text"');
    });
  });

  describe('extractFrontmatter', () => {
    it('should extract frontmatter', () => {
      const content = `---
title: My Post
author: John
---

# Content`;

      const result = extractFrontmatter(content);

      expect(result).not.toBeNull();
      expect(result!.data.title).toBe('My Post');
    });

    it('should return null for no frontmatter', () => {
      const result = extractFrontmatter('No frontmatter here');

      expect(result).toBeNull();
    });
  });

  describe('markdownToPlainText', () => {
    it('should strip markdown formatting', () => {
      const plain = markdownToPlainText('**Bold** and *italic*');

      expect(plain).toBe('Bold and italic');
    });

    it('should remove links but keep text', () => {
      const plain = markdownToPlainText('[Link text](https://url.com)');

      expect(plain).toBe('Link text');
    });
  });

  describe('getReadingTime', () => {
    it('should calculate reading time', () => {
      const text = 'word '.repeat(200);

      expect(getReadingTime(text, 200)).toBe(1);
    });

    it('should round up', () => {
      const text = 'word '.repeat(250);

      expect(getReadingTime(text, 200)).toBe(2);
    });
  });

  describe('getWordCount', () => {
    it('should count words', () => {
      expect(getWordCount('one two three')).toBe(3);
    });

    it('should handle string with spaces', () => {
      expect(getWordCount('   ')).toBeGreaterThanOrEqual(1);
    });
  });

  describe('renderMarkdown', () => {
    it('should render to HTML string', () => {
      const html = renderMarkdown('# Hello');

      expect(html).toContain('<h1');
    });
  });

  describe('createMarkdownParser', () => {
    it('should create parser instance', () => {
      const parser = createMarkdownParser({ gfm: true });

      const result = parser.parse('# Test');

      expect(result.html).toContain('<h1');
    });
  });
});
