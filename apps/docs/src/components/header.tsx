import type { RouteComponent } from '@emberkit/core';
import { IconGithub } from '@emberkit/icons';
import { Icon } from '@emberkit/ui';
import { useNavigate } from '@emberkit/core';
import { CORE_VERSION, formatVersion } from '../lib/version.js';

const navLinks = [
  { label: 'Docs', path: '/docs/introduction' },
  { label: 'API', path: '/docs/api' },
  { label: 'Examples', path: '/docs/examples' },
];

const Header: RouteComponent = () => {
  const navigate = useNavigate();
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

  const toggleSidebar = () => {
    const sidebar = document.querySelector('[data-sidebar]');
    const backdrop = document.querySelector('[data-sidebar-backdrop]');
    const isOpen = sidebar?.classList.contains('translate-x-0');

    if (isOpen) {
      sidebar?.classList.remove('translate-x-0');
      sidebar?.classList.add('-translate-x-full');
      backdrop?.remove();
    } else {
      sidebar?.classList.remove('-translate-x-full');
      sidebar?.classList.add('translate-x-0');

      if (!backdrop) {
        const overlay = document.createElement('div');
        overlay.setAttribute('data-sidebar-backdrop', '');
        overlay.className = 'fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm lg:hidden';
        overlay.onclick = () => toggleSidebar();
        document.body.appendChild(overlay);
      }
    }

    const icon = document.querySelector('[data-menu-icon]');
    if (icon) {
      icon.innerHTML = isOpen
        ? '<path d="M3 12h18"/><path d="M3 6h18"/><path d="M3 18h18"/>'
        : '<path d="M18 6L6 18"/><path d="M6 6l12 12"/>';
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-b border-white/[0.06] bg-[#0b0f19]/90 px-6 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <button
          onClick={() => toggleSidebar()}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition-all duration-200 hover:bg-white/5 hover:text-white active:scale-95 lg:hidden"
        >
          <svg data-menu-icon xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 12h18"/>
            <path d="M3 6h18"/>
            <path d="M3 18h18"/>
          </svg>
        </button>
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            navigate('/');
          }}
          className="flex items-center gap-2.5 no-underline transition-opacity duration-200 hover:opacity-80 cursor-pointer"
        >
          <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/35 via-fuchsia-500/25 to-cyan-500/20 ring-1 ring-orange-400/40 shadow-[0_0_18px_rgba(249,115,22,0.3)]">
            <Icon name="emberkit" size={22} className="text-orange-200 drop-shadow-[0_0_10px_rgba(251,113,133,0.55)]" />
          </span>
          <span className="text-[1.0625rem] font-bold bg-gradient-to-r from-orange-400 via-orange-500 to-fuchsia-400 bg-clip-text text-transparent">EmberKit</span>
        </a>
        <span className="hidden sm:inline-flex items-center rounded-full bg-orange-500/10 px-2 py-0.5 text-[0.625rem] font-semibold uppercase tracking-wider text-orange-500/80 ring-1 ring-orange-500/20">
          {formatVersion(CORE_VERSION)}
        </span>
      </div>

      <nav className="hidden sm:flex items-center gap-1">
        {navLinks.map((link) => {
          const docsBase = link.path.split('/').slice(0, 2).join('/');
          const isActive = link.path !== '/' && currentPath.startsWith(docsBase);
          return (
            <a
              key={link.path}
              href={link.path}
              onClick={(e) => {
                e.preventDefault();
                navigate(link.path);
              }}
              className={[
                'px-3 py-1.5 rounded-md text-sm font-medium no-underline transition-all duration-200 cursor-pointer',
                isActive
                  ? 'text-orange-400 bg-orange-500/10'
                  : 'text-gray-400 hover:text-gray-100 hover:bg-white/[0.04]',
              ].join(' ')}
            >
              {link.label}
            </a>
          );
        })}
      </nav>

      <div className="flex items-center gap-2">
        <a
          href="https://github.com"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-all duration-200 hover:bg-white/5 hover:text-white active:scale-95"
          target="_blank"
          rel="noopener"
        >
          <IconGithub size={18} />
        </a>
      </div>
    </header>
  );
};

export default Header;
