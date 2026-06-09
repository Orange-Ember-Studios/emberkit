import {
  buildPackageJson,
  buildTsConfig,
  buildViteConfig,
  buildEmberkitConfig,
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
  "emberkit.config.ts": buildEmberkitConfig('hybrid'),
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

@keyframes fade-in-down {
  from { opacity: 0; transform: translateY(-20px); }
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
.animate-fade-in-down { animation: fade-in-down 0.6s ease-out forwards; }
.animate-pulse-glow { animation: pulse-glow 4s ease-in-out infinite; }`,

  "src/routes/_layout.tsx": `import type { RouteComponent } from '@emberkit/core';
import { Head } from '@emberkit/core';

const Layout: RouteComponent = ({ children }) => {
  return (
    <>
      <Head>
        <title>{{name}}</title>
        <meta name="description" content="Built with EmberKit UI" />
      </Head>
      <div className="relative min-h-screen flex flex-col">
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-ember-500/10 blur-[120px] animate-pulse-glow" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-amber-500/5 blur-[120px] animate-pulse-glow" style={{ animationDelay: '2s' }} />
        </div>

        <header className="relative z-50 border-b border-slate-800/50 bg-[#0b0f19]/80 backdrop-blur-xl sticky top-0">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2 group">
              <span className="text-2xl animate-float">&#128293;</span>
              <span className="text-xl font-bold bg-gradient-to-r from-ember-400 to-ember-500 bg-clip-text text-transparent">{{name}}</span>
            </a>
            <nav className="flex items-center gap-8">
              <a href="/" className="text-slate-400 hover:text-ember-500 font-medium transition-colors">Home</a>
              <a href="/about" className="text-slate-400 hover:text-ember-500 font-medium transition-colors">About</a>
              <a href="https://emberkit.orangeember.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-ember-500 font-medium transition-colors">
                Docs <span className="text-xs">&#8599;</span>
              </a>
            </nav>
          </div>
        </header>

        <main className="relative z-10 flex-1">
          <div className="max-w-6xl mx-auto px-6 py-12">
            {children}
          </div>
        </main>

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
import {
  Button,
  Card,
  Heading,
  Text,
  Badge,
  Tabs,
  Alert,
  Icon,
} from '@emberkit/ui';

const HomePage: RouteComponent = () => {
  const [activeTab, setActiveTab] = createSignal('features');

  const features = [
    { icon: 'zap' as const, title: 'Lightning Fast', desc: 'Sub-10KB runtime with tree-shakeable architecture' },
    { icon: 'book' as const, title: 'TypeScript First', desc: 'Full type safety with intelligent autocomplete' },
    { icon: 'folder' as const, title: 'File-Based Routing', desc: 'Routes automatically created from your file structure' },
  ];

  const components = [
    { name: 'Button', desc: 'Multiple variants and sizes for all use cases' },
    { name: 'Card', desc: 'Flexible container component with padding options' },
    { name: 'Badge', desc: 'Status indicators with different variants' },
    { name: 'Alert', desc: 'Notification component for important messages' },
    { name: 'Tabs', desc: 'Organized content switching interface' },
    { name: 'Input', desc: 'Styled form input with validation support' },
  ];

  return (
    <div className="relative space-y-24">
      {/* Hero Section */}
      <section className="relative text-center py-20">
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-ember-500/15 blur-[150px] animate-pulse-glow" />
        <div className="relative z-10 space-y-6 animate-fade-in-down">
          <Badge variant="primary" className="inline-flex items-center gap-2">
            <Icon name="emberkit" size={14} className="text-amber-400 shrink-0 drop-shadow-[0_0_6px_rgba(251,191,36,0.45)]" />
            Welcome to {{name}}
          </Badge>
          <Heading level="h1" size="4xl" weight="bold">
            Built with EmberKit <span className="bg-gradient-to-r from-ember-400 via-ember-500 to-amber-500 bg-clip-text text-transparent">UI System</span>
          </Heading>
          <Text size="xl" color="muted" className="max-w-2xl mx-auto">
            A modern, component-driven template using the EmberKit design system. Beautiful, accessible, and production-ready.
          </Text>
          <div className="flex gap-4 justify-center flex-wrap pt-4">
            <Button variant="primary" size="lg">
              Get Started
            </Button>
            <Button variant="secondary" size="lg">
              View Docs →
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid using Cards */}
      <section>
        <Heading level="h2" size="2xl" weight="semibold" className="text-center mb-2">
          Why EmberKit?
        </Heading>
        <Text color="muted" className="text-center mb-12 max-w-lg mx-auto">
          Everything you need to build fast, beautiful web applications.
        </Text>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Card key={feature.title} padding="lg" className="relative group hover:border-ember-500/50 transition-all hover:-translate-y-1 cursor-pointer">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-ember-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative space-y-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-ember-400/20 via-fuchsia-500/10 to-cyan-500/10 text-ember-300 ring-1 ring-ember-400/25 shadow-[0_0_24px_rgba(236,72,153,0.12)]">
                  <Icon name={feature.icon} size={28} className="drop-shadow-[0_0_10px_rgba(249,115,22,0.35)]" />
                </div>
                <Heading level="h3" size="md" weight="semibold">
                  {feature.title}
                </Heading>
                <Text color="muted" size="sm">
                  {feature.desc}
                </Text>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Component Showcase with Tabs */}
      <section>
        <Heading level="h2" size="2xl" weight="semibold" className="text-center mb-2">
          Design System Components
        </Heading>
        <Text color="muted" className="text-center mb-8 max-w-lg mx-auto">
          Pre-built, accessible components ready to use in your project.
        </Text>

        <div className="space-y-8">
          {/* Buttons Section */}
          <Card padding="xl">
            <Heading level="h3" size="lg" weight="semibold" className="mb-6">
              Button Component
            </Heading>
            <div className="space-y-4">
              <Text color="muted" size="sm">
                The Button component comes in multiple variants and sizes for different use cases.
              </Text>
              <div className="flex flex-wrap gap-2 pt-4">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="primary" size="sm">Small</Button>
                <Button variant="secondary" size="lg">Large</Button>
              </div>
            </div>
          </Card>

          {/* Badge & Alert Section */}
          <Card padding="xl">
            <Heading level="h3" size="lg" weight="semibold" className="mb-6">
              Status Components
            </Heading>
            <div className="space-y-6">
              <div>
                <Text weight="semibold" className="mb-3">Badges</Text>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="primary">Primary</Badge>
                  <Badge variant="success">Success</Badge>
                  <Badge variant="warning">Warning</Badge>
                  <Badge variant="info">Info</Badge>
                </div>
              </div>
              <Alert variant="success">
                <span className="inline-flex items-start gap-2">
                  <Icon name="check" size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span>This is a success alert message. Use it to confirm important actions.</span>
                </span>
              </Alert>
              <Alert variant="info">
                <span className="inline-flex items-start gap-2">
                  <Icon name="info" size={18} className="text-sky-400 shrink-0 mt-0.5" />
                  <span>This is an info alert. Useful for displaying helpful information.</span>
                </span>
              </Alert>
            </div>
          </Card>

          {/* Components Grid */}
          <Card padding="xl">
            <Heading level="h3" size="lg" weight="semibold" className="mb-6">
              Available Components
            </Heading>
            <div className="grid md:grid-cols-2 gap-4">
              {components.map((comp) => (
                <div key={comp.name} className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50">
                  <Text weight="semibold" size="sm">{comp.name}</Text>
                  <Text color="muted" size="xs" className="mt-1">{comp.desc}</Text>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="w-[500px] h-[200px] rounded-full bg-ember-500/10 blur-[100px]" />
        </div>
        <Card padding="xl" className="relative z-10 max-w-2xl mx-auto text-center">
          <Heading level="h2" size="2xl" weight="semibold" className="mb-4">
            Ready to Build?
          </Heading>
          <Text color="muted" className="mb-8">
            Start building your next project with EmberKit's powerful components and TypeScript-first API.
          </Text>
          <div className="flex gap-4 justify-center">
            <Button variant="primary" size="lg">
              Create Project →
            </Button>
            <Button variant="secondary" size="lg">
              Learn More
            </Button>
          </div>
        </Card>
      </section>
    </div>
  );
};

export default HomePage;`,

  "src/routes/about.tsx": `import type { RouteComponent } from '@emberkit/core';
import { Head } from '@emberkit/core';
import { Heading, Text, Button, Card, Badge, Alert, Icon } from '@emberkit/ui';

const AboutPage: RouteComponent = () => {
  const features = [
    { icon: 'type' as const, title: 'TypeScript-first', desc: 'Full type safety with intelligent autocomplete' },
    { icon: 'grid' as const, title: 'UI Components', desc: 'Pre-built design system components' },
    { icon: 'zap' as const, title: 'Tailwind CSS', desc: 'Utility-first styling framework' },
    { icon: 'folder' as const, title: 'File Routing', desc: 'Automatic routes from file structure' },
  ];

  const techStack = ['EmberKit', 'TypeScript', 'Tailwind CSS', 'Vite', 'JSX', 'Design System'];

  return (
    <>
      <Head>
        <title>About - {{name}}</title>
      </Head>
      <div className="max-w-3xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge variant="primary" className="inline-block">
            About Us
          </Badge>
          <Heading level="h1" size="3xl" weight="bold">
            About <span className="bg-gradient-to-r from-ember-400 to-ember-600 bg-clip-text text-transparent">{{name}}</span>
          </Heading>
          <Text size="lg" color="muted" className="max-w-2xl mx-auto">
            A modern, component-driven project built with EmberKit and the UI design system.
          </Text>
        </div>

        {/* Description Card */}
        <Card padding="xl" className="border-ember-500/20">
          <Text size="lg" color="muted" className="leading-relaxed">
            This project demonstrates how to build modern, beautiful interfaces with EmberKit's pre-built components and Tailwind CSS.
            It showcases best practices in component-driven development, accessible design, and TypeScript-first architecture.
          </Text>
        </Card>

        {/* Features Grid */}
        <section>
          <Heading level="h2" size="xl" weight="semibold" className="mb-6">
            Key Features
          </Heading>
          <div className="grid sm:grid-cols-2 gap-4">
            {features.map((f) => (
              <Card key={f.title} padding="lg" className="hover:border-ember-500/50 transition-all hover:-translate-y-0.5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-ember-400/20 via-fuchsia-500/10 to-cyan-500/10 text-ember-300 ring-1 ring-ember-400/25 mb-3">
                  <Icon name={f.icon} size={24} className="drop-shadow-[0_0_8px_rgba(249,115,22,0.35)]" />
                </div>
                <Heading level="h3" size="md" weight="semibold" className="mb-1">
                  {f.title}
                </Heading>
                <Text color="muted" size="sm">{f.desc}</Text>
              </Card>
            ))}
          </div>
        </section>

        {/* Tech Stack */}
        <section>
          <Card padding="xl">
            <Heading level="h3" size="lg" weight="semibold" className="mb-6 text-center">
              Tech Stack
            </Heading>
            <div className="flex flex-wrap gap-2 justify-center">
              {techStack.map((tech) => (
                <Badge key={tech} variant="primary" className="px-3 py-1.5">
                  {tech}
                </Badge>
              ))}
            </div>
          </Card>
        </section>

        {/* Benefits Alert */}
        <Alert variant="success">
          <span className="inline-flex items-start gap-2">
            <Icon name="emberkit" size={18} className="text-amber-400 shrink-0 mt-0.5 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]" />
            <span><strong>Pro Tip:</strong> This template uses the EmberKit design system components. Check the component library documentation to learn about all available components and their capabilities.</span>
          </span>
        </Alert>

        {/* Back Button */}
        <div className="text-center pt-4">
          <Button variant="secondary">
            ← Back to Home
          </Button>
        </div>
      </div>
    </>
  );
};

export default AboutPage;`,
};
