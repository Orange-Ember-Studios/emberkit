export const signalTemplate = `import { signal, computed, effect } from '@emberkit/core';

// Writable signal
const count = signal(0);

// Computed value
const doubled = computed(() => count.value * 2);

// Side effect
effect(() => {
  console.log('Count changed to:', count.value);
});

// Update
count.value++;

// Batch updates
import { batch } from '@emberkit/core';

batch(() => {
  count.value = 10;
});

export { count, doubled };
`;