import type { Locale, ResolveLocaleOptions } from '../types.js';

export function normalizeLocale(input: string): string {
  const trimmed = input.trim().replace(/_/g, '-');
  if (!trimmed) return trimmed;

  const parts = trimmed.split('-');
  const language = parts[0].toLowerCase();
  if (parts.length === 1) return language;

  const region = parts[1].length === 2 ? parts[1].toUpperCase() : parts[1];
  return `${language}-${region}`;
}

export function isSupportedLocale(locale: string, supported: readonly Locale[]): boolean {
  const normalized = normalizeLocale(locale);
  return supported.some(
    (s) => normalizeLocale(s) === normalized || normalizeLocale(s).split('-')[0] === normalized,
  );
}

export function matchLocale(candidate: string, supported: readonly Locale[]): Locale | undefined {
  const normalized = normalizeLocale(candidate);
  const exact = supported.find((s) => normalizeLocale(s) === normalized);
  if (exact) return exact;

  const language = normalized.split('-')[0];
  return supported.find((s) => normalizeLocale(s).split('-')[0] === language);
}

export function parseAcceptLanguage(header: string | null): string[] {
  if (!header) return [];

  return header
    .split(',')
    .map((part) => {
      const [tag, qPart] = part.trim().split(';');
      const q = qPart?.startsWith('q=') ? Number.parseFloat(qPart.slice(2)) : 1;
      return { tag: normalizeLocale(tag), q: Number.isFinite(q) ? q : 0 };
    })
    .sort((a, b) => b.q - a.q)
    .map((entry) => entry.tag);
}

function resolveFromPath(pathname: string, supported: readonly Locale[]): Locale | undefined {
  const segment = pathname.split('/').filter(Boolean)[0];
  if (!segment) return undefined;
  return matchLocale(segment, supported);
}

function resolveFromHeader(request: Request, supported: readonly Locale[]): Locale | undefined {
  const preferred = parseAcceptLanguage(request.headers.get('accept-language'));
  for (const tag of preferred) {
    const match = matchLocale(tag, supported);
    if (match) return match;
  }
  return undefined;
}

function resolveFromCookie(
  request: Request,
  supported: readonly Locale[],
  cookieName: string,
): Locale | undefined {
  const cookie = request.headers.get('cookie');
  if (!cookie) return undefined;

  const match = new RegExp(`(?:^|;\\s*)${cookieName}=([^;]+)`).exec(cookie);
  if (!match?.[1]) return undefined;
  return matchLocale(decodeURIComponent(match[1]), supported);
}

function resolveFromQuery(
  url: URL,
  supported: readonly Locale[],
  queryParam: string,
): Locale | undefined {
  const value = url.searchParams.get(queryParam);
  if (!value) return undefined;
  return matchLocale(value, supported);
}

export function resolveLocaleFromRequest(
  request: Request,
  options: ResolveLocaleOptions,
): Locale {
  const strategies = Array.isArray(options.strategy)
    ? options.strategy
    : [options.strategy ?? 'path-prefix'];

  const url = new URL(request.url);
  const cookieName = options.cookieName ?? 'locale';
  const queryParam = options.queryParam ?? 'lang';

  for (const strategy of strategies) {
    let resolved: Locale | undefined;

    switch (strategy) {
      case 'path-prefix':
        resolved = resolveFromPath(url.pathname, options.locales);
        break;
      case 'header':
        resolved = resolveFromHeader(request, options.locales);
        break;
      case 'cookie':
        resolved = resolveFromCookie(request, options.locales, cookieName);
        break;
      case 'query':
        resolved = resolveFromQuery(url, options.locales, queryParam);
        break;
      default:
        break;
    }

    if (resolved) return resolved;
  }

  return options.defaultLocale;
}
