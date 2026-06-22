import type { DocsLocale } from './i18n.js';
import { docsNavPath } from './i18n.js';

export type DocsNavItem = {
  key: string;
  slug: string;
};

export type DocsNavSection = {
  titleKey: string;
  items: DocsNavItem[];
};

export const DOCS_NAV: DocsNavSection[] = [
  {
    titleKey: 'nav.sectionGettingStarted',
    items: [
      { key: 'nav.introduction', slug: 'introduction' },
      { key: 'nav.installation', slug: 'installation' },
      { key: 'nav.quickStart', slug: 'quick-start' },
      { key: 'nav.builtWith', slug: 'built-with-emberkit' },
      { key: 'nav.release', slug: 'release-0-11' },
      { key: 'nav.api', slug: 'api' },
      { key: 'nav.examples', slug: 'examples' },
    ],
  },
  {
    titleKey: 'nav.sectionCore',
    items: [
      { key: 'nav.components', slug: 'components' },
      { key: 'nav.routing', slug: 'routing' },
      { key: 'nav.signals', slug: 'signals' },
      { key: 'nav.context', slug: 'context' },
      { key: 'nav.i18n', slug: 'i18n' },
    ],
  },
  {
    titleKey: 'nav.sectionFeatures',
    items: [
      { key: 'nav.ssr', slug: 'ssr' },
      { key: 'nav.forms', slug: 'forms' },
      { key: 'nav.hydration', slug: 'hydration' },
      { key: 'nav.viewTransitions', slug: 'view-transitions' },
      { key: 'nav.devApi', slug: 'dev-api' },
      { key: 'nav.meta', slug: 'meta' },
      { key: 'nav.head', slug: 'head' },
      { key: 'nav.icons', slug: 'icons' },
      { key: 'nav.ui', slug: 'ui' },
    ],
  },
  {
    titleKey: 'nav.sectionAdvanced',
    items: [
      { key: 'nav.edge', slug: 'edge' },
      { key: 'nav.images', slug: 'images' },
      { key: 'nav.markdown', slug: 'markdown' },
    ],
  },
];

export function navItemPath(slug: string, locale: DocsLocale): string {
  return docsNavPath(slug, locale);
}
