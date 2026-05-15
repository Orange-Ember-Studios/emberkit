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