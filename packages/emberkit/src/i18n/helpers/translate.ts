import type { InterpolationValues } from '../types.js';

const INTERPOLATION_PATTERN = /\{(\w+)\}/g;

export function interpolate(template: string, values?: InterpolationValues): string {
  if (!values) return template;

  return template.replace(INTERPOLATION_PATTERN, (_, key: string) => {
    const value = values[key];
    return value === undefined ? `{${key}}` : String(value);
  });
}

export function resolveMessage(
  catalogs: Record<string, Record<string, string>>,
  key: string,
  locale: string,
  fallbackLocale: string,
): string | undefined {
  const primary = catalogs[locale]?.[key];
  if (primary !== undefined) return primary;

  if (locale !== fallbackLocale) {
    return catalogs[fallbackLocale]?.[key];
  }

  return undefined;
}
