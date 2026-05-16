import type { RouteComponent } from '@emberkit/core';
import { IconZap, IconPackage, IconTarget, IconType, IconArrowRight } from '@emberkit/icons';
import { Icon } from '@emberkit/ui';
import { useNavigate } from '@emberkit/core';
import { CodeBlock } from '@emberkit/ui/molecules';

const HomePage: RouteComponent = () => {
  const navigate = useNavigate();

  return (
    <div className="relative -mx-6 -mt-8 lg:-mx-16 lg:-mt-12 min-h-screen bg-[#0b0f19] text-gray-100 overflow-hidden">

      {/* Ambient glow blobs */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-orange-500/20 blur-[150px] animate-pulse" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full bg-amber-500/15 blur-[120px] animate-pulse [animation-delay:700ms]" />
      <div className="pointer-events-none absolute top-1/3 right-[15%] h-[280px] w-[280px] rounded-full bg-fuchsia-500/12 blur-[100px] animate-pulse [animation-delay:400ms]" />
      <div className="pointer-events-none absolute bottom-1/4 left-[10%] h-[220px] w-[220px] rounded-full bg-cyan-500/10 blur-[90px] animate-pulse [animation-delay:1100ms]" />

      {/* Hero Section */}
      <section className="relative z-10 flex min-h-[85vh] flex-col items-center justify-center px-6 text-center">
        <div className="relative mb-10 h-28 w-28 animate-bounce md:h-32 md:w-32" style={{ animationDuration: '3s' }}>
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-500/40 via-fuchsia-500/25 to-cyan-500/20 blur-2xl animate-pulse" />
          <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-fuchsia-500/20 to-transparent blur-xl" />
          <span className="relative z-10 flex h-full w-full items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500/30 via-fuchsia-500/20 to-cyan-500/15 ring-2 ring-orange-400/35 shadow-[0_0_40px_rgba(249,115,22,0.35)]">
            <Icon name="emberkit" size={76} className="text-orange-100 drop-shadow-[0_0_24px_rgba(251,113,133,0.65)]" />
          </span>
        </div>

        <span className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-fuchsia-400 to-cyan-300 md:text-base animate-fade-in-down" style={{ animationDelay: '100ms', animation: 'fade-in-down 0.6s ease-out' }}>
          Speed First &middot; TypeScript &middot; Zero JS by Default
        </span>

        <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-7xl lg:text-8xl animate-fade-in-down" style={{ animationDelay: '200ms', animation: 'fade-in-down 0.6s ease-out 200ms forwards', opacity: 0 }}>
          <span className="bg-gradient-to-br from-orange-300 via-orange-500 to-fuchsia-500 bg-clip-text text-transparent">EmberKit</span>
        </h1>

        <p className="mb-10 max-w-2xl text-lg leading-relaxed text-gray-300 md:text-2xl animate-fade-in-down" style={{ animationDelay: '300ms', animation: 'fade-in-down 0.6s ease-out 300ms forwards', opacity: 0 }}>
          The TypeScript-first JSX framework where <strong className="text-white font-semibold">speed comes first</strong> — fast SSR, pre-rendered static routes, and selective hydration instead of shipping a heavy client runtime.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row animate-fade-in-down" style={{ animationDelay: '400ms', animation: 'fade-in-down 0.6s ease-out 400ms forwards', opacity: 0 }}>
          <button
            className="inline-flex min-w-[200px] items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-700 px-8 py-4 text-xl font-bold text-white shadow-lg transition-all duration-300 hover:scale-[1.03] hover:from-orange-400 hover:to-orange-500 hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] active:scale-95"
            onClick={() => navigate('/docs/introduction')}
          >
            Get Started
            <IconArrowRight size={18} />
          </button>
          <button
            className="min-w-[200px] rounded-full border border-white/10 bg-transparent px-8 py-4 font-semibold text-gray-300 transition-all duration-300 hover:border-orange-400 hover:bg-white/5 hover:text-white hover:shadow-[0_0_20px_rgba(249,115,22,0.2)] active:scale-95"
            onClick={() => navigate('/docs/api')}
          >
            View API
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-16 animate-fade-in-up" style={{ animation: 'fade-in-up 0.6s ease-out' }}>
            <h2 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
              Why <span className="bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">EmberKit</span>?
            </h2>
            <div className="mb-6 h-1 w-24 rounded-full bg-gradient-to-r from-orange-500 to-orange-700 transform origin-left transition-all duration-700" style={{ transform: 'scaleX(1)' }} />
            <p className="max-w-2xl text-lg text-gray-400">
              Everything you need to build fast, lightweight web applications without the bloat.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: <IconZap size={28} />, title: 'Built for Speed', desc: 'SSR and pre-rendered HTML for fast TTFB and paint. Targeted signal updates — no full-tree client re-renders.' },
              { icon: <IconPackage size={28} />, title: 'Minimal Weight', desc: 'Sub-10KB runtime goal, tree-shakeable. Static pages can ship zero framework JavaScript.' },
              { icon: <IconTarget size={28} />, title: 'Zero JS Default', desc: 'Only interactive regions hydrate. Static content stays pure HTML.' },
              { icon: <IconType size={28} />, title: 'TypeScript First', desc: 'File-based routes, typed params, and JSX with @emberkit/core.' },
            ].map((f, i) => (
              <div 
                key={f.title}
                className="group rounded-2xl border border-white/5 bg-white/[0.02] p-8 transition-all duration-500 hover:border-orange-500/40 hover:bg-white/[0.04] hover:shadow-[0_0_40px_rgba(249,115,22,0.08)] hover:-translate-y-1 animate-fade-in-up"
                style={{ 
                  animation: `fade-in-up 0.6s ease-out ${100 + i * 100}ms forwards`,
                  opacity: 0
                }}
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/15 to-orange-700/10 text-orange-400 transition-all duration-300 group-hover:scale-110 group-hover:text-orange-300">
                  {f.icon}
                </div>
                <h3 className="mb-2 text-lg font-bold text-white transition-colors duration-300 group-hover:text-orange-300">{f.title}</h3>
                <p className="text-sm leading-relaxed text-gray-400 transition-colors duration-300 group-hover:text-gray-300">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Code Preview Section */}
      <section className="relative z-10 py-24">
        <div className="mx-auto max-w-4xl px-6 animate-fade-in-up" style={{ animation: 'fade-in-up 0.6s ease-out' }}>
          <div className="overflow-hidden rounded-2xl border border-white/5 bg-[#0d1117] shadow-2xl transition-all duration-500 hover:border-orange-500/20 hover:shadow-[0_0_50px_rgba(249,115,22,0.1)]">
            <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3 bg-white/[0.01]">
              <div className="h-3 w-3 rounded-full bg-red-500/80 transition-all duration-300 hover:scale-125" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/80 transition-all duration-300 hover:scale-125" />
              <div className="h-3 w-3 rounded-full bg-green-500/80 transition-all duration-300 hover:scale-125" />
              <span className="ml-3 text-xs font-medium text-gray-400 transition-colors duration-300">counter.tsx</span>
            </div>
            <CodeBlock code={`import { createSignal } from '@emberkit/core';

function Counter() {
  const [count, setCount] = createSignal(0);

  return (
  <div>
    <span data-ek-bind={count}>{count()}</span>
    <button type="button" onClick={() => setCount((n) => n + 1)}>+</button>
  </div>
  );
}`} language="tsx" />
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              { label: 'TTFB', value: 'HTML first', color: 'text-emerald-400' },
              { label: 'Runtime', value: '~8KB goal', color: 'text-orange-400' },
              { label: 'Client JS', value: 'selective', color: 'text-amber-400' },
            ].map((s, i) => (
              <div 
                key={s.label}
                className="rounded-xl border border-white/5 bg-white/[0.02] p-6 text-center transition-all duration-500 hover:border-orange-500/30 hover:bg-white/[0.04] hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(249,115,22,0.08)] animate-fade-in-up"
                style={{ 
                  animation: `fade-in-up 0.6s ease-out ${200 + i * 100}ms forwards`,
                  opacity: 0
                }}
              >
                <div className={`text-3xl font-bold transition-all duration-300 ${s.color}`}>{s.value}</div>
                <div className="mt-1 text-sm text-gray-400 transition-colors duration-300">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24 text-center">
        <div className="mx-auto max-w-2xl px-6 animate-fade-in-up" style={{ animation: 'fade-in-up 0.6s ease-out' }}>
          <h2 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
            Ready to build?
          </h2>
          <p className="mb-8 text-lg text-gray-400 transition-colors duration-300 hover:text-gray-300">
            Fast by design: server HTML, pre-rendered static routes, and hydration only where you need interactivity.
          </p>
          <button
            className="rounded-full bg-gradient-to-r from-orange-500 to-orange-700 px-8 py-4 text-xl font-bold text-white shadow-lg transition-all duration-300 hover:scale-[1.03] hover:from-orange-400 hover:to-orange-500 hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] active:scale-95"
            onClick={() => navigate('/docs/quick-start')}
          >
            Read the Quick Start →
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
