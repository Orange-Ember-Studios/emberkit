import { Head, type RouteComponent } from '@emberkit/core';
import { getDocsHeadProps, normalizeDocsPath } from '../lib/site-meta.js';

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
  return <Head {...getDocsHeadProps(pathname)} />;
};

export default DocsPageHead;
