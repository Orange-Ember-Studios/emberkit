declare module 'virtual:emberkit-routes' {
  import type { RouteConfig } from '@emberkit/core';
  export const routes: RouteConfig[];
}

declare module 'virtual:emberkit-config' {
  import type { EmberKitConfig } from '@emberkit/core';
  export const config: EmberKitConfig;
}
