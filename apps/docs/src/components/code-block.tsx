import type { JSXNode } from '@emberkit/core';

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const keywords = new Set([
  'import', 'export', 'from', 'const', 'let', 'var', 'function', 'return',
  'if', 'else', 'for', 'while', 'class', 'extends', 'new', 'delete',
  'typeof', 'instanceof', 'async', 'await', 'try', 'catch', 'finally',
  'throw', 'default', 'as', 'implements', 'interface', 'type', 'enum',
  'declare', 'abstract', 'static', 'readonly', 'public', 'private',
  'protected', 'override', 'switch', 'case', 'break', 'continue',
  'yield', 'with', 'debugger',
]);

const literals = new Set(['true', 'false', 'null', 'undefined', 'this', 'super']);

function tokenizeLine(line: string): JSXNode[] {
  const tokens: JSXNode[] = [];
  let remaining = line;

  while (remaining.length > 0) {
    let match: RegExpMatchArray | null;

    // Single-line comment
    match = remaining.match(/^\/\/.*/);
    if (match) {
      tokens.push({ type: 'span', props: { className: 'cm', children: [esc(match[0])] } });
      remaining = remaining.slice(match[0].length);
      continue;
    }

    // Strings (single or double quoted, with basic escape support)
    match = remaining.match(/^'(?:[^'\\]|\\.)*'/);
    if (!match) match = remaining.match(/^"(?:[^"\\]|\\.)*"/);
    if (match) {
      tokens.push({ type: 'span', props: { className: 'str', children: [esc(match[0])] } });
      remaining = remaining.slice(match[0].length);
      continue;
    }

    // JSX closing tag: </Name>
    match = remaining.match(/^<\/([A-Za-z][\w.]*)>/);
    if (match) {
      tokens.push(esc('</'));
      tokens.push({ type: 'span', props: { className: 'tag', children: [match[1]] } });
      tokens.push(esc('>'));
      remaining = remaining.slice(match[0].length);
      continue;
    }

    // JSX opening / self-closing tag start: <Name
    match = remaining.match(/^<([A-Za-z][\w.]*)/);
    if (match) {
      tokens.push(esc('<'));
      tokens.push({ type: 'span', props: { className: 'tag', children: [match[1]] } });
      remaining = remaining.slice(match[0].length);
      continue;
    }

    // Numbers
    match = remaining.match(/^\d+\.?\d*/);
    if (match) {
      tokens.push({ type: 'span', props: { className: 'num', children: [match[0]] } });
      remaining = remaining.slice(match[0].length);
      continue;
    }

    // Identifiers: keywords, literals, capitalized (components), or plain
    match = remaining.match(/^[a-zA-Z_$][\w$]*/);
    if (match) {
      const word = match[0];
      if (keywords.has(word) || literals.has(word)) {
        tokens.push({ type: 'span', props: { className: 'kw', children: [word] } });
      } else if (/^[A-Z]/.test(word)) {
        tokens.push({ type: 'span', props: { className: 'fn', children: [word] } });
      } else {
        tokens.push(word);
      }
      remaining = remaining.slice(word.length);
      continue;
    }

    // Operators and punctuation
    match = remaining.match(/^[{}()\[\];,.:!?%^*+\-\/=<>|]+/);
    if (match) {
      tokens.push({ type: 'span', props: { className: 'op', children: [esc(match[0])] } });
      remaining = remaining.slice(match[0].length);
      continue;
    }

    // Whitespace (pass through)
    match = remaining.match(/^\s+/);
    if (match) {
      tokens.push(match[0]);
      remaining = remaining.slice(match[0].length);
      continue;
    }

    tokens.push(remaining[0]);
    remaining = remaining.slice(1);
  }

  return tokens;
}

export function CodeBlock(props: Record<string, unknown>): JSXNode {
  const code = String(props.code || '');
  const lang = String(props.language || 'tsx');
  const lines = code.split('\n');

  const highlightedLines = lines.map((line) => {
    if (line === '') {
      return { type: 'br', props: {} };
    }
    const tokens = tokenizeLine(line);
    return { type: 'span', props: { className: 'line', children: [tokens, { type: 'br', props: {} }] } };
  });

  return {
    type: 'pre',
    props: {
      className: 'overflow-x-auto p-6 text-sm leading-7 text-gray-300',
      children: [
        {
          type: 'code',
          props: {
            className: `language-${lang}`,
            children: highlightedLines,
          },
        },
      ],
    },
  };
}