let headBuffer: string[] = [];

export function registerHeadContent(html: string): void {
  headBuffer.push(html);
}

export function drainHeadContent(): string {
  const content = headBuffer.join('\n');
  headBuffer = [];
  return content;
}

export function peekHeadContent(): string {
  return headBuffer.join('\n');
}

export function clearHeadContent(): void {
  headBuffer = [];
}
