export interface ImageConfig {
  provider?: 'none' | 'cloudflare' | 'imgix' | 'ipx';
  baseUrl?: string;
  quality?: number;
  formats?: Array<'webp' | 'avif' | 'png' | 'jpeg'>;
  sizes?: Array<number>;
  lazy?: boolean;
  placeholder?: 'blur' | 'dominant' | 'none';
}

export interface ImageStats {
  originalSize: number;
  optimizedSize: number;
  savings: number;
  format: string;
}

export interface TransformedImage {
  src: string;
  srcset: string;
  width: number;
  height: number;
  format: string;
  blurDataURL?: string;
}

export class ImageProcessor {
  private config: Required<ImageConfig>;

  constructor(config: ImageConfig = {}) {
    this.config = {
      provider: config.provider ?? 'none',
      baseUrl: config.baseUrl ?? '',
      quality: config.quality ?? 80,
      formats: config.formats ?? ['webp', 'jpeg'],
      sizes: config.sizes ?? [320, 640, 1024, 1920],
      lazy: config.lazy ?? true,
      placeholder: config.placeholder ?? 'blur',
    };
  }

  analyze(stats: ImageStats): void {
    const savingsPercent = parseFloat(((stats.savings / stats.originalSize) * 100).toFixed(1));

    if (savingsPercent > 50) {
      console.log(`[Image] Significant savings: ${savingsPercent}% reduction`);
    }
  }

  transform(
    src: string,
    options: {
      width?: number;
      height?: number;
      format?: string;
      quality?: number;
    } = {},
  ): TransformedImage {
    const { width = 800, height, format = 'webp', quality } = options;

    const url = this.buildUrl(src, {
      width,
      height,
      format,
      quality: quality ?? this.config.quality,
    });

    const srcset = this.buildSrcset(src, {
      format,
      quality: quality ?? this.config.quality,
    });

    return {
      src: url,
      srcset,
      width,
      height: height ?? Math.round(width * 0.75),
      format,
      blurDataURL: this.config.placeholder !== 'none' ? this.generatePlaceholder() : undefined,
    };
  }

  private buildSrcset(src: string, params: { format: string; quality?: number }): string {
    return this.config.sizes
      .map((size) => {
        const url = this.buildUrl(src, { width: size, ...params });
        return `${url} ${size}w`;
      })
      .join(', ');
  }

  private buildUrl(
    src: string,
    params: { width?: number; height?: number; format?: string; quality?: number },
  ): string {
    const url = new URL(src, this.config.baseUrl || 'https://example.com');

    if (params.width) url.searchParams.set('w', String(params.width));
    if (params.height) url.searchParams.set('h', String(params.height));
    if (params.format) url.searchParams.set('f', params.format);
    if (params.quality) url.searchParams.set('q', String(params.quality));

    return url.toString();
  }

  private generatePlaceholder(): string {
    return 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmZmIj48L3JlY3Q+PC9zdmc+';
  }
}

export function createImageProcessor(config?: ImageConfig): ImageProcessor {
  return new ImageProcessor(config);
}

export function getOptimalFormat(acceptHeader: string): string {
  if (acceptHeader.includes('image/avif')) return 'avif';
  if (acceptHeader.includes('image/webp')) return 'webp';
  return 'jpeg';
}

export function calculateSizes(sizes: string, viewport: number): string {
  const parsed = sizes.replace(/(\d+)px/g, (_, n) => {
    const vw = (parseInt(n) / viewport) * 100;
    return `${vw.toFixed(2)}vw`;
  });
  return parsed || '100vw';
}

export const ASPECT_RATIOS = new Map<string, number>([
  ['1:1', 1],
  ['4:3', 4 / 3],
  ['16:9', 16 / 9],
  ['21:9', 21 / 9],
  ['3:2', 3 / 2],
  ['2:3', 2 / 3],
]);

export function calculateDimensions(
  width: number,
  aspectRatio?: string,
): { width: number; height: number } {
  const ratio = aspectRatio ? ASPECT_RATIOS.get(aspectRatio) : undefined;

  return {
    width,
    height: ratio ? Math.round(width / ratio) : Math.round(width * 0.75),
  };
}

export const LOW_QUALITY_IMAGE_SIZES = [20, 40, 80];

export function generatePlaceholderSVG(width: number, height: number, color = '#e0e0e0'): string {
  return `data:image/svg+xml;base64,${btoa(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <rect width="100%" height="100%" fill="${color}"/>
      <text x="50%" y="50%" text-anchor="middle" fill="#999">Loading...</text>
    </svg>`,
  )}`;
}

export function createPictureElement(
  image: TransformedImage,
  alt: string,
  options: {
    lazy?: boolean;
    loading?: 'lazy' | 'eager';
    fetchpriority?: 'high' | 'low' | 'auto';
  } = {},
): string {
  const { lazy = true, loading = 'lazy', fetchpriority = 'auto' } = options;

  const sources =
    image.format !== 'avif'
      ? `<source type="image/avif" srcset="${image.srcset.replace(/f=webp/g, 'f=avif')}">`
      : '';

  const webpSource =
    image.format !== 'webp'
      ? `<source type="image/webp" srcset="${image.srcset.replace(/f=[\w]+/g, 'f=webp')}">`
      : '';

  return `<picture>
  ${sources}
  ${webpSource}
  <img
    src="${image.src}"
    width="${image.width}"
    height="${image.height}"
    alt="${escapeHtml(alt)}"
    loading="${loading}"
    ${lazy ? 'decoding="async"' : ''}
    fetchpriority="${fetchpriority}"
    ${image.blurDataURL ? `style="background-image:url(${image.blurDataURL})"` : ''}
  >
</picture>`;
}

function escapeHtml(str: string): string {
  return str.replace(
    /[<>&"']/g,
    (c) =>
      ({
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        '"': '&quot;',
        "'": '&#39;',
      })[c] ?? c,
  );
}

export function parseImageSrc(src: string): {
  path: string;
  params: Record<string, string>;
} {
  const [path, query] = src.split('?');

  const params: Record<string, string> = {};
  if (query) {
    for (const pair of query.split('&')) {
      const [key, value] = pair.split('=');
      if (key && value) {
        params[key] = value;
      }
    }
  }

  return { path, params };
}
