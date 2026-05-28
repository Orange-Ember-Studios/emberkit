import type { RouteComponent } from '@emberkit/core';
import { useNavigate } from '@emberkit/core';

export async function loader() {
  return { data: { redirectTo: '/en/docs/introduction' } };
}

const LegacyDocsIndex: RouteComponent<{ data?: { redirectTo?: string } }> = ({ data }) => {
  const navigate = useNavigate();
  const target = data?.redirectTo ?? '/en/docs/introduction';

  if (typeof window !== 'undefined') {
    navigate(target);
  }

  return (
    <div className="flex min-h-[40vh] items-center justify-center text-gray-400">
      <meta httpEquiv="refresh" content={`0;url=${target}`} />
      <p>Redirecting…</p>
    </div>
  );
};

export default LegacyDocsIndex;
