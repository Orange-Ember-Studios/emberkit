import type { RouteComponent } from '@emberkit/core';
import Sidebar from '../components/sidebar';
import Header from '../components/header';

const Layout: RouteComponent = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col bg-[#0b0f19]">
      <Header />
      <div className="flex flex-1 pt-16">
        <Sidebar />
        <main className="ml-[260px] flex-1 px-16 py-12 max-lg:ml-0 max-lg:px-6 max-lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
