type FC<P> = (props: P) => unknown;

export type TextSize = 'xs' | 'sm' | 'base' | 'lg';
export type TextWeight = 'normal' | 'medium' | 'semibold';
export type TextColor = 'default' | 'muted' | 'primary' | 'error';

export interface TextProps {
  children?: unknown;
  [key: string]: unknown;
  size?: TextSize;
  weight?: TextWeight;
  color?: TextColor;
  as?: 'p' | 'span' | 'div' | 'label';
  className?: string;
}

function sizeClass(size: TextSize): string {
  const map: Record<TextSize, string> = {
    xs: 'text-xs', sm: 'text-sm', base: 'text-base', lg: 'text-lg',
  };
  return map[size];
}

function weightClass(weight: TextWeight): string {
  const map: Record<TextWeight, string> = {
    normal: 'font-normal', medium: 'font-medium', semibold: 'font-semibold',
  };
  return map[weight];
}

function colorClass(color: TextColor): string {
  const map: Record<TextColor, string> = {
    default: 'text-surface-900',
    muted: 'text-surface-700',
    primary: 'text-primary-400',
    error: 'text-error-500',
  };
  return map[color];
}

const Text: FC<TextProps> = ({
  children,
  size = 'base',
  weight = 'normal',
  color = 'default',
  as: Tag = 'p',
  className = '',
}) => {
  const cls = `${sizeClass(size)} ${weightClass(weight)} ${colorClass(color)} ${className}`.trim();

  if (Tag === 'label') {
    return <label class={cls}>{children}</label>;
  }
  if (Tag === 'span') {
    return <span class={cls}>{children}</span>;
  }
  if (Tag === 'div') {
    return <div class={cls}>{children}</div>;
  }
  return <p class={cls}>{children}</p>;
};

export { Text };
