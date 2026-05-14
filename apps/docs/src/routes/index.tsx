import type { RouteComponent } from '@emberkit/core';
import { IconZap, IconPackage, IconTarget, IconType, IconArrowRight } from '@emberkit/icons';
import { useNavigate } from '@emberkit/core';
import { CodeBlock } from '../components/code-block';

const HomePage: RouteComponent = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-[#0b0f19] text-gray-100 overflow-hidden">

      {/* Ambient glow blobs */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-orange-500/20 blur-[150px] animate-pulse" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full bg-amber-500/15 blur-[120px] animate-pulse [animation-delay:700ms]" />

      {/* Hero Section */}
      <section className="relative z-10 flex min-h-[85vh] flex-col items-center justify-center px-6 text-center">
        <div className="relative mb-10 h-24 w-24 animate-bounce" style={{ animationDuration: '3s' }}>
          <div className="absolute inset-0 animate-pulse rounded-full bg-orange-500/30 blur-2xl" />
          <span className="relative z-10 flex h-full w-full items-center justify-center text-6xl drop-shadow-[0_0_15px_rgba(249,115,22,0.6)]">🔥</span>
        </div>

        <span className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-orange-400 md:text-base animate-fade-in-down" style={{ animationDelay: '100ms', animation: 'fade-in-down 0.6s ease-out' }}>
          Minimalist &middot; TypeScript &middot; Zero JS by Default
        </span>

        <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-7xl lg:text-8xl animate-fade-in-down" style={{ animationDelay: '200ms', animation: 'fade-in-down 0.6s ease-out 200ms forwards', opacity: 0 }}>
          <span className="bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">EmberKit</span>
        </h1>

        <p className="mb-10 max-w-2xl text-lg leading-relaxed text-gray-300 md:text-2xl animate-fade-in-down" style={{ animationDelay: '300ms', animation: 'fade-in-down 0.6s ease-out 300ms forwards', opacity: 0 }}>
          The TypeScript-first JSX framework built for speed, minimal weight, and zero JavaScript by default.
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
              { icon: <IconZap size={28} />, title: 'Lightning Fast', desc: 'Sub-50ms SSR with streaming support. Optimized for performance from the ground up.' },
              { icon: <IconPackage size={28} />, title: 'Under 10KB', desc: 'Minimal runtime that is fully tree-shakeable. Pay only for what you use.' },
              { icon: <IconTarget size={28} />, title: 'Zero JS Default', desc: 'Only interactive elements receive hydration. Static content stays static.' },
              { icon: <IconType size={28} />, title: 'TypeScript First', desc: 'Full type safety with excellent IDE support. Catch errors before they happen.' },
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
            <CodeBlock code={`import { createSignal, render } from '@emberkit/core';

function Counter() {
  const [count, setCount] = createSignal(0);

  return (
    <button onClick={() => setCount(c => c + 1)}>
      Count: {count()}
    </button>
  );
}

render(<Counter />, document.body);`} language="tsx" />
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              { label: 'Runtime Size', value: '~8KB', color: 'text-orange-400' },
              { label: 'SSR Time', value: '<50ms', color: 'text-emerald-400' },
              { label: 'JS Shipped', value: '0 by default', color: 'text-amber-400' },
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
            Get started in minutes with file-based routing, signals, and zero-config builds.
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
