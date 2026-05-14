type FC<P> = (props: P) => unknown;
import { Icon, type IconName } from '../../atoms/index.js';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

export interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children?: unknown;
  [key: string]: unknown;
  dismissible?: boolean;
  className?: string;
  onDismiss?: (event: MouseEvent) => void;
}

function variantClasses(variant: AlertVariant): string {
  const map: Record<AlertVariant, string> = {
    info: 'bg-info-900 border-info-500',
    success: 'bg-success-900 border-success-500',
    warning: 'bg-warning-900 border-warning-500',
    error: 'bg-error-900 border-error-500',
  };
  return map[variant];
}

function textColor(variant: AlertVariant): string {
  const map: Record<AlertVariant, string> = {
    info: 'text-info-50',
    success: 'text-success-50',
    warning: 'text-warning-50',
    error: 'text-error-50',
  };
  return map[variant];
}

function iconName(variant: AlertVariant): IconName {
  const map: Record<AlertVariant, IconName> = {
    info: 'info',
    success: 'check-circle',
    warning: 'alert-triangle',
    error: 'alert-circle',
  };
  return map[variant];
}

const Alert: FC<AlertProps> = ({
  variant = 'info',
  title,
  children,
  dismissible = false,
  className = '',
  onDismiss,
}) => {
  const cls = `relative flex items-start gap-3 rounded-lg border-l-4 p-4 ${variantClasses(variant)} ${className}`.trim();

  const textCls = textColor(variant);

  return (
    <div class={cls} role="alert">
      <Icon name={iconName(variant)} size={20} className={`mt-0.5 shrink-0 ${textCls}`} />
      <div class="flex-1">
        {title && <p class={`text-sm font-semibold ${textCls}`}>{title}</p>}
        {children && <p class={`text-sm ${textCls}`}>{children}</p>}
      </div>
      {dismissible && (
        <button
          class={`shrink-0 p-1 rounded-md hover:opacity-70 transition-opacity ${textCls}`}
          onClick={onDismiss}
          aria-label="Dismiss"
        >
          <Icon name="x" size={16} />
        </button>
      )}
    </div>
  );
};

export { Alert };
