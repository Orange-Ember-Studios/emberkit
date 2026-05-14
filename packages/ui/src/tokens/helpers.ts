import type { DesignTokens } from "./types.js";

export const tokens: DesignTokens = {
  primary: {
    50: "#fff7ed",
    100: "#ffedd5",
    200: "#fed7aa",
    300: "#fdba74",
    400: "#fb923c",
    500: "#f97316",
    600: "#ea580c",
    700: "#c2410c",
    800: "#9a3412",
    900: "#7c2d12",
  },
  secondary: {
    50: "#faf6f0",
    100: "#f0ebe2",
    200: "#dbd3c5",
    300: "#c2b6a3",
    400: "#a6957e",
    500: "#8c7a63",
    600: "#736250",
    700: "#5f5042",
    800: "#3d332b",
    900: "#1a1512",
  },
  accent: {
    50: "#fffbeb",
    100: "#fef3c7",
    200: "#fde68a",
    300: "#fcd34d",
    400: "#fbbf24",
    500: "#f59e0b",
    600: "#d97706",
    700: "#b45309",
    800: "#92400e",
    900: "#78350f",
  },
  success: { light: "#f0fdf4", DEFAULT: "#22c55e", dark: "#14532d" },
  warning: { light: "#fffbeb", DEFAULT: "#eab308", dark: "#713f12" },
  error: { light: "#fef2f2", DEFAULT: "#f77f7f", dark: "#7f1d1d" },
  info: { light: "#ecfeff", DEFAULT: "#06b6d4", dark: "#164e63" },
  surface: {
    50: "#1a1512",
    100: "#221d19",
    200: "#2d2621",
    300: "#3d332b",
    400: "#5f5042",
    500: "#8c7a63",
    600: "#a6957e",
    700: "#c2b6a3",
    800: "#dbd3c5",
    900: "#f0ebe2",
  },
  font: {
    sans: '"Inter", ui-sans-serif, system-ui, sans-serif',
    mono: '"JetBrains Mono", ui-monospace, monospace',
    heading: '"Inter", ui-sans-serif, system-ui, sans-serif',
  },
};

export const spacing = {
  0: "0px",
  1: "0.25rem",
  2: "0.5rem",
  3: "0.75rem",
  4: "1rem",
  5: "1.25rem",
  6: "1.5rem",
  8: "2rem",
  10: "2.5rem",
  12: "3rem",
  16: "4rem",
  20: "5rem",
  24: "6rem",
} as const;

export const fontSize = {
  xs: "0.75rem",
  sm: "0.875rem",
  base: "1rem",
  lg: "1.125rem",
  xl: "1.25rem",
  "2xl": "1.5rem",
  "3xl": "1.875rem",
  "4xl": "2.25rem",
} as const;

export const fontWeight = {
  normal: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
} as const;

export const borderRadius = {
  none: "0px",
  sm: "0.125rem",
  md: "0.375rem",
  lg: "0.5rem",
  xl: "0.75rem",
  "2xl": "1rem",
  full: "9999px",
} as const;

export const shadow = {
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.3)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.3)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.4), 0 4px 6px -4px rgb(0 0 0 / 0.3)",
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.5), 0 8px 10px -6px rgb(0 0 0 / 0.4)",
} as const;

export function color(scale: keyof DesignTokens, shade: number): string {
  const c = tokens[scale];
  if (typeof c === "object" && c !== null && "500" in c) {
    return (c as unknown as Record<string, string>)[String(shade)] ?? "#000000";
  }
  return "#000000";
}

export function semanticColor(
  type: "success" | "warning" | "error" | "info",
  variant: "light" | "DEFAULT" | "dark",
): string {
  return tokens[type][variant];
}
