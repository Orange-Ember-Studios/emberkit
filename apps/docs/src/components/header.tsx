import type { RouteComponent } from '@emberkit/core';
import { navigate } from '@emberkit/core';
import { IconMenu, IconGithub } from '@emberkit/icons';

const Header: RouteComponent = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div className="flex items-center gap-3">
        <button className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-800 transition-colors hover:bg-gray-100">
          <IconMenu size={24} />
        </button>
        <a
          href="/"
          className="flex items-center gap-2 text-2xl font-bold text-gray-800 no-underline"
          onClick={(e) => { e.preventDefault(); navigate('/'); }}
        >
          <span className="text-2xl">⚡</span>
          <span className="bg-gradient-to-r from-indigo-500 to-emerald-500 bg-clip-text text-transparent">EmberKit</span>
        </a>
      </div>
      <nav className="flex gap-6 max-sm:hidden">
        <a href="/docs/introduction" className="font-medium text-gray-500 no-underline transition-colors hover:text-gray-800">Docs</a>
        <a href="/docs/api" className="font-medium text-gray-500 no-underline transition-colors hover:text-gray-800">API</a>
        <a href="/docs/examples" className="font-medium text-gray-500 no-underline transition-colors hover:text-gray-800">Examples</a>
      </nav>
      <div className="flex items-center gap-4">
        <a
          href="https://github.com"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-all hover:bg-gray-100 hover:text-gray-800"
          target="_blank"
          rel="noopener"
        >
          <IconGithub size={20} />
        </a>
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-500">v0.1.0</span>
      </div>
    </header>
  );
};

export default Header;
