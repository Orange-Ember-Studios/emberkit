import { Head, type RouteComponent } from '@emberkit/core';
import { docsAlternateLinks, getDocsHeadProps, normalizeDocsPath } from '../lib/site-meta.js';

function resolvePathname(pathname?: string): string {
  if (pathname) {
    return normalizeDocsPath(pathname);
  }
  if (typeof window !== 'undefined') {
    return normalizeDocsPath(window.location.pathname);
  }
  return '/';
}

/** Updates document head (including Open Graph) on each client render / navigation. */
const DocsPageHead: RouteComponent = (props) => {
  const pathname = resolvePathname(props.pathname as string | undefined);
  const headProps = getDocsHeadProps(pathname);
  const alternates = docsAlternateLinks(pathname);

  return (
    <Head {...headProps}>
      {alternates.map((alt) => (
        <link key={alt.hreflang} rel="alternate" hreflang={alt.hreflang} href={alt.href} />
      ))}
    </Head>
  );
};

export default DocsPageHead;
