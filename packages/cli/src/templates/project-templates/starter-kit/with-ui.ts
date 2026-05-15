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

export const withUiTemplate: Record<string, string> = {
  "package.json": buildPackageJson({ hasTailwind: true, hasUI: true }),
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
  --font-family-sans: 'Inter', system-ui, sans-serif;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fade-in-down {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes pulse-glow {
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.05); }
}

body {
  @apply bg-[#0b0f19] text-slate-200 font-sans;
}

a {
  @apply text-inherit no-underline;
}

.animate-float { animation: float 6s ease-in-out infinite; }
.animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
.animate-fade-in-down { animation: fade-in-down 0.6s ease-out forwards; }
.animate-pulse-glow { animation: pulse-glow 4s ease-in-out infinite; }`,

  "src/routes/_layout.tsx": `import type { RouteComponent } from '@emberkit/core';
import { Head } from '@emberkit/core';
import { DefaultLayout } from '@emberkit/ui';

const Layout: RouteComponent = ({ children }) => {
  return (
    <>
      <Head>
        <title>{{name}}</title>
        <meta name="description" content="Built with EmberKit UI" />
      </Head>
      <div className="relative min-h-screen">
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-ember-500/10 blur-[120px] animate-pulse-glow" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-amber-500/5 blur-[120px] animate-pulse-glow" style={{ animationDelay: '2s' }} />
        </div>
        <DefaultLayout
          logo={
            <span className="flex items-center gap-2">
              <span className="text-2xl animate-float">&#128293;</span>
              <span className="font-bold text-xl bg-gradient-to-r from-ember-400 to-ember-600 bg-clip-text text-transparent">{{name}}</span>
            </span>
          }
          navItems={[
            { label: 'Home', href: '/' },
            { label: 'About', href: '/about' },
            { label: 'Docs', href: 'https://emberkit.dev/docs', external: true },
          ]}
        >
          {children}
        </DefaultLayout>
      </div>
    </>
  );
};

export default Layout;`,

  "src/routes/index.tsx": `import type { RouteComponent } from '@emberkit/core';
import { Button, Card, Heading, Text, Badge, Input } from '@emberkit/ui';
import { signal } from '@emberkit/core';

const HomePage: RouteComponent = () => {
  const email = signal('');
  const activeTab = signal('buttons');

  return (
    <div className="relative space-y-24">
      {/* Hero */}
      <section className="relative text-center py-20">
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-ember-500/15 blur-[150px] animate-pulse-glow" />

        <div className="relative z-10 animate-fade-in-down">
          <Badge variant="primary" className="mb-6 inline-flex">
            &#10024; Built with EmberKit UI
          </Badge>
          <Heading level="h1" size="4xl" weight="bold" className="mb-6">
            Welcome to {' '}
            <span className="bg-gradient-to-r from-ember-400 via-ember-500 to-amber-500 bg-clip-text text-transparent">
              {{name}}
            </span>
          </Heading>
          <Text size="xl" color="muted" className="max-w-2xl mx-auto mb-10">
            A modern starter template with EmberKit UI components and Tailwind CSS.
            Build beautiful interfaces with our pre-built component library.
          </Text>
          <div className="flex gap-4 justify-center">
            <Button variant="primary" size="lg" className="shadow-lg shadow-ember-500/20 hover:shadow-ember-500/40 transition-shadow">
              Get Started
            </Button>
            <Button variant="secondary" size="lg">
              View Docs &#8594;
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section>
        <Heading level="h2" size="2xl" weight="semibold" className="mb-2 text-center">
          Why EmberKit?
        </Heading>
        <Text color="muted" className="text-center mb-10 max-w-lg mx-auto">
          Everything you need to build fast, beautiful web applications.
        </Text>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: '&#9889;', title: 'Lightning Fast', desc: 'Sub-10KB runtime with tree-shakeable architecture' },
            { icon: '&#128303;', title: 'TypeScript First', desc: 'Full type safety with intelligent autocomplete' },
            { icon: '&#128726;', title: 'File-Based Routing', desc: 'Routes automatically created from your file structure' },
          ].map((f, i) => (
            <Card key={f.title} padding="lg" className="relative group hover:border-ember-500/50 transition-all duration-300 hover:-translate-y-1" style={{ animationDelay: \`\${i * 100}ms\` }}>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-ember-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-ember-500/10 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <Heading level="h3" size="lg" weight="semibold" className="mb-2">
                  {f.title}
                </Heading>
                <Text color="muted">{f.desc}</Text>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Component Showcase */}
      <section>
        <Heading level="h2" size="2xl" weight="semibold" className="mb-2 text-center">
          UI Components
        </Heading>
        <Text color="muted" className="text-center mb-8">
          Explore our pre-built component library.
        </Text>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1 rounded-lg bg-slate-800/50 border border-slate-700/50">
            {[
              { id: 'buttons', label: 'Buttons' },
              { id: 'cards', label: 'Cards' },
              { id: 'forms', label: 'Forms' },
            ].map((tab) => (
              <button
                key={tab.id}
                className={\`px-4 py-2 text-sm font-medium rounded-md transition-all \${activeTab.value === tab.id ? 'bg-ember-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}\`}
                onClick={() => { activeTab.value = tab.id; }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab.value === 'buttons' && (
          <Card padding="xl" className="max-w-2xl mx-auto">
            <div className="text-center mb-6">
              <Badge variant="primary" className="mb-2">Buttons</Badge>
              <Heading level="h3" size="lg" weight="semibold">Button Variants</Heading>
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="primary" size="sm">Small</Button>
              <Button variant="secondary" size="lg">Large</Button>
            </div>
            <div className="mt-6 pt-6 border-t border-slate-700/50">
              <Heading level="h4" size="sm" weight="semibold" className="mb-3 text-slate-400">With Icons</Heading>
              <div className="flex flex-wrap gap-3 justify-center">
                <Button variant="primary">&#9889; Get Started</Button>
                <Button variant="secondary">Learn More &#8594;</Button>
                <Button variant="ghost">&#10084; Like</Button>
              </div>
            </div>
          </Card>
        )}

        {activeTab.value === 'cards' && (
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <Card padding="lg" className="hover:border-ember-500/50 transition-colors">
              <Badge variant="success" className="mb-3">Analytics</Badge>
              <Heading level="h3" size="lg" weight="semibold" className="mb-2">
                Revenue Growth
              </Heading>
              <div className="text-3xl font-bold text-ember-400 mb-1">$45,231</div>
              <Text color="muted" className="text-sm">+20.1% from last month</Text>
              <div className="mt-4 h-2 rounded-full bg-slate-700 overflow-hidden">
                <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-ember-500 to-amber-500" />
              </div>
            </Card>
            <Card padding="lg" className="hover:border-ember-500/50 transition-colors">
              <Badge variant="info" className="mb-3">Users</Badge>
              <Heading level="h3" size="lg" weight="semibold" className="mb-2">
                Active Users
              </Heading>
              <div className="text-3xl font-bold text-blue-400 mb-1">2,338</div>
              <Text color="muted" className="text-sm">+15.3% from last month</Text>
              <div className="mt-4 h-2 rounded-full bg-slate-700 overflow-hidden">
                <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" />
              </div>
            </Card>
          </div>
        )}

        {activeTab.value === 'forms' && (
          <Card padding="xl" className="max-w-md mx-auto">
            <div className="text-center mb-6">
              <Badge variant="info" className="mb-2">Forms</Badge>
              <Heading level="h3" size="lg" weight="semibold">Newsletter Signup</Heading>
            </div>
            <div className="space-y-4">
              <Input
                label="Name"
                placeholder="John Doe"
              />
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={email.value}
                onChange={(e) => { email.value = e.currentTarget.value; }}
              />
              <Button variant="primary" className="w-full shadow-lg shadow-ember-500/20">
                Subscribe &#10148;
              </Button>
            </div>
          </Card>
        )}
      </section>

      {/* CTA */}
      <section className="relative py-20">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="w-[500px] h-[200px] rounded-full bg-ember-500/10 blur-[100px]" />
        </div>
        <div className="relative z-10 text-center">
          <Heading level="h2" size="2xl" weight="semibold" className="mb-4">
            Ready to build something amazing?
          </Heading>
          <Text color="muted" className="max-w-xl mx-auto mb-8">
            Start building your next project with EmberKit's powerful components and TypeScript-first API.
          </Text>
          <Button variant="primary" size="lg" className="shadow-lg shadow-ember-500/25 hover:shadow-ember-500/40 transition-shadow">
            Create Project &#10148;
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;`,

  "src/routes/about.tsx": `import type { RouteComponent } from '@emberkit/core';
import { Head } from '@emberkit/core';
import { Heading, Text, Button, Card, Badge } from '@emberkit/ui';

const AboutPage: RouteComponent = () => {
  return (
    <>
      <Head>
        <title>About - {{name}}</title>
      </Head>
      <div className="max-w-3xl mx-auto py-12 space-y-12">
        {/* Header */}
        <div className="text-center">
          <Badge variant="primary" className="mb-4 inline-flex">About</Badge>
          <Heading level="h1" size="3xl" weight="bold">
            About {' '}
            <span className="bg-gradient-to-r from-ember-400 to-ember-600 bg-clip-text text-transparent">{{name}}</span>
          </Heading>
        </div>

        {/* Description */}
        <Card padding="xl" className="border-ember-500/20">
          <Text size="lg" color="muted" className="leading-relaxed">
            This project was created with EmberKit and the UI component library.
            It demonstrates how to build modern, beautiful interfaces with our
            pre-built components and Tailwind CSS.
          </Text>
        </Card>

        {/* Features */}
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { icon: '&#128268;', title: 'TypeScript-first', desc: 'Full type safety with intelligent autocomplete' },
            { icon: '&#127912;', title: 'UI Components', desc: 'Pre-built atoms, molecules, and organisms' },
            { icon: '&#127752;', title: 'Tailwind CSS', desc: 'Utility-first styling with custom theme' },
            { icon: '&#128726;', title: 'File Routing', desc: 'Automatic routes from your file structure' },
          ].map((f) => (
            <Card key={f.title} padding="lg" className="hover:border-ember-500/50 transition-all hover:-translate-y-0.5">
              <div className="text-2xl mb-3">{f.icon}</div>
              <Heading level="h3" size="md" weight="semibold" className="mb-1">
                {f.title}
              </Heading>
              <Text color="muted" size="sm">{f.desc}</Text>
            </Card>
          ))}
        </div>

        {/* Tech Stack */}
        <Card padding="xl">
          <Heading level="h3" size="lg" weight="semibold" className="mb-4 text-center">
            Tech Stack
          </Heading>
          <div className="flex flex-wrap gap-2 justify-center">
            {['EmberKit', 'TypeScript', 'Tailwind CSS', 'Vite', 'JSX'].map((tech) => (
              <Badge key={tech} variant="primary" className="px-3 py-1.5">
                {tech}
              </Badge>
            ))}
          </div>
        </Card>

        {/* Back */}
        <div className="text-center">
          <Button variant="secondary">
            &#8592; Back to Home
          </Button>
        </div>
      </div>
    </>
  );
};

export default AboutPage;`,
};
