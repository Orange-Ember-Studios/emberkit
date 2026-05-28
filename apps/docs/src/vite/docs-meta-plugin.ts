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

function withEnrichImport(code: string, id: string): string {
  const importPath = siteMetaImportPath(id);
  const importLine = `import { enrichDocsMetadata } from '${importPath}';`;
  if (code.includes('enrichDocsMetadata')) {
    return code;
  }
  return `${importLine}\n${code}`;
}

export function docsMetaPlugin(): Plugin {
  return {
    name: 'docs:meta',
    enforce: 'post',
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

      if (pathname.includes(':slug') || pathname.includes(':lang')) {
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
