import type { RouteComponent } from '@emberkit/core';
import { navigate } from '@emberkit/core';
import { IconChevronRight } from '@emberkit/icons';

const docs = [
  {
    title: 'Getting Started',
    items: [
      { title: 'Introduction', path: '/docs/introduction' },
      { title: 'Installation', path: '/docs/installation' },
      { title: 'Quick Start', path: '/docs/quick-start' },
    ],
  },
  {
    title: 'Core Concepts',
    items: [
      { title: 'Components', path: '/docs/components' },
      { title: 'Routing', path: '/docs/routing' },
      { title: 'Signals', path: '/docs/signals' },
      { title: 'Context', path: '/docs/context' },
    ],
  },
  {
    title: 'Features',
    items: [
      { title: 'SSR & SSG', path: '/docs/ssr' },
      { title: 'Forms & Mutations', path: '/docs/forms' },
      { title: 'Hydration', path: '/docs/hydration' },
      { title: 'SEO & Meta', path: '/docs/meta' },
    ],
  },
  {
    title: 'Advanced',
    items: [
      { title: 'Edge Deployment', path: '/docs/edge' },
      { title: 'Image Optimization', path: '/docs/images' },
      { title: 'Markdown/MDX', path: '/docs/markdown' },
    ],
  },
];

const Sidebar: RouteComponent = () => {
  return (
    <aside className="docs-sidebar">
      {docs.map((section) => (
        <div key={section.title} className="sidebar-section">
          <h3 className="sidebar-title">{section.title}</h3>
          <ul className="sidebar-nav">
            {section.items.map((item) => (
              <li key={item.path}>
                <a
                  href={item.path}
                  className="sidebar-link"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(item.path);
                  }}
                >
                  <IconChevronRight size={16} />
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </aside>
  );
};

export default Sidebar;