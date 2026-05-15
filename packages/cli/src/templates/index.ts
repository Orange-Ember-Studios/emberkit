export const routeTemplate = `import type { RouteComponent } from '@emberkit/core';

const {{name}}: RouteComponent = () => {
  return (
    <div>
      <h1>{{name}}</h1>
    </div>
  );
};

export default {{name}};
`;

export const componentTemplate = `interface {{name}}Props {
  className?: string;
}

const {{name}} = ({ className = '' }: {{name}}Props) => {
  return (
    <div className={className}>
      {{name}} component
    </div>
  );
};

export default {{name}};
`;

export const layoutTemplate = `import type { RouteComponent } from '@emberkit/core';

const {{name}}Layout: RouteComponent = ({ children }) => {
  return (
    <div>
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

export const errorBoundaryTemplate = `import type { RouteComponent } from '@emberkit/core';

interface {{name}}ErrorProps {
  error: Error;
}

const {{name}}Error: RouteComponent<{{name}}ErrorProps> = ({ error }) => {
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

export const loader: LoaderFunction = async ({ params, query, request }) => {
  return {
    data: {
      // Add your data here
    },
  } as LoaderResult<unknown>;
};
`;

export const actionTemplate = `import type { ActionFunction, LoaderResult } from '@emberkit/core';

export const action: ActionFunction = async ({ params, request }) => {
  const formData = await request.formData();

  return {
    data: {
      success: true,
    },
  } as LoaderResult<unknown>;
};
`;

export const apiRouteTemplate = `import type { LoaderFunction, LoaderResult } from '@emberkit/core';

export const GET: LoaderFunction = async ({ params, query, request }) => {
  return {
    data: {
      message: 'Hello from API',
    },
  } as LoaderResult<unknown>;
};

export const POST: LoaderFunction = async ({ request }) => {
  const body = await request.json();

  return {
    data: {
      received: body,
    },
  } as LoaderResult<unknown>;
};
`;

export const configTemplate = `import { defineConfig } from '@emberkit/core';

export default defineConfig({
  mode: 'hybrid',
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
import { routes } from 'virtual:emberkit-routes';
import App from './routes/_layout';
import './styles.css';

const root = document.getElementById('app');

if (root) {
  try {
    render(App, root, { routes });
  } catch (error) {
    console.error('[entry] Render error:', error);
  }
}
`;

export const layoutRoutesTemplate = `// EmberKit uses file-based routing.
// Routes are automatically discovered from the src/routes directory.
// - src/routes/index.tsx → /
// - src/routes/about.tsx → /about
// - src/routes/[slug].tsx → /:slug
// - src/routes/[...rest].tsx → catch-all

export {};
`;

export const signalTemplate = `import { signal, computed, effect } from '@emberkit/core';

// Writable signal
const count = signal(0);

// Computed value
const doubled = computed(() => count.value * 2);

// Side effect
effect(() => {
  console.log('Count changed to:', count.value);
});

// Update
count.value++;

// Batch updates
import { batch } from '@emberkit/core';

batch(() => {
  count.value = 10;
});

export { count, doubled };
`;

export const contextTemplate = `import { createContext, useContext } from '@emberkit/core';

interface {{name}}Context {
  // Define your context shape
  value: string;
}

const {{name}}Context = createContext<{{name}}Context>({
  value: 'default',
});

// Provider usage:
// <{{name}}Context.Provider value={{ value: 'hello' }}>
//   {children}
// </{{name}}Context.Provider>

// Consumer usage:
// const ctx = useContext({{name}}Context);

export { {{name}}Context };
`;

export const formTemplate = `import { signal } from '@emberkit/core';

const {{name}}Form = () => {
  const email = signal('');
  const password = signal('');
  const error = signal<string | null>(null);
  const loading = signal(false);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    error.value = null;
    loading.value = true;

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.value,
          password: password.value,
        }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      // Handle success
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
    } finally {
      loading.value = false;
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email.value}
        onInput={(e) => { email.value = e.currentTarget.value; }}
        placeholder="Email"
      />
      <input
        type="password"
        value={password.value}
        onInput={(e) => { password.value = e.currentTarget.value; }}
        placeholder="Password"
      />
      {error.value && <p className="text-red-500">{error.value}</p>}
      <button type="submit" disabled={loading.value}>
        {loading.value ? 'Loading...' : 'Submit'}
      </button>
    </form>
  );
};

export default {{name}}Form;
`;

export function getTemplate(type: string): string {
  const templates: Record<string, string> = {
    route: routeTemplate,
    component: componentTemplate,
    layout: layoutTemplate,
    error: errorBoundaryTemplate,
    loader: loaderTemplate,
    action: actionTemplate,
    api: apiRouteTemplate,
    config: configTemplate,
    index: indexTemplate,
    signal: signalTemplate,
    context: contextTemplate,
    form: formTemplate,
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
