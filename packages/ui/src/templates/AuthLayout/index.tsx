type FC<P> = (props: P) => unknown;

export interface AuthLayoutProps {
  children?: unknown;
  [key: string]: unknown;
  title?: string;
  subtitle?: string;
  logo?: unknown;
}

const AuthLayout: FC<AuthLayoutProps> = ({
  children,
  title = "Welcome back",
  subtitle = "Sign in to your account to continue",
  logo,
}) => {
  return (
    <div class="min-h-screen flex items-center justify-center bg-surface-50 px-4 py-12">
      <div class="w-full max-w-md">
        <div class="text-center mb-8">
          {logo ? (
            <div class="flex justify-center mb-4">{logo}</div>
          ) : (
            <div class="flex justify-center mb-4">
              <span class="text-3xl font-bold text-primary-400">E</span>
            </div>
          )}
          <h1 class="text-2xl font-bold text-surface-900">{title}</h1>
          <p class="mt-2 text-sm text-surface-500">{subtitle}</p>
        </div>
        <div class="bg-surface-100 rounded-xl shadow-sm border border-surface-300 p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export { AuthLayout };
