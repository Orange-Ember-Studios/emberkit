# Signals

Signals are EmberKit's reactive primitives. They store state and notify subscribers when values change — without re-rendering the entire page.

## Creating a Signal

```tsx
import { createSignal } from '@emberkit/core';

const [count, setCount] = createSignal(0);

// Read the value
console.log(count()); // 0

// Update the value
setCount(1);
console.log(count()); // 1
```

A signal returns a tuple: a getter function and a setter function.

## Updating Signals

```tsx
// Set a static value
setCount(5);

// Set based on previous value (function updater syntax)
setCount((prev) => prev + 1);
```

## Signal Options

```tsx
const [name, setName] = createSignal('Alice', {
  equals: (prev, next) => prev === next, // custom equality check
});
```

## Subscribing to Changes

Every signal has a `subscribe` method that registers a callback, fired whenever the value changes. The callback receives the new value.

```tsx
const [count, setCount] = createSignal(0);

const unsub = count.subscribe((newVal) => {
  console.log('count changed to', newVal);
});

setCount(5); // logs "count changed to 5"

// Clean up subscription when done
unsub();
```

This is the foundation for EmberKit's [zero-JS DOM binding](#dom-binding-with-data-ek-hydrate) — the hydration system uses `subscribe` internally to update specific DOM elements when a signal changes, without re-rendering the whole page.

## Computed Values with createMemo

`createMemo` derives a value from other signals. It only recalculates when dependencies change:

```tsx
import { createSignal, createMemo } from '@emberkit/core';

const [count, setCount] = createSignal(0);
const doubled = createMemo(() => count() * 2);

console.log(doubled.value); // 0
setCount(3);
console.log(doubled.value); // 6
```

## Effects with createEffect

Effects run side effects when signals change:

```tsx
import { createSignal, createEffect } from '@emberkit/core';

const [theme, setTheme] = createSignal('light');

createEffect(() => {
  document.body.className = theme();
});

// Later: triggers the effect
setTheme('dark');
```

Effects can return a cleanup function:

```tsx
createEffect(() => {
  const handler = () => console.log('resize');
  window.addEventListener('resize', handler);
  
  return () => {
    window.removeEventListener('resize', handler);
  };
});
```

## Batch Updates

`batch` groups multiple signal updates into a single notification:

```tsx
import { createSignal, batch } from '@emberkit/core';

const [firstName, setFirstName] = createSignal('John');
const [lastName, setLastName] = createSignal('Doe');

batch(() => {
  setFirstName('Jane');
  setLastName('Smith');
});
// Only one notification sent
```

## Untracking

`untrack` reads a signal without tracking it as a dependency:

```tsx
const [count, setCount] = createSignal(0);

createEffect(() => {
  // count() is tracked here
  console.log(count());
  
  untrack(() => {
    // this read is NOT tracked
    console.log(count());
  });
});
```

## DOM Binding with data-ek-bind

Signals can drive DOM updates directly — no re-render needed. The framework embeds the signal's identity into the HTML, and a tiny hydration script connects the signal to its DOM element at load time.

### Basic usage — textContent

Pass the signal getter directly as `data-ek-bind`. The element's `textContent` updates automatically when the signal changes:

```tsx
import { createSignal } from '@emberkit/core';

const [count, setCount] = createSignal(0);

return <span data-ek-bind={count}>{count()}</span>;
```

### Show / Hide with CSS classes

Add `data-ek-show` and `data-ek-hide` to toggle CSS classes based on truthiness:

```tsx
const [open, setOpen] = createSignal(false);

return (
  <div>
    <button onClick={() => setOpen(true)}>Open</button>
    <div data-ek-bind={open} data-ek-show="opacity-100" data-ek-hide="opacity-0 pointer-events-none" class="opacity-0 pointer-events-none">
      Panel content
    </div>
  </div>
);
```

### Components can accept signals directly

Components detect signal props automatically and apply bindings internally:

```tsx
// Modal detects `open` is a signal and auto-wires data-ek-bind + show/hide
<Modal open={open} onClose={() => setOpen(false)} />
```

**How it works:**

1. **SSR** — The full HTML is rendered with `data-ek-bind="0"` (the signal's auto-assigned index). The initial class reflects the closed state. Zero JavaScript is needed to see the page.

2. **Hydration** — After the HTML is injected, the framework scans for `[data-ek-bind]` elements, finds the matching signal via a global registry, and calls `signal.subscribe()` to register a DOM update callback.

3. **Interaction** — When the button is clicked, `setOpen(true)` fires. The subscriber toggles the CSS classes on the bound element — no re-render.

**Supported attributes:**

| Attribute | Purpose |
|---|---|
| `data-ek-bind` | Accepts the signal getter directly (`data-ek-bind={count}`) |
| `data-ek-show` | Classes to add when signal value is truthy |
| `data-ek-hide` | Classes to add when signal value is falsy |
| `data-ek-show-when` | Only show when signal equals this string value (for tabs, etc.) |
| `data-ek-hide-class` | Class to toggle when using `data-ek-show-when` (defaults to `"hidden"`) |

### Tabs Example

```tsx
const [tab, setTab] = createSignal('preview');

<Tabs activeTab={tab()} onChange={(id) => setTab(id)} />
<div data-ek-bind={tab} data-ek-show-when="preview">Preview panel</div>
<div data-ek-bind={tab} data-ek-show-when="code" class="hidden">Code panel</div>
```

### Components accepting signals

Interactive components detect when a prop is a signal (has `__idx`/`subscribe`) and auto-apply bindings. Accepting signals is optional — components also accept plain values for SSR-only use.

**In component implementation:**
```tsx
// Modal checks if `open` is a signal
const isSignal = (val: unknown) => typeof val === 'function' && (val as any).__idx != null;
const openVal = isSignal(open) ? open() : open;
const bindAttr = isSignal(open) ? { 'data-ek-bind': open, 'data-ek-show': 'opacity-100', 'data-ek-hide': 'opacity-0 pointer-events-none' } : {};

return <div class={...openVal ? 'opacity-100' : 'opacity-0 pointer-events-none'} ...bindAttr />;
```

**In consumer code:**
```tsx
// Pass signal — component handles binding
<Modal open={open} onClose={() => setOpen(false)} />

// Or pass plain boolean — no binding, SSR only
<Modal open={true} />
```

## Complete Example

```tsx
import { createSignal, createMemo, createEffect } from '@emberkit/core';

function Counter() {
  const [count, setCount] = createSignal(0);
  const doubled = createMemo(() => count() * 2);
  const isEven = createMemo(() => count() % 2 === 0);

  createEffect(() => {
    document.title = `Count: ${count()}`;
  });

  return (
    <div>
      <p>Count: {count()}</p>
      <p>Doubled: {doubled.value}</p>
      <p>{isEven.value ? 'Even' : 'Odd'}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
      <button onClick={() => setCount(0)}>Reset</button>
      {/* Live DOM binding — no re-render */}
      <span data-ek-bind={count}>{count()}</span>
    </div>
  );
}
```

## Next Steps

- [Context](/docs/context) — Share signals across components
- [Components](/docs/components) — Component patterns
- [Routing](/docs/routing) — Route loaders and data fetching
- [UI Components](/docs/ui) — See signal hydration in action (Modal, Tabs, Counter)
