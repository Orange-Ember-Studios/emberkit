import type { RouteComponent } from '@emberkit/core';
import DocsPageHead from '../components/docs-page-head';
import Sidebar from '../components/sidebar';
import Header from '../components/header';

const Layout: RouteComponent = ({ children, pathname }) => {
  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-[#0b0f19] text-gray-100">
      <DocsPageHead pathname={pathname as string | undefined} />
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-[20%] left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-orange-500/18 blur-[130px] animate-pulse" />
        <div className="absolute top-[25%] left-1/2 h-[260px] w-[260px] -translate-x-1/2 rounded-full bg-amber-500/12 blur-[100px] animate-pulse [animation-delay:700ms]" />
        <div className="absolute top-[15%] right-[8%] h-[240px] w-[240px] rounded-full bg-fuchsia-500/10 blur-[90px] animate-pulse [animation-delay:400ms]" />
        <div className="absolute bottom-[10%] left-[6%] h-[200px] w-[200px] rounded-full bg-cyan-500/10 blur-[80px] animate-pulse [animation-delay:1100ms]" />
      </div>

      <div className="relative" data-app-shell>
        <Header />
        <div className="pt-16 lg:grid lg:grid-cols-[260px_minmax(0,1fr)]">
          <Sidebar pathname={pathname as string | undefined} />
          <main className="md-content relative min-w-0 px-4 py-8 sm:px-6 sm:py-10 lg:px-16 lg:py-14">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
