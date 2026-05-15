import type { RouteComponent } from '@emberkit/core';
import Sidebar from '../components/sidebar';
import Header from '../components/header';

const Layout: RouteComponent = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col bg-[#0b0f19]">
      <Header />
      <div className="flex flex-1 pt-16">
        <Sidebar />
        <main className="flex-1 min-w-0 px-6 py-8 lg:ml-[260px] lg:px-16 lg:py-12">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
