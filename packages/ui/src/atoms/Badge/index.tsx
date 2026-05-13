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
    success: 'bg-success-50 text-success-900',
    warning: 'bg-warning-50 text-warning-900',
    error: 'bg-error-50 text-error-900',
    info: 'bg-info-50 text-info-900',
    accent: 'bg-accent-100 text-accent-900',
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
