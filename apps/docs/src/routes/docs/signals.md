# Signals

Signals are EmberKit's reactive primitives. They track state changes and automatically re-run effects when values update.

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

// Set based on previous value
setCount((prev) => prev + 1);
```

## Signal Options

```tsx
const [name, setName] = createSignal('Alice', {
  equals: (prev, next) => prev === next, // custom equality check
});
```

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
    </div>
  );
}
```

## Next Steps

- [Context](/docs/context) - Share signals across components
- [Components](/docs/components) - Component patterns
- [Routing](/docs/routing) - Route loaders and data fetching
