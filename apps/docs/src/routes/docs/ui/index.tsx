import type { RouteComponent } from '@emberkit/core';
import { createSignal } from '@emberkit/core';
import { IconZap, IconPackage, IconTarget, IconType } from '@emberkit/icons';
import { Button, Icon, Text, Heading, Badge, Input, Spinner } from '@emberkit/ui';
import { Card, FormField, Alert, Tabs, Modal, Select } from '@emberkit/ui';
import { DataTable, Pagination } from '@emberkit/ui';

const UI_PAGE_SECTIONS = [
  { id: 'atoms', label: 'Atoms' },
  { id: 'molecules', label: 'Molecules' },
  { id: 'organisms', label: 'Organisms' },
  { id: 'tokens', label: 'Design Tokens' },
] as const;

const UIContent: RouteComponent = () => {
  const [open, setOpen] = createSignal(false);
  const [tab, setTab] = createSignal('preview');
  const [page, setPage] = createSignal(1);
  const [count, setCount] = createSignal(0);
  return (
    <div class="min-h-screen bg-surface-50 text-surface-900">
      {/* Hero */}
        <div class="relative overflow-hidden border-b border-white/5 glass-card rounded-none">
        <div class="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary-500/15 blur-[120px]" />
        <div class="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-accent-500/15 blur-[100px]" />
        <div class="relative mx-auto max-w-5xl px-8 py-20">
          <Badge variant="accent" size="sm" className="mb-4">@emberkit/ui v0.1.0</Badge>
          <Heading level={1} className="mb-4">
            <span class="text-primary-400">@emberkit/ui</span> — Component Library
          </Heading>
          <Text size="lg" color="muted" className="mb-8 max-w-2xl">
            A dark-themed, high-contrast atomic design system built with EmberKit JSX and Tailwind 4. Inspired by Orange Ember Studios.
          </Text>
          <div class="flex flex-wrap gap-3">
            <Button variant="outline" size="lg" onClick={() => document.getElementById('atoms')?.scrollIntoView({ behavior: 'smooth' })}>
              Browse Components
            </Button>
          </div>

          {/* Install Command */}
          <div class="mt-10 glass rounded-2xl p-5">
            <Text size="xs" color="muted" className="mb-2 font-mono uppercase tracking-widest">Install</Text>
            <div class="flex items-center justify-between gap-4 bg-black/30 rounded-xl px-5 py-3.5 border border-white/5">
              <code class="text-sm text-primary-400 font-mono select-all">pnpm add @emberkit/ui</code>
              <button
                class="shrink-0 text-surface-500 hover:text-surface-200 transition-colors p-1"
                onClick={(e: MouseEvent) => {
                  navigator.clipboard.writeText('pnpm add @emberkit/ui');
                  const el = e.target as HTMLElement;
                  el.textContent = 'Copied!';
                  setTimeout(() => { el.textContent = 'Copy'; }, 1500);
                }}
                aria-label="Copy install command"
              >
                Copy
              </button>
            </div>
          </div>
          {/* Stats */}
          <div class="mt-12 grid grid-cols-3 gap-4 pt-8">
            {[
              { value: '4', label: 'Atomic Levels', icon: 'layers' as const },
              { value: '20+', label: 'Components', icon: 'grid' as const },
              { value: '90+', label: 'Icons', icon: 'package' as const },
            ].map((stat) => (
              <div key={stat.label} class="glass rounded-2xl p-5 text-center hover:scale-[1.03] transition-transform duration-200">
                <Icon name={stat.icon} size={24} className="mx-auto mb-2 text-primary-400" />
                <div class="text-2xl font-bold text-surface-900">{stat.value}</div>
                <Text size="sm" color="muted">{stat.label}</Text>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section Nav */}
      <div class="sticky top-0 z-10 border-b border-white/10 glass rounded-none">
        <div class="mx-auto flex max-w-5xl gap-6 overflow-x-auto px-8 py-3">
          {UI_PAGE_SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' })}
              class="whitespace-nowrap text-sm font-medium text-surface-500 hover:text-surface-900 transition-colors"
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div class="mx-auto max-w-5xl px-8 py-16 space-y-24">

        {/* ═══ ATOMS ═══ */}
        <section id="atoms">
          <div class="mb-10">
            <Badge variant="primary" className="mb-2">Layer 1</Badge>
            <Heading level={2}>Atoms</Heading>
            <Text color="muted" className="mt-2">Basic building blocks — the smallest UI primitives.</Text>
          </div>

          {/* Button */}
          <div class="mb-12 glass-card rounded-2xl p-7">
            <Heading level={4} className="mb-1">Button</Heading>
            <Text size="sm" color="muted" className="mb-6">Variants: primary, secondary, outline, ghost, danger</Text>
            <div class="flex flex-wrap gap-3">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
              <Button variant="primary" loading>Loading</Button>
              <Button variant="primary" disabled>Disabled</Button>
            </div>
          </div>

          {/* Icon */}
          <div class="mb-12 glass-card rounded-2xl p-7">
            <Heading level={4} className="mb-1">Icon</Heading>
            <Text size="sm" color="muted" className="mb-6">90+ icons from @emberkit/icons, accessible by name</Text>
            <div class="flex flex-wrap gap-4">
              <div class="flex flex-col items-center gap-1">
                <Icon name="zap" size={28} className="text-primary-400" />
                <Text size="xs" color="muted">zap</Text>
              </div>
              <div class="flex flex-col items-center gap-1">
                <Icon name="search" size={28} className="text-primary-400" />
                <Text size="xs" color="muted">search</Text>
              </div>
              <div class="flex flex-col items-center gap-1">
                <Icon name="home" size={28} className="text-primary-400" />
                <Text size="xs" color="muted">home</Text>
              </div>
              <div class="flex flex-col items-center gap-1">
                <Icon name="user" size={28} className="text-primary-400" />
                <Text size="xs" color="muted">user</Text>
              </div>
              <div class="flex flex-col items-center gap-1">
                <Icon name="settings" size={28} className="text-primary-400" />
                <Text size="xs" color="muted">settings</Text>
              </div>
              <div class="flex flex-col items-center gap-1">
                <Icon name="bell" size={28} className="text-primary-400" />
                <Text size="xs" color="muted">bell</Text>
              </div>
            </div>
          </div>

          {/* Text + Heading */}
          <div class="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div class="glass-card rounded-2xl p-7">
              <Heading level={4} className="mb-3">Text</Heading>
              <div class="space-y-2">
                <Text size="xs" color="muted">xs muted text</Text>
                <Text size="sm">sm default text</Text>
                <Text size="base">base default text</Text>
                <Text size="lg" weight="semibold">lg semibold text</Text>
                <Text color="primary">Primary colored text</Text>
                <Text color="error">Error colored text</Text>
              </div>
            </div>
            <div class="glass-card rounded-2xl p-7">
              <Heading level={4} className="mb-3">Heading</Heading>
              <div class="space-y-1">
                <Heading level={1}>h1. Heading</Heading>
                <Heading level={2}>h2. Heading</Heading>
                <Heading level={3}>h3. Heading</Heading>
                <Heading level={4}>h4. Heading</Heading>
                <Heading level={5}>h5. Heading</Heading>
                <Heading level={6}>h6. Heading</Heading>
              </div>
            </div>
          </div>

          {/* Badge */}
          <div class="mb-12 glass-card rounded-2xl p-7">
            <Heading level={4} className="mb-1">Badge</Heading>
            <Text size="sm" color="muted" className="mb-6">Semantic variants: default, success, warning, error, info, accent</Text>
            <div class="flex flex-wrap gap-3">
              <Badge>Default</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="error">Error</Badge>
              <Badge variant="info">Info</Badge>
              <Badge variant="accent">Accent</Badge>
            </div>
          </div>

          {/* Input */}
          <div class="mb-12 glass-card rounded-2xl p-7">
            <Heading level={4} className="mb-1">Input</Heading>
            <Text size="sm" color="muted" className="mb-6">With error, disabled, and different sizes</Text>
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input placeholder="Default input" />
              <Input placeholder="With error" error="This field is required" />
              <Input placeholder="Disabled" disabled />
              <Input placeholder="Search..." type="search" />
            </div>
          </div>

          {/* Spinner */}
          <div class="glass-card rounded-2xl p-7">
            <Heading level={4} className="mb-1">Spinner</Heading>
            <Text size="sm" color="muted" className="mb-6">Loading indicator with configurable size</Text>
            <div class="flex items-center gap-6">
              <Spinner size="sm" />
              <Spinner size="md" />
              <Spinner size="lg" />
              <Spinner size="md" className="text-primary-400" />
              <Spinner size="md" gradient className="text-primary-400" />
              <div class="w-6 h-6 rounded-full animate-pulse-glow bg-primary-500" />
              <div class="w-6 h-6 rounded animate-shimmer" />
            </div>
          </div>
        </section>

        {/* ═══ MOLECULES ═══ */}
        <section id="molecules">
          <div class="mb-10">
            <Badge variant="primary" className="mb-2">Layer 2</Badge>
            <Heading level={2}>Molecules</Heading>
            <Text color="muted" className="mt-2">Groups of atoms working together as a unit.</Text>
          </div>

          {/* Card */}
          <div class="mb-12">
            <Heading level={4} className="mb-4">Card</Heading>
            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Card
                title="Simple Card"
                description="A basic card with title and description text."
              >
                <Text size="sm" color="muted">Any content can go here.</Text>
              </Card>
              <Card
                title="Card with Badge"
                description="Featured content with a badge indicator."
                badge={{ text: 'New', variant: 'success' }}
                footer={<Button variant="primary" size="sm">Action</Button>}
              />
            </div>
          </div>

          {/* FormField */}
          <div class="mb-12 glass-card rounded-2xl p-7">
            <Heading level={4} className="mb-4">FormField</Heading>
            <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
              <FormField label="Email" name="email" type="email" placeholder="you@example.com" required />
              <FormField label="Password" name="password" type="password" placeholder="••••••••" error="Password is too short" />
            </div>
          </div>

          {/* Alert */}
          <div class="mb-12">
            <Heading level={4} className="mb-4">Alert</Heading>
            <div class="space-y-3">
              <Alert variant="info" title="Heads up!" dismissible>This is an informational message.</Alert>
              <Alert variant="success" title="All good!">Operation completed successfully.</Alert>
              <Alert variant="warning" title="Warning">You are about to exceed your plan limit.</Alert>
              <Alert variant="error" title="Error">Something went wrong. Please try again.</Alert>
            </div>
          </div>

          {/* Tabs */}
          <div class="mb-12 glass-card rounded-2xl p-7">
            <Heading level={4} className="mb-4">Tabs</Heading>
            <Tabs
              tabs={[
                { id: 'preview', label: 'Preview' },
                { id: 'code', label: 'Code' },
                { id: 'settings', label: 'Settings', disabled: true },
              ]}
              activeTab={tab}
              onChange={(id) => setTab(id)}
            />
            <div class="mt-4 rounded-xl bg-white/5 border border-white/5">
              <div data-ek-bind={tab} data-ek-show-when="preview" class="p-4"><Text>Preview content here.</Text></div>
              <div data-ek-bind={tab} data-ek-show-when="code" class="p-4 hidden"><Text>Code content here.</Text></div>
            </div>
          </div>

          {/* Signal Hydration example — live counter */}
          <div class="mb-12 glass-card rounded-2xl p-7">
            <Heading level={4} className="mb-1">Signal + Hydration</Heading>
            <Text size="sm" color="muted" className="mb-4">
              Signals with <code class="text-primary-400">data-ek-bind</code> — zero-JS binding.
            </Text>
            <div class="glass rounded-xl p-5 text-center">
              <Text size="lg" weight="semibold" className="mb-3">Counter</Text>
              <div class="flex items-center justify-center gap-4">
                <Button variant="outline" size="sm" onClick={() => setCount((c) => c - 1)}>-</Button>
                <span class="text-2xl font-bold text-primary-400 min-w-[3rem]" data-ek-bind={count}>{count()}</span>
                <Button variant="outline" size="sm" onClick={() => setCount((c) => c + 1)}>+</Button>
              </div>
              <Text size="xs" color="muted" className="mt-3">
                Signal updates the DOM directly — no re-render.
              </Text>
            </div>
          </div>

          {/* Modal */}
          <div class="mb-12 glass-card rounded-2xl p-7">
            <Heading level={4} className="mb-1">Modal</Heading>
            <Text size="sm" color="muted" className="mb-4">Dialog overlay with backdrop</Text>
            <Button variant="primary" onClick={() => setOpen(true)}>Open Modal</Button>
            <Modal
              open={open}
              onClose={() => setOpen(false)}
              title="Modal Title"
              description="This is a modal dialog example."
              footer={
                <>
                  <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                  <Button variant="primary" onClick={() => setOpen(false)}>Confirm</Button>
                </>
              }
            >
              <Text>Modal body content goes here. It can contain any atoms or molecules.</Text>
            </Modal>
          </div>

          {/* Select */}
          <div class="glass-card rounded-2xl p-7">
            <Heading level={4} className="mb-1">Select</Heading>
            <Text size="sm" color="muted" className="mb-4">Dropdown with options</Text>
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Select
                placeholder="Choose a framework..."
                value={''}
                options={[
                  { value: 'emberkit', label: 'EmberKit' },
                  { value: 'astro', label: 'Astro' },
                  { value: 'nextjs', label: 'Next.js' },
                  { value: 'sveltekit', label: 'SvelteKit', disabled: true },
                ]}
              />
              <Select
                placeholder="With error"
                error="Selection is required"
                options={[{ value: '', label: 'Option' }]}
              />
            </div>
          </div>
        </section>

        {/* ═══ ORGANISMS ═══ */}
        <section id="organisms">
          <div class="mb-10">
            <Badge variant="primary" className="mb-2">Layer 3</Badge>
            <Heading level={2}>Organisms</Heading>
            <Text color="muted" className="mt-2">Complex UI sections composed of molecules and atoms.</Text>
          </div>

          {/* DataTable */}
          <div class="mb-12 glass-card rounded-2xl p-7">
            <Heading level={4} className="mb-4">DataTable</Heading>
            <DataTable
              columns={[
                { key: 'name', label: 'Name', sortable: true },
                { key: 'role', label: 'Role', sortable: true },
                { key: 'status', label: 'Status', render: (row: Record<string, string>) => (
                  row.status === 'Active'
                    ? <Badge variant="success">Active</Badge>
                    : <Badge variant="error">Inactive</Badge>
                ) },
              ]}
              rows={[
                { name: 'John Doe', role: 'Developer', status: 'Active' },
                { name: 'Jane Smith', role: 'Designer', status: 'Active' },
                { name: 'Bob Johnson', role: 'PM', status: 'Inactive' },
              ]}
            />
          </div>

          {/* Pagination */}
          <div class="mb-12 glass-card rounded-2xl p-7">
            <Heading level={4} className="mb-4">Pagination</Heading>
            <Pagination
              currentPage={page()}
              totalPages={10}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        </section>

        {/* ═══ DESIGN TOKENS ═══ */}
        <section id="tokens">
          <div class="mb-10">
            <Badge variant="primary" className="mb-2">System</Badge>
            <Heading level={2}>Design Tokens</Heading>
            <Text color="muted" className="mt-2">Tailwind 4 theme — Orange Ember high-contrast dark palette.</Text>
          </div>

          {/* Primary Scale */}
          <div class="mb-12">
            <Heading level={4} className="mb-2">Primary — Ember/Orange</Heading>
            <Text color="muted" size="sm" className="mb-5">Full scale from lightest to darkest orange.</Text>
            <div class="glass-card rounded-2xl p-6">
              <div class="grid grid-cols-5 gap-3 sm:grid-cols-10">
                {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                  <div key={shade} class="text-center group">
                    <div
                      class="h-16 w-full rounded-xl border border-white/10 shadow-inner transition-transform duration-200 group-hover:scale-110 group-hover:shadow-lg group-hover:z-10 relative"
                      style={{ backgroundColor: `var(--color-primary-${shade})` }}
                    />
                    <Text size="xs" color="muted" className="mt-2 font-mono">{shade}</Text>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Surface Scale */}
          <div class="mb-12">
            <Heading level={4} className="mb-2">Surface — Dark Neutral</Heading>
            <Text color="muted" size="sm" className="mb-5">Inverted for dark mode — 50 is darkest, 900 is lightest.</Text>
            <div class="glass-card rounded-2xl p-6">
              <div class="grid grid-cols-5 gap-3 sm:grid-cols-10">
                {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                  <div key={shade} class="text-center group">
                    <div
                      class="h-16 w-full rounded-xl border border-white/10 shadow-inner transition-all duration-200 group-hover:scale-110 group-hover:shadow-lg group-hover:z-10 relative"
                      style={{ backgroundColor: `var(--color-surface-${shade})` }}
                    />
                    <Text size="xs" color="muted" className="mt-2 font-mono">{shade}</Text>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Semantic Colors */}
          <div class="mb-12">
            <Heading level={4} className="mb-2">Semantic Colors</Heading>
            <Text color="muted" size="sm" className="mb-5">Status colors for feedback and state.</Text>
            <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {(['success', 'warning', 'error', 'info'] as const).map((name) => (
                <div key={name} class="glass-card rounded-2xl p-5 text-center group hover:-translate-y-0.5 transition-all duration-200">
                  <div
                    class="mx-auto mb-3 h-10 w-10 rounded-xl shadow-lg transition-transform duration-200 group-hover:scale-110"
                    style={{ backgroundColor: `var(--color-${name}-500)` }}
                  />
                  <Text size="sm" weight="semibold" className="capitalize text-surface-800">{name}</Text>
                  <Text size="xs" color="muted" className="font-mono mt-1">
                    {name === 'success' ? '#16a34a' : name === 'warning' ? '#d97706' : name === 'error' ? '#dc2626' : '#0891b2'}
                  </Text>
                  <div class="flex gap-1.5 mt-3 justify-center">
                    <div class="h-3 w-3 rounded-full border border-white/20" style={{ backgroundColor: `var(--color-${name}-50)` }} title="50" />
                    <div class="h-3 w-3 rounded-full border border-white/20" style={{ backgroundColor: `var(--color-${name}-500)` }} title="500" />
                    <div class="h-3 w-3 rounded-full border border-white/20" style={{ backgroundColor: `var(--color-${name}-900)` }} title="900" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Glassmorphism */}
          <div class="mb-12">
            <Heading level={4} className="mb-2">Glassmorphism</Heading>
            <Text color="muted" size="sm" className="mb-5">Utility classes for frosted glass effects.</Text>
            <div class="grid grid-cols-3 gap-4">
              {[
                { cls: 'glass', label: '.glass', desc: 'Light frost' },
                { cls: 'glass-strong', label: '.glass-strong', desc: 'Deep frost' },
                { cls: 'glass-card', label: '.glass-card', desc: 'Card surface' },
              ].map((g) => (
                <div key={g.cls} class={`${g.cls} rounded-2xl p-6 text-center hover:scale-[1.02] transition-transform duration-200`}>
                  <Text weight="semibold" className="text-surface-800">{g.label}</Text>
                  <Text size="sm" color="muted">{g.desc}</Text>
                </div>
              ))}
            </div>
            <div class="mt-4 grid grid-cols-2 gap-4">
              {[
                { cls: 'glow-primary', label: '.glow-primary' },
                { cls: 'glow-accent', label: '.glow-accent' },
              ].map((g) => (
                <div key={g.cls} class={`glass rounded-2xl p-5 text-center ${g.cls}`}>
                  <Text weight="semibold" className="text-surface-800">{g.label}</Text>
                </div>
              ))}
            </div>
          </div>

          {/* Typography */}
          <div class="glass-card rounded-2xl p-8">
            <Heading level={4} className="mb-2">Typography</Heading>
            <Text color="muted" size="sm" className="mb-6">Font scale with Inter and JetBrains Mono.</Text>
            <div class="space-y-4">
              {[
                { name: '4xl', size: '2.25rem', px: '36px', weight: 'font-bold', cls: 'text-4xl font-bold' },
                { name: '3xl', size: '1.875rem', px: '30px', weight: 'font-semibold', cls: 'text-3xl font-semibold' },
                { name: '2xl', size: '1.5rem', px: '24px', weight: 'font-semibold', cls: 'text-2xl font-semibold' },
                { name: 'xl', size: '1.25rem', px: '20px', weight: 'font-semibold', cls: 'text-xl font-semibold' },
                { name: 'lg', size: '1.125rem', px: '18px', weight: 'font-medium', cls: 'text-lg font-medium' },
                { name: 'base', size: '1rem', px: '16px', weight: 'font-normal', cls: 'text-base' },
                { name: 'sm', size: '0.875rem', px: '14px', weight: 'font-normal', cls: 'text-sm text-surface-500' },
                { name: 'xs', size: '0.75rem', px: '12px', weight: 'font-normal', cls: 'text-xs text-surface-500' },
              ].map((t) => (
                <div key={t.name} class="flex items-center justify-between border-b border-white/5 pb-4 last:border-b-0 last:pb-0 group hover:bg-white/[0.02] -mx-2 px-2 rounded-lg transition-colors duration-150">
                  <div class="flex items-baseline gap-4">
                    <span class={t.cls}>{t.name}</span>
                    <span class="text-xs text-surface-600 font-mono">{t.weight}</span>
                  </div>
                  <Text size="xs" color="muted" className="font-mono tabular-nums">{t.size} / {t.px}</Text>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer class="border-t border-white/10 pt-10 text-center">
          <Text size="sm" color="muted">
            Built with <Icon name="zap" size={14} className="inline text-primary-400" />{' '}
            <span class="text-primary-400">@emberkit/core</span> + Tailwind 4
          </Text>
          <Text size="xs" color="muted" className="mt-1">
            Design System &copy; {new Date().getFullYear()} Orange Ember Studios
          </Text>
        </footer>
      </div>
    </div>
  );
};

export default UIContent;
