export const saasTemplate: Record<string, string> = {
  "package.json": `{
  "name": "{{name}}",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "emberkit dev",
    "build": "emberkit build",
    "preview": "emberkit preview"
  },
  "dependencies": {
    "@emberkit/core": "^0.2.4",
    "@emberkit/ui": "^0.2.3"
  },
  "devDependencies": {
    "@emberkit/cli": "^0.2.4",
    "typescript": "^5.7.0",
    "vite": "^6.0.0",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/vite": "^4.0.0"
  }
}`,

  "tsconfig.json": `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "jsxImportSource": "@emberkit/core",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}`,

  "vite.config.ts": `import { defineConfig } from 'vite';
import { emberkitVitePlugin } from '@emberkit/core/vite-plugin';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [emberkitVitePlugin(), tailwindcss()],
  server: {
    port: 3000,
    host: 'localhost',
  },
  esbuild: {
    jsxImportSource: '@emberkit/core',
  },
});`,

  "index.html": `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{name}}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
</head>
<body id="app">
  <script type="module" src="/src/index.tsx"></script>
</body>
</html>`,

  "src/index.tsx": `import { render } from '@emberkit/core';
import { routes } from 'virtual:emberkit-routes';
import App from './routes/_layout';
import './styles.css';

const root = document.getElementById('app');

if (root) {
  try {
    render(App, root, { routes });
  } catch (error) {
    console.error('[entry] Render error:', error);
  }
}`,

  "src/styles.css": `@import "tailwindcss";

@theme {
  --color-brand-50: #eff6ff;
  --color-brand-100: #dbeafe;
  --color-brand-200: #bfdbfe;
  --color-brand-300: #93c5fd;
  --color-brand-400: #60a5fa;
  --color-brand-500: #3b82f6;
  --color-brand-600: #2563eb;
  --color-brand-700: #1d4ed8;
  --color-brand-800: #1e40af;
  --color-brand-900: #1e3a8a;
  --font-sans: 'Inter', system-ui, sans-serif;
}

body {
  @apply bg-white text-slate-900 font-sans;
}

a {
  @apply text-inherit no-underline;
}`,

  "src/routes/_layout.tsx": `import type { RouteComponent } from '@emberkit/core';
import { Head } from '@emberkit/core';

const Layout: RouteComponent = ({ children }) => {
  return (
    <>
      <Head>
        <title>{{name}}</title>
        <meta name="description" content="A modern SaaS application built with EmberKit" />
      </Head>
      <div className="min-h-screen flex flex-col">
        <header className="border-b border-slate-200 sticky top-0 bg-white/80 backdrop-blur z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <span className="text-2xl">&#9889;</span>
              <span className="text-xl font-bold text-brand-600">{{name}}</span>
            </a>
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
              <a href="/#features" className="hover:text-brand-600">Features</a>
              <a href="/#pricing" className="hover:text-brand-600">Pricing</a>
              <a href="/about" className="hover:text-brand-600">About</a>
            </nav>
            <div className="flex items-center gap-4">
              <a href="/login" className="text-sm font-medium text-slate-600 hover:text-brand-600">Sign in</a>
              <a href="/signup" className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-lg transition-colors">
                Get Started
              </a>
            </div>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-slate-200 bg-slate-50 py-12">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="/#features" className="hover:text-brand-600">Features</a></li>
                <li><a href="/#pricing" className="hover:text-brand-600">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="/about" className="hover:text-brand-600">About</a></li>
                <li><a href="/blog" className="hover:text-brand-600">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="/privacy" className="hover:text-brand-600">Privacy</a></li>
                <li><a href="/terms" className="hover:text-brand-600">Terms</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="/docs" className="hover:text-brand-600">Docs</a></li>
                <li><a href="/contact" className="hover:text-brand-600">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-6 mt-8 pt-8 border-t border-slate-200 text-center text-sm text-slate-500">
            <p>&copy; 2026 {{name}}. Built with EmberKit.</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Layout;`,

  "src/routes/index.tsx": `import type { RouteComponent } from '@emberkit/core';
import { signal } from '@emberkit/core';
import { Button, Card, Badge } from '@emberkit/ui';

const HomePage: RouteComponent = () => {
  const annual = signal(false);

  const features = [
    { icon: '&#9889;', title: 'Lightning Fast', desc: 'Sub-10KB runtime with tree-shakeable architecture' },
    { icon: '&#128272;', title: 'Secure by Default', desc: 'Built-in security best practices and protections' },
    { icon: '&#128200;', title: 'Analytics Built-in', desc: 'Track user behavior without third-party scripts' },
    { icon: '&#127758;', title: 'Global CDN', desc: 'Deploy to the edge for minimal latency worldwide' },
    { icon: '&#128268;', title: 'Real-time Sync', desc: 'WebSocket support for live collaboration' },
    { icon: '&#9881;', title: 'Customizable', desc: 'Extend everything with our plugin system' },
  ];

  const plans = [
    {
      name: 'Starter',
      price: annual.value ? '$0' : '$0',
      period: annual.value ? '/year' : '/month',
      desc: 'Perfect for side projects',
      features: ['1 user', '5 projects', '1GB storage', 'Community support'],
      cta: 'Get Started Free',
      popular: false,
    },
    {
      name: 'Pro',
      price: annual.value ? '$199' : '$19',
      period: annual.value ? '/year' : '/month',
      desc: 'For growing teams',
      features: ['10 users', 'Unlimited projects', '50GB storage', 'Priority support', 'Analytics', 'API access'],
      cta: 'Start Free Trial',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      desc: 'For large organizations',
      features: ['Unlimited users', 'Unlimited everything', 'SSO & SAML', 'Dedicated support', 'SLA guarantee', 'Custom integrations'],
      cta: 'Contact Sales',
      popular: false,
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-white py-24">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <Badge variant="primary" className="mb-6">Now in Public Beta</Badge>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
            Build faster with {' '}
            <span className="bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent">{{name}}</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10">
            The modern SaaS platform that helps teams ship products faster.
            Stop reinventing the wheel and focus on what matters.
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="primary" size="lg">Start Free Trial</Button>
            <Button variant="secondary" size="lg">Watch Demo</Button>
          </div>
          <p className="mt-4 text-sm text-slate-500">No credit card required &middot; 14-day free trial</p>
        </div>
      </section>

      {/* Logos */}
      <section className="py-12 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm font-medium text-slate-500 mb-8">Trusted by teams at</p>
          <div className="flex justify-center gap-12 opacity-50 grayscale">
            {['Acme', 'Globex', 'Initech', 'Umbrella', 'Stark'].map((name) => (
              <span key={name} className="text-xl font-bold text-slate-400">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything you need</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Powerful features to help your team build, ship, and scale.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f) => (
              <Card key={f.title} padding="lg" className="hover:border-brand-300 transition-colors">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-slate-600">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-lg text-slate-600 mb-8">Choose the plan that works for your team</p>
            <div className="inline-flex items-center gap-3 p-1 bg-white rounded-lg border border-slate-200">
              <button
                className={\`px-4 py-2 text-sm font-medium rounded-md transition-colors \$\{!annual.value ? 'bg-brand-600 text-white' : 'text-slate-600'\}\`}
                onClick={() => { annual.value = false; }}
              >
                Monthly
              </button>
              <button
                className={\`px-4 py-2 text-sm font-medium rounded-md transition-colors \$\{annual.value ? 'bg-brand-600 text-white' : 'text-slate-600'\}\`}
                onClick={() => { annual.value = true; }}
              >
                Annual <span className="text-brand-600 ml-1 font-semibold">-20%</span>
              </button>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                padding="lg"
                className={\`relative \$\{plan.popular ? 'border-brand-500 shadow-lg' : ''\}\`}
              >
                {plan.popular && (
                  <Badge variant="primary" className="absolute -top-3 left-6">Most Popular</Badge>
                )}
                <h3 className="text-lg font-semibold mb-2">{plan.name}</h3>
                <p className="text-sm text-slate-600 mb-4">{plan.desc}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-slate-600">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <span className="text-green-500">&#10003;</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={plan.popular ? 'primary' : 'secondary'}
                  className="w-full"
                >
                  {plan.cta}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-brand-600 text-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-lg text-brand-100 mb-8">
            Join thousands of teams already using {{name}}.
          </p>
          <Button variant="secondary" size="lg" className="bg-white text-brand-600 hover:bg-brand-50">
            Start Free Trial
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;`,

  "src/routes/login.tsx": `import type { RouteComponent } from '@emberkit/core';
import { Head } from '@emberkit/core';
import { Button, Input, Card } from '@emberkit/ui';
import { signal } from '@emberkit/core';

const LoginPage: RouteComponent = () => {
  const email = signal('');
  const password = signal('');
  const error = signal<string | null>(null);

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    error.value = null;

    if (!email.value || !password.value) {
      error.value = 'Please fill in all fields';
      return;
    }

    // Handle login
  };

  return (
    <>
      <Head>
        <title>Sign In - {{name}}</title>
      </Head>
      <div className="min-h-[80vh] flex items-center justify-center px-6">
        <Card padding="xl" className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">Welcome back</h1>
            <p className="text-slate-600">Sign in to your account</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email.value}
              onInput={(e) => { email.value = e.currentTarget.value; }}
            />
            <Input
              label="Password"
              type="password"
              placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
              value={password.value}
              onInput={(e) => { password.value = e.currentTarget.value; }}
            />
            {error.value && (
              <p className="text-red-500 text-sm">{error.value}</p>
            )}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                Remember me
              </label>
              <a href="/forgot-password" className="text-brand-600 hover:underline">Forgot password?</a>
            </div>
            <Button variant="primary" className="w-full">Sign In</Button>
          </form>
          <p className="text-center text-sm text-slate-600 mt-6">
            Don't have an account? <a href="/signup" className="text-brand-600 font-medium hover:underline">Sign up</a>
          </p>
        </Card>
      </div>
    </>
  );
};

export default LoginPage;`,

  "src/routes/signup.tsx": `import type { RouteComponent } from '@emberkit/core';
import { Head } from '@emberkit/core';
import { Button, Input, Card } from '@emberkit/ui';
import { signal } from '@emberkit/core';

const SignupPage: RouteComponent = () => {
  const name = signal('');
  const email = signal('');
  const password = signal('');
  const error = signal<string | null>(null);

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    error.value = null;

    if (!name.value || !email.value || !password.value) {
      error.value = 'Please fill in all fields';
      return;
    }

    // Handle signup
  };

  return (
    <>
      <Head>
        <title>Sign Up - {{name}}</title>
      </Head>
      <div className="min-h-[80vh] flex items-center justify-center px-6">
        <Card padding="xl" className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">Create an account</h1>
            <p className="text-slate-600">Start your 14-day free trial</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="John Doe"
              value={name.value}
              onInput={(e) => { name.value = e.currentTarget.value; }}
            />
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email.value}
              onInput={(e) => { email.value = e.currentTarget.value; }}
            />
            <Input
              label="Password"
              type="password"
              placeholder="8+ characters"
              value={password.value}
              onInput={(e) => { password.value = e.currentTarget.value; }}
            />
            {error.value && (
              <p className="text-red-500 text-sm">{error.value}</p>
            )}
            <p className="text-xs text-slate-500">
              By signing up, you agree to our {' '}
              <a href="/terms" className="text-brand-600 hover:underline">Terms</a> {' '}
              and {' '}
              <a href="/privacy" className="text-brand-600 hover:underline">Privacy Policy</a>
            </p>
            <Button variant="primary" className="w-full">Create Account</Button>
          </form>
          <p className="text-center text-sm text-slate-600 mt-6">
            Already have an account? <a href="/login" className="text-brand-600 font-medium hover:underline">Sign in</a>
          </p>
        </Card>
      </div>
    </>
  );
};

export default SignupPage;`,

  "src/routes/about.tsx": `import type { RouteComponent } from '@emberkit/core';
import { Head } from '@emberkit/core';

const AboutPage: RouteComponent = () => {
  return (
    <>
      <Head>
        <title>About - {{name}}</title>
      </Head>
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-6">About {{name}}</h1>
        <div className="prose prose-slate">
          <p class="text-lg text-slate-600 mb-6">
            We're on a mission to make software development faster and more enjoyable.
            Our platform provides everything you need to build, deploy, and scale modern web applications.
          </p>
          <h2 class="text-2xl font-bold mt-8 mb-4">Our Story</h2>
          <p class="text-slate-600 mb-4">
            Founded in 2026, {{name}} was born from the frustration of dealing with complex,
            bloated frameworks. We believe in simplicity, performance, and developer experience.
          </p>
          <h2 class="text-2xl font-bold mt-8 mb-4">Values</h2>
          <ul class="list-disc pl-6 space-y-2 text-slate-600">
            <li>Developer experience first</li>
            <li>Performance is a feature</li>
            <li>Simplicity over complexity</li>
            <li>Open and transparent</li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default AboutPage;`,
};