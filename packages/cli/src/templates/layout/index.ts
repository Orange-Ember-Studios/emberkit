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