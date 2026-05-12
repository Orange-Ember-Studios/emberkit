import { navigate as coreNavigate } from './navigation.js';
import type { NavigationOptions } from '../types.js';

export type UseNavigateOptions = Omit<NavigationOptions, 'viewTransition'> & {
  skipTransition?: boolean;
};

export function useNavigate() {
  return async (path: string, options: UseNavigateOptions = {}) => {
    const { skipTransition = false, ...navigationOptions } = options;

    return coreNavigate(path, {
      ...navigationOptions,
      viewTransition: skipTransition ? false : true,
    });
  };
}
