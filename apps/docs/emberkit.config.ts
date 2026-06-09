import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from '@emberkit/core';
import { DEFAULT_DESCRIPTION, DOCS_TITLE_SUFFIX, OG_IMAGE_URL, SITE_NAME, SITE_URL } from './src/lib/site-meta.js';

export default defineConfig({
  mode: 'ssr',
  compression: {
    gzip: true,
    brotli: true,
  },
  site: {
    url: SITE_URL,
    name: SITE_NAME,
    titleSuffix: DOCS_TITLE_SUFFIX,
    description: DEFAULT_DESCRIPTION,
    ogImage: OG_IMAGE_URL,
  },
  prerender: {
    exclude: ['/', '/docs', '/en', '/es', '/fr'],
    discover: async () => {
      const { readdirSync } = await import('node:fs');
      const { join } = await import('node:path');
      const { DOCS_LOCALES } = await import('./src/lib/locales.js');
      const enDir = join(process.cwd(), 'src/content/docs/en');
      const slugs = readdirSync(enDir)
        .filter((name) => name.endsWith('.mdx'))
        .map((name) => name.replace(/\.mdx$/, ''));
      const paths: string[] = [];
      for (const lang of DOCS_LOCALES) {
        paths.push(`/${lang}`);
        for (const slug of slugs) {
          paths.push(`/${lang}/docs/${slug}`);
        }
        paths.push(`/${lang}/docs/ui`);
      }
      return paths;
    },
  },
  sitemap: true,
  server: {
    port: 9876,
    host: 'localhost',
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
