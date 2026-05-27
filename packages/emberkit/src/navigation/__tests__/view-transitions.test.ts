import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { supportsViewTransitions, waitForAppUpdate } from '../helpers/view-transitions.js';

describe('view-transitions', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="app"><p>Home</p></div>';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('reports API support when startViewTransition exists', () => {
    const original = document.startViewTransition;
    (document as Document & { startViewTransition?: typeof original }).startViewTransition =
      vi.fn() as typeof original;
    expect(supportsViewTransitions()).toBe(true);
    if (original) {
      document.startViewTransition = original;
    } else {
      delete (document as Document & { startViewTransition?: typeof original })
        .startViewTransition;
    }
  });

  it('waitForAppUpdate resolves after #app mutates', async () => {
    const promise = waitForAppUpdate('/next');
    await Promise.resolve();
    const app = document.getElementById('app');
    app!.innerHTML = '<p>Next</p>';
    await promise;
    expect(window.location.pathname).toContain('/next');
  });
});
