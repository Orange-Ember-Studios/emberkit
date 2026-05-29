import type { RouteComponent } from '@emberkit/core';
import { useNavigate } from '@emberkit/core';
import {
  DEFAULT_DOCS_LOCALE,
  I18nProvider,
  i18n,
  isDocsLocale,
  localeFromPathname,
  docsNavPath,
  useI18n,
} from '../lib/i18n.js';

const NotFoundContent: RouteComponent = () => {
  const navigate = useNavigate();
  const { t, locale } = useI18n();

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <div className="max-w-lg">
        <div className="mb-5 text-7xl font-bold text-orange-400">404</div>
        <h1 className="mb-3 text-3xl font-bold text-white">{t('notFound.title')}</h1>
        <p className="mb-8 text-lg text-gray-300">{t('notFound.body')}</p>

        <button
          type="button"
          className="mb-10 inline-block rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-400"
          onClick={() => navigate(`/${locale}`)}
        >
          {t('notFound.home')}
        </button>

        <div className="grid grid-cols-1 gap-4 text-left sm:grid-cols-2">
          <a
            href={docsNavPath('introduction', locale)}
            onClick={(e) => {
              e.preventDefault();
              navigate(docsNavPath('introduction', locale));
            }}
            className="rounded-xl border border-white/10 p-5 no-underline text-inherit hover:border-orange-500/30"
          >
            <div className="font-semibold text-white">{t('notFound.docsTitle')}</div>
            <div className="text-sm text-gray-300">{t('notFound.docsDesc')}</div>
          </a>
          <a
            href={docsNavPath('quick-start', locale)}
            onClick={(e) => {
              e.preventDefault();
              navigate(docsNavPath('quick-start', locale));
            }}
            className="rounded-xl border border-white/10 p-5 no-underline text-inherit hover:border-orange-500/30"
          >
            <div className="font-semibold text-white">{t('notFound.quickStartTitle')}</div>
            <div className="text-sm text-gray-300">{t('notFound.quickStartDesc')}</div>
          </a>
        </div>
      </div>
    </div>
  );
};

const NotFound: RouteComponent = () => {
  const locale =
    typeof window !== 'undefined'
      ? localeFromPathname(window.location.pathname)
      : DEFAULT_DOCS_LOCALE;

  return (
    <I18nProvider i18n={i18n} locale={isDocsLocale(locale) ? locale : DEFAULT_DOCS_LOCALE}>
      <NotFoundContent />
    </I18nProvider>
  );
};

export default NotFound;
