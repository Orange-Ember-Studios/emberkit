export interface ColorScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
}

export interface SemanticColor {
  light: string;
  DEFAULT: string;
  dark: string;
}

export interface TypographyToken {
  fontSize: string;
  lineHeight: string;
  fontWeight?: string;
}

export type SpacingToken =
  `spacing-${0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24}`;

export type BorderRadiusToken =
  | "none"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "full";

export type ShadowToken = "sm" | "md" | "lg" | "xl";

export interface DesignTokens {
  primary: ColorScale;
  secondary: ColorScale;
  accent: ColorScale;
  success: SemanticColor;
  warning: SemanticColor;
  error: SemanticColor;
  info: SemanticColor;
  surface: ColorScale;
  font: {
    sans: string;
    mono: string;
    heading: string;
  };
}
