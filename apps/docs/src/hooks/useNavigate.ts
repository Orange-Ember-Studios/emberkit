import { navigate as coreNavigate } from '@emberkit/core';
import type { NavigationOptions } from '@emberkit/core';

export type UseNavigateOptions = Omit<NavigationOptions, 'viewTransition'> & {
  skipTransition?: boolean;
};

/**
 * Custom navigate hook with view transitions enabled by default.
 * Use this instead of the core navigate function for automatic transitions.
 */
export function useNavigate() {
  return async (path: string, options: UseNavigateOptions = {}) => {
    const { skipTransition = false, ...navigationOptions } = options;
    
    return coreNavigate(path, {
      ...navigationOptions,
      viewTransition: skipTransition ? false : true,
    });
  };
}
