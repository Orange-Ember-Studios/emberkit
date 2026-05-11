import type { GeneratorOptions } from '../types.js';

export const routeTemplate = `import type { RouteComponent } from '@emberkit/runtime';

const {{name}}Route: RouteComponent = (props) => {
  return (
    <div>
      <h1>{{name}}</h1>
    </div>
  );
};

export default {{name}}Route;
`;

export const componentTemplate = `import type { Component } from '@emberkit/runtime';

interface {{name}}Props {
  className?: string;
}

const {{name}}: Component<{{name}}Props> = ({ className = '' }) => {
  return (
    <div className={className}>
      {{name}} component
    </div>
  );
};

export default {{name}};
`;

export const layoutTemplate = `import type { RouteComponent } from '@emberkit/runtime';

interface {{name}}LayoutProps {
  children: JSX.Element;
}

const {{name}}Layout: RouteComponent<{{name}}LayoutProps> = ({ children }) => {
  return (
    <div className="{{kebab-name}}">
      <header>
        <nav>{{name}} Navigation</nav>
      </header>
      <main>{children}</main>
      <footer>Footer</footer>
    </div>
  );
};

export default {{name}}Layout;
`;

export const errorBoundaryTemplate = `import type { RouteComponent } from '@emberkit/runtime';
import { createErrorBoundary } from '@emberkit/runtime';

const {{name}}Error: RouteComponent<{ error: Error }> = ({ error }) => {
  return (
    <div className="error-boundary">
      <h2>Something went wrong</h2>
      <p>{error.message}</p>
    </div>
  );
};

export default {{name}}Error;
`;

export const loaderTemplate = `import type { Loader } from '@emberkit/loader';

export const loader: Loader = async ({ params, request }) => {
  return {
    // Add your data here
  };
};
`;

export const configTemplate = `import { defineConfig } from '@emberkit/core';

export default defineConfig({
  mode: 'ssr',
  routes: {
    output: 'src/generated/routes.ts',
  },
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
    target: 'esnext',
  },
});
`;

export const indexTemplate = `import { render } from '@emberkit/runtime';
import App from './routes/_layout';

const root = document.getElementById('app');

if (root) {
  render(App, root);
}
`;

export const layoutRoutesTemplate = `import { defineRoutes } from '@emberkit/router';

export default defineRoutes([
  {
    path: '/',
    component: () => import('./routes/index'),
  },
  {
    path: '/:slug',
    component: () => import('./routes/[slug]'),
  },
]);
`;

export function getTemplate(type: string): string {
  const templates: Record<string, string> = {
    route: routeTemplate,
    component: componentTemplate,
    layout: layoutTemplate,
    error: errorBoundaryTemplate,
    loader: loaderTemplate,
    config: configTemplate,
  };

  return templates[type] ?? routeTemplate;
}

export function formatTemplate(
  template: string,
  params: Record<string, string>,
): string {
  let result = template;

  for (const [key, value] of Object.entries(params)) {
    result = result.replaceAll(`{{${key}}}`, value);
  }

  return result;
}

export function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}