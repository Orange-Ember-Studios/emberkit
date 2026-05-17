import {
  Head,
  createEffect,
  createSignal,
  matchRoute,
  type HeadProps,
  type MetaData,
  type RouteComponent,
} from '@emberkit/core';
import { routes } from 'virtual:emberkit-routes';
import { enrichDocsMetadata, getDocsHeadProps, normalizeDocsPath } from '../lib/site-meta.js';

function currentPathname(): string {
  if (typeof window === 'undefined') {
    return '/';
  }
  return normalizeDocsPath(window.location.pathname);
}

const DocsPageHead: RouteComponent = () => {
  const pathname = currentPathname();
  const [headProps, setHeadProps] = createSignal<HeadProps>(getDocsHeadProps(pathname));

  createEffect(() => {
    const path = currentPathname();
    setHeadProps(getDocsHeadProps(path));

    const matched = matchRoute(routes, path);
    if (!matched) {
      return;
    }

    void matched.component().then((mod) => {
      if (mod.metadata) {
        setHeadProps(getDocsHeadProps(path, mod.metadata as MetaData));
      } else {
        setHeadProps(getDocsHeadProps(path, enrichDocsMetadata(path)));
      }
    });
  });

  const props = headProps();
  return <Head {...props} />;
};

export default DocsPageHead;
