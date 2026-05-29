import type { RouteComponent } from '@emberkit/core';
import { createElement } from '@emberkit/core';
import TranslationNotice from '../../../components/translation-notice';
import {
  enrichDocsMetadata,
  localeFromDocsPath,
} from '../../../lib/site-meta.js';
import {
  isDocsLocale,
  type DocsLocale,
} from '../../../lib/i18n.js';
import {
  getResolvedDocModule,
  normalizeDocSlug,
  resolveDocModule,
} from '../../../lib/load-doc.js';

export async function loader({
  params,
}: {
  params: Record<string, string | undefined>;
  request: Request;
}) {
  const langParam = params.lang ?? 'en';
  const slug = normalizeDocSlug(params.slug);

  if (!isDocsLocale(langParam)) {
    return { data: { notFound: true as const } };
  }

  const resolved = await resolveDocModule(langParam, slug);
  if (!resolved) {
    return { data: { notFound: true as const } };
  }

  const pathname = `/${langParam}/docs/${slug}`;
  return {
    data: {
      slug,
      locale: langParam,
      contentLocale: resolved.resolvedLocale,
      isFallback: resolved.isFallback,
      metadata: enrichDocsMetadata(pathname, resolved.module.metadata ?? {}, langParam),
    },
  };
}

const DocPage: RouteComponent<{
  lang?: string;
  slug?: string;
  params?: Record<string, string>;
  data?: {
    slug?: string;
    locale?: DocsLocale;
    contentLocale?: DocsLocale;
    isFallback?: boolean;
    notFound?: boolean;
  };
  pathname?: string;
}> = (props) => {
  const params = props.params ?? {};
  const locale = isDocsLocale(String(params.lang ?? props.lang ?? props.data?.locale ?? 'en'))
    ? ((params.lang ?? props.lang ?? props.data?.locale) as DocsLocale)
    : 'en';
  const slug = normalizeDocSlug(params.slug ?? props.slug ?? props.data?.slug);
  const resolved = getResolvedDocModule(locale, slug);

  if (!resolved || props.data?.notFound) {
    return (
      <article className="md-doc">
        <p>Document not found.</p>
      </article>
    );
  }

  const Component = resolved.module.default;

  return (
    <>
      <TranslationNotice
        isFallback={props.data?.isFallback ?? resolved.isFallback}
        contentLocale={props.data?.contentLocale ?? resolved.resolvedLocale}
        locale={locale}
      />
      {createElement(Component, { ...props, lang: locale, slug })}
    </>
  );
};

export default DocPage;

export function getMetadata(props: {
  pathname?: string;
  params?: Record<string, string>;
}) {
  const lang = props.params?.lang ?? 'en';
  const slug = props.params?.slug ?? 'introduction';
  const pathname = props.pathname ?? `/${lang}/docs/${slug}`;
  const locale = localeFromDocsPath(pathname);
  return enrichDocsMetadata(pathname, {}, locale);
}
