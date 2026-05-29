import type { FC, JSXNode } from "@emberkit/core";

// ─── HTML escape ─────────────────────────────────────────────────────────────

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function span(cls: string, text: string): JSXNode {
  return { type: "span", props: { className: cls, children: [text] } };
}

// ─── TypeScript / TSX ────────────────────────────────────────────────────────

const tsKeywords = new Set([
  "import", "export", "from", "const", "let", "var", "function", "return",
  "if", "else", "for", "while", "class", "extends", "new", "delete",
  "typeof", "instanceof", "async", "await", "try", "catch", "finally",
  "throw", "default", "as", "implements", "interface", "type", "enum",
  "declare", "abstract", "static", "readonly", "public", "private",
  "protected", "override", "switch", "case", "break", "continue",
  "yield", "with", "debugger", "satisfies", "keyof", "infer", "is",
  "namespace", "module", "in", "of",
]);

const tsLiterals = new Set(["true", "false", "null", "undefined", "this", "super"]);

function tokenizeTSLine(line: string): JSXNode[] {
  const tokens: JSXNode[] = [];
  let remaining = line;

  while (remaining.length > 0) {
    let m: RegExpMatchArray | null;

    m = remaining.match(/^\/\/.*/);
    if (m) { tokens.push(span("cm", esc(m[0]))); remaining = remaining.slice(m[0].length); continue; }

    m = remaining.match(/^`[^`]*`/);
    if (m) { tokens.push(span("str", esc(m[0]))); remaining = remaining.slice(m[0].length); continue; }

    m = remaining.match(/^'(?:[^'\\]|\\.)*'/) ?? remaining.match(/^"(?:[^"\\]|\\.)*"/);
    if (m) { tokens.push(span("str", esc(m[0]))); remaining = remaining.slice(m[0].length); continue; }

    m = remaining.match(/^<\/([A-Za-z][\w.]*)>/);
    if (m) {
      tokens.push(esc("</"));
      tokens.push(span("tag", m[1]!));
      tokens.push(esc(">"));
      remaining = remaining.slice(m[0].length);
      continue;
    }

    m = remaining.match(/^<([A-Za-z][\w.]*)/);
    if (m) {
      tokens.push(esc("<"));
      tokens.push(span("tag", m[1]!));
      remaining = remaining.slice(m[0].length);
      continue;
    }

    m = remaining.match(/^\d+\.?\d*/);
    if (m) { tokens.push(span("num", m[0])); remaining = remaining.slice(m[0].length); continue; }

    m = remaining.match(/^[a-zA-Z_$][\w$]*/);
    if (m) {
      const word = m[0];
      const ahead = remaining.slice(word.length);
      if (tsKeywords.has(word) || tsLiterals.has(word)) {
        tokens.push(span("kw", word));
      } else if (/^[A-Z]/.test(word) && word.length > 1) {
        tokens.push(span("type", word));
      } else if (/^\s*\(/.test(ahead)) {
        tokens.push(span("fn", word));
      } else {
        tokens.push(word);
      }
      remaining = remaining.slice(word.length);
      continue;
    }

    m = remaining.match(/^[{}()[\];,.:!?%^*+\-/=<>|&@~]+/);
    if (m) { tokens.push(span("op", esc(m[0]))); remaining = remaining.slice(m[0].length); continue; }

    m = remaining.match(/^\s+/);
    if (m) { tokens.push(m[0]); remaining = remaining.slice(m[0].length); continue; }

    tokens.push(remaining[0]);
    remaining = remaining.slice(1);
  }

  return tokens;
}

// ─── Bash ────────────────────────────────────────────────────────────────────

const bashCommands = new Set([
  "sudo", "cd", "mkdir", "rm", "cp", "mv", "ls", "cat", "echo",
  "npm", "pnpm", "yarn", "bun", "deno", "node", "npx", "git",
  "curl", "wget", "chmod", "export", "source", "grep", "find",
  "docker", "kubectl", "touch", "open", "which",
]);

function tokenizeBashLine(line: string): JSXNode[] {
  if (line.trimStart().startsWith("#")) return [span("cm", esc(line))];

  const tokens: JSXNode[] = [];
  let remaining = line;

  while (remaining.length > 0) {
    let m: RegExpMatchArray | null;

    m = remaining.match(/^'[^']*'/) ?? remaining.match(/^"[^"]*"/);
    if (m) { tokens.push(span("str", esc(m[0]))); remaining = remaining.slice(m[0].length); continue; }

    m = remaining.match(/^(--?[\w-]+)/);
    if (m) { tokens.push(span("attr", m[1]!)); remaining = remaining.slice(m[1]!.length); continue; }

    m = remaining.match(/^(\$[\w{][^}\s]*}?)/);
    if (m) { tokens.push(span("val", m[1]!)); remaining = remaining.slice(m[1]!.length); continue; }

    m = remaining.match(/^([a-zA-Z][\w.-]*)/);
    if (m) {
      tokens.push(bashCommands.has(m[1]!) ? span("kw", m[1]!) : m[1]!);
      remaining = remaining.slice(m[1]!.length);
      continue;
    }

    m = remaining.match(/^([|&;<>]+)/);
    if (m) { tokens.push(span("op", esc(m[1]!))); remaining = remaining.slice(m[1]!.length); continue; }

    tokens.push(esc(remaining.charAt(0)));
    remaining = remaining.slice(1);
  }

  return tokens;
}

// ─── CSS ─────────────────────────────────────────────────────────────────────

const cssValueKws = new Set([
  "none", "auto", "inherit", "initial", "unset", "revert", "flex", "grid",
  "block", "inline", "absolute", "relative", "fixed", "sticky", "center",
  "left", "right", "top", "bottom", "normal", "bold", "italic", "solid",
  "dashed", "dotted", "transparent", "currentColor",
]);

function tokenizeCSSLine(line: string): JSXNode[] {
  const tokens: JSXNode[] = [];
  let remaining = line;

  while (remaining.length > 0) {
    let m: RegExpMatchArray | null;

    m = remaining.match(/^\/\*.*?\*\//);
    if (m) { tokens.push(span("cm", esc(m[0]))); remaining = remaining.slice(m[0].length); continue; }

    m = remaining.match(/^'[^']*'/) ?? remaining.match(/^"[^"]*"/);
    if (m) { tokens.push(span("str", esc(m[0]))); remaining = remaining.slice(m[0].length); continue; }

    m = remaining.match(/^@[\w-]+/);
    if (m) { tokens.push(span("kw", m[0])); remaining = remaining.slice(m[0].length); continue; }

    m = remaining.match(/^#[0-9a-fA-F]{3,8}\b/);
    if (m) { tokens.push(span("num", m[0])); remaining = remaining.slice(m[0].length); continue; }

    m = remaining.match(/^\d+\.?\d*(?:px|em|rem|vh|vw|%|s|ms|deg|fr)?/);
    if (m && m[0].length > 0) { tokens.push(span("num", m[0])); remaining = remaining.slice(m[0].length); continue; }

    m = remaining.match(/^([\w-]+)(\s*:)/);
    if (m) {
      tokens.push(span("attr", m[1]!));
      tokens.push(span("op", m[2]!));
      remaining = remaining.slice(m[0].length);
      continue;
    }

    m = remaining.match(/^([a-zA-Z][\w-]*)/);
    if (m) {
      tokens.push(cssValueKws.has(m[1]!) ? span("val", m[1]!) : m[1]!);
      remaining = remaining.slice(m[1]!.length);
      continue;
    }

    m = remaining.match(/^[.#:]+[\w-]*/);
    if (m) { tokens.push(span("type", m[0])); remaining = remaining.slice(m[0].length); continue; }

    tokens.push(esc(remaining.charAt(0)));
    remaining = remaining.slice(1);
  }

  return tokens;
}

// ─── Public tokenizer ────────────────────────────────────────────────────────

type LineTokenizer = (line: string) => JSXNode[];

function pickTokenizer(language: string): LineTokenizer {
  if (language === "bash" || language === "sh" || language === "shell") return tokenizeBashLine;
  if (language === "css" || language === "scss" || language === "sass" || language === "less") return tokenizeCSSLine;
  return tokenizeTSLine;
}

/** Tokenize a multi-line code string into JSXNode[] for use as children of a <code> element. */
export function tokenizeCode(code: string, language = "tsx"): JSXNode[] {
  const tokenizeLine = pickTokenizer(language);
  const lines = code.split("\n");
  const result: JSXNode[] = [];
  lines.forEach((line, i) => {
    if (i > 0) result.push("\n");
    result.push(...tokenizeLine(line));
  });
  return result;
}

// ─── Component ───────────────────────────────────────────────────────────────

export interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
  [key: string]: unknown;
}

const CodeBlock: FC<CodeBlockProps> = ({ code, language = "tsx", className }) => {
  const highlighted = tokenizeCode(code, language);
  return (
    <div class={`relative mt-4 rounded-xl border border-white/10 bg-black/35${className ? ` ${className}` : ""}`}>
      <pre class="m-0 overflow-x-auto p-4 pr-20 text-xs font-mono leading-relaxed text-surface-700">
        <code class={`language-${language}`}>{highlighted}</code>
      </pre>
      <button
        type="button"
        aria-label="Copy code to clipboard"
        class="absolute top-2 right-2 rounded-lg border border-white/10 bg-surface-200/40 px-2.5 py-1 text-xs font-medium text-gray-300 transition-colors hover:text-white"
        onClick={(e: MouseEvent) => {
          void navigator.clipboard.writeText(code);
          const t = e.currentTarget as HTMLButtonElement;
          const prev = t.textContent;
          t.textContent = "Copied";
          setTimeout(() => {
            t.textContent = prev ?? "Copy";
          }, 1500);
        }}
      >
        Copy
      </button>
    </div>
  );
};

export { CodeBlock };
