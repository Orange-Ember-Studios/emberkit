export function normalizeHandlerModulePath(handler: string): string {
  const normalized = handler.replace(/\\/g, '/');
  if (normalized.startsWith('/')) {
    return normalized;
  }
  return `/${normalized.replace(/^\.\//, '')}`;
}
