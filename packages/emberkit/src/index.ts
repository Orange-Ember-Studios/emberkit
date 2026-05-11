export const VERSION = '0.1.0';

export { createElement, render, hydrate, renderToString } from './runtime/index.js';
export { createSignal, createMemo, createEffect, batch, untrack } from './signals/index.js';
export { createContext, useContext, provide } from './context/index.js';
export { navigate, redirect, preload, startViewTransition } from './navigation/index.js';
export { createRouter, defineRoutes, matchRoute, type RouteConfig } from './router/index.js';
export { createLoader, loader, createBoundary, type LoaderResult } from './loader/index.js';
export { createErrorBoundary, createLoadingBoundary, isNotFoundError, isUnauthorizedError } from './boundaries/index.js';
export type { JSXElement, DOMElement, Component, RouteComponent } from './runtime/types.js';
export type { Signal, WritableSignal, ReadonlySignal } from './signals/index.js';
export type { HydrationConfig, HydrationManifest, HydrationStrategy } from './hydration/index.js';
export { DevServer, createDevServer } from './dev-server/index.js';
export type { Plugin, PluginContext, ResolvedConfig } from './plugin/index.js';
export { HMRConnection, createHMRContext, subscribeToHMR } from './hmr/index.js';
export { SSGBuilder, generateStaticPages, isStaticRoute, createSSGManifest } from './ssg/index.js';
export { FormValidator, createFormValidator, createFormState, setFieldValue, setFieldError } from './forms/index.js';
export { createAction, createMutation, handleAction, useMutation } from './forms/mutations.js';
export { MetaGenerator, createMetaGenerator, generateMeta, generateBreadcrumbs } from './meta/index.js';
export { DataCache, createCache, getCached, setCache, prefetch, staleWhileRevalidate } from './cache/index.js';

export function defineConfig(config: Record<string, unknown>): Record<string, unknown> {
  return config;
}