import { PARAM_REGEX, CATCH_ALL_REGEX } from '../types.js';

export function normalizePath(path: string): string {
  const cleaned = path.replace(/^\/|\/$/g, '').replace(/\/+/g, '/') || '';
  return '/' + cleaned;
}

export function pathToRegex(path: string): { pattern: RegExp; paramNames: string[] } {
  const paramNames: string[] = [];

  let regexString = path.replace(CATCH_ALL_REGEX, (_, name) => {
    paramNames.push(name);
    return '(.*)';
  });

  regexString = regexString.replace(PARAM_REGEX, (_, name) => {
    paramNames.push(name);
    return '([^/]+)';
  });

  return {
    pattern: new RegExp(`^${regexString}$`),
    paramNames,
  };
}

export function matchPath(pattern: RegExp, path: string): string[] | null {
  const match = path.match(pattern);
  if (match) {
    return match.slice(1);
  }
  return null;
}

export function scoreRoute(routePath: string): number {
  let score = 100;
  const segments = routePath.split('/').filter(Boolean);

  score -= segments.length * 20;

  for (const segment of segments) {
    if (segment.startsWith(':') || segment.startsWith('*')) {
      score -= 30;
    } else {
      score += 10;
    }
  }

  if (routePath.includes('*')) {
    score -= 50;
  }

  return Math.max(0, score);
}

export function extractSegments(filePath: string): string[] {
  return filePath
    .replace(/^\/|\/$/g, '')
    .split('/')
    .filter(Boolean);
}

export function segmentsToPath(segments: string[]): string {
  return '/' + segments.join('/');
}

export function isIndexFile(fileName: string): boolean {
  return fileName === 'index' || fileName === 'index.tsx' || fileName === 'index.ts';
}

export function isDynamicSegment(segment: string): boolean {
  return segment.startsWith('[') && segment.endsWith(']');
}

export function isCatchAll(segment: string): boolean {
  return segment.startsWith('[...') && segment.endsWith(']');
}

export function getParamName(segment: string): string | null {
  if (isDynamicSegment(segment)) {
    return segment.slice(1, -1);
  }
  return null;
}

export function getCatchAllName(segment: string): string | null {
  if (isCatchAll(segment)) {
    return segment.slice(4, -1);
  }
  return null;
}
