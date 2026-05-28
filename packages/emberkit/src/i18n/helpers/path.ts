import type { Locale } from '../types.js';
import { matchLocale, normalizeLocale } from './locale.js';

export function extractLocaleFromPath(
  pathname: string,
  supported: readonly Locale[],
): { locale: Locale | undefined; pathnameWithoutLocale: string } {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) {
    return { locale: undefined, pathnameWithoutLocale: '/' };
  }

  const first = segments[0];
  const matched = matchLocale(first, supported);
  if (!matched) {
    return { locale: undefined, pathnameWithoutLocale: pathname || '/' };
  }

  const rest = segments.slice(1).join('/');
  const pathnameWithoutLocale = rest ? `/${rest}` : '/';
  return { locale: matched, pathnameWithoutLocale };
}

export function stripLocalePrefix(pathname: string, supported: readonly Locale[]): string {
  return extractLocaleFromPath(pathname, supported).pathnameWithoutLocale;
}

export function addLocalePrefix(pathname: string, locale: Locale): string {
  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`;
  if (normalized === '/') return `/${normalizeLocale(locale)}`;
  return `/${normalizeLocale(locale)}${normalized}`;
}

export function localizePath(
  pathname: string,
  locale: Locale,
  supported: readonly Locale[],
): string {
  const without = stripLocalePrefix(pathname, supported);
  return addLocalePrefix(without, locale);
}
