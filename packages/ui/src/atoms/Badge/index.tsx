type FC<P> = (props: P) => unknown;

export type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'accent';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps {
  children?: unknown;
  [key: string]: unknown;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
}

function variantClass(variant: BadgeVariant): string {
  const map: Record<BadgeVariant, string> = {
    default: 'bg-surface-200 text-surface-800',
    success: 'bg-success-900 text-success-50',
    warning: 'bg-warning-900 text-warning-50',
    error: 'bg-error-900 text-error-50',
    info: 'bg-info-900 text-info-50',
    accent: 'bg-accent-900 text-accent-50',
  };
  return map[variant];
}

function sizeClass(size: BadgeSize): string {
  const map: Record<BadgeSize, string> = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  };
  return map[size];
}

const Badge: FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const cls = `inline-flex items-center font-medium rounded-full ${variantClass(variant)} ${sizeClass(size)} ${className}`.trim();

  return <span class={cls}>{children}</span>;
};

export { Badge };
