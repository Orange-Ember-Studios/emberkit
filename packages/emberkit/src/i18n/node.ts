import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import type { CreateI18nOptions } from './create-i18n.js';
import {
  createI18nFromJson,
  localeFromJsonPath,
  parseMessageCatalogJson,
  type CreateI18nFromGlobConfig,
} from './load-json.js';
import type { I18nInstance, Locale, MessageCatalog } from './types.js';

export interface LoadLocalesFromDirectoryOptions {
  extension?: string;
}

export function readLocaleCatalog(filePath: string): MessageCatalog {
  return parseMessageCatalogJson(readFileSync(filePath, 'utf-8'), filePath);
}

export function loadLocalesFromDirectory(
  directory: string,
  options: LoadLocalesFromDirectoryOptions = {},
): Record<Locale, MessageCatalog> {
  const extension = options.extension ?? '.json';
  const files = readdirSync(directory).filter((file) => file.endsWith(extension));
  const messages: Record<Locale, MessageCatalog> = {};

  for (const file of files) {
    const filePath = join(directory, file);
    const locale = localeFromJsonPath(file);
    messages[locale] = readLocaleCatalog(filePath);
  }

  return messages;
}

export function createI18nFromDirectory<
  const TLocales extends readonly Locale[],
>(
  directory: string,
  config: CreateI18nFromGlobConfig<TLocales>,
  options?: CreateI18nOptions,
): I18nInstance<string> {
  const messages = loadLocalesFromDirectory(directory);
  return createI18nFromJson({ ...config, messages }, options);
}
