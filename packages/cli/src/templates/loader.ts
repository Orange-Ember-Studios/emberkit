export const loaderTemplate = `import type { LoaderFunction, LoaderResult } from '@emberkit/core';

export const loader: LoaderFunction = async ({ params, query, request }) => {
  return {
    data: {
      // Add your data here
    },
  } as LoaderResult<unknown>;
};
`;