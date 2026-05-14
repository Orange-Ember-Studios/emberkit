import type { Plugin } from '../plugin/index.js';
import { createImageProcessor, type ImageConfig } from './processor.js';

export interface ImagePluginConfig extends ImageConfig {
  watchDir?: string;
}

export function imagePlugin(config: ImagePluginConfig = {}): Plugin {
  const processor = createImageConfig(config);
  const images = new Set<string>();

  return {
    name: 'emberkit-image',
    version: '0.1.0',
    setup(context) {
      context.onHook('buildEnd', () => {
        optimizeImages(images);
      });

      context.addWatchFile(config.watchDir ?? './src/images');
    },
  };
}

function createImageConfig(config: ImageConfig) {
  return {
    provider: config.provider ?? 'none',
    baseUrl: config.baseUrl ?? '',
    quality: config.quality ?? 80,
    formats: config.formats ?? ['webp', 'jpeg'],
    sizes: config.sizes ?? [320, 640, 1024, 1920],
    lazy: config.lazy ?? true,
    placeholder: config.placeholder ?? 'blur',
  };
}

async function optimizeImages(images: Set<string>): Promise<void> {
  for (const imagePath of images) {
    console.log(`[Image Plugin] Optimizing: ${imagePath}`);
  }
}

export function createImageVitePlugin(config?: ImagePluginConfig): Plugin {
  return imagePlugin(config);
}

export {
  createImageProcessor,
  type ImageConfig,
  type ImageStats,
  type TransformedImage,
} from './processor.js';
