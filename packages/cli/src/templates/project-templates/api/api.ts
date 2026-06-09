import {
  buildPackageJson,
  buildTsConfig,
  buildEmberkitConfig,
  buildIndexHtml,
  buildEntryFile,
  GITIGNORE,
} from "../_shared/base.js";

export const apiTemplate: Record<string, string> = {
  "package.json": buildPackageJson(),
  "tsconfig.json": buildTsConfig(),
  "emberkit.config.ts": buildEmberkitConfig('ssr'),
  "index.html": buildIndexHtml({ title: "{{name}} API" }),
  ".gitignore": GITIGNORE,
  "src/index.tsx": buildEntryFile(),

  "src/routes/index.tsx": `import type { RouteComponent } from '@emberkit/core';

const ApiHome: RouteComponent = () => {
  const endpoints = [
    { method: 'GET', path: '/api/users', desc: 'List all users' },
    { method: 'POST', path: '/api/users', desc: 'Create a new user' },
    { method: 'GET', path: '/api/users/:id', desc: 'Get a user by ID' },
    { method: 'PUT', path: '/api/users/:id', desc: 'Update a user' },
    { method: 'DELETE', path: '/api/users/:id', desc: 'Delete a user' },
    { method: 'GET', path: '/api/health', desc: 'Health check' },
  ];

  const methodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-green-100 text-green-700';
      case 'POST': return 'bg-blue-100 text-blue-700';
      case 'PUT': return 'bg-yellow-100 text-yellow-700';
      case 'DELETE': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
      <header className="mb-12">
        <h1 className="text-3xl font-bold mb-2">{{name}} API</h1>
        <p className="text-gray-600">RESTful API built with EmberKit</p>
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <code className="text-sm">Base URL: http://localhost:3000</code>
        </div>
      </header>

      <section>
        <h2 className="text-xl font-semibold mb-4">Endpoints</h2>
        <div className="space-y-3">
          {endpoints.map((ep) => (
            <div key={ep.method + ep.path} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
              <span className={\`px-2 py-1 rounded text-xs font-bold \${methodColor(ep.method)}\`}>
                {ep.method}
              </span>
              <code className="text-sm font-mono">{ep.path}</code>
              <span className="text-gray-500 text-sm ml-auto">{ep.desc}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Example Response</h2>
        <pre className="p-4 bg-gray-900 text-gray-100 rounded-lg overflow-x-auto text-sm">
{JSON.stringify({
  data: [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  ],
  meta: { page: 1, total: 2 },
}, null, 2)}
        </pre>
      </section>
    </div>
  );
};

export default ApiHome;`,

  "src/routes/_api/users.ts": `import type { LoaderFunction, LoaderResult, ActionFunction } from '@emberkit/core';

// In-memory store (replace with database in production)
const users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', createdAt: '2026-01-15' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', createdAt: '2026-02-20' },
  { id: 3, name: 'Mike Johnson', email: 'mike@example.com', createdAt: '2026-03-10' },
];

let nextId = 4;

export const GET: LoaderFunction = async ({ query }) => {
  const page = parseInt(query.page as string) || 1;
  const limit = parseInt(query.limit as string) || 10;
  const start = (page - 1) * limit;
  const end = start + limit;

  return {
    data: {
      users: users.slice(start, end),
      meta: {
        page,
        limit,
        total: users.length,
      },
    },
  } as LoaderResult<unknown>;
};

export const POST: ActionFunction = async ({ request }) => {
  const body = await request.json();

  if (!body.name || !body.email) {
    return {
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Name and email are required',
        status: 400,
      },
    } as LoaderResult<unknown>;
  }

  const newUser = {
    id: nextId++,
    name: body.name,
    email: body.email,
    createdAt: new Date().toISOString().split('T')[0],
  };

  users.push(newUser);

  return {
    data: newUser,
  } as LoaderResult<unknown>;
};`,

  "src/routes/_api/users/[id].ts": `import type { LoaderFunction, LoaderResult, ActionFunction } from '@emberkit/core';

// In-memory store (replace with database in production)
const users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', createdAt: '2026-01-15' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', createdAt: '2026-02-20' },
  { id: 3, name: 'Mike Johnson', email: 'mike@example.com', createdAt: '2026-03-10' },
];

export const GET: LoaderFunction = async ({ params }) => {
  const id = parseInt(params.id);
  const user = users.find((u) => u.id === id);

  if (!user) {
    return {
      error: {
        code: 'NOT_FOUND',
        message: 'User not found',
        status: 404,
      },
    } as LoaderResult<unknown>;
  }

  return {
    data: user,
  } as LoaderResult<unknown>;
};

export const PUT: ActionFunction = async ({ params, request }) => {
  const id = parseInt(params.id);
  const index = users.findIndex((u) => u.id === id);

  if (index === -1) {
    return {
      error: {
        code: 'NOT_FOUND',
        message: 'User not found',
        status: 404,
      },
    } as LoaderResult<unknown>;
  }

  const body = await request.json();
  users[index] = { ...users[index], ...body };

  return {
    data: users[index],
  } as LoaderResult<unknown>;
};

export const DELETE: ActionFunction = async ({ params }) => {
  const id = parseInt(params.id);
  const index = users.findIndex((u) => u.id === id);

  if (index === -1) {
    return {
      error: {
        code: 'NOT_FOUND',
        message: 'User not found',
        status: 404,
      },
    } as LoaderResult<unknown>;
  }

  users.splice(index, 1);

  return {
    data: { success: true },
  } as LoaderResult<unknown>;
};`,

  "src/routes/_api/health.ts": `import type { LoaderFunction, LoaderResult } from '@emberkit/core';

export const GET: LoaderFunction = async () => {
  return {
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
  } as LoaderResult<unknown>;
};`,
};