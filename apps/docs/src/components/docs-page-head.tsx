import { Head, type RouteComponent } from '@emberkit/core';
import { docsAlternateLinks, getDocsHeadProps } from '../lib/site-meta.js';
import { DEFAULT_DOCS_LOCALE } from '../lib/locales.js';

function resolvePathname(pathname?: string): string {
  const raw =
    pathname ?? (typeof window !== 'undefined' ? window.location.pathname : `/${DEFAULT_DOCS_LOCALE}`);
  return raw.replace(/\/+$/, '') || '/';
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
