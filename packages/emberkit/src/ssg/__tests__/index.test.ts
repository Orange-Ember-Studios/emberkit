import { describe, it, expect, beforeEach } from 'vitest';
import {
  SSGBuilder,
  generateStaticPages,
  isStaticRoute,
  createSSGManifest,
  serializeManifest,
  deserializeManifest,
} from '../index.js';

describe('SSG', () => {
  describe('SSGBuilder', () => {
    let builder: SSGBuilder;

    beforeEach(() => {
      builder = new SSGBuilder({
        outDir: './dist',
        routes: ['/', '/about', '/blog'],
      });
    });

    it('should build pages', async () => {
      const renderFn = async (path: string) => `<html><body>${path}</body></html>`;

      const manifest = await builder.build(renderFn);

      expect(manifest.pages.size).toBe(3);
      expect(manifest.pages.get('/')).toBe('<html><body>/</body></html>');
    });

    it('should track errors', async () => {
      const renderFn = async (_path: string) => {
        throw new Error('Render failed');
      };

      const manifest = await builder.build(renderFn);

      expect(manifest.errors.size).toBe(3);
    });

    it('should report build stats', async () => {
      const renderFn = async (_path: string) => '<html></html>';
      await builder.build(renderFn);

      const stats = builder.getBuildStats();

      expect(stats.pages).toBe(3);
      expect(stats.errors).toBe(0);
      expect(stats.time).toBeGreaterThanOrEqual(0);
    });
  });

  describe('generateStaticPages', () => {
    it('should generate all routes', async () => {
      const routes = ['/', '/about', '/contact'];
      const renderFn = async (path: string) => `<!DOCTYPE html><p>${path}</p>`;

      const manifest = await generateStaticPages(routes, renderFn);

      expect(manifest.pages.size).toBe(3);
    });
  });

  describe('isStaticRoute', () => {
    it('should identify static routes', () => {
      expect(isStaticRoute('/')).toBe(true);
      expect(isStaticRoute('/about')).toBe(true);
      expect(isStaticRoute('/blog/post')).toBe(true);
    });

    it('should reject dynamic routes', () => {
      expect(isStaticRoute('/[slug]')).toBe(false);
      expect(isStaticRoute('/blog/:id')).toBe(false);
      expect(isStaticRoute('/api/data')).toBe(false);
    });

    it('should reject catch-all routes', () => {
      expect(isStaticRoute('/[...path]')).toBe(false);
    });
  });

  describe('manifest serialization', () => {
    it('should serialize and deserialize manifest', () => {
      const pages = [
        { path: '/', html: '<html></html>', status: 200, headers: {} },
        { path: '/about', html: '<html><h1>About</h1></html>', status: 200, headers: {} },
      ];

      const manifest = createSSGManifest(pages);
      const json = serializeManifest(manifest);
      const restored = deserializeManifest(json);

      expect(restored.pages.size).toBe(2);
      expect(restored.pages.get('/')).toBe('<html></html>');
    });
  });
});