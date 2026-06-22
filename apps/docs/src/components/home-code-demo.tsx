import type { RouteComponent } from '@emberkit/core';
import { CodeBlock } from '@emberkit/ui/molecules';

const DEMO_CODE = `import { createSignal } from '@emberkit/core';

function Counter() {
  const [count, setCount] = createSignal(0);
  return (
    <div>
      <span data-ek-bind={count}>{count()}</span>
      <button type="button" onClick={() => setCount((n) => n + 1)}>+</button>
    </div>
  );
}`;

const HomeCodeDemo: RouteComponent = () => {
  return <CodeBlock code={DEMO_CODE} language="tsx" />;
};

export default HomeCodeDemo;
