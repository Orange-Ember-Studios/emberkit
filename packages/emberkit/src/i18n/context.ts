import { createContext } from '../context/index.js';
import type { I18nInstance } from './types.js';

export interface I18nContextValue<TKeys extends string = string> {
  i18n: I18nInstance<TKeys>;
}

export function createI18nContext<TKeys extends string = string>() {
  const bridge = createContext<I18nContextValue<TKeys> | undefined>(undefined);

  function useI18n(): I18nInstance<TKeys> {
    const ctx = bridge.use();
    if (!ctx?.i18n) {
      throw new Error(
        'useI18n() must be used within an I18nProvider. Wrap your app with <I18nProvider i18n={...}>.',
      );
    }
    return ctx.i18n;
  }

  function I18nProvider(props: {
    i18n: I18nInstance<TKeys>;
    locale?: string;
    children?: unknown;
  }): ReturnType<typeof bridge.Provider> {
    if (props.locale) {
      props.i18n.setLocale(props.locale);
    }
    return bridge.Provider({
      value: { i18n: props.i18n },
      children: props.children,
    });
  }

  return {
    Provider: I18nProvider,
    useI18n,
    context: bridge,
  };
}
