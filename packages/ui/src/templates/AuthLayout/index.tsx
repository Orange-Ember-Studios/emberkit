import type { FC, JSXNode } from "@emberkit/core";

export interface AuthLayoutProps {
  children?: JSXNode;
  title?: string;
  subtitle?: string;
  logo?: JSXNode;
  [key: string]: unknown;
}

const AuthLayout: FC<AuthLayoutProps> = ({
  children,
  title = "Welcome back",
  subtitle = "Sign in to your account to continue",
  logo,
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          {logo ? (
            <div className="flex justify-center mb-4">{logo}</div>
          ) : (
            <div className="flex justify-center mb-4">
              <span className="text-3xl font-bold text-primary-400">E</span>
            </div>
          )}
          <h1 className="text-2xl font-bold text-surface-900">{title}</h1>
          <p className="mt-2 text-sm text-surface-500">{subtitle}</p>
        </div>
        <div className="bg-surface-100 rounded-xl shadow-sm border border-surface-300 p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export { AuthLayout };
