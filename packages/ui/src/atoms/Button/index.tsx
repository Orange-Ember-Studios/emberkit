type FC<P> = (props: P) => unknown;
import { Spinner } from "../Spinner/index.js";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger";
export type ButtonSize = "sm" | "md" | "lg";

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
  type?: "button" | "submit" | "reset";
}

function variantClasses(variant: ButtonVariant): string {
  const map: Record<ButtonVariant, string> = {
    primary:
      "bg-primary-500 text-white ring-1 ring-primary-400/40 shadow-lg shadow-primary-500/25 " +
      "hover:bg-primary-400 hover:shadow-xl hover:shadow-primary-400/35 hover:scale-[1.02] " +
      "active:scale-[0.98] active:bg-primary-600",
    secondary:
      "glass text-surface-900 " +
      "hover:bg-white/12 hover:border-white/20 hover:scale-[1.02] " +
      "active:scale-[0.98]",
    outline:
      "border border-surface-500/50 text-surface-800 bg-surface-200/30 " +
      "hover:bg-primary-500/10 hover:border-primary-500/60 hover:text-primary-300 hover:scale-[1.02] " +
      "active:scale-[0.98]",
    ghost:
      "text-surface-600 bg-transparent " +
      "hover:text-surface-900 hover:bg-white/8 hover:scale-[1.02] " +
      "active:scale-[0.98]",
    danger:
      "bg-error-500/15 text-error-500 ring-1 ring-error-500/35 shadow-md shadow-error-500/10 " +
      "hover:bg-error-500/25 hover:text-error-900 hover:shadow-lg hover:scale-[1.02] " +
      "active:scale-[0.98]",
  };
  return map[variant];
}

function sizeClasses(size: ButtonSize): string {
  const map: Record<ButtonSize, string> = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };
  return map[size];
}

const Button: FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  fullWidth = false,
  className = "",
  onClick,
  type = "button",
}) => {
  const base =
    "inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 ease-out disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100";
  const cls =
    `${base} ${variantClasses(variant)} ${sizeClasses(size)} ${fullWidth ? "w-full" : ""} ${className}`.trim();

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
