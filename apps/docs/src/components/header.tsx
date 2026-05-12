import type { RouteComponent } from '@emberkit/core';
import { navigate } from '@emberkit/core';
import { IconMenu, IconGithub } from '@emberkit/icons';

const Header: RouteComponent = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-b border-white/5 bg-[#0b0f19]/80 px-6 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <button className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-300 transition-colors hover:bg-white/5 hover:text-white">
          <IconMenu size={24} />
        </button>
        <a
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-white no-underline"
          onClick={(e) => { e.preventDefault(); navigate('/'); }}
        >
          <span className="text-2xl">🔥</span>
          <span className="bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">EmberKit</span>
        </a>
      </div>
      <nav className="flex gap-6 max-sm:hidden">
        <a href="/docs/introduction" className="text-sm font-medium uppercase tracking-widest text-gray-400 no-underline transition-colors hover:text-orange-400">Docs</a>
        <a href="/docs/api" className="text-sm font-medium uppercase tracking-widest text-gray-400 no-underline transition-colors hover:text-orange-400">API</a>
        <a href="/docs/examples" className="text-sm font-medium uppercase tracking-widest text-gray-400 no-underline transition-colors hover:text-orange-400">Examples</a>
      </nav>
      <div className="flex items-center gap-4">
        <a
          href="https://github.com"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition-all hover:bg-white/5 hover:text-white"
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
