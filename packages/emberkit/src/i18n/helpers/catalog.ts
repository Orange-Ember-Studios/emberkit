import type { MessageCatalog } from '../types.js';

export class InvalidMessageCatalogError extends Error {
  readonly path: string;

  constructor(path: string, detail: string) {
    super(`Invalid message catalog at "${path}": ${detail}`);
    this.name = 'InvalidMessageCatalogError';
    this.path = path;
  }
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function flattenMessageCatalog(
  input: Record<string, unknown>,
  prefix = '',
): MessageCatalog {
  const catalog: MessageCatalog = {};

  for (const [key, value] of Object.entries(input)) {
    const path = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'string') {
      catalog[path] = value;
      continue;
    }

    if (isPlainObject(value)) {
      Object.assign(catalog, flattenMessageCatalog(value, path));
      continue;
    }

    throw new InvalidMessageCatalogError(
      path,
      `expected string or nested object, got ${value === null ? 'null' : typeof value}`,
    );
  }

  return catalog;
}

export function parseMessageCatalog(input: unknown, rootPath = 'root'): MessageCatalog {
  if (!isPlainObject(input)) {
    throw new InvalidMessageCatalogError(rootPath, 'catalog must be a JSON object');
  }

  return flattenMessageCatalog(input);
}

export function parseMessageCatalogJson(json: string, source = 'json'): MessageCatalog {
  let parsed: unknown;

  try {
    parsed = JSON.parse(json);
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'invalid JSON';
    throw new InvalidMessageCatalogError(source, detail);
  }

  return parseMessageCatalog(parsed, source);
}

export function localeFromJsonPath(path: string): string {
  const fileName = path.split(/[/\\]/).pop() ?? path;
  return fileName.replace(/\.json$/i, '');
}
