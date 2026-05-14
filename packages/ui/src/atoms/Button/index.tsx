type FC<P> = (props: P) => unknown;
import { Spinner } from '../Spinner/index.js';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  children?: unknown;
  [key: string]: unknown;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  className?: string;
  onClick?: (event: MouseEvent) => void;
  type?: 'button' | 'submit' | 'reset';
}

function variantClasses(variant: ButtonVariant): string {
  const map: Record<ButtonVariant, string> = {
    primary:
      'bg-primary-800 text-white shadow-lg shadow-primary-800/25 '
      + 'hover:bg-primary-700 hover:shadow-xl hover:shadow-primary-700/40 hover:scale-[1.02] '
      + 'active:scale-[0.98] active:shadow-md active:shadow-primary-700/20',
    secondary:
      'glass text-surface-900 '
      + 'hover:bg-white/15 hover:border-white/20 hover:scale-[1.02] '
      + 'active:scale-[0.98]',
    outline:
      'border-2 border-surface-500/60 text-surface-800 bg-transparent '
      + 'hover:bg-primary-500/15 hover:border-primary-500 hover:text-primary-400 hover:shadow-lg hover:shadow-primary-500/15 hover:scale-[1.02] '
      + 'active:scale-[0.98]',
    ghost:
      'text-surface-500 bg-transparent '
      + 'hover:text-surface-800 hover:bg-white/8 hover:scale-[1.02] '
      + 'active:scale-[0.98]',
    danger:
      'bg-error-50 text-error-900 ring-1 ring-error-500/40 shadow-lg shadow-error-500/15 '
      + 'hover:bg-error-900/15 hover:shadow-xl hover:shadow-error-500/25 hover:scale-[1.02] '
      + 'active:scale-[0.98] active:shadow-md active:shadow-error-500/10',
  };
  return map[variant];
}

function sizeClasses(size: ButtonSize): string {
  const map: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  return map[size];
}

const Button: FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  className = '',
  onClick,
  type = 'button',
}) => {
  const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 ease-out disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100';
  const cls = `${base} ${variantClasses(variant)} ${sizeClasses(size)} ${fullWidth ? 'w-full' : ''} ${className}`.trim();

  return (
    <button
      type={type}
      class={cls}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  );
};

export { Button };
