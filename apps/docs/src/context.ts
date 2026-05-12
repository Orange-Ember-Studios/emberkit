import { createSignal } from '@emberkit/core';

const [getSidebarOpen, setSidebarOpen] = createSignal(false);

export const sidebarSignal = {
  get: getSidebarOpen,
  set: setSidebarOpen,
  toggle: () => setSidebarOpen(!getSidebarOpen()),
};
