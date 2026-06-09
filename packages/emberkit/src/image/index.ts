import type { Plugin } from 'vite';

export interface ImageOptimizeOptions {
  quality?: number;
  formats?: ('webp' | 'avif' | 'jpeg' | 'png')[];
  maxWidth?: number;
  maxHeight?: number;
  exclude?: string[];
}

export function emberkitImagePlugin(options: ImageOptimizeOptions = {}): Plugin {
  const {
    quality = 80,
    formats = ['webp', 'avif'],
    maxWidth = 1920,
    maxHeight = 1920,
    exclude = [],
  } = options;

  return {
    name: 'emberkit:image',
    enforce: 'pre',

    async transform(code: string, id: string) {
      if (
        !id.match(/\.(jpg|jpeg|png|gif|webp|avif)$/i) ||
        exclude.some((pattern) => id.includes(pattern))
      ) {
        return null;
      }

      return code;
    },

    generateBundle(options, bundle) {
      for (const [fileName, chunk] of Object.entries(bundle)) {
        if (chunk.type === 'asset' && chunk.fileName.match(/\.(jpg|jpeg|png)$/i)) {
          if (formats.includes('webp')) {
            // Placeholder for actual image optimization
            // In a real implementation, this would use sharp or squoosh
          }
        }
      }
    },
  };
}

export interface ImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  decoding?: 'async' | 'sync' | 'auto';
  className?: string;
  sizes?: string;
  srcSet?: string;
}

export function createImageElement(props: ImageProps): string {
  const {
    src,
    alt,
    width,
    height,
    loading = 'lazy',
    decoding = 'async',
    className,
    sizes,
  } = props;

  const attrs: string[] = [`src="${src}"`, `alt="${alt}"`];

  if (width) attrs.push(`width="${width}"`);
  if (height) attrs.push(`height="${height}"`);
  if (loading) attrs.push(`loading="${loading}"`);
  if (decoding) attrs.push(`decoding="${decoding}"`);
  if (className) attrs.push(`class="${className}"`);
  if (sizes) attrs.push(`sizes="${sizes}"`);

  return `<img ${attrs.join(' ')}/>`;
}

export function generateSrcSet(
  baseSrc: string,
  widths: number[],
  format: 'webp' | 'avif' = 'webp',
  quality: number = 80,
): string {
  return widths
    .map((w) => {
      const optimizedSrc = baseSrc.replace(/(\.\w+)$/, `_${w}w.${format}`);
      return `${optimizedSrc} ${w}w`;
    })
    .join(', ');
}

export function getImageDimensions(
  src: string,
): { width: number; height: number } | null {
  // This would be implemented with actual image parsing
  return null;
}