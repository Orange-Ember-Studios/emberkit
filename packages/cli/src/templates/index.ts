export const routeTemplate = `import type { FC } from '@emberkit/core';

const {{name}}Route: FC = () => {
  return (
    <div>
      <h1>{{name}}</h1>
    </div>
  );
};

export default {{name}}Route;
`;

export const componentTemplate = `import type { FC } from '@emberkit/core';

interface {{name}}Props {
  className?: string;
}

const {{name}}: FC<{{name}}Props> = ({ className = '' }) => {
  return (
    <div className={className}>
      {{name}} component
    </div>
  );
};

export default {{name}};
`;

export const layoutTemplate = `import type { FC, JSXNode } from '@emberkit/core';

interface {{name}}LayoutProps {
  children?: JSXNode;
}

const {{name}}Layout: FC<{{name}}LayoutProps> = ({ children }) => {
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

export const errorBoundaryTemplate = `import type { FC, JSXNode } from '@emberkit/core';

interface {{name}}ErrorProps {
  error: Error;
}

const {{name}}Error: FC<{{name}}ErrorProps> = ({ error }): JSXNode => {
  return (
    <div className="error-boundary">
      <h2>Something went wrong</h2>
      <p>{error.message}</p>
    </div>
  );
};

export default {{name}}Error;
`;

export const loaderTemplate = `import type { LoaderFunction, LoaderResult } from '@emberkit/core';

export const loader: LoaderFunction = async ({ params, request }) => {
  return {
    data: {
      // Add your data here
    },
  } as LoaderResult<unknown>;
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

export const indexTemplate = `import { render } from '@emberkit/core';
import App from './routes/_layout';

const root = document.getElementById('app');

if (root) {
  render(App, root);
}
`;

export const layoutRoutesTemplate = `// EmberKit uses file-based routing.
// Routes are automatically discovered from the src/routes directory.
// - src/routes/index.tsx → /
// - src/routes/about.tsx → /about
// - src/routes/[slug].tsx → /:slug

export {};
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
    result = result.split(`{{${key}}}`).join(value);
  }

  return result;
}

export function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
}
