import { createContext } from '../context/index.js';
import type { I18nInstance } from './types.js';

export interface I18nContextValue<TKeys extends string = string> {
  i18n: I18nInstance<TKeys>;
}

export function createI18nContext<TKeys extends string = string>() {
  const bridge = createContext<I18nContextValue<TKeys> | undefined>(undefined);

  function useI18n(): I18nInstance<TKeys> | undefined {
    const ctx = bridge.use();
    return ctx?.i18n;
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
