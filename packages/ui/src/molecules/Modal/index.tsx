type FC<P> = (props: P) => unknown;
import { Icon, Heading, Text } from "../../atoms/index.js";

export interface ModalProps {
  open: boolean | (() => boolean);
  onClose: () => void;
  title?: string;
  description?: string;
  children?: unknown;
  [key: string]: unknown;
  footer?: unknown;
  size?: "sm" | "md" | "lg";
}

function isSignal(val: unknown): val is (() => unknown) & { __idx: number } {
  return typeof val === "function" && (val as any).__idx != null;
}

function sizeClass(size: ModalProps["size"]): string {
  const map = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl" };
  return map[size ?? "md"];
}

const Modal: FC<ModalProps> = ({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
}) => {
  const openVal = isSignal(open) ? open() : open;
  const bindAttr = isSignal(open)
    ? {
        "data-ek-bind": open,
        "data-ek-show": "opacity-100",
        "data-ek-hide": "opacity-0 pointer-events-none",
      }
    : {};

  return (
    <div
      class={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-200 ${openVal ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      {...bindAttr}
    >
      <div
        class="absolute inset-0 bg-surface-50/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        class={`relative w-full ${sizeClass(size)} mx-4 glass-card rounded-2xl shadow-2xl scale-in`}
      >
        <div class="flex items-start justify-between p-6 pb-0">
          <div>
            {title && <Heading level={4}>{title}</Heading>}
            {description && (
              <Text color="muted" size="sm">
                {description}
              </Text>
            )}
          </div>
          <button
            class="p-1 rounded-md hover:bg-surface-200 transition-colors"
            onClick={onClose}
            aria-label="Close"
          >
            <Icon name="x" size={20} />
          </button>
        </div>
        {children && <div class="p-6">{children}</div>}
        {footer && (
          <div class="px-6 py-4 bg-white/5 border-t border-white/10 rounded-b-2xl flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export { Modal };
