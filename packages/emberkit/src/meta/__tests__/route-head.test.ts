import { describe, expect, it } from 'vitest';
import { buildRouteHeadFromMetadata } from '../index.js';

describe('buildRouteHeadFromMetadata', () => {
  it('generates Open Graph and Twitter tags with site defaults', () => {
    const html = buildRouteHeadFromMetadata(
      {
        title: 'Introduction',
        description: 'Learn EmberKit basics.',
      },
      '/docs/introduction',
      {
        siteUrl: 'https://emberkit.orangeember.com',
        siteName: 'EmberKit Docs',
        titleSuffix: 'EmberKit Docs',
        defaultOgImage: 'https://emberkit.orangeember.com/og-image.svg',
        twitterSite: '@orangeember',
      },
    );

    expect(html).toContain('<title>Introduction | EmberKit Docs</title>');
    expect(html).toContain('property="og:title" content="Introduction | EmberKit Docs"');
    expect(html).toContain('property="og:url" content="https://emberkit.orangeember.com/docs/introduction"');
    expect(html).toContain('property="og:image" content="https://emberkit.orangeember.com/og-image.svg"');
    expect(html).toContain('name="twitter:card" content="summary_large_image"');
    expect(html).toContain('rel="canonical" href="https://emberkit.orangeember.com/docs/introduction"');
  });

  it('respects explicit metadata overrides', () => {
    const html = buildRouteHeadFromMetadata(
      {
        title: 'Custom',
        openGraph: {
          type: 'article',
          images: [{ url: 'https://example.com/custom.png', width: 800, height: 400 }],
        },
        twitter: {
          card: 'summary',
          title: 'Twitter title',
        },
      },
      '/blog/post',
      {
        siteUrl: 'https://emberkit.orangeember.com',
        defaultOgImage: 'https://emberkit.orangeember.com/og-image.svg',
      },
    );

    expect(html).toContain('og:type" content="article"');
    expect(html).toContain('og:image" content="https://example.com/custom.png"');
    expect(html).toContain('name="twitter:card" content="summary"');
    expect(html).toContain('name="twitter:title" content="Twitter title"');
  });
});
