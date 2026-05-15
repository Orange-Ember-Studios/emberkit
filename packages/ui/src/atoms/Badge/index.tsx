type FC<P> = (props: P) => unknown;

export type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "accent";
export type BadgeSize = "sm" | "md";

export interface BadgeProps {
  children: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
}

function variantClass(variant: BadgeVariant): string {
  const map: Record<BadgeVariant, string> = {
    default: "bg-surface-300/50 text-surface-800 ring-1 ring-white/10",
    success:
      "bg-success-500/15 text-success-500 ring-1 ring-success-500/30",
    warning:
      "bg-warning-500/15 text-warning-500 ring-1 ring-warning-500/30",
    error: "bg-error-500/15 text-error-500 ring-1 ring-error-500/30",
    info: "bg-info-500/15 text-info-500 ring-1 ring-info-500/30",
    accent: "bg-accent-500/15 text-accent-400 ring-1 ring-accent-500/30",
  };
  return map[variant];
}

function sizeClass(size: BadgeSize): string {
  const map: Record<BadgeSize, string> = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
  };
  return map[size];
}

const Badge: FC<BadgeProps> = ({
  children,
  variant = "default",
  size = "md",
  className = "",
}) => {
  const cls =
    `inline-flex items-center font-medium rounded-full ${variantClass(variant)} ${sizeClass(size)} ${className}`.trim();

  return <span class={cls}>{children}</span>;
};

export { Badge };
