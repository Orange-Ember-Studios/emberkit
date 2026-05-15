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