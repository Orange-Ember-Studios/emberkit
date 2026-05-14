import type { FC } from "@emberkit/core";

export type SpinnerSize = "sm" | "md" | "lg";

export interface SpinnerProps {
  [key: string]: unknown;
  size?: SpinnerSize;
  className?: string;
  color?: string;
  gradient?: boolean;
}

function sizeClass(size: SpinnerSize): string {
  const map: Record<SpinnerSize, string> = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };
  return map[size];
}

const Spinner: FC<SpinnerProps> = ({
  size = "md",
  className = "",
  color,
  gradient = false,
}) => {
  const cls = `animate-spin ${sizeClass(size)} ${className}`.trim();
  const strokeColor = color ?? "currentColor";

  if (gradient) {
    return (
      <svg
        class={cls}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="spinner-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color={strokeColor} stop-opacity="1" />
            <stop offset="50%" stop-color={strokeColor} stop-opacity="0.4" />
            <stop offset="100%" stop-color={strokeColor} stop-opacity="0.1" />
          </linearGradient>
        </defs>
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="url(#spinner-grad)"
          stroke-width="3"
          stroke-dasharray="62.8"
          stroke-dashoffset="15.7"
          stroke-linecap="round"
        />
      </svg>
    );
  }

  return (
    <svg
      class={cls}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke={strokeColor}
        stroke-width="3"
        stroke-dasharray="62.8"
        stroke-dashoffset="0"
        stroke-linecap="round"
        class="opacity-20"
      />
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke={strokeColor}
        stroke-width="3"
        stroke-dasharray="62.8"
        stroke-linecap="round"
        class="opacity-90"
        stroke-dashoffset="-15.7"
      />
    </svg>
  );
};

export { Spinner };
