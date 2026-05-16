import type { RouteComponent } from '@emberkit/core';
import Sidebar from '../components/sidebar';
import Header from '../components/header';

const Layout: RouteComponent = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col bg-[#0b0f19]">
      <Header />
      <div className="flex flex-1 pt-16">
        <Sidebar />
        <main className="md-content flex-1 min-w-0 px-6 py-10 lg:ml-[260px] lg:px-16 lg:py-14">
          <div className="max-w-[800px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
