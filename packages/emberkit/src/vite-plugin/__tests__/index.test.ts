import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Plugin } from 'vite';
import { emberkitVitePlugin } from '../index.js';

describe('emberkitVitePlugin', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  it('should create a plugin with the correct name', () => {
    const plugin = emberkitVitePlugin();
    expect(plugin.name).toBe('emberkit:vite-plugin');
  });

  it('should enforce pre order', () => {
    const plugin = emberkitVitePlugin();
    expect(plugin.enforce).toBe('pre');
  });

  it('should return a valid plugin object', () => {
    const plugin = emberkitVitePlugin();
    expect(plugin).toBeTypeOf('object');
    expect(plugin).toHaveProperty('name');
    expect(plugin).toHaveProperty('enforce');
    expect(plugin).toHaveProperty('config');
    expect(plugin).toHaveProperty('resolveId');
    expect(plugin).toHaveProperty('load');
    expect(plugin).toHaveProperty('transform');
  });

  it('should use default options when none provided', () => {
    const plugin = emberkitVitePlugin();
    expect(plugin).toBeTypeOf('object');
  });

  it('should accept custom options', () => {
    const plugin = emberkitVitePlugin({
      mode: 'ssr',
      routeDir: 'custom-routes',
      outputDir: 'custom-dist',
    });
    expect(plugin.name).toBe('emberkit:vite-plugin');
  });

  it('should have config function that returns vite config', async () => {
    const plugin = emberkitVitePlugin() as Plugin;
    expect(plugin.config).toBeTypeOf('function');
  });

  it('should have resolveId function for virtual modules', async () => {
    const plugin = emberkitVitePlugin() as Plugin;
    expect(plugin.resolveId).toBeTypeOf('function');
    const configId = (plugin.resolveId as (id: string) => string | null)('virtual:emberkit-config');
    const routesId = (plugin.resolveId as (id: string) => string | null)('virtual:emberkit-routes');
    expect(configId).toBe('virtual:emberkit-config');
    expect(routesId).toBe('virtual:emberkit-routes');
    expect((plugin.resolveId as (id: string) => string | null)('other')).toBeNull();
  });

  it('should have load function that returns virtual module content', async () => {
    const plugin = emberkitVitePlugin({ mode: 'ssr' }) as Plugin;
    expect(plugin.load).toBeTypeOf('function');
    const configLoad = (plugin.load as (id: string) => string | null)('virtual:emberkit-config');
    expect(configLoad).not.toBeNull();
    expect(typeof configLoad).toBe('string');
    expect(configLoad).toContain('"ssr"');
  });

  it('should return null for unknown module IDs in load', async () => {
    const plugin = emberkitVitePlugin() as Plugin;
    const unknownLoad = (plugin.load as (id: string) => string | null)('unknown:module');
    expect(unknownLoad).toBeNull();
  });
});
