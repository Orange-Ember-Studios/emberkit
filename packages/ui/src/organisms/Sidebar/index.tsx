import type { FC } from '@emberkit/core';
import { Icon, Text, type IconName } from '../../atoms/index.js';

export interface SidebarItem {
  label: string;
  href: string;
  icon?: IconName;
  active?: boolean;
  badge?: string;
  children?: SidebarItem[];
}

export interface SidebarProps {
  [key: string]: unknown;
  items: SidebarItem[];
  className?: string;
  collapsed?: boolean;
  onItemClick?: (item: SidebarItem) => void;
  header?: unknown;
  footer?: unknown;
}

const Sidebar: FC<SidebarProps> = ({
  items,
  className = '',
  collapsed = false,
  onItemClick,
  header,
  footer,
}) => {
  const cls = `flex flex-col h-full bg-surface-50 text-surface-900 border-r border-surface-300 transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'} ${className}`.trim();

  function renderItem(item: SidebarItem, depth = 0) {
    const itemCls = [
      'flex items-center gap-3 px-3 py-2 mx-2 text-sm font-medium rounded-lg transition-colors duration-150',
      item.active
        ? 'bg-primary-800 text-white'
        : 'text-surface-700 hover:text-surface-900 hover:bg-surface-200',
    ].join(' ');

    return (
      <div key={item.href}>
        <a
          href={item.href}
          class={itemCls}
          style={{ paddingLeft: collapsed ? '0.75rem' : `${0.75 + depth * 1.25}rem` }}
          onClick={(e) => {
            if (onItemClick) {
              e.preventDefault();
              onItemClick(item);
            }
          }}
          title={collapsed ? item.label : undefined}
        >
          {item.icon && <Icon name={item.icon} size={20} className="shrink-0" />}
          {!collapsed && (
            <>
              <span class="flex-1 truncate">{item.label}</span>
              {item.badge && (
                <span class="px-1.5 py-0.5 text-xs font-medium bg-primary-800 text-white rounded-full">
                  {item.badge}
                </span>
              )}
            </>
          )}
        </a>
        {!collapsed && item.children && item.children.length > 0 && (
          <div class="mt-1">
            {item.children.map((child) => renderItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  }

  return (
    <aside class={cls}>
      {header && (
        <div class="flex items-center h-16 px-4 border-b border-surface-300">
          {header}
        </div>
      )}
      <nav class="flex-1 overflow-y-auto py-4 space-y-1">
        {items.map((item) => renderItem(item))}
      </nav>
      {footer && (
        <div class="p-4 border-t border-surface-300">
          {footer}
        </div>
      )}
    </aside>
  );
};

export { Sidebar };
