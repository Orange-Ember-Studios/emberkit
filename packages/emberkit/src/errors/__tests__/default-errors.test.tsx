import { describe, expect, it } from 'vitest';
import { renderToString } from '../../runtime/helpers/render.js';
import { DefaultNotFoundPage } from '../default-not-found.js';
import { DefaultServerErrorPage } from '../default-server-error.js';

describe('default error pages', () => {
  it('renders 404 with pathname', () => {
    const html = renderToString({
      type: DefaultNotFoundPage,
      props: { pathname: '/missing-page' },
    });
    expect(html).toContain('404');
    expect(html).toContain('Page not found');
    expect(html).toContain('/missing-page');
    expect(html).toContain('src/routes/404.tsx');
  });

  it('renders 500 with error details', () => {
    const html = renderToString({
      type: DefaultServerErrorPage,
      props: {
        pathname: '/broken',
        error: { status: 500, message: 'Database unavailable' },
      },
    });
    expect(html).toContain('500');
    expect(html).toContain('Server error');
    expect(html).toContain('Database unavailable');
    expect(html).toContain('/broken');
    expect(html).toContain('src/routes/500.tsx');
  });
});
