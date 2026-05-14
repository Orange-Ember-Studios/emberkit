type FC<P> = (props: P) => unknown;
import type { NavItem } from "../../organisms/Header/index.js";
import { Header, Sidebar } from "../../organisms/index.js";

export interface DefaultLayoutProps {
  children?: unknown;
  [key: string]: unknown;
  title?: string;
  navItems?: NavItem[];
  sidebarItems?: import("../../organisms/Sidebar/index.js").SidebarItem[];
  logo?: unknown;
  headerActions?: unknown;
  sidebarCollapsed?: boolean;
}

const DefaultLayout: FC<DefaultLayoutProps> = ({
  children,
  title = "EmberKit",
  navItems = [],
  sidebarItems = [],
  logo,
  headerActions,
  sidebarCollapsed = false,
}) => {
  return (
    <div class="flex h-screen bg-surface-50">
      {sidebarItems.length > 0 && (
        <Sidebar
          items={sidebarItems}
          collapsed={sidebarCollapsed}
          header={
            <span class="text-lg font-semibold text-surface-900">App</span>
          }
        />
      )}
      <div class="flex-1 flex flex-col overflow-hidden">
        <Header
          title={title}
          navItems={navItems}
          logo={logo}
          actions={headerActions}
        />
        <main class="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
};

export { DefaultLayout };
