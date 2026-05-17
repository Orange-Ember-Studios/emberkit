import type { RouteComponent } from '@emberkit/core';
import { Icon } from '@emberkit/ui';
import { useNavigate } from '@emberkit/core';
import { CORE_VERSION, DOCS_VERSION, formatVersion } from '../lib/version.js';

function normalizePath(path: string): string {
  const p = path.replace(/\/+$/, '') || '/';
  return p;
}

const docs = [
  {
    title: 'Getting Started',
    items: [
      { title: 'Introduction', path: '/docs/introduction' },
      { title: 'Installation', path: '/docs/installation' },
      { title: 'Quick Start', path: '/docs/quick-start' },
      { title: 'Built with EmberKit', path: '/docs/built-with-emberkit' },
      { title: 'API Reference', path: '/docs/api' },
      { title: 'Examples', path: '/docs/examples' },
    ],
  },
  {
    title: 'Core Concepts',
    items: [
      { title: 'Components', path: '/docs/components' },
      { title: 'Routing', path: '/docs/routing' },
      { title: 'Signals', path: '/docs/signals' },
      { title: 'Context', path: '/docs/context' },
    ],
  },
  {
    title: 'Features',
    items: [
      { title: 'SSR & SSG', path: '/docs/ssr' },
      { title: 'Forms & Mutations', path: '/docs/forms' },
      { title: 'Hydration', path: '/docs/hydration' },
      { title: 'SEO & Meta', path: '/docs/meta' },
      { title: 'Head Component', path: '/docs/head' },
      { title: 'Icons', path: '/docs/icons' },
      { title: 'UI Components', path: '/docs/ui' },
    ],
  },
  {
    title: 'Advanced',
    items: [
      { title: 'Edge Deployment', path: '/docs/edge' },
      { title: 'Image Optimization', path: '/docs/images' },
      { title: 'Markdown/MDX', path: '/docs/markdown' },
    ],
  },
];

const Sidebar: RouteComponent = () => {
  const navigate = useNavigate();
  const pathname =
    typeof window !== 'undefined' ? normalizePath(window.location.pathname) : '/';

  const closeSidebar = () => {
    const sidebar = document.querySelector('[data-sidebar]');
    const backdrop = document.querySelector('[data-sidebar-backdrop]');
    sidebar?.classList.remove('translate-x-0');
    sidebar?.classList.add('-translate-x-full');
    backdrop?.remove();

    const icon = document.querySelector('[data-menu-icon]');
    if (icon) {
      icon.innerHTML = '<path d="M3 12h18"/><path d="M3 6h18"/><path d="M3 18h18"/>';
    }
  };

  return (
    <aside
      data-sidebar
      className="fixed top-0 lg:top-16 left-0 z-[100] lg:z-40 h-screen lg:h-[calc(100vh-4rem)] w-[260px] overflow-y-auto border-r border-white/5 bg-[#0b0f19]/70 px-4 py-6 shadow-[4px_0_40px_rgba(0,0,0,0.2)] backdrop-blur-xl transition-transform duration-300 -translate-x-full lg:translate-x-0"
    >
      <div className="mb-8 flex items-center justify-between lg:hidden">
        <div className="flex items-center gap-2 text-xl font-bold text-white">
          <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/35 via-fuchsia-500/25 to-cyan-500/20 ring-1 ring-orange-400/40 shadow-[0_0_18px_rgba(249,115,22,0.3)]">
            <Icon name="emberkit" size={26} className="text-orange-200 drop-shadow-[0_0_10px_rgba(251,113,133,0.5)]" />
          </span>
          <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-fuchsia-400 bg-clip-text text-transparent">EmberKit</span>
        </div>
        <button onClick={closeSidebar} className="text-gray-400 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 6L6 18"/><path d="M6 6l12 12"/>
          </svg>
        </button>
      </div>

      {docs.map((section) => (
        <div key={section.title} className="mb-7">
          <h3 className="mb-2 px-3 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-transparent bg-clip-text bg-gradient-to-r from-orange-400/85 via-fuchsia-400/75 to-cyan-400/70">
            {section.title}
          </h3>
          <ul className="list-none space-y-0.5">
            {section.items.map((item) => {
              const isActive = pathname === normalizePath(item.path);
              return (
                <li key={item.path}>
                  <a
                    href={item.path}
                    data-sidebar-link={item.path}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={(e) => {
                      e.preventDefault();
                      closeSidebar();
                      navigate(item.path);
                    }}
                    className={[
                      'group flex items-center gap-2 rounded-xl border border-transparent px-3 py-2 text-sm no-underline transition-all duration-200 cursor-pointer',
                      isActive
                        ? 'bg-orange-500/10 font-semibold text-orange-300 ring-1 ring-orange-500/30 shadow-[0_0_24px_rgba(249,115,22,0.08)]'
                        : 'font-medium text-gray-400 hover:border-orange-500/25 hover:bg-white/[0.04] hover:text-gray-100 hover:shadow-[0_0_20px_rgba(249,115,22,0.06)]',
                    ].join(' ')}
                  >
                    <span className={[
                      'flex h-1.5 w-1.5 shrink-0 rounded-full transition-all duration-200',
                      isActive
                        ? 'bg-orange-300 shadow-[0_0_8px_rgba(251,146,60,0.7)]'
                        : 'bg-gray-600 group-hover:bg-orange-400/60',
                    ].join(' ')} />
                    {item.title}
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
