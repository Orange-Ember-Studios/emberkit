import type { FC } from "@emberkit/core";
import type { InputHTMLAttributes } from "../../types/index.js";

export type InputSize = "sm" | "md" | "lg";

export interface InputProps extends Omit<InputHTMLAttributes, "size"> {
  size?: InputSize;
  error?: string | undefined;
}

function sizeClass(size: InputSize): string {
  const map: Record<InputSize, string> = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-5 py-3 text-lg",
  };
  return map[size];
}

const Input: FC<InputProps> = ({
  name,
  type = "text",
  placeholder,
  value,
  size = "md",
  disabled = false,
  readOnly = false,
  required = false,
  error,
  className = "",
  onInput,
  onChange,
  onFocus,
  onBlur,
}) => {
  const base =
    "w-full rounded-xl border bg-surface-200/70 text-surface-900 placeholder-surface-600 " +
    "shadow-sm shadow-black/20 transition-all duration-150 " +
    "focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-offset-surface-50 " +
    "disabled:bg-surface-300/50 disabled:text-surface-600 disabled:cursor-not-allowed";
  const border = error
    ? "border-error-500/80 focus:border-error-500 focus:ring-error-500/30"
    : "border-surface-400/50 hover:border-surface-500/70 focus:border-primary-500 focus:ring-primary-500/25";
  const cls = `${base} ${border} ${sizeClass(size)} ${className}`.trim();

  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      disabled={disabled}
      readOnly={readOnly}
      required={required}
      class={cls}
      onInput={onInput}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  );
};

export { Input };
