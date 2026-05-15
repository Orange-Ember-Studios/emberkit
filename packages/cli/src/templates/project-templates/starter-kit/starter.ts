import {
  buildPackageJson,
  buildTsConfig,
  buildViteConfig,
  buildIndexHtml,
  buildEntryFile,
  GITIGNORE,
} from "../_shared/base.js";

const INTER_FONT =
  "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap";

export const starterFiles: Record<string, string> = {
  "package.json": buildPackageJson({ hasTailwind: true }),
  "tsconfig.json": buildTsConfig(),
  "vite.config.ts": buildViteConfig(true),
  "index.html": buildIndexHtml({ fonts: [INTER_FONT] }),
  ".gitignore": GITIGNORE,

  "src/index.tsx": buildEntryFile({ hasLayout: true, hasCss: true }),

  "src/styles.css": `@import "tailwindcss";

@theme {
  --color-ember-50: #fff7ed;
  --color-ember-100: #ffedd5;
  --color-ember-200: #fed7aa;
  --color-ember-300: #fdba74;
  --color-ember-400: #fb923c;
  --color-ember-500: #f97316;
  --color-ember-600: #ea580c;
  --color-ember-700: #c2410c;
  --color-ember-800: #9a3412;
  --color-ember-900: #7c2d12;
  --font-sans: 'Inter', system-ui, sans-serif;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes pulse-glow {
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.05); }
}

body {
  @apply bg-[#0b0f19] text-slate-200 font-sans min-h-screen;
}

a {
  @apply text-inherit no-underline transition-colors;
}

.animate-float { animation: float 6s ease-in-out infinite; }
.animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
.animate-pulse-glow { animation: pulse-glow 4s ease-in-out infinite; }`,

  "src/routes/_layout.tsx": `import type { RouteComponent } from '@emberkit/core';
import { Head } from '@emberkit/core';

const Layout: RouteComponent = ({ children }) => {
  return (
    <>
      <Head>
        <title>{{name}}</title>
        <meta name="description" content="Built with EmberKit" />
      </Head>
      <div className="relative min-h-screen flex flex-col">
        {/* Ambient background */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-ember-500/10 blur-[120px] animate-pulse-glow" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-amber-500/5 blur-[120px] animate-pulse-glow" style={{ animationDelay: '2s' }} />
        </div>

        <header className="relative z-50 border-b border-slate-800/50 bg-[#0b0f19]/80 backdrop-blur-xl sticky top-0">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2 group">
              <span className="text-2xl animate-float">&#128293;</span>
              <span className="text-xl font-bold bg-gradient-to-r from-ember-400 to-ember-500 bg-clip-text text-transparent">
                {{name}}
              </span>
            </a>
            <nav className="flex items-center gap-6">
              <a href="/" className="text-slate-400 hover:text-ember-500 font-medium transition-colors">Home</a>
              <a href="/about" className="text-slate-400 hover:text-ember-500 font-medium transition-colors">About</a>
              <a href="https://emberkit.orangeember.com/docs" target="_blank" className="text-slate-400 hover:text-ember-500 font-medium transition-colors">
                Docs <span className="text-xs">&#8599;</span>
              </a>
            </nav>
          </div>
        </header>
        <main className="relative z-10 flex-1">{children}</main>
        <footer className="relative z-10 border-t border-slate-800/50 py-8 text-center text-sm text-slate-500">
          <p>Built with <a href="https://emberkit.orangeember.com" className="text-ember-500 hover:underline">EmberKit</a></p>
        </footer>
      </div>
    </>
  );
};

export default Layout;`,

  "src/routes/index.tsx": `import type { RouteComponent } from '@emberkit/core';
import { createSignal } from '@emberkit/core';

const HomePage: RouteComponent = () => {
  const [count, setCount] = createSignal(0);

  return (
    <div className="relative max-w-6xl mx-auto px-6 py-16 space-y-24">
      {/* Hero Section */}
      <section className="relative text-center space-y-6 animate-fade-in-down">
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-ember-500/10 blur-[120px] animate-pulse-glow" />
        <h1 className="relative z-10 text-5xl md:text-6xl font-extrabold tracking-tight">
          Welcome to <span className="bg-gradient-to-r from-ember-400 via-ember-500 to-amber-500 bg-clip-text text-transparent">{{name}}</span>
        </h1>
        <p className="relative z-10 text-xl text-slate-400 max-w-2xl mx-auto">
          A minimalist TypeScript-first JSX framework built for speed and simplicity.
          Get started in seconds with hot module replacement and zero-config routing.
        </p>
        <div className="relative z-10 flex gap-4 justify-center pt-4">
          <a href="/about" className="px-6 py-3 bg-ember-500 hover:bg-ember-600 text-white font-semibold rounded-lg transition-all hover:scale-105 shadow-lg shadow-ember-500/20">
            Learn More
          </a>
          <a href="https://emberkit.orangeember.com/docs" target="_blank" className="px-6 py-3 border border-slate-700 hover:border-ember-500 text-slate-300 hover:text-ember-500 font-semibold rounded-lg transition-all">
            Read Docs &#8594;
          </a>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid md:grid-cols-3 gap-6">
        {[
          { icon: '&#9889;', title: 'Lightning Fast', desc: 'Sub-10KB runtime with tree-shakeable architecture' },
          { icon: '&#128303;', title: 'TypeScript First', desc: 'Full type safety with intelligent autocomplete' },
          { icon: '&#128726;', title: 'File-Based Routing', desc: 'Routes automatically created from your file structure' },
        ].map((f, i) => (
          <div key={f.title} className="p-6 rounded-xl border border-slate-800 bg-slate-800/30 hover:border-ember-500/50 transition-all duration-300 hover:-translate-y-1 group animate-fade-in-up" style={{ animationDelay: \`\${i * 100}ms\` }}>
            <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">{f.icon}</div>
            <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
            <p className="text-slate-400">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Counter Demo */}
      <section className="relative p-8 rounded-3xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 text-center backdrop-blur-sm">
        <h2 className="text-2xl font-bold mb-6">Interactive Counter Demo</h2>
        <div className="flex items-center justify-center gap-6">
          <button
            className="w-12 h-12 rounded-lg bg-slate-800 border border-slate-700 hover:bg-ember-500 hover:border-ember-500 text-ember-500 hover:text-white text-xl transition-all hover:scale-110"
            onClick={() => setCount(c => c - 1)}
          >
            &#8722;
          </button>
          <span className="text-5xl font-bold tabular-nums min-w-[80px] text-amber-400" data-ek-bind={count}>{count()}</span>
          <button
            className="w-12 h-12 rounded-lg bg-slate-800 border border-slate-700 hover:bg-ember-500 hover:border-ember-500 text-ember-500 hover:text-white text-xl transition-all hover:scale-110"
            onClick={() => setCount(c => c + 1)}
          >
            +
          </button>
        </div>
        <p className="text-slate-500 mt-4 text-sm">Try clicking the buttons!</p>
      </section>

      <section className="text-center py-8">
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-ember-500/10 border border-ember-500/20 text-ember-400">
          <span className="w-2 h-2 rounded-full bg-ember-500 animate-pulse"></span>
          <span className="text-sm font-medium">Ready to build something amazing?</span>
        </div>
      </section>
    </div>
  );
};

export default HomePage;`,

  "src/routes/about.tsx": `import type { RouteComponent } from '@emberkit/core';
import { Head } from '@emberkit/core';

const AboutPage: RouteComponent = () => {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 space-y-12 animate-fade-in-up">
      <Head>
        <title>About - {{name}}</title>
      </Head>
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-6">About {{name}}</h1>
        <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto">
          EmberKit is a minimalist TypeScript-first JSX framework built for speed and simplicity.
          It combines the best of modern frontend development with a lightweight runtime.
        </p>
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: 'SPA & SSR', desc: 'Works in both modes' },
          { label: 'Zero Config', desc: 'Sensible defaults' },
          { label: 'HMR', desc: 'Hot module replacement' },
        ].map((f) => (
          <div key={f.label} className="p-4 rounded-xl bg-slate-800/30 border border-slate-800 hover:border-ember-500/50 transition-all hover:-translate-y-1 group">
            <span className="text-ember-500 text-sm font-semibold">{f.label}</span>
            <p className="text-slate-500 text-sm mt-1">{f.desc}</p>
          </div>
        ))}
      </div>
      <div className="text-center">
        <a href="/" className="inline-flex items-center gap-2 text-ember-500 hover:text-ember-400 font-medium transition-colors">
          &#8592; Back to Home
        </a>
      </div>
    </div>
  );
};

export default AboutPage;`,
};
