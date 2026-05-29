import type { RouteComponent } from '@emberkit/core';
import { useNavigate } from '@emberkit/core';
import { Select } from '@emberkit/ui/molecules';
import {
  DOCS_LOCALES,
  LOCALE_FLAGS,
  LOCALE_LABELS,
  localizeDocsPath,
  localeFromPathname,
  useI18n,
  type DocsLocale,
} from '../lib/i18n.js';

const languageOptions = DOCS_LOCALES.map((code) => ({
  value: code,
  label: LOCALE_LABELS[code],
  leading: LOCALE_FLAGS[code],
}));

const LanguageSwitcher: RouteComponent = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const currentPath =
    typeof window !== 'undefined' ? window.location.pathname : '/en';
  const locale = localeFromPathname(currentPath);

  return (
    <div role="group" aria-labelledby="docs-language-label">
      <span id="docs-language-label" className="sr-only">
        {t('language.switch')}
      </span>
      <Select
        key={locale}
        name="docs-language"
        value={locale}
        aria-label={t('language.switch')}
        options={languageOptions}
        onChange={(next) => {
          if (next === locale) return;
          navigate(localizeDocsPath(currentPath, next as DocsLocale));
        }}
        className="!w-[9.75rem] shrink-0 !rounded-lg !border-white/10 !bg-white/5 !px-2.5 !py-1.5 !text-sm font-medium shadow-none hover:!border-primary-500/30 hover:!bg-white/[0.07] focus-within:!border-primary-500/40 focus-within:!ring-primary-500/20"
      />
    </div>
  );
};

export default LanguageSwitcher;
