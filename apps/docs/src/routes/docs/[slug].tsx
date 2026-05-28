import type { RouteComponent } from '@emberkit/core';
import { useNavigate } from '@emberkit/core';

export async function loader({
  params,
}: {
  params: Record<string, string | undefined>;
}) {
  const slug = params.slug ?? 'introduction';
  return { data: { redirectTo: `/en/docs/${slug}` } };
}

const LegacyDocsRedirect: RouteComponent<{
  params?: Record<string, string>;
  data?: { redirectTo?: string };
}> = ({ params, data }) => {
  const navigate = useNavigate();
  const slug = params?.slug ?? 'introduction';
  const target = data?.redirectTo ?? `/en/docs/${slug}`;

  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/docs')) {
    navigate(target);
  }

  return (
    <div className="flex min-h-[40vh] items-center justify-center text-gray-400">
      <meta httpEquiv="refresh" content={`0;url=${target}`} />
      <p>Redirecting…</p>
    </div>
  );
};

export default LegacyDocsRedirect;
