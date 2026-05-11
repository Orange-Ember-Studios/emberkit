import type { RouteComponent } from '@emberkit/core';
import { renderMarkdown } from '@emberkit/core';

interface Props {
  content: string;
  title?: string;
}

const DocPage: RouteComponent<Props> = ({ content, title }) => {
  const html = renderMarkdown(content);

  return (
    <article className="doc-page">
      {title && <h1 className="doc-title">{title}</h1>}
      <div className="doc-content" dangerouslySetInnerHTML={{ __html: html }} />
    </article>
  );
};

export default DocPage;