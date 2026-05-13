import type { FC } from '@emberkit/core';
import { Text } from '../../atoms/index.js';

export interface Tab {
  id: string;
  label: string;
  disabled?: boolean;
}

export interface TabsProps {
  [key: string]: unknown;
  tabs: Tab[];
  activeTab: string | (() => string);
  onChange?: (tabId: string) => void;
  className?: string;
}

function isSignal(val: unknown): val is (() => string) & { __idx: number } {
  return typeof val === 'function' && (val as any).__idx != null;
}

const Tabs: FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className = '',
}) => {
  const signalTab = isSignal(activeTab) ? activeTab : null;
  const activeVal = signalTab ? signalTab() : (activeTab as string);
  const base = 'flex border-b border-white/10';
  const cls = `${base} ${className}`.trim();

  return (
    <div class={cls} role="tablist">
      {  tabs.map((tab) => {
        const isActive = tab.id === activeVal;
        const sharedCls = 'px-4 py-2.5 text-sm font-medium transition-colors duration-150 border-b-2 -mb-px';
        const activeCls = 'border-primary-500 text-primary-400';
        const inactiveCls = 'border-transparent text-surface-600 hover:text-surface-800 hover:border-surface-400';
        const hoverCls = tab.disabled ? '' : 'cursor-pointer';
        const disabledCls = tab.disabled ? 'opacity-50 cursor-not-allowed' : '';

        return (
          <button
            key={tab.id}
            role="tab"
            class={`${sharedCls} ${isActive ? activeCls : inactiveCls} ${hoverCls} ${disabledCls}`.trim()}
            disabled={tab.disabled}
            data-ek-bind={signalTab}
            data-ek-active-when={tab.id}
            data-ek-active-class={activeCls}
            data-ek-inactive-class={inactiveCls}
            onClick={() => onChange?.(tab.id)}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export { Tabs };
