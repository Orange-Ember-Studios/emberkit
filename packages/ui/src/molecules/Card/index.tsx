type FC<P> = (props: P) => unknown;
import { Heading, Text, Badge, type BadgeVariant } from "../../atoms/index.js";

export interface CardProps {
  title?: string;
  description?: string;
  badge?: { text: string; variant?: BadgeVariant };
  children?: unknown;
  [key: string]: unknown;
  className?: string;
  footer?: unknown;
  onClick?: (event: MouseEvent) => void;
}

const Card: FC<CardProps> = ({
  title,
  description,
  badge,
  children,
  className = "",
  footer,
  onClick,
}) => {
  const base =
    "glass-card rounded-2xl overflow-hidden transition-all duration-300";
  const hover = onClick
    ? "cursor-pointer hover:shadow-xl hover:border-primary-500/30 hover:scale-[1.01] hover:-translate-y-0.5"
    : "";
  const cls = `${base} ${hover} ${className}`.trim();

  return (
    <div class={cls} onClick={onClick}>
      {(title || description || badge) && (
        <div class="p-8 pb-0">
          {badge && (
            <Badge variant={badge.variant ?? "default"}>{badge.text}</Badge>
          )}
          {title && <Heading level={3}>{title}</Heading>}
          {description && <Text color="muted">{description}</Text>}
        </div>
      )}
      {children && <div class="p-8 pt-6">{children}</div>}
      {footer && (
        <div class="px-8 py-5 bg-white/5 border-t border-white/10">
          {footer}
        </div>
      )}
    </div>
  );
};

export { Card };
