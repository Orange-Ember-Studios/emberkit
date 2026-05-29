import type { RouteComponent } from '@emberkit/core';
import { useNavigate } from '@emberkit/core';
import { DOCS_NAV, navItemPath } from '../lib/docs-nav.js';
import { CORE_VERSION, DOCS_VERSION, formatVersion } from '../lib/version.js';
import { useI18n, type DocsLocale } from '../lib/i18n.js';
import LanguageSwitcher from './language-switcher.js';

function normalizePath(path: string): string {
  return path.replace(/\/+$/, '') || '/';
}

const Sidebar: RouteComponent<{ pathname?: string; locale?: DocsLocale }> = ({
  pathname: pathnameProp,
  locale: localeProp,
}) => {
  const navigate = useNavigate();
  const { t, locale: ctxLocale } = useI18n();
  const locale = localeProp ?? (ctxLocale as DocsLocale);
  const pathname = normalizePath(
    pathnameProp ??
      (typeof window !== 'undefined' ? window.location.pathname : `/${locale}`),
  );

  const closeSidebar = () => {
    const sidebar = document.querySelector('[data-sidebar]');
    const backdrop = document.querySelector('[data-sidebar-backdrop]');
    sidebar?.classList.remove('translate-x-0');
    sidebar?.classList.add('-translate-x-full');
    sidebar?.classList.add('max-lg:pointer-events-none');
    backdrop?.remove();

    const icon = document.querySelector('[data-menu-icon]');
    if (icon) {
      icon.innerHTML = '<path d="M3 12h18"/><path d="M3 6h18"/><path d="M3 18h18"/>';
    }
  };

  return (
    <aside
      id="docs-sidebar"
      data-sidebar
      className="fixed top-16 left-0 z-[110] h-[calc(100dvh-4rem)] w-[min(100vw-2rem,280px)] max-lg:pointer-events-none overflow-y-auto border-r border-white/5 bg-[#0b0f19]/95 px-4 py-4 shadow-[4px_0_40px_rgba(0,0,0,0.2)] backdrop-blur-xl transition-transform duration-300 -translate-x-full lg:static lg:sticky lg:top-16 lg:z-40 lg:w-[260px] lg:translate-x-0 lg:pointer-events-auto lg:self-start lg:py-6"
    >
      <LanguageSwitcher placement="sidebar" onLocaleChange={closeSidebar} />
      {DOCS_NAV.map((section) => (
        <div key={section.titleKey} className="mb-7">
          <h3 className="mb-2 px-3 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-transparent bg-clip-text bg-gradient-to-r from-orange-400/85 via-fuchsia-400/75 to-cyan-400/70">
            {t(section.titleKey)}
          </h3>
          <ul className="list-none space-y-0.5">
            {section.items.map((item) => {
              const path = navItemPath(item.slug, locale);
              const isActive = pathname === normalizePath(path);
              return (
                <li key={item.slug}>
                  <a
                    href={path}
                    data-sidebar-link={path}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={(e) => {
                      e.preventDefault();
                      closeSidebar();
                      navigate(path);
                    }}
                    className={[
                      'group flex items-center gap-2 rounded-xl border border-transparent px-3 py-2 text-sm no-underline transition-all duration-200 cursor-pointer',
                      isActive
                        ? 'bg-orange-500/10 font-semibold text-orange-300 ring-1 ring-orange-500/30 shadow-[0_0_24px_rgba(249,115,22,0.08)]'
                        : 'font-medium text-gray-300 hover:border-orange-500/25 hover:bg-white/[0.04] hover:text-gray-100 hover:shadow-[0_0_20px_rgba(249,115,22,0.06)]',
                    ].join(' ')}
                  >
                    <span
                      className={[
                        'flex h-1.5 w-1.5 shrink-0 rounded-full transition-all duration-200',
                        isActive
                          ? 'bg-orange-300 shadow-[0_0_8px_rgba(251,146,60,0.7)]'
                          : 'bg-gray-600 group-hover:bg-orange-400/60',
                      ].join(' ')}
                    />
                    {t(item.key)}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      ))}

      <div className="mt-6 border-t border-white/5 pt-6 px-3">
        <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-transparent bg-clip-text bg-gradient-to-r from-orange-400/70 via-fuchsia-400/55 to-cyan-400/50">
          {formatVersion(CORE_VERSION)} · docs {formatVersion(DOCS_VERSION)}
        </span>
      </div>
    </aside>
  );
};

export default Sidebar;
