import { createContext, useContext } from '@emberkit/core';
import { createSignal } from '@emberkit/core';
import type { RouteComponent } from '@emberkit/core';
import Sidebar from '../components/sidebar';
import Header from '../components/header';

interface DocsContextValue {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const DocsContext = createContext<DocsContextValue | null>(null);

const Layout: RouteComponent = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = createSignal(false);

  const context: DocsContextValue = {
    sidebarOpen: sidebarOpen(),
    setSidebarOpen,
  };

  return (
    <DocsContext.Provider value={context}>
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex flex-1 pt-16">
          <Sidebar />
          <main className="ml-[260px] max-w-[900px] flex-1 px-16 py-12 max-lg:ml-0 max-lg:px-6 max-lg:py-8">
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
