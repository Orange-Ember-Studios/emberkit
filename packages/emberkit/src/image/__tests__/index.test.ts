import { describe, it, expect, beforeEach } from 'vitest';
import {
  createImageProcessor,
  getOptimalFormat,
  calculateDimensions,
  ASPECT_RATIOS,
  generatePlaceholderSVG,
  parseImageSrc,
} from '../processor.js';

describe('Image Processor', () => {
  let processor: ReturnType<typeof createImageProcessor>;

  beforeEach(() => {
    processor = createImageProcessor({
      quality: 80,
      sizes: [320, 640, 1024, 1920],
      formats: ['webp', 'jpeg'],
    });
  });

  describe('transform', () => {
    it('should generate srcset for different sizes', () => {
      const result = processor.transform('https://example.com/image.jpg', {
        width: 800,
      });

      expect(result.srcset).toContain('320w');
      expect(result.srcset).toContain('640w');
      expect(result.srcset).toContain('1024w');
    });

    it('should include width and height', () => {
      const result = processor.transform('https://example.com/image.jpg', {
        width: 800,
      });

      expect(result.width).toBe(800);
      expect(result.height).toBeGreaterThan(0);
    });

    it('should respect custom quality', () => {
      const result = processor.transform('https://example.com/image.jpg', {
        width: 800,
        quality: 60,
      });

      expect(result.src).toContain('q=60');
    });
  });

  describe('getOptimalFormat', () => {
    it('should return avif when supported', () => {
      const format = getOptimalFormat('image/avif,image/webp');
      expect(format).toBe('avif');
    });

    it('should return webp when avif not supported', () => {
      const format = getOptimalFormat('image/webp,*/*');
      expect(format).toBe('webp');
    });

    it('should default to jpeg', () => {
      const format = getOptimalFormat('text/html,*/*');
      expect(format).toBe('jpeg');
    });
  });

  describe('calculateDimensions', () => {
    it('should respect 16:9 aspect ratio', () => {
      const dims = calculateDimensions(1920, '16:9');
      expect(dims.height).toBe(1080);
    });

    it('should use default ratio when none specified', () => {
      const dims = calculateDimensions(800);
      expect(dims.width).toBe(800);
      expect(dims.height).toBe(600);
    });

    it('should handle square 1:1 ratio', () => {
      const dims = calculateDimensions(400, '1:1');
      expect(dims.height).toBe(400);
    });
  });

  describe('ASPECT_RATIOS', () => {
    it('should have common ratios defined', () => {
      expect(ASPECT_RATIOS.get('16:9')).toBe(16 / 9);
      expect(ASPECT_RATIOS.get('4:3')).toBe(4 / 3);
      expect(ASPECT_RATIOS.get('21:9')).toBe(21 / 9);
    });
  });

  describe('generatePlaceholderSVG', () => {
    it('should generate valid base64 SVG', () => {
      const placeholder = generatePlaceholderSVG(300, 200, '#e0e0e0');

      expect(placeholder).toContain('data:image/svg+xml;base64,');
      const decoded = atob(placeholder.replace('data:image/svg+xml;base64,', ''));
      expect(decoded).toContain('width="300"');
      expect(decoded).toContain('height="200"');
    });
  });

  describe('parseImageSrc', () => {
    it('should parse path and params', () => {
      const result = parseImageSrc('/image.jpg?w=800&f=webp&q=80');

      expect(result.path).toBe('/image.jpg');
      expect(result.params.w).toBe('800');
      expect(result.params.f).toBe('webp');
      expect(result.params.q).toBe('80');
    });

    it('should handle no params', () => {
      const result = parseImageSrc('/image.jpg');

      expect(result.path).toBe('/image.jpg');
      expect(Object.keys(result.params).length).toBe(0);
    });
  });
});
