import type { RouteComponent } from '@emberkit/core';
import { navigate } from '@emberkit/core';
import { IconZap, IconPackage, IconTarget, IconType, IconArrowRight, IconCode } from '@emberkit/icons';

const HomePage: RouteComponent = () => {
  return (
    <div className="mx-auto max-w-[1100px] px-12 max-sm:px-6">
      <section className="py-20 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-gradient-to-r from-indigo-500/10 to-emerald-500/10 px-4 py-2 text-sm font-medium text-indigo-600">
          <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
          v0.1.0 Now Available
        </div>
        <h1 className="mb-6 text-5xl font-extrabold leading-tight tracking-tight max-sm:text-3xl">
          The <span className="bg-gradient-to-r from-indigo-500 to-emerald-500 bg-clip-text text-transparent">minimalist</span> JSX framework
        </h1>
        <p className="mx-auto mb-10 max-w-[600px] text-xl leading-relaxed text-gray-500 max-sm:text-base">
          Built for speed, minimal weight, and zero JavaScript by default.
          TypeScript-first with file-based routing.
        </p>
        <div className="flex justify-center gap-4 max-sm:flex-col max-sm:items-center">
          <button
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-md"
            onClick={() => navigate('/docs/introduction')}
          >
            Get Started
            <IconArrowRight size={18} />
          </button>
          <button
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-6 py-3 text-base font-semibold text-gray-800 transition-all hover:border-gray-400 hover:bg-gray-100"
            onClick={() => navigate('/docs/api')}
          >
            View API
          </button>
        </div>
      </section>

      <section className="my-20 grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6">
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-8 transition-all hover:-translate-y-0.5 hover:border-indigo-500 hover:shadow-md">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500/10 to-emerald-500/10 text-indigo-600">
            <IconZap size={32} />
          </div>
          <h3 className="mb-2 text-lg font-bold">Lightning Fast</h3>
          <p className="text-sm leading-relaxed text-gray-500">Sub-50ms SSR with streaming support. Optimized for performance from the ground up.</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-8 transition-all hover:-translate-y-0.5 hover:border-indigo-500 hover:shadow-md">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500/10 to-emerald-500/10 text-indigo-600">
            <IconPackage size={32} />
          </div>
          <h3 className="mb-2 text-lg font-bold">Under 10KB</h3>
          <p className="text-sm leading-relaxed text-gray-500">Minimal runtime that is fully tree-shakeable. Pay only for what you use.</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-8 transition-all hover:-translate-y-0.5 hover:border-indigo-500 hover:shadow-md">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500/10 to-emerald-500/10 text-indigo-600">
            <IconTarget size={32} />
          </div>
          <h3 className="mb-2 text-lg font-bold">Zero JS Default</h3>
          <p className="text-sm leading-relaxed text-gray-500">Only interactive elements receive hydration. Static content stays static.</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-8 transition-all hover:-translate-y-0.5 hover:border-indigo-500 hover:shadow-md">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500/10 to-emerald-500/10 text-indigo-600">
            <IconType size={32} />
          </div>
          <h3 className="mb-2 text-lg font-bold">TypeScript First</h3>
          <p className="text-sm leading-relaxed text-gray-500">Full type safety with excellent IDE support. Catch errors before they happen.</p>
        </div>
      </section>

      <section className="my-20 rounded-xl bg-gray-900 p-8">
        <h2 className="mb-6 flex items-center gap-3 text-xl font-semibold text-white">
          <IconCode size={24} />
          Simple API
        </h2>
        <pre className="m-0 overflow-x-auto"><code className="font-mono text-sm leading-7 text-gray-100">{`import { createSignal, render } from '@emberkit/core';

function Counter() {
  const [count, setCount] = createSignal(0);

  return (
    <button onClick={() => setCount(c => c + 1)}>
      Count: {count()}
    </button>
  );
}

render(<Counter />, document.body);`}</code></pre>
      </section>
    </div>
  );
};

export default HomePage;
