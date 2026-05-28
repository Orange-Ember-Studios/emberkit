import type { RouteComponent } from '@emberkit/core';
import { useNavigate } from '@emberkit/core';
import { resolveDocsLocale } from '../lib/i18n.js';

export async function loader({ request }: { request: Request }) {
  const locale = resolveDocsLocale(request);
  return { data: { redirectTo: `/${locale}` } };
}

const RootRedirect: RouteComponent<{ data?: { redirectTo?: string } }> = ({ data }) => {
  const navigate = useNavigate();
  const target = data?.redirectTo ?? '/en';

  if (typeof window !== 'undefined' && window.location.pathname === '/') {
    navigate(target);
  }

  return (
    <div className="flex min-h-[50vh] items-center justify-center text-gray-400">
      <meta httpEquiv="refresh" content={`0;url=${target}`} />
      <p>Redirecting…</p>
    </div>
  );
};

export default RootRedirect;
