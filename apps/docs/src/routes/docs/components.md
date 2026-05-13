# Components

EmberKit components are plain functions that return JSX elements. They follow the same mental model as React but with zero runtime overhead by default.

## Defining a Component

```tsx
function Button({ children, variant = 'primary' }: { children: unknown; variant?: string }) {
  return (
    <button className={`btn btn-${variant}`}>
      {children}
    </button>
  );
}
```

Components receive a single props object and return JSX. There are no class components, no lifecycle methods, and no `this` binding.

## Using Components

```tsx
function App() {
  return (
    <div>
      <Button>Click me</Button>
      <Button variant="secondary">Cancel</Button>
    </div>
  );
}
```

## Children

Components can accept `children` to act as wrappers:

```tsx
function Card({ children, title }: { children: unknown; title: string }) {
  return (
    <div className="card">
      <h3 className="card-title">{title}</h3>
      <div className="card-body">{children}</div>
    </div>
  );
}
```

## Conditional Rendering

Use JavaScript expressions for conditional output:

```tsx
function Status({ online }: { online: boolean }) {
  return (
    <div>
      {online ? <span className="badge-green">Online</span> : <span className="badge-red">Offline</span>}
    </div>
  );
}
```

## Lists

Use `map` to render lists with `key` props:

```tsx
function TodoList({ items }: { items: string[] }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
```

## Static vs Interactive

EmberKit makes a key distinction:

- **Static components** (no event handlers, no signal bindings) render to pure HTML with zero JavaScript
- **Interactive components** (with `onClick`, `onChange`, etc. or `data-ek-bind`) receive targeted client-side hydration

```tsx
// Static: renders to <h1>Hello</h1>, no JS shipped
function Title() {
  return <h1>Hello</h1>;
}

// Interactive via event handler (data-ekclick)
function Counter() {
  const [count, setCount] = createSignal(0);
  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>+</button>
      <span data-ek-bind={count}>{count()}</span>
    </div>
  );
}

// Interactive via signal binding only (no events, still gets JS)
function LiveTime() {
  const [time, setTime] = createSignal(new Date().toLocaleTimeString());
  setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
  return <p data-ek-bind={time}>{time()}</p>;
}
```

Components can accept signals directly — the component decides whether to apply bindings:

```tsx
// Consumer passes the signal, component handles binding
<Modal open={open} onClose={() => setOpen(false)} />

// Component implementation
function Modal({ open, onClose }: { open: (() => boolean) | boolean; onClose: () => void }) {
  const isSignal = typeof open === 'function' && (open as any).__idx != null;
  const openVal = isSignal ? (open as () => boolean)() : open;
  const bindAttr = isSignal ? { 'data-ek-bind': open, 'data-ek-show': 'opacity-100', 'data-ek-hide': 'opacity-0 pointer-events-none' } : {};

  return <div class={openVal ? 'opacity-100' : 'opacity-0 pointer-events-none'} {...bindAttr}>...</div>;
}
```

See [Hydration](/docs/hydration) for the complete `data-ek-bind` reference.

## Props Interface

Define prop types with TypeScript interfaces:

```tsx
interface ButtonProps {
  children: unknown;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
}

function Button({ children, variant = 'primary', size = 'md', disabled, onClick }: ButtonProps) {
  return (
    <button
      className={`btn btn-${variant} btn-${size}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

## Next Steps

- [Routing](/docs/routing) - File-based routing
- [Signals](/docs/signals) - Reactive state
- [Context](/docs/context) - Shared state across components
