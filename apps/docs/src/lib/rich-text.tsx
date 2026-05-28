import type { JSXNode } from '@emberkit/core';

/** Minimal inline markers for translated strings: {strong}…{/strong}, {brand}…{/brand} */
export function renderRichText(text: string): JSXNode {
  const parts = text.split(/(\{strong\}|\{\/strong\}|\{brand\}|\{\/brand\})/);
  const nodes: JSXNode[] = [];
  let mode: 'plain' | 'strong' | 'brand' = 'plain';

  for (const part of parts) {
    if (part === '{strong}') {
      mode = 'strong';
      continue;
    }
    if (part === '{/strong}') {
      mode = 'plain';
      continue;
    }
    if (part === '{brand}') {
      mode = 'brand';
      continue;
    }
    if (part === '{/brand}') {
      mode = 'plain';
      continue;
    }
    if (!part) continue;

    if (mode === 'strong') {
      nodes.push(<strong className="text-white font-semibold">{part}</strong>);
    } else if (mode === 'brand') {
      nodes.push(
        <span className="bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
          {part}
        </span>,
      );
    } else {
      nodes.push(part);
    }
  }

  return <>{nodes}</>;
}
