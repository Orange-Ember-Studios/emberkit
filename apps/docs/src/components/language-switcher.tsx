import type { RouteComponent } from '@emberkit/core';
import { useNavigate } from '@emberkit/core';
import { Select } from '@emberkit/ui/molecules';
import {
  DOCS_LOCALES,
  LOCALE_FLAGS,
  LOCALE_LABELS,
  LOCALE_SHORT,
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

export interface LanguageSwitcherProps {
  /** Header dropdown on large screens; segmented control in the mobile sidebar */
  placement?: 'header' | 'sidebar';
  /** Called after choosing a locale (e.g. close the mobile drawer) */
  onLocaleChange?: () => void;
}

function useLanguageNavigation(onLocaleChange?: () => void) {
  const navigate = useNavigate();
  const currentPath =
    typeof window !== 'undefined' ? window.location.pathname : '/en';
  const locale = localeFromPathname(currentPath);

  const switchLocale = (next: DocsLocale) => {
    if (next === locale) return;
    navigate(localizeDocsPath(currentPath, next));
    onLocaleChange?.();
  };

  return { locale, switchLocale };
}

const LanguageSwitcherHeader: RouteComponent = () => {
  const { t } = useI18n();
  const { locale, switchLocale } = useLanguageNavigation();

  return (
    <div role="group" aria-labelledby="docs-language-label" className="hidden lg:block">
      <span id="docs-language-label" className="sr-only">
        {t('language.switch')}
      </span>
      <Select
        key={locale}
        name="docs-language"
        value={locale}
        aria-label={t('language.switch')}
        options={languageOptions}
        onChange={(next) => switchLocale(next as DocsLocale)}
        className="!w-[10.5rem] shrink-0 !rounded-lg !border-white/10 !bg-white/5 !px-2.5 !py-1.5 !text-sm font-medium shadow-none hover:!border-primary-500/30 hover:!bg-white/[0.07] focus-within:!border-primary-500/40 focus-within:!ring-primary-500/20 [&_ul]:z-[60]"
      />
    </div>
  );
};

const LanguageSwitcherSidebar: RouteComponent<Pick<LanguageSwitcherProps, 'onLocaleChange'>> = ({
  onLocaleChange,
}) => {
  const { t } = useI18n();
  const { locale, switchLocale } = useLanguageNavigation(onLocaleChange);

  return (
    <nav
      className="mb-6 lg:hidden"
      aria-label={t('language.switch')}
    >
      <p className="mb-2 px-1 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-gray-500">
        {t('language.label')}
      </p>
      <div
        className="grid grid-cols-3 gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-1.5"
        role="group"
      >
        {DOCS_LOCALES.map((code) => {
          const isActive = locale === code;
          return (
            <button
              key={code}
              type="button"
              aria-current={isActive ? 'true' : undefined}
              aria-label={LOCALE_LABELS[code]}
              onClick={() => switchLocale(code)}
              className={[
                'flex min-h-[2.75rem] flex-col items-center justify-center gap-0.5 rounded-lg border px-2 py-2 text-center transition-all duration-200 active:scale-[0.98]',
                isActive
                  ? 'border-orange-500/40 bg-orange-500/15 font-semibold text-orange-200 shadow-[0_0_20px_rgba(249,115,22,0.12)] ring-1 ring-orange-500/25'
                  : 'border-transparent text-gray-300 hover:border-white/10 hover:bg-white/[0.05] hover:text-white',
              ].join(' ')}
            >
              <span className="text-lg leading-none" aria-hidden="true">
                {LOCALE_FLAGS[code]}
              </span>
              <span className="text-[0.6875rem] font-bold tracking-wide">{LOCALE_SHORT[code]}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

const LanguageSwitcher: RouteComponent<LanguageSwitcherProps> = ({
  placement = 'header',
  onLocaleChange,
}) => {
  if (placement === 'sidebar') {
    return <LanguageSwitcherSidebar onLocaleChange={onLocaleChange} />;
  }
  return <LanguageSwitcherHeader />;
};

export default LanguageSwitcher;
export { LanguageSwitcherHeader, LanguageSwitcherSidebar };
