import type { RouteComponent } from '@emberkit/core';
import { Alert } from '@emberkit/ui';
import { i18n, LOCALE_LABELS, type DocsLocale } from '../lib/i18n.js';

const TranslationNotice: RouteComponent<{
  isFallback?: boolean;
  contentLocale?: DocsLocale;
  locale?: DocsLocale;
}> = ({ isFallback, contentLocale, locale = 'en' }) => {
  if (!isFallback || contentLocale === locale) {
    return null;
  }

  i18n.setLocale(locale);

  return (
    <Alert variant="info" title={i18n.t('translationNotice.title')} className="mb-8">
      {i18n.t('translationNotice.body', { locale: LOCALE_LABELS[locale] })}
    </Alert>
  );
};

export default TranslationNotice;
