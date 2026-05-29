import type { RouteComponent } from '@emberkit/core';
import type { DocsLocale } from '../lib/locales.js';

/** Sets `<html lang>` on the client after navigation (SSR HTML uses index default). */
const SetDocumentLang: RouteComponent<{ locale: DocsLocale }> = ({ locale }) => {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = locale;
  }
  return null;
};

export default SetDocumentLang;
