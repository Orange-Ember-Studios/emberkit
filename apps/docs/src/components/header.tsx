import type { RouteComponent } from '@emberkit/core';
import { navigate } from '@emberkit/core';
import { IconMenu, IconGithub } from './icons';

const Header: RouteComponent = () => {
  return (
    <header className="docs-header">
      <div className="header-left">
        <button className="menu-toggle">
          <IconMenu size={24} />
        </button>
        <a href="/" className="logo" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
          <span className="logo-icon">⚡</span>
          <span className="logo-text">EmberKit</span>
        </a>
      </div>
      <nav className="header-nav">
        <a href="/docs/introduction">Docs</a>
        <a href="/docs/api">API</a>
        <a href="/docs/examples">Examples</a>
      </nav>
      <div className="header-right">
        <a href="https://github.com" className="github-link" target="_blank" rel="noopener">
          <IconGithub size={20} />
        </a>
        <span className="version-badge">v0.1.0</span>
      </div>
    </header>
  );
};

export default Header;