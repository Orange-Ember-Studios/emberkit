import type { FC } from '@emberkit/core';
import { Icon, type IconName } from '../../atoms/Icon/index.js';

export interface NavItem {
  label: string;
  href: string;
  icon?: IconName;
  active?: boolean;
}

export interface HeaderProps {
  [key: string]: unknown;
  title: string;
  navItems?: NavItem[];
  className?: string;
  onNavClick?: (item: NavItem) => void;
  logo?: unknown;
  actions?: unknown;
}

const Header: FC<HeaderProps> = ({
  title,
  navItems = [],
  className = '',
  onNavClick,
  logo,
  actions,
}) => {
  const cls = `sticky top-0 z-40 w-full bg-surface-100 border-b border-surface-300 ${className}`.trim();

  return (
    <header class={cls}>
      <div class="mx-auto flex h-16 items-center justify-between px-6">
        <div class="flex items-center gap-6">
          {logo ? (
            logo
          ) : (
            <span class="text-lg font-semibold text-surface-900">{title}</span>
          )}
          {navItems.length > 0 && (
            <nav class="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const linkCls = [
                  'flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-150',
                  item.active
                    ? 'bg-primary-500/15 text-primary-400'
                    : 'text-surface-700 hover:text-surface-900 hover:bg-surface-200',
                ].join(' ');

                return (
                  <a
                    key={item.href}
                    href={item.href}
                    class={linkCls}
                    onClick={(e) => {
                      if (onNavClick) {
                        e.preventDefault();
                        onNavClick(item);
                      }
                    }}
                  >
                    {item.icon && <Icon name={item.icon} size={18} />}
                    {item.label}
                  </a>
                );
              })}
            </nav>
          )}
        </div>
        {actions && (
          <div class="flex items-center gap-3">
            {actions}
          </div>
        )}
      </div>
    </header>
  );
};

export { Header };
