import type { RouteComponent } from '@emberkit/core';
import { IconChevronRight } from '@emberkit/icons';
import { useNavigate } from '../hooks/useNavigate';

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
  const navigate = useNavigate();

  return (
    <aside className="fixed top-16 left-0 h-[calc(100vh-4rem)] w-[260px] overflow-y-auto border-r border-white/5 bg-[#0b0f19] px-4 py-6 max-lg:hidden transition-all duration-300">
      {docs.map((section) => (
        <div key={section.title} className="mb-8">
          <h3 className="mb-3 px-3 text-xs font-semibold uppercase tracking-widest text-gray-500 transition-colors duration-200">{section.title}</h3>
          <ul className="list-none space-y-1">
            {section.items.map((item) => (
              <li key={item.path}>
                <a
                  href={item.path}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(item.path);
                  }}
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-400 no-underline transition-all duration-200 hover:bg-white/5 hover:text-orange-400 hover:translate-x-1 cursor-pointer [&_svg]:shrink-0 [&_svg]:transition-all [&_svg]:duration-200 [&_svg]:text-gray-600 hover:[&_svg]:text-orange-400"
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
