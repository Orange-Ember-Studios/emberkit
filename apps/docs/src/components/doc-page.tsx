import type { RouteComponent } from '@emberkit/core';
import { renderMarkdown } from '@emberkit/core';

interface Props {
  content: string;
  title?: string;
}

const DocPage: RouteComponent<Props> = ({ content, title }) => {
  const html = renderMarkdown(content);

  return (
    <article className="max-w-[800px]">
      {title && <h1 className="mb-8 text-4xl font-extrabold tracking-tight">{title}</h1>}
      <div className="md-content" dangerouslySetInnerHTML={{ __html: html }} />
    </article>
  );
};

export default DocPage;
