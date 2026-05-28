import type { RouteComponent } from '@emberkit/core';
import DocsPageHead from '../components/docs-page-head';
import Sidebar from '../components/sidebar';
import Header from '../components/header';
import { I18nProvider, i18n, localeFromPathname, type DocsLocale } from '../lib/i18n.js';

function resolvePathname(pathnameProp?: string): string {
  if (pathnameProp) return pathnameProp;
  if (typeof window !== 'undefined') return window.location.pathname;
  return '/en';
}

function isLocaleRoute(pathname: string): boolean {
  return /^\/(en|es|fr)(\/|$)/.test(pathname);
}

const Layout: RouteComponent<{ pathname?: string; children?: unknown }> = ({
  pathname: pathnameProp,
  children,
}) => {
  const pathname = resolvePathname(pathnameProp as string | undefined);

  if (!isLocaleRoute(pathname)) {
    return (
      <>
        <DocsPageHead pathname={pathname} />
        {children}
      </>
    );
  }

  const locale = localeFromPathname(pathname);

  return (
    <I18nProvider i18n={i18n} locale={locale}>
      <div className="relative min-h-dvh overflow-x-hidden bg-[#0b0f19] text-gray-100">
        <DocsPageHead pathname={pathname} />
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-[20%] left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-orange-500/18 blur-[130px] animate-pulse" />
          <div className="absolute top-[25%] left-1/2 h-[260px] w-[260px] -translate-x-1/2 rounded-full bg-amber-500/12 blur-[100px] animate-pulse [animation-delay:700ms]" />
          <div className="absolute top-[15%] right-[8%] h-[240px] w-[240px] rounded-full bg-fuchsia-500/10 blur-[90px] animate-pulse [animation-delay:400ms]" />
          <div className="absolute bottom-[10%] left-[6%] h-[200px] w-[200px] rounded-full bg-cyan-500/10 blur-[80px] animate-pulse [animation-delay:1100ms]" />
        </div>

        <div className="relative" data-app-shell>
          <Header locale={locale as DocsLocale} />
          <div className="pt-16 lg:grid lg:grid-cols-[260px_minmax(0,1fr)]">
            <Sidebar pathname={pathname} locale={locale as DocsLocale} />
            <main className="md-content relative min-w-0 px-4 py-8 sm:px-6 sm:py-10 lg:px-16 lg:py-14">
              {children}
            </main>
          </div>
        </div>
      </div>
    </I18nProvider>
  );
};

export default Layout;
