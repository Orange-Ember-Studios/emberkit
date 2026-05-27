import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it, expect } from 'vitest';
import { sqlRawPlugin } from '../sql-raw.js';

describe('sqlRawPlugin', () => {
  it('bundles bare .sql imports as default export strings', () => {
    const dir = mkdtempSync(join(tmpdir(), 'emberkit-sql-'));
    const file = join(dir, '001_users.sql');
    writeFileSync(file, 'CREATE TABLE users (id TEXT);');

    const plugin = sqlRawPlugin();
    const result = plugin.load?.(file);
    expect(result).toMatchObject({
      code: expect.stringContaining('CREATE TABLE users'),
    });
  });

  it('bundles .sql?raw imports', () => {
    const dir = mkdtempSync(join(tmpdir(), 'emberkit-sql-'));
    const file = join(dir, '002_posts.sql');
    writeFileSync(file, 'CREATE TABLE posts (id TEXT);');

    const plugin = sqlRawPlugin();
    const result = plugin.load?.(`${file}?raw`);
    expect(result).toMatchObject({
      code: expect.stringContaining('CREATE TABLE posts'),
    });
  });
});
