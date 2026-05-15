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