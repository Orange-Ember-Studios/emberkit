import type { Plugin } from 'vite';

const ROUTES_SEGMENT = '/src/routes/';
const CONTENT_SEGMENT = '/src/content/';

function routePathFromFile(id: string): string | null {
  const normalized = id.replace(/\\/g, '/');
  if (normalized.includes(CONTENT_SEGMENT)) {
    return null;
  }
  const markerIndex = normalized.indexOf(ROUTES_SEGMENT);
  if (markerIndex === -1) {
    return null;
  }

  let relative = normalized.slice(markerIndex + ROUTES_SEGMENT.length);
  relative = relative.replace(/\.(tsx|ts|mdx|md)$/, '');
  relative = relative.replace(/(^|\/)index$/, '$1').replace(/\/$/, '');

  if (!relative) {
    return '/';
  }

  return `/${relative}`;
}

function siteMetaImportPath(id: string): string {
  const normalized = id.replace(/\\/g, '/');
  const markerIndex = normalized.indexOf(ROUTES_SEGMENT);
  const relativePath = normalized.slice(markerIndex + ROUTES_SEGMENT.length);
  const dirDepth = relativePath.split('/').length - 1;
  return `${'../'.repeat(dirDepth + 1)}lib/site-meta.js`;
}

function isParameterizedRoute(pathname: string): boolean {
  return /[[\]:]/.test(pathname);
}

function withEnrichImport(code: string, id: string): string {
  const importPath = siteMetaImportPath(id);
  const importLine = `import { enrichDocsMetadata } from '${importPath}';`;
  if (code.includes('enrichDocsMetadata')) {
    return code;
  }
  return `${importLine}\n${code}`;
}

async function collectPublicPaths(): Promise<string[]> {
  const { readdirSync } = await import('node:fs');
  const { join } = await import('node:path');
  const { DOCS_LOCALES } = await import('../lib/locales.js');
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
}

export function docsMetaPlugin(): Plugin {
  return {
    name: 'docs:meta',
    enforce: 'post',
    async writeBundle(options) {
      const { writeFileSync, mkdirSync, copyFileSync, existsSync } = await import('node:fs');
      const { join } = await import('node:path');
      const { SITE_URL } = await import('../lib/site-meta.js');
      const paths = await collectPublicPaths();
      const urls = paths
        .map(
          (path) =>
            `  <url><loc>${SITE_URL}${path}</loc><changefreq>weekly</changefreq><priority>${path.endsWith('/docs/ui') ? '0.6' : path.split('/').length <= 2 ? '1.0' : '0.8'}</priority></url>`,
        )
        .join('\n');
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
      const outDir = options.dir ?? 'dist';
      mkdirSync(outDir, { recursive: true });
      writeFileSync(join(outDir, 'sitemap.xml'), sitemap, 'utf-8');
      const publicDir = join(process.cwd(), 'public');
      if (existsSync(join(publicDir, 'robots.txt'))) {
        copyFileSync(join(publicDir, 'robots.txt'), join(outDir, 'robots.txt'));
      }
    },
    transform(code, id) {
      const pathname = routePathFromFile(id);
      if (!pathname) {
        return null;
      }

      if (code.includes('export const metadata =')) {
        return {
          code: withEnrichImport(code, id).replace(
            /export const metadata = ([^;]+);/,
            `export const metadata = enrichDocsMetadata(${JSON.stringify(pathname)}, $1);`,
          ),
        };
      }

      if (!id.endsWith('.tsx') && !id.endsWith('.ts')) {
        return null;
      }

      if (isParameterizedRoute(pathname)) {
        return null;
      }

      if (code.includes('enrichDocsMetadata(')) {
        return null;
      }

      return {
        code: `${withEnrichImport(code, id)}\nexport const metadata = enrichDocsMetadata(${JSON.stringify(pathname)});\n`,
      };
    },
  };
}
