import { createSignal, createEffect } from '@emberkit/core';
import type { RouteComponent } from '@emberkit/core';

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
  const [CodeBlock, setCodeBlock] = createSignal<
    ((props: { code: string; language: string }) => unknown) | null
  >(null);

  createEffect(() => {
    void import('@emberkit/ui/molecules').then((mod) => {
      setCodeBlock(() => mod.CodeBlock as (props: { code: string; language: string }) => unknown);
    });
  });

  const Block = CodeBlock();
  if (!Block) {
    return (
      <div
        className="min-h-[20rem] w-full bg-white/[0.03]"
        aria-hidden="true"
        role="presentation"
      />
    );
  }

  return <Block code={DEMO_CODE} language="tsx" />;
};

export default HomeCodeDemo;
