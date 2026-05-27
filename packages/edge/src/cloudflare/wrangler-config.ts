/** Wrangler config shape used by Orange Ember production apps (Workers + assets). */
export interface EmberKitWranglerConfig {
  name: string;
  main: string;
  compatibility_date: string;
  compatibility_flags?: string[];
  assets: {
    directory: string;
    binding: string;
    not_found_handling?: 'single-page-application' | '404-page' | 'none';
  };
  observability?: {
    enabled: boolean;
  };
}

export type EmberKitWranglerConfigInput = Pick<
  EmberKitWranglerConfig,
  'name' | 'main'
> &
  Partial<Omit<EmberKitWranglerConfig, 'name' | 'main'>>;

export const DEFAULT_CLOUDFLARE_COMPATIBILITY_DATE = '2026-04-03';

export const DEFAULT_CLOUDFLARE_COMPATIBILITY_FLAGS = [
  'global_fetch_strictly_public',
  'nodejs_compat',
] as const;

const defaultAssets = {
  directory: './dist',
  binding: 'ASSETS',
  not_found_handling: 'single-page-application' as const,
};

/** Defaults from orangeember.com website (`wrangler.jsonc`). */
export function defineWranglerConfig(
  overrides: EmberKitWranglerConfigInput,
): EmberKitWranglerConfig {
  return {
    name: overrides.name,
    main: overrides.main,
    compatibility_date:
      overrides.compatibility_date ?? DEFAULT_CLOUDFLARE_COMPATIBILITY_DATE,
    compatibility_flags:
      overrides.compatibility_flags ?? [...DEFAULT_CLOUDFLARE_COMPATIBILITY_FLAGS],
    observability: overrides.observability ?? { enabled: true },
    assets: {
      ...defaultAssets,
      ...overrides.assets,
    },
  };
}
