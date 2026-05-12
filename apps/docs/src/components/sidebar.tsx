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
    <aside className="fixed top-16 left-0 h-[calc(100vh-4rem)] w-[260px] overflow-y-auto border-r border-white/5 bg-[#0b0f19] px-4 py-6 max-lg:hidden">
      {docs.map((section) => (
        <div key={section.title} className="mb-6">
          <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-widest text-gray-500">{section.title}</h3>
          <ul className="list-none">
            {section.items.map((item) => (
              <li key={item.path}>
                <a
                  href={item.path}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-400 no-underline transition-all hover:bg-white/5 hover:text-white [&_svg]:shrink-0 [&_svg]:text-gray-600"
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
