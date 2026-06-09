import type { RouteMetadata } from '../router/types.js';

export interface GeneratedRouteTypes {
  params: Record<string, string>;
  loaderData: unknown;
  metadata: RouteMetadata;
}

export interface RouteTypeContext {
  routePath: string;
  filePath: string;
  params: string[];
  loader?: string;
  prerender?: boolean;
  ssr?: boolean;
  ssrOnly?: boolean;
}

export function generateRouteTypes(routes: RouteTypeContext[]): string {
  const typeLines: string[] = [
    '// Auto-generated route types',
    '// Do not edit manually',
    '',
    'export interface RouteParams {',
  ];

  for (const route of routes) {
    const paramInterface = route.params.length > 0
      ? route.params.map((p) => `  ${p}: string;`).join('\n')
      : '  [key: string]: string;';

    typeLines.push(`  '${route.routePath}': {`);
    typeLines.push(paramInterface);
    typeLines.push('  };');
    typeLines.push('');
  }

  typeLines.push('}');
  typeLines.push('');

  typeLines.push('export type RouteParamsForPath<T extends keyof RouteParams> = RouteParams[T];');
  typeLines.push('');

  // Generate loader result types
  typeLines.push('export interface RouteLoaderResults {');
  for (const route of routes) {
    if (route.loader) {
      typeLines.push(`  '${route.routePath}': ${route.loader};`);
    }
  }
  typeLines.push('}');
  typeLines.push('');

  // Generate metadata types
  typeLines.push('export interface RouteMetadata {');
  typeLines.push('  prerender?: boolean;');
  typeLines.push('  ssr?: boolean;');
  typeLines.push('  ssrOnly?: boolean;');
  typeLines.push('}');
  typeLines.push('');
  typeLines.push('export type RouteMetadataForPath<T extends string> = RouteMetadata;');

  return typeLines.join('\n');
}

export function parseRouteFile(filePath: string): RouteTypeContext | null {
  // This would parse the route file and extract type information
  return null;
}

export async function generateTypesForDirectory(
  routesDir: string,
): Promise<string> {
  const routes: RouteTypeContext[] = [];

  // Scan routes directory
  // Parse each route file
  // Generate types

  return generateRouteTypes(routes);
}