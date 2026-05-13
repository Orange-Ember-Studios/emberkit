type FC<P> = (props: P) => unknown;

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface HeadingProps {
  children?: unknown;
  [key: string]: unknown;
  level?: HeadingLevel;
  className?: string;
}

function levelClass(level: HeadingLevel): string {
  const map: Record<HeadingLevel, string> = {
    1: 'text-4xl font-bold tracking-tight',
    2: 'text-3xl font-semibold tracking-tight',
    3: 'text-2xl font-semibold',
    4: 'text-xl font-semibold',
    5: 'text-lg font-medium',
    6: 'text-base font-medium uppercase tracking-wider',
  };
  return map[level];
}

const Heading: FC<HeadingProps> = ({
  children,
  level = 1,
  className = '',
}) => {
  const cls = `${levelClass(level)} text-surface-900 ${className}`.trim();

  switch (level) {
    case 1: return <h1 class={cls}>{children}</h1>;
    case 2: return <h2 class={cls}>{children}</h2>;
    case 3: return <h3 class={cls}>{children}</h3>;
    case 4: return <h4 class={cls}>{children}</h4>;
    case 5: return <h5 class={cls}>{children}</h5>;
    case 6: return <h6 class={cls}>{children}</h6>;
  }
};

export { Heading };
