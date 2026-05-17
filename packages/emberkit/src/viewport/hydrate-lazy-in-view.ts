import { hydrateSubtree } from '../runtime/index.js';
import { renderToString } from '../runtime/helpers/render.js';
import type { JSXElement, JSXNode } from '../runtime/types.js';
import { getLazyContent, unregisterLazyContent } from './registry.js';
import { observeOnce } from './observe-once.js';

function getLazyHosts(container: Element): Element[] {
  const hosts: Element[] = [];

  if (
    container.matches('[data-ek-lazy-in-view]:not([data-ek-lazy-loaded])')
  ) {
    hosts.push(container);
  }

  hosts.push(
    ...Array.from(container.querySelectorAll('[data-ek-lazy-in-view]:not([data-ek-lazy-loaded])')),
  );

  return hosts;
}

export function hydrateLazyInView(container: Element): void {
  const hosts = getLazyHosts(container);

  hosts.forEach((host) => {
    const id = host.getAttribute('data-ek-lazy-in-view');
    const rootMargin = host.getAttribute('data-ek-lazy-root-margin') ?? '200px';

    if (!id) {
      return;
    }

    observeOnce(
      host,
      () => {
        const loader = getLazyContent(id);

        if (!loader) {
          return;
        }

        const content = loader();
        const html =
          content == null || content === false
            ? ''
            : typeof content === 'string' || typeof content === 'number'
              ? String(content)
              : renderToString(content as JSXElement);

        host.innerHTML = html;
        host.setAttribute('data-ek-lazy-loaded', 'true');
        host.removeAttribute('aria-busy');
        hydrateSubtree(host);

        if (host.getAttribute('data-ek-lazy-once') !== 'false') {
          unregisterLazyContent(id);
        }
      },
      { rootMargin },
    );
  });
}
