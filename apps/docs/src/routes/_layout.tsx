import type { RouteComponent } from '@emberkit/core';
import { createContext, useContext } from '@emberkit/core';
import { createSignal } from '@emberkit/core';
import Sidebar from '../components/sidebar';
import Header from '../components/header';

interface DocsContextValue {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const DocsContext = createContext<DocsContextValue | null>(null);

const Layout: RouteComponent<{ children?: JSX.Element }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = createSignal(false);

  const context: DocsContextValue = {
    sidebarOpen: sidebarOpen(),
    setSidebarOpen,
  };

  return (
    <DocsContext.Provider value={context}>
      <div className="docs-layout">
        <Header />
        <div className="docs-content">
          <Sidebar />
          <main className="docs-main">
            {children}
          </main>
        </div>
      </div>
    </DocsContext.Provider>
  );
};

export const useDocs = () => {
  const ctx = useContext(DocsContext);
  if (!ctx) throw new Error('useDocs must be used within DocsContext');
  return ctx;
};

export default Layout;