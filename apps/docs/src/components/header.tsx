import type { RouteComponent } from '@emberkit/core';
import { IconGithub } from '@emberkit/icons';
import { useNavigate } from '@emberkit/core';

const Header: RouteComponent = () => {
  const navigate = useNavigate();

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
        overlay.className = 'fixed inset-0 z-30 bg-black/50 backdrop-blur-sm';
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
    <header className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-b border-white/5 bg-[#0b0f19]/80 px-6 backdrop-blur-xl transition-all duration-300">
      <div className="flex items-center gap-3">
        <button
          onClick={() => toggleSidebar()}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-300 transition-all duration-200 hover:bg-white/5 hover:text-white active:scale-95 lg:hidden"
        >
          <svg data-menu-icon xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
          className="flex items-center gap-2 text-xl font-bold text-white no-underline transition-all duration-200 hover:opacity-80 cursor-pointer"
        >
          <span className="text-2xl drop-shadow-[0_0_8px_rgba(249,115,22,0.4)]">🔥</span>
          <span className="bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent transition-all duration-300 hover:from-orange-300 hover:to-orange-400">EmberKit</span>
        </a>
      </div>
      <nav className="flex gap-6 max-sm:hidden">
        <a
          href="/docs/introduction"
          onClick={(e) => {
            e.preventDefault();
            navigate('/docs/introduction');
          }}
          className="text-sm font-medium uppercase tracking-widest text-gray-400 no-underline transition-all duration-200 hover:text-orange-400 hover:drop-shadow-[0_0_8px_rgba(249,115,22,0.3)] cursor-pointer"
        >
          Docs
        </a>
        <a
          href="/docs/api"
          onClick={(e) => {
            e.preventDefault();
            navigate('/docs/api');
          }}
          className="text-sm font-medium uppercase tracking-widest text-gray-400 no-underline transition-all duration-200 hover:text-orange-400 hover:drop-shadow-[0_0_8px_rgba(249,115,22,0.3)] cursor-pointer"
        >
          API
        </a>
        <a
          href="/docs/examples"
          onClick={(e) => {
            e.preventDefault();
            navigate('/docs/examples');
          }}
          className="text-sm font-medium uppercase tracking-widest text-gray-400 no-underline transition-all duration-200 hover:text-orange-400 hover:drop-shadow-[0_0_8px_rgba(249,115,22,0.3)] cursor-pointer"
        >
          Examples
        </a>
      </nav>
      <div className="flex items-center gap-4">
        <a
          href="https://github.com"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition-all duration-200 hover:bg-white/5 hover:text-white hover:drop-shadow-[0_0_12px_rgba(249,115,22,0.3)] active:scale-95"
          target="_blank"
          rel="noopener"
        >
          <IconGithub size={20} />
        </a>
      </div>
    </header>
  );
};

export default Header;
