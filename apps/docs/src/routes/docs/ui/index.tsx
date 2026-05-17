import type { RouteComponent } from "@emberkit/core";
import { createSignal, LazyInView } from "@emberkit/core";
import {
  CodeBlock,
} from "@emberkit/ui/molecules";
import {
  Button,
  Icon,
  Text,
  Heading,
  Badge,
  Input,
  Spinner,
} from "@emberkit/ui/atoms";
import {
  Card,
  FormField,
  Alert,
  Tabs,
  Modal,
  Select,
} from "@emberkit/ui/molecules";
import { DataTable, Pagination } from "@emberkit/ui/organisms";
import { UI_VERSION } from "../../../lib/version.js";

type PropRow = {
  name: string;
  type: string;
  default?: string;
  desc: string;
};


function PropsTable({ rows }: { rows: PropRow[] }) {
  return (
    <div class="mt-5 overflow-x-auto rounded-xl border border-white/10">
      <table class="w-full min-w-[40rem] border-collapse text-sm">
        <thead>
          <tr class="border-b border-white/10 bg-white/[0.04] text-left">
            <th class="px-3 py-2.5 font-semibold text-surface-800">Prop</th>
            <th class="px-3 py-2.5 font-semibold text-surface-800">Type</th>
            <th class="px-3 py-2.5 font-semibold text-surface-800">Default</th>
            <th class="px-3 py-2.5 font-semibold text-surface-800">Description</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-white/5">
          {rows.map((r) => (
            <tr key={r.name} class="text-surface-700">
              <td class="px-3 py-2.5 align-top font-mono text-xs text-primary-300">
                {r.name}
              </td>
              <td class="px-3 py-2.5 align-top font-mono text-xs text-surface-600">
                {r.type}
              </td>
              <td class="px-3 py-2.5 align-top font-mono text-xs text-surface-500">
                {r.default ?? "—"}
              </td>
              <td class="px-3 py-2.5 align-top">{r.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const uiSectionFallback = (minHeight: string) => (
  <div
    class={`rounded-2xl border border-white/5 bg-white/[0.02] animate-pulse ${minHeight}`}
    aria-hidden="true"
  />
);

function DocSubheading({ children }: { children: string }) {
  return (
    <Text
      size="sm"
      weight="semibold"
      className="mt-6 mb-2 uppercase tracking-wide text-surface-800"
    >
      {children}
    </Text>
  );
}

const UI_PAGE_SECTIONS = [
  { id: "usage", label: "Usage" },
  { id: "atoms", label: "Atoms" },
  { id: "molecules", label: "Molecules" },
  { id: "organisms", label: "Organisms" },
  { id: "tokens", label: "Design Tokens" },
] as const;

const UIContent: RouteComponent = () => {
  const [open, setOpen] = createSignal(false);
  const [tab, setTab] = createSignal("preview");
  const [page, setPage] = createSignal(1);
  const [count, setCount] = createSignal<number>(0);
  return (
    <div class="-mx-6 -mt-8 min-h-screen text-surface-900 lg:-mx-16 lg:-mt-12">
      {/* Hero */}
      <div class="relative overflow-hidden border-b border-white/5 glass-card rounded-none">
        <div
          class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgb(249_115_22/0.18),transparent)]"
          aria-hidden="true"
        />
        <div class="relative mx-auto max-w-5xl px-8 py-16 md:py-20">
          <Badge variant="accent" size="sm" className="mb-4">
            @emberkit/ui v{UI_VERSION}
          </Badge>
          <Heading level={1} className="mb-4">
            <span class="text-primary-400">@emberkit/ui</span> — Component
            Library
          </Heading>
          <Text size="lg" color="muted" className="mb-8 max-w-2xl">
            A dark-themed, high-contrast atomic design system built with
            EmberKit JSX and Tailwind 4. Import{" "}
            <code class="text-primary-400 font-mono text-base">
              @emberkit/ui/tokens.css
            </code>{" "}
            after Tailwind for polished defaults out of the box.
          </Text>
          <div class="flex flex-wrap gap-3">
            <Button
              variant="outline"
              size="lg"
              onClick={() =>
                document
                  .getElementById("atoms")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Browse Components
            </Button>
          </div>

          {/* Install Command */}
          <div class="mt-10 glass rounded-2xl p-5">
            <Text
              size="xs"
              color="muted"
              className="mb-2 font-mono uppercase tracking-widest"
            >
              Install
            </Text>
            <div class="flex items-center justify-between gap-4 bg-black/30 rounded-xl px-5 py-3.5 border border-white/5">
              <code class="text-sm text-primary-400 font-mono select-all">
                pnpm add @emberkit/ui
              </code>
              <button
                class="shrink-0 text-surface-500 hover:text-surface-200 transition-colors p-1"
                onClick={(e: MouseEvent) => {
                  navigator.clipboard.writeText("pnpm add @emberkit/ui");
                  const el = e.target as HTMLElement;
                  el.textContent = "Copied!";
                  setTimeout(() => {
                    el.textContent = "Copy";
                  }, 1500);
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
              { value: "4", label: "Atomic Levels", icon: "layers" as const },
              { value: "20+", label: "Components", icon: "grid" as const },
              { value: "90+", label: "Icons", icon: "package" as const },
            ].map((stat) => (
              <div
                key={stat.label}
                class="glass rounded-2xl p-5 text-center hover:scale-[1.03] transition-transform duration-200"
              >
                <Icon
                  name={stat.icon}
                  size={24}
                  className="mx-auto mb-2 text-primary-400"
                />
                <div class="text-2xl font-bold text-surface-900">
                  {stat.value}
                </div>
                <Text size="sm" color="muted">
                  {stat.label}
                </Text>
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
              onClick={() =>
                document
                  .getElementById(s.id)
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              class="whitespace-nowrap text-sm font-medium text-surface-500 hover:text-surface-900 transition-colors"
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div class="mx-auto max-w-5xl px-8 py-16 space-y-24">
        {/* ═══ USAGE ═══ */}
        <section id="usage" class="scroll-mt-28">
          <div class="mb-10">
            <Badge variant="info" className="mb-2">
              Start here
            </Badge>
            <Heading level={2}>Usage</Heading>
            <Text color="muted" className="mt-2 max-w-3xl">
              Install the package, import design tokens after Tailwind, then pull
              components from the{" "}
              <code class="text-primary-400 font-mono text-sm">
                @emberkit/ui/*{" "}
              </code>
              entry points so your bundler tree-shakes cleanly.
            </Text>
          </div>

          <div class="ds-showcase mb-10">
            <Heading level={4} className="mb-2">
              Install & global styles
            </Heading>
            <Text size="sm" color="muted" className="mb-4">
              Peer deps:{" "}
              <code class="font-mono text-primary-400">@emberkit/core</code>,{" "}
              <code class="font-mono text-primary-400">@emberkit/icons</code>,{" "}
              <code class="font-mono text-primary-400">tailwindcss ^4</code>.
              Point Tailwind at your app sources and at published UI (tokens ship
              a{" "}
              <code class="font-mono text-primary-400">@source</code> for{" "}
              <code class="font-mono text-primary-400">dist/</code>
              ).
            </Text>
            <DocSubheading>package.json</DocSubheading>
            <CodeBlock
              language="bash"
              code={`pnpm add @emberkit/ui @emberkit/core @emberkit/icons tailwindcss`}
            />
            <DocSubheading>globals.css (example)</DocSubheading>
            <CodeBlock
              language="css"
              code={`@import "tailwindcss";
@import "@emberkit/ui/tokens.css";
@source "./src/**/*.{tsx,ts,jsx}";`}
            />
            <Text size="xs" color="muted" className="mt-3">
              Glass utilities (
              <code class="font-mono text-primary-400">.glass</code>,{" "}
              <code class="font-mono text-primary-400">.glass-card</code>, etc.)
              are defined in{" "}
              <code class="font-mono text-primary-400">tokens.css</code>— always
              import it when using Card, secondary Button, or Modal.
            </Text>
          </div>

          <div class="ds-showcase">
            <Heading level={4} className="mb-2">
              Imports by layer
            </Heading>
            <Text size="sm" color="muted" className="mb-4">
              Match published{" "}
              <code class="font-mono text-primary-400">package.json exports</code>{" "}
              so installs from npm resolve without monorepo path hacks.
            </Text>
            <CodeBlock
              code={`import { Button, Input, Text } from "@emberkit/ui/atoms";
import { Card, Alert, Modal } from "@emberkit/ui/molecules";
import { DataTable, Header } from "@emberkit/ui/organisms";
import type { ButtonProps } from "@emberkit/ui/atoms";`}
            />
            <DocSubheading>Rendering & interactivity</DocSubheading>
            <Text size="sm" color="muted" className="mb-2">
              Components return EmberKit JSX. Mount with a function so the
              runtime attaches click handlers and hydrates signals, e.g.{" "}
              <code class="font-mono text-primary-400">
                {`render(() => <App />, document.getElementById("root")!)`}
              </code>
              . See{" "}
              <button
                type="button"
                class="text-primary-400 underline-offset-2 hover:underline"
                onClick={() =>
                  document
                    .getElementById("signal-hydration")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Signal + Hydration
              </button>{" "}
              below.
            </Text>
          </div>
        </section>

        <LazyInView class="block" minHeight="32rem" fallback={uiSectionFallback('min-h-[32rem]')}>
        {/* ═══ ATOMS ═══ */}
        <section id="atoms" class="scroll-mt-28">
          <div class="mb-10">
            <Badge variant="default" className="mb-2">
              Layer 1
            </Badge>
            <Heading level={2}>Atoms</Heading>
            <Text color="muted" className="mt-2">
              Basic building blocks — the smallest UI primitives.
            </Text>
          </div>

          {/* Button */}
          <div class="mb-12 ds-showcase">
            <Heading level={4} className="mb-1">
              Button
            </Heading>
            <Text size="sm" color="muted" className="mb-4">
              Action control with loading state (replaces label with{" "}
              <code class="font-mono text-primary-400">Spinner</code>) and
              optional full width.
            </Text>
            <Text size="xs" color="muted" className="mb-4">
              Use <code class="font-mono text-primary-400">type="submit"</code>{" "}
              inside forms; default is{" "}
              <code class="font-mono text-primary-400">button</code>.
            </Text>
            <DocSubheading>Live examples</DocSubheading>
            <div class="flex flex-wrap gap-3">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
              <Button variant="primary" loading>
                Loading
              </Button>
              <Button variant="primary" disabled>
                Disabled
              </Button>
            </div>
            <div class="mt-6 flex flex-wrap items-end gap-4">
              <div class="text-center">
                <Text size="xs" color="muted" className="mb-2 block">
                  size=&quot;sm&quot;
                </Text>
                <Button variant="outline" size="sm">
                  Small
                </Button>
              </div>
              <div class="text-center">
                <Text size="xs" color="muted" className="mb-2 block">
                  size=&quot;md&quot; (default)
                </Text>
                <Button variant="outline" size="md">
                  Medium
                </Button>
              </div>
              <div class="text-center">
                <Text size="xs" color="muted" className="mb-2 block">
                  size=&quot;lg&quot;
                </Text>
                <Button variant="outline" size="lg">
                  Large
                </Button>
              </div>
              <Button variant="primary" fullWidth className="max-w-sm">
                fullWidth (max-w-sm for demo)
              </Button>
            </div>
            <DocSubheading>Example</DocSubheading>
            <CodeBlock
              code={`import { Button } from "@emberkit/ui/atoms";

<Button variant="primary" size="md" onClick={() => alert("ok")}>
  Save
</Button>

<Button variant="primary" loading type="submit">
  Saving…
</Button>`}
            />
            <DocSubheading>Props</DocSubheading>
            <PropsTable
              rows={[
                {
                  name: "variant",
                  type: '"primary" | "secondary" | "outline" | "ghost" | "danger"',
                  default: '"primary"',
                  desc: "Visual style; secondary uses glass surface.",
                },
                {
                  name: "size",
                  type: '"sm" | "md" | "lg"',
                  default: '"md"',
                  desc: "Padding and font size.",
                },
                {
                  name: "disabled",
                  type: "boolean",
                  default: "false",
                  desc: "Disables interaction; paired with loading also disables.",
                },
                {
                  name: "loading",
                  type: "boolean",
                  default: "false",
                  desc: "Shows spinner and disables the button.",
                },
                {
                  name: "fullWidth",
                  type: "boolean",
                  default: "false",
                  desc: "Adds w-full for block layouts.",
                },
                {
                  name: "className",
                  type: "string",
                  default: "—",
                  desc: "Extra Tailwind / utility classes.",
                },
                {
                  name: "onClick",
                  type: "(e: MouseEvent) => void",
                  default: "—",
                  desc: "Click handler (wired after SSR via data-ekclick).",
                },
                {
                  name: "type",
                  type: '"button" | "submit" | "reset"',
                  default: '"button"',
                  desc: "Native button type for forms.",
                },
              ]}
            />
          </div>

          {/* Icon */}
          <div class="mb-12 ds-showcase">
            <Heading level={4} className="mb-1">
              Icon
            </Heading>
            <Text size="sm" color="muted" className="mb-4">
              Thin wrapper around named SVGs from{" "}
              <code class="font-mono text-primary-400">@emberkit/icons</code>.
              Prefer <code class="font-mono text-primary-400">Icon</code> for
              consistent sizing; import SVG components directly when you need
              tree-shaking per icon.
            </Text>
            <Text size="xs" color="muted" className="mb-4">
              Browse the full set on the{" "}
              <a
                href="/docs/icons"
                class="text-primary-400 underline-offset-2 hover:underline"
              >
                Icons
              </a>{" "}
              doc page.
            </Text>
            <div class="flex flex-wrap gap-4">
              <div class="flex flex-col items-center gap-1">
                <Icon name="zap" size={28} className="text-primary-400" />
                <Text size="xs" color="muted">
                  zap
                </Text>
              </div>
              <div class="flex flex-col items-center gap-1">
                <Icon name="search" size={28} className="text-primary-400" />
                <Text size="xs" color="muted">
                  search
                </Text>
              </div>
              <div class="flex flex-col items-center gap-1">
                <Icon name="home" size={28} className="text-primary-400" />
                <Text size="xs" color="muted">
                  home
                </Text>
              </div>
              <div class="flex flex-col items-center gap-1">
                <Icon name="user" size={28} className="text-primary-400" />
                <Text size="xs" color="muted">
                  user
                </Text>
              </div>
              <div class="flex flex-col items-center gap-1">
                <Icon name="settings" size={28} className="text-primary-400" />
                <Text size="xs" color="muted">
                  settings
                </Text>
              </div>
              <div class="flex flex-col items-center gap-1">
                <Icon name="bell" size={28} className="text-primary-400" />
                <Text size="xs" color="muted">
                  bell
                </Text>
              </div>
            </div>
            <DocSubheading>Example</DocSubheading>
            <CodeBlock
              code={`import { Icon } from "@emberkit/ui/atoms";

<Icon name="zap" size={24} className="text-primary-400" />`}
            />
            <DocSubheading>Props</DocSubheading>
            <PropsTable
              rows={[
                {
                  name: "name",
                  type: "IconName",
                  default: "—",
                  desc: "Registry key (e.g. zap, search, github).",
                },
                {
                  name: "size",
                  type: "number",
                  default: "24",
                  desc: "Pixel size passed to the underlying SVG component.",
                },
                {
                  name: "className",
                  type: "string",
                  default: '""',
                  desc: "Tailwind classes for color and layout.",
                },
                {
                  name: "color",
                  type: "string",
                  default: '""',
                  desc: "Forwarded to icon SVG stroke/fill where supported.",
                },
              ]}
            />
          </div>

          {/* Text + Heading — stacked so demos and props tables have full width */}
          <div class="mb-12 flex flex-col gap-10">
            <div class="ds-showcase">
              <Heading level={4} className="mb-3">
                Text
              </Heading>
              <Text size="sm" color="muted" className="mb-4">
                Semantic body copy with size, weight, color, and optional tag via{" "}
                <code class="font-mono text-primary-400">as</code>.
              </Text>
              <div class="space-y-2">
                <Text size="xs" color="muted">
                  xs muted text
                </Text>
                <Text size="sm">sm default text</Text>
                <Text size="base">base default text</Text>
                <Text size="lg" weight="semibold">
                  lg semibold text
                </Text>
                <Text color="primary">Primary colored text</Text>
                <Text color="error">Error colored text</Text>
              </div>
              <DocSubheading>Props</DocSubheading>
              <PropsTable
                rows={[
                  {
                    name: "as",
                    type: '"p" | "span" | "div" | "label"',
                    default: '"p"',
                    desc: "HTML element to render.",
                  },
                  {
                    name: "size",
                    type: '"xs" | "sm" | "base" | "lg"',
                    default: '"base"',
                    desc: "Type scale from tokens.",
                  },
                  {
                    name: "weight",
                    type: '"normal" | "medium" | "semibold"',
                    default: '"normal"',
                    desc: "Font weight.",
                  },
                  {
                    name: "color",
                    type: '"default" | "muted" | "primary" | "error"',
                    default: '"default"',
                    desc: "Text color preset.",
                  },
                  {
                    name: "className",
                    type: "string",
                    default: "—",
                    desc: "Additional classes.",
                  },
                ]}
              />
            </div>
            <div class="ds-showcase">
              <Heading level={4} className="mb-3">
                Heading
              </Heading>
              <Text size="sm" color="muted" className="mb-4">
                Maps <code class="font-mono text-primary-400">level</code> to{" "}
                <code class="font-mono text-primary-400">h1</code>–
                <code class="font-mono text-primary-400">h6</code> with preset
                typography; use once per section for accessible outlines.
              </Text>
              <div class="space-y-3">
                <Heading level={1}>h1. Heading</Heading>
                <Heading level={2}>h2. Heading</Heading>
                <Heading level={3}>h3. Heading</Heading>
                <Heading level={4}>h4. Heading</Heading>
                <Heading level={5}>h5. Heading</Heading>
                <Heading level={6}>h6. Heading</Heading>
              </div>
              <DocSubheading>Props</DocSubheading>
              <PropsTable
                rows={[
                  {
                    name: "level",
                    type: "1 | 2 | 3 | 4 | 5 | 6",
                    default: "1",
                    desc: "Heading rank and visual size.",
                  },
                  {
                    name: "className",
                    type: "string",
                    default: "—",
                    desc: "Additional classes.",
                  },
                ]}
              />
            </div>
          </div>

          {/* Badge */}
          <div class="mb-12 ds-showcase">
            <Heading level={4} className="mb-1">
              Badge
            </Heading>
            <Text size="sm" color="muted" className="mb-4">
              Compact status or meta label.{" "}
              <code class="font-mono text-primary-400">children</code> is typed
              as <code class="font-mono text-primary-400">string</code> on the
              component API.
            </Text>
            <div class="flex flex-wrap gap-3">
              <Badge>Default</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="error">Error</Badge>
              <Badge variant="info">Info</Badge>
              <Badge variant="accent">Accent</Badge>
              <Badge size="sm">Small</Badge>
            </div>
            <DocSubheading>Example</DocSubheading>
            <CodeBlock
              code={`import { Badge } from "@emberkit/ui/atoms";

<Badge variant="success" size="md">Beta</Badge>`}
            />
            <DocSubheading>Props</DocSubheading>
            <PropsTable
              rows={[
                {
                  name: "variant",
                  type: '"default" | "success" | "warning" | "error" | "info" | "accent"',
                  default: '"default"',
                  desc: "Colorway for status semantics.",
                },
                {
                  name: "size",
                  type: '"sm" | "md"',
                  default: '"md"',
                  desc: "Padding and text size.",
                },
                {
                  name: "className",
                  type: "string",
                  default: "—",
                  desc: "Additional classes.",
                },
              ]}
            />
          </div>

          {/* Input */}
          <div class="mb-12 ds-showcase">
            <Heading level={4} className="mb-1">
              Input
            </Heading>
            <Text size="sm" color="muted" className="mb-4">
              Native text input; extends standard input attributes except{" "}
              <code class="font-mono text-primary-400">size</code> (use{" "}
              <code class="font-mono text-primary-400">InputSize</code> prop).
            </Text>
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input placeholder="Default input" />
              <Input placeholder="With error" error="This field is required" />
              <Input placeholder="Disabled" disabled />
              <Input placeholder="Search..." type="search" />
              <Input placeholder="Small" size="sm" />
              <Input placeholder="Large" size="lg" />
            </div>
            <DocSubheading>Example</DocSubheading>
            <CodeBlock
              code={`import { Input } from "@emberkit/ui/atoms";

<Input name="email" type="email" placeholder="you@example.com" />
<Input error="Required" size="md" />`}
            />
            <DocSubheading>Props (highlights)</DocSubheading>
            <PropsTable
              rows={[
                {
                  name: "size",
                  type: '"sm" | "md" | "lg"',
                  default: '"md"',
                  desc: "Visual size; distinct from native input size attr.",
                },
                {
                  name: "error",
                  type: "string",
                  default: "—",
                  desc: "Shows error border and screen-reader friendly state.",
                },
                {
                  name: "…htmlInput",
                  type: "InputHTMLAttributes",
                  default: "—",
                  desc: "name, type, value, placeholder, disabled, onInput, etc.",
                },
              ]}
            />
          </div>

          {/* Spinner */}
          <div class="ds-showcase">
            <Heading level={4} className="mb-1">
              Spinner
            </Heading>
            <Text size="sm" color="muted" className="mb-4">
              SVG loader; use inside{" "}
              <code class="font-mono text-primary-400">Button</code> via{" "}
              <code class="font-mono text-primary-400">loading</code> or inline
              next to labels.{" "}
              <code class="font-mono text-primary-400">gradient</code> animates
              stroke with a soft fade.
            </Text>
            <div class="flex flex-wrap items-center gap-6">
              <Spinner size="sm" />
              <Spinner size="md" />
              <Spinner size="lg" />
              <Spinner size="md" className="text-primary-400" />
              <Spinner size="md" gradient className="text-primary-400" />
              <div class="w-6 h-6 rounded-full animate-pulse-glow bg-primary-500" />
              <div class="w-6 h-6 rounded animate-shimmer" />
            </div>
            <Text size="xs" color="muted" className="mt-3">
              Last two pills: token CSS demos{" "}
              <code class="font-mono text-primary-400">.animate-pulse-glow</code>{" "}
              /{" "}
              <code class="font-mono text-primary-400">.animate-shimmer</code>.
            </Text>
            <DocSubheading>Props</DocSubheading>
            <PropsTable
              rows={[
                {
                  name: "size",
                  type: '"sm" | "md" | "lg"',
                  default: '"md"',
                  desc: "Diameter of the SVG.",
                },
                {
                  name: "gradient",
                  type: "boolean",
                  default: "false",
                  desc: "Use gradient stroke instead of dual arcs.",
                },
                {
                  name: "color",
                  type: "string",
                  default: "—",
                  desc: "Stroke strokeColor when not using currentColor.",
                },
                {
                  name: "className",
                  type: "string",
                  default: "—",
                  desc: "Sets color via text-* for currentColor strokes.",
                },
              ]}
            />
          </div>
        </section>
        </LazyInView>

        <LazyInView class="block" minHeight="36rem" fallback={uiSectionFallback('min-h-[36rem]')}>
        {/* ═══ MOLECULES ═══ */}
        <section id="molecules" class="scroll-mt-28">
          <div class="mb-10">
            <Badge variant="default" className="mb-2">
              Layer 2
            </Badge>
            <Heading level={2}>Molecules</Heading>
            <Text color="muted" className="mt-2">
              Groups of atoms working together as a unit.
            </Text>
          </div>

          {/* Card */}
          <div class="mb-12">
            <Heading level={4} className="mb-2">
              Card
            </Heading>
            <Text size="sm" color="muted" className="mb-4 max-w-3xl">
              Glass surface with optional header (title, description, badge),
              body slot, and footer rail.
              <code class="font-mono text-primary-400"> onClick</code> enables
              hover lift; omit it for static content.
            </Text>
            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Card
                title="Simple Card"
                description="A basic card with title and description text."
              >
                <Text size="sm" color="muted">
                  Any content can go here.
                </Text>
              </Card>
              <Card
                title="Card with Badge"
                description="Featured content with a badge indicator."
                badge={{ text: "New", variant: "success" }}
                footer={
                  <Button variant="primary" size="sm">
                    Action
                  </Button>
                }
              />
            </div>
            <DocSubheading>Example</DocSubheading>
            <CodeBlock
              code={`import { Card, Button } from "@emberkit/ui/molecules";
import { Text } from "@emberkit/ui/atoms";

<Card
  title="Billing"
  description="Invoices and payment methods."
  badge={{ text: "3", variant: "info" }}
  footer={<Button variant="outline" size="sm">Manage</Button>}
>
  <Text size="sm" color="muted">Next charge Feb 12.</Text>
</Card>`}
            />
            <DocSubheading>Props</DocSubheading>
            <PropsTable
              rows={[
                {
                  name: "title",
                  type: "string",
                  default: "—",
                  desc: "Header title; renders with Heading level 3.",
                },
                {
                  name: "description",
                  type: "string",
                  default: "—",
                  desc: "Muted subcopy under title.",
                },
                {
                  name: "badge",
                  type: "{ text: string; variant?: BadgeVariant }",
                  default: "—",
                  desc: "Optional pill in header.",
                },
                {
                  name: "footer",
                  type: "unknown",
                  default: "—",
                  desc: "Footer row (actions, links).",
                },
                {
                  name: "onClick",
                  type: "(e: MouseEvent) => void",
                  default: "—",
                  desc: "Makes whole card interactive with hover styles.",
                },
                {
                  name: "className",
                  type: "string",
                  default: "—",
                  desc: "Extra classes on outer shell.",
                },
              ]}
            />
          </div>

          {/* FormField */}
          <div class="mb-12 ds-showcase">
            <Heading level={4} className="mb-2">
              FormField
            </Heading>
            <Text size="sm" color="muted" className="mb-4">
              Label + <code class="font-mono text-primary-400">Input</code> with
              optional hint and error line. Pass extra native attributes via{" "}
              <code class="font-mono text-primary-400">inputProps</code>.
            </Text>
            <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
              <FormField
                label="Email"
                name="email"
                required
                inputProps={{
                  type: "email",
                  placeholder: "you@example.com",
                }}
              />
              <FormField
                label="Password"
                name="password"
                error="Password is too short"
                inputProps={{
                  type: "password",
                  placeholder: "••••••••",
                }}
              />
            </div>
            <DocSubheading>Example</DocSubheading>
            <CodeBlock
              code={`import { FormField } from "@emberkit/ui/molecules";

<FormField
  label="Email"
  name="email"
  required
  inputProps={{ type: "email", autoComplete: "email" }}
/>`}
            />
            <DocSubheading>Props</DocSubheading>
            <PropsTable
              rows={[
                {
                  name: "label",
                  type: "string",
                  default: "—",
                  desc: "Visible label; * when required.",
                },
                {
                  name: "name",
                  type: "string",
                  default: "—",
                  desc: "Forwarded to Input.",
                },
                {
                  name: "hint",
                  type: "string",
                  default: "—",
                  desc: "Helper line when no error.",
                },
                {
                  name: "error",
                  type: "string",
                  default: "—",
                  desc: "Shows error on Input + message.",
                },
                {
                  name: "inputProps",
                  type: "Omit<InputProps, \"name\" | \"size\">",
                  default: "—",
                  desc: "placeholder, type, onInput, etc.",
                },
              ]}
            />
          </div>

          {/* Alert */}
          <div class="mb-12">
            <Heading level={4} className="mb-2">
              Alert
            </Heading>
            <Text size="sm" color="muted" className="mb-4 max-w-3xl">
              Inline feedback with icon, optional title, and body. Set{" "}
              <code class="font-mono text-primary-400">dismissible</code> and{" "}
              <code class="font-mono text-primary-400">onDismiss</code> for a
              close control (wired like buttons after render).
            </Text>
            <div class="space-y-3">
              <Alert variant="info" title="Heads up!" dismissible>
                This is an informational message.
              </Alert>
              <Alert variant="success" title="All good!">
                Operation completed successfully.
              </Alert>
              <Alert variant="warning" title="Warning">
                You are about to exceed your plan limit.
              </Alert>
              <Alert variant="error" title="Error">
                Something went wrong. Please try again.
              </Alert>
            </div>
            <DocSubheading>Example</DocSubheading>
            <CodeBlock
              code={`import { Alert } from "@emberkit/ui/molecules";

<Alert variant="info" title="Note" dismissible onDismiss={() => {}}>
  Details for the user.
</Alert>`}
            />
            <DocSubheading>Props</DocSubheading>
            <PropsTable
              rows={[
                {
                  name: "variant",
                  type: '"info" | "success" | "warning" | "error"',
                  default: '"info"',
                  desc: "Semantic color and icon.",
                },
                {
                  name: "title",
                  type: "string",
                  default: "—",
                  desc: "Bold line above children.",
                },
                {
                  name: "dismissible",
                  type: "boolean",
                  default: "false",
                  desc: "Shows close button.",
                },
                {
                  name: "onDismiss",
                  type: "() => void",
                  default: "—",
                  desc: "Called when dismiss is pressed.",
                },
                {
                  name: "className",
                  type: "string",
                  default: "—",
                  desc: "Extra classes on root (role=alert).",
                },
              ]}
            />
          </div>

          {/* Tabs */}
          <div class="mb-12 ds-showcase">
            <Heading level={4} className="mb-2">
              Tabs
            </Heading>
            <Text size="sm" color="muted" className="mb-4">
              Pass <code class="font-mono text-primary-400">activeTab</code> as a
              plain string or a{" "}
              <code class="font-mono text-primary-400">createSignal</code>{" "}
              function. When you pass a signal, tab panels and trigger icons can
              use{" "}
              <code class="font-mono text-primary-400">data-ek-bind</code> /{" "}
              <code class="font-mono text-primary-400">data-ek-active-class</code>{" "}
              so the active tab updates with zero React-style rerenders after
              hydration.
            </Text>
            <Tabs
              tabs={[
                { id: "preview", label: "Preview" },
                { id: "code", label: "Code" },
                { id: "settings", label: "Settings", disabled: true },
              ]}
              activeTab={tab}
              onChange={(id) => setTab(id)}
            />
            <div class="mt-4 rounded-xl border border-white/10 bg-surface-200/40">
              <div data-ek-bind={tab} data-ek-show-when="preview" class="p-4">
                <Text>Preview content here.</Text>
              </div>
              <div
                data-ek-bind={tab}
                data-ek-show-when="code"
                class="p-4 hidden"
              >
                <Text>Code content here.</Text>
              </div>
            </div>
            <CodeBlock
              code={`import { Tabs } from "@emberkit/ui/molecules";
import { createSignal } from "@emberkit/core";

const [tab, setTab] = createSignal("a");

<Tabs
  tabs={[
    { id: "a", label: "Tab A" },
    { id: "b", label: "Tab B", disabled: true },
  ]}
  activeTab={tab}
  onChange={(id) => setTab(id)}
/>`}
            />
            <PropsTable
              rows={[
                {
                  name: "tabs",
                  type: "Tab[]",
                  default: "—",
                  desc: "id, label, optional disabled.",
                },
                {
                  name: "activeTab",
                  type: "string | (() => string)",
                  default: "—",
                  desc: "Current id, or signal returning current id.",
                },
                {
                  name: "onChange",
                  type: "(id: string) => void",
                  default: "—",
                  desc: "Fires after user selects a tab.",
                },
              ]}
            />
          </div>

          {/* Signal Hydration example — live counter */}
          <div class="mb-12 ds-showcase" id="signal-hydration">
            <Heading level={4} className="mb-1">
              Signal + Hydration
            </Heading>
            <Text size="sm" color="muted" className="mb-4">
              DOM nodes marked with{" "}
              <code class="font-mono text-primary-400">data-ek-bind</code>{" "}
              subscribe to the matching signal after hydration—the runtime
              updates text or classes without re-running your component tree.
            </Text>
            <div class="glass rounded-xl p-5 text-center">
              <Text size="lg" weight="semibold" className="mb-3">
                Counter
              </Text>
              <div class="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCount((c) => c - 1)}
                >
                  -
                </Button>
                <span
                  class="text-2xl font-bold text-primary-400 min-w-[3rem]"
                  data-ek-bind={count}
                >
                  {count()}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCount((c) => c + 1)}
                >
                  +
                </Button>
              </div>
              <Text size="xs" color="muted" className="mt-3">
                Signal updates the DOM directly — no re-render.
              </Text>
            </div>
            <DocSubheading>Common data-ek-* hooks</DocSubheading>
            <PropsTable
              rows={[
                {
                  name: "data-ek-bind",
                  type: "signal",
                  default: "—",
                  desc: "Binds element text, visibility (with show/hide attrs), or active classes per runtime rules.",
                },
                {
                  name: "data-ek-show-when",
                  type: "string",
                  default: "—",
                  desc: "When signal value string-matches, panel stays visible.",
                },
                {
                  name: "data-ek-active-when / data-ek-active-class / data-ek-inactive-class",
                  type: "string",
                  default: "—",
                  desc: "Toggle classes for the active tab id vs signal value.",
                },
                {
                  name: "data-ek-hide / data-ek-show",
                  type: "string (class names)",
                  default: "—",
                  desc: "Used by Select overlay and similar (see package source).",
                },
              ]}
            />
          </div>

          {/* Modal */}
          <div class="mb-12 ds-showcase">
            <Heading level={4} className="mb-2">
              Modal
            </Heading>
            <Text size="sm" color="muted" className="mb-4">
              Centered panel with backdrop blur. Pass{" "}
              <code class="font-mono text-primary-400">open</code> as boolean or
              signal; when using a signal, the overlay and panel participate in{" "}
              <code class="font-mono text-primary-400">data-ek-bind</code>{" "}
              transitions (see Modal source).
            </Text>
            <Button variant="primary" onClick={() => setOpen(true)}>
              Open Modal
            </Button>
            <Modal
              open={open}
              onClose={() => setOpen(false)}
              title="Modal Title"
              description="This is a modal dialog example."
              footer={
                <>
                  <Button variant="ghost" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={() => setOpen(false)}>
                    Confirm
                  </Button>
                </>
              }
            >
              <Text>
                Modal body content goes here. It can contain any atoms or
                molecules.
              </Text>
            </Modal>
            <CodeBlock
              code={`import { Modal, Button } from "@emberkit/ui/molecules";
import { createSignal } from "@emberkit/core";
import { Text } from "@emberkit/ui/atoms";

const [open, setOpen] = createSignal(false);

<>
  <Button onClick={() => setOpen(true)}>Open</Button>
  <Modal
    open={open}
    onClose={() => setOpen(false)}
    title="Title"
    size="md"
    footer={
      <>
        <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
        <Button variant="primary" onClick={() => setOpen(false)}>OK</Button>
      </>
    }
  >
    <Text>Body</Text>
  </Modal>
</>`}
            />
            <PropsTable
              rows={[
                {
                  name: "open",
                  type: "boolean | (() => boolean)",
                  default: "—",
                  desc: "Visibility; signal form enables declarative bindings.",
                },
                {
                  name: "onClose",
                  type: "() => void",
                  default: "—",
                  desc: "Backdrop and close button invoke this.",
                },
                {
                  name: "size",
                  type: '"sm" | "md" | "lg"',
                  default: '"md"',
                  desc: "max-w-* on the dialog surface.",
                },
                {
                  name: "title / description",
                  type: "string",
                  default: "—",
                  desc: "Header stack; both optional.",
                },
                {
                  name: "footer",
                  type: "unknown",
                  default: "—",
                  desc: "Action row below body.",
                },
              ]}
            />
          </div>

          {/* Select */}
          <div class="ds-showcase">
            <Heading level={4} className="mb-2">
              Select
            </Heading>
            <Text size="sm" color="muted" className="mb-4">
              Headless-style combobox built with signals and{" "}
              <code class="font-mono text-primary-400">data-ek-*</code> hooks
              for open state, selected label, and chevron rotation. Emits{" "}
              <code class="font-mono text-primary-400">onChange(value)</code>{" "}
              when user picks an option. Keyboard: Enter/Space to toggle,
              Escape to close, arrows to move selection.
            </Text>
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Select
                placeholder="Choose a framework..."
                value={""}
                options={[
                  { value: "emberkit", label: "EmberKit" },
                  { value: "astro", label: "Astro" },
                  { value: "nextjs", label: "Next.js" },
                  { value: "sveltekit", label: "SvelteKit", disabled: true },
                ]}
              />
              <Select
                placeholder="With error"
                error="Selection is required"
                options={[{ value: "", label: "Option" }]}
              />
            </div>
            <CodeBlock
              code={`import { Select } from "@emberkit/ui/molecules";

<Select
  name="framework"
  placeholder="Pick one"
  options={[
    { value: "a", label: "A" },
    { value: "b", label: "B", disabled: true },
  ]}
  onChange={(v) => console.log(v)}
/>`}
            />
            <PropsTable
              rows={[
                {
                  name: "options",
                  type: "{ value, label, disabled? }[]",
                  default: "—",
                  desc: "Selectable rows.",
                },
                {
                  name: "value",
                  type: "string",
                  default: '""',
                  desc: "Initial selected value.",
                },
                {
                  name: "placeholder",
                  type: "string",
                  default: "—",
                  desc: "Empty-state label and list header row.",
                },
                {
                  name: "error",
                  type: "string",
                  default: "—",
                  desc: "Error ring + message below trigger.",
                },
                {
                  name: "onChange",
                  type: "(value: string) => void",
                  default: "—",
                  desc: "Called with option value.",
                },
                {
                  name: "disabled",
                  type: "boolean",
                  default: "false",
                  desc: "Locks the trigger.",
                },
              ]}
            />
          </div>
        </section>
        </LazyInView>

        <LazyInView class="block" minHeight="28rem" fallback={uiSectionFallback('min-h-[28rem]')}>
        {/* ═══ ORGANISMS ═══ */}
        <section id="organisms" class="scroll-mt-28">
          <div class="mb-10">
            <Badge variant="default" className="mb-2">
              Layer 3
            </Badge>
            <Heading level={2}>Organisms</Heading>
            <Text color="muted" className="mt-2">
              Complex UI sections composed of molecules and atoms.
            </Text>
          </div>

          {/* DataTable */}
          <div class="mb-12 ds-showcase">
            <Heading level={4} className="mb-2">
              DataTable
            </Heading>
            <Text size="sm" color="muted" className="mb-4">
              Server-minded table: pass{" "}
              <code class="font-mono text-primary-400">columns</code> with
              optional <code class="font-mono text-primary-400">sortable</code>{" "}
              and
              <code class="font-mono text-primary-400"> render(row)</code> for
              custom cells. Sorting UI toggles direction display but wiring{" "}
              <code class="font-mono text-primary-400">onSort</code> to your data
              is app-specific.
            </Text>
            <DataTable
              columns={[
                { key: "name", label: "Name", sortable: true },
                { key: "role", label: "Role", sortable: true },
                {
                  key: "status",
                  label: "Status",
                  render: (row: Record<string, string>) =>
                    row.status === "Active" ? (
                      <Badge variant="success">Active</Badge>
                    ) : (
                      <Badge variant="error">Inactive</Badge>
                    ),
                },
              ]}
              rows={[
                { name: "John Doe", role: "Developer", status: "Active" },
                { name: "Jane Smith", role: "Designer", status: "Active" },
                { name: "Bob Johnson", role: "PM", status: "Inactive" },
              ]}
            />
            <CodeBlock
              code={`import { DataTable } from "@emberkit/ui/organisms";

<DataTable
  columns={[
    { key: "id", label: "ID", sortable: true },
    { key: "name", label: "Name", render: (r) => <strong>{r.name}</strong> },
  ]}
  rows={[{ id: "1", name: "Acme" }]}
  onSort={(key) => reorderBy(key)}
  sortKey="id"
  sortDirection="asc"
/>`}
            />
            <PropsTable
              rows={[
                {
                  name: "columns",
                  type: "Column<T>[]",
                  default: "—",
                  desc: "key, label, sortable?, render?, className?.",
                },
                {
                  name: "rows",
                  type: "T[]",
                  default: "—",
                  desc: "Row objects keyed by column.key.",
                },
                {
                  name: "loading",
                  type: "boolean",
                  default: "false",
                  desc: "Shows centered Spinner in tbody.",
                },
                {
                  name: "emptyMessage",
                  type: "string",
                  default: '"No data available"',
                  desc: "Copy when rows length is 0.",
                },
                {
                  name: "onRowClick",
                  type: "(row: T) => void",
                  default: "—",
                  desc: "Cursor + hover row; invokes with row data.",
                },
                {
                  name: "sortKey / sortDirection / onSort",
                  type: "string / asc|desc / (key) => void",
                  default: "—",
                  desc: "Controlled sort indicators on headers.",
                },
              ]}
            />
          </div>

          {/* Pagination */}
          <div class="mb-12 ds-showcase">
            <Heading level={4} className="mb-2">
              Pagination
            </Heading>
            <Text size="sm" color="muted" className="mb-4">
              Ellipsis window around the active page, Previous/Next via{" "}
              <code class="font-mono text-primary-400">Button outline</code>.
              Fully controlled: you store current page and fetch or slice data in{" "}
              <code class="font-mono text-primary-400">onPageChange</code>.
            </Text>
            <Pagination
              currentPage={page()}
              totalPages={10}
              onPageChange={(p) => setPage(p)}
            />
            <CodeBlock
              code={`import { Pagination } from "@emberkit/ui/organisms";
import { createSignal } from "@emberkit/core";

const [page, setPage] = createSignal(1);

<Pagination
  currentPage={page()}
  totalPages={42}
  onPageChange={(p) => setPage(p)}
/>`}
            />
            <PropsTable
              rows={[
                {
                  name: "currentPage",
                  type: "number",
                  default: "—",
                  desc: "1-based active page index.",
                },
                {
                  name: "totalPages",
                  type: "number",
                  default: "—",
                  desc: "Last page number (>= 1).",
                },
                {
                  name: "onPageChange",
                  type: "(page: number) => void",
                  default: "—",
                  desc: "Called when user picks a page or prev/next.",
                },
                {
                  name: "className",
                  type: "string",
                  default: "—",
                  desc: "Extra classes on nav wrapper.",
                },
              ]}
            />
          </div>
        </section>
        </LazyInView>

        {/* ═══ DESIGN TOKENS ═══ */}
        <section id="tokens" class="scroll-mt-28">
          <div class="mb-10">
            <Badge variant="default" className="mb-2">
              System
            </Badge>
            <Heading level={2}>Design Tokens</Heading>
            <Text color="muted" className="mt-2">
              Tailwind 4 theme — Orange Ember high-contrast dark palette.
            </Text>
          </div>

          {/* Primary Scale */}
          <div class="mb-12">
            <Heading level={4} className="mb-2">
              Primary — Ember/Orange
            </Heading>
            <Text color="muted" size="sm" className="mb-5">
              Full scale from lightest to darkest orange.
            </Text>
            <div class="ds-showcase">
              <div class="grid grid-cols-5 gap-3 sm:grid-cols-10">
                {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map(
                  (shade) => (
                    <div key={shade} class="text-center group">
                      <div
                        class="h-16 w-full rounded-xl border border-white/10 shadow-inner transition-transform duration-200 group-hover:scale-110 group-hover:shadow-lg group-hover:z-10 relative"
                        style={{
                          backgroundColor: `var(--color-primary-${shade})`,
                        }}
                      />
                      <Text size="xs" color="muted" className="mt-2 font-mono">
                        {shade}
                      </Text>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>

          {/* Surface Scale */}
          <div class="mb-12">
            <Heading level={4} className="mb-2">
              Surface — Dark Neutral
            </Heading>
            <Text color="muted" size="sm" className="mb-5">
              Inverted for dark mode — 50 is darkest, 900 is lightest.
            </Text>
            <div class="ds-showcase">
              <div class="grid grid-cols-5 gap-3 sm:grid-cols-10">
                {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map(
                  (shade) => (
                    <div key={shade} class="text-center group">
                      <div
                        class="h-16 w-full rounded-xl border border-white/10 shadow-inner transition-all duration-200 group-hover:scale-110 group-hover:shadow-lg group-hover:z-10 relative"
                        style={{
                          backgroundColor: `var(--color-surface-${shade})`,
                        }}
                      />
                      <Text size="xs" color="muted" className="mt-2 font-mono">
                        {shade}
                      </Text>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>

          {/* Semantic Colors */}
          <div class="mb-12">
            <Heading level={4} className="mb-2">
              Semantic Colors
            </Heading>
            <Text color="muted" size="sm" className="mb-5">
              Status colors for feedback and state.
            </Text>
            <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {(["success", "warning", "error", "info"] as const).map(
                (name) => (
                  <div
                    key={name}
                    class="ds-showcase p-5 text-center group hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <div
                      class="mx-auto mb-3 h-10 w-10 rounded-xl shadow-lg transition-transform duration-200 group-hover:scale-110"
                      style={{ backgroundColor: `var(--color-${name}-500)` }}
                    />
                    <Text
                      size="sm"
                      weight="semibold"
                      className="capitalize text-surface-800"
                    >
                      {name}
                    </Text>
                    <Text size="xs" color="muted" className="font-mono mt-1">
                      {name === "success"
                        ? "#16a34a"
                        : name === "warning"
                          ? "#d97706"
                          : name === "error"
                            ? "#dc2626"
                            : "#0891b2"}
                    </Text>
                    <div class="flex gap-1.5 mt-3 justify-center">
                      <div
                        class="h-3 w-3 rounded-full border border-white/20"
                        style={{ backgroundColor: `var(--color-${name}-50)` }}
                        title="50"
                      />
                      <div
                        class="h-3 w-3 rounded-full border border-white/20"
                        style={{ backgroundColor: `var(--color-${name}-500)` }}
                        title="500"
                      />
                      <div
                        class="h-3 w-3 rounded-full border border-white/20"
                        style={{ backgroundColor: `var(--color-${name}-900)` }}
                        title="900"
                      />
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>

          {/* Glassmorphism */}
          <div class="mb-12">
            <Heading level={4} className="mb-2">
              Glassmorphism
            </Heading>
            <Text color="muted" size="sm" className="mb-5">
              Utility classes for frosted glass effects.
            </Text>
            <div class="grid grid-cols-3 gap-4">
              {[
                { cls: "glass", label: ".glass", desc: "Light frost" },
                {
                  cls: "glass-strong",
                  label: ".glass-strong",
                  desc: "Deep frost",
                },
                {
                  cls: "glass-card",
                  label: ".glass-card",
                  desc: "Card surface",
                },
              ].map((g) => (
                <div
                  key={g.cls}
                  class={`${g.cls} rounded-2xl p-6 text-center hover:scale-[1.02] transition-transform duration-200`}
                >
                  <Text weight="semibold" className="text-surface-800">
                    {g.label}
                  </Text>
                  <Text size="sm" color="muted">
                    {g.desc}
                  </Text>
                </div>
              ))}
            </div>
            <div class="mt-4 grid grid-cols-2 gap-4">
              {[
                { cls: "glow-primary", label: ".glow-primary" },
                { cls: "glow-accent", label: ".glow-accent" },
              ].map((g) => (
                <div
                  key={g.cls}
                  class={`glass rounded-2xl p-5 text-center ${g.cls}`}
                >
                  <Text weight="semibold" className="text-surface-800">
                    {g.label}
                  </Text>
                </div>
              ))}
            </div>
          </div>

          {/* Typography */}
          <div class="ds-showcase p-8">
            <Heading level={4} className="mb-2">
              Typography
            </Heading>
            <Text color="muted" size="sm" className="mb-6">
              Font scale with Inter and JetBrains Mono.
            </Text>
            <div class="space-y-4">
              {[
                {
                  name: "4xl",
                  size: "2.25rem",
                  px: "36px",
                  weight: "font-bold",
                  cls: "text-4xl font-bold",
                },
                {
                  name: "3xl",
                  size: "1.875rem",
                  px: "30px",
                  weight: "font-semibold",
                  cls: "text-3xl font-semibold",
                },
                {
                  name: "2xl",
                  size: "1.5rem",
                  px: "24px",
                  weight: "font-semibold",
                  cls: "text-2xl font-semibold",
                },
                {
                  name: "xl",
                  size: "1.25rem",
                  px: "20px",
                  weight: "font-semibold",
                  cls: "text-xl font-semibold",
                },
                {
                  name: "lg",
                  size: "1.125rem",
                  px: "18px",
                  weight: "font-medium",
                  cls: "text-lg font-medium",
                },
                {
                  name: "base",
                  size: "1rem",
                  px: "16px",
                  weight: "font-normal",
                  cls: "text-base",
                },
                {
                  name: "sm",
                  size: "0.875rem",
                  px: "14px",
                  weight: "font-normal",
                  cls: "text-sm text-surface-500",
                },
                {
                  name: "xs",
                  size: "0.75rem",
                  px: "12px",
                  weight: "font-normal",
                  cls: "text-xs text-surface-500",
                },
              ].map((t) => (
                <div
                  key={t.name}
                  class="flex items-center justify-between border-b border-white/5 pb-4 last:border-b-0 last:pb-0 group hover:bg-white/[0.02] -mx-2 px-2 rounded-lg transition-colors duration-150"
                >
                  <div class="flex items-baseline gap-4">
                    <span class={t.cls}>{t.name}</span>
                    <span class="text-xs text-surface-600 font-mono">
                      {t.weight}
                    </span>
                  </div>
                  <Text
                    size="xs"
                    color="muted"
                    className="font-mono tabular-nums"
                  >
                    {t.size} / {t.px}
                  </Text>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer class="border-t border-white/10 pt-10 text-center">
          <Text size="sm" color="muted">
            Built with{" "}
            <Icon name="zap" size={14} className="inline text-primary-400" />{" "}
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
