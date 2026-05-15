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