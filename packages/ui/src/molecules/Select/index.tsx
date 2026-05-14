type FC<P> = (props: P) => unknown;
import { createSignal } from '@emberkit/core';
import { Text, Icon } from '../../atoms/index.js';
import type { SelectHTMLAttributes } from '../../types/index.js';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<SelectHTMLAttributes, 'onChange'> {
  options: SelectOption[];
  value?: string;
  placeholder?: string;
  error?: string;
  onChange?: (value: string) => void;
}

const Select: FC<SelectProps> = ({
  name,
  options,
  value: initialValue = '',
  placeholder,
  disabled = false,
  required = false,
  error,
  className = '',
  onChange,
}) => {
  const [open, setOpen] = createSignal(false);
  const [selectedValue, setSelectedValue] = createSignal(initialValue);
  const selectedOption = options.find(o => o.value === selectedValue());
  const [displayLabel, setDisplayLabel] = createSignal(selectedOption ? selectedOption.label : '');

  function handleSelect(opt: SelectOption) {
    if (opt.disabled) return;
    setSelectedValue(opt.value);
    setDisplayLabel(opt.label);
    setOpen(false);
    onChange?.(opt.value);
  }

  function handleToggle(e: MouseEvent) {
    e.stopPropagation();
    if (!disabled) setOpen(!open());
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') setOpen(false);
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!disabled) setOpen(!open());
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const currIdx = options.findIndex(o => o.value === selectedValue());
      const next = options.slice(currIdx + 1).find(o => !o.disabled);
      if (next) setSelectedValue(next.value);
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const currIdx = options.findIndex(o => o.value === selectedValue());
      const prev = options.slice(0, currIdx).reverse().find(o => !o.disabled);
      if (prev) setSelectedValue(prev.value);
    }
  }

  const triggerCls = [
    'w-full flex items-center justify-between gap-2 rounded-xl border text-base transition-all duration-200',
    'px-4 py-2.5',
    'bg-surface-100/80 backdrop-blur-sm',
    disabled ? 'opacity-50 cursor-not-allowed bg-surface-200' : 'cursor-pointer hover:border-primary-500/50 hover:bg-surface-200/50',
    error
      ? 'border-error-500 ring-1 ring-error-500/20'
      : 'border-surface-300 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-300/30',
    className,
  ].filter(Boolean).join(' ');

  const dropdownId = `ek-sel-${String(Math.random()).slice(2, 8)}`;

  return (
    <div class="relative">
      <div class="relative">
        <div
          class={triggerCls}
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          tabIndex={disabled ? -1 : 0}
          role="combobox"
          aria-expanded="false"
          aria-haspopup="listbox"
          data-ek-bind={open}
          data-ek-active-class="border-primary-500 ring-2 ring-primary-300/30 rounded-b-none bg-surface-200/70"
        >
          <span class={selectedOption ? 'text-surface-900' : 'text-surface-500'} data-ek-bind={displayLabel}>
            {selectedOption ? selectedOption.label : (placeholder || 'Select...')}
          </span>
          <Icon
            name="chevron-down"
            size={16}
            className="text-surface-500 transition-transform duration-200"
            data-ek-bind={open}
            data-ek-active-class="rotate-180"
          />
        </div>
      </div>

      <div
        class={`fixed inset-0 z-10 ${open() ? '' : 'hidden'}`}
        data-ek-bind={open}
        data-ek-hide="hidden"
      >
        <div class="absolute inset-0" onClick={() => setOpen(false)} />
      </div>
      <div
        class={`absolute left-0 right-0 z-20 mt-1 overflow-hidden rounded-xl border border-surface-300/80 bg-surface-100/95 backdrop-blur-xl shadow-2xl shadow-surface-900/30 ${open() ? '' : 'hidden'}`}
        data-ek-bind={open}
        data-ek-hide="hidden"
      >
        <ul role="listbox" class="py-1 max-h-60 overflow-y-auto">
          {placeholder && (
            <li
              role="option"
              aria-selected={selectedValue() === ''}
              class="px-4 py-2.5 text-sm text-surface-500 cursor-default"
            >
              {placeholder}
            </li>
          )}
          {options.map((opt) => {
            const isSelected = opt.value === selectedValue();
            const optCls = [
              'flex items-center justify-between px-4 py-2.5 text-sm cursor-pointer transition-all duration-150',
              opt.disabled
                ? 'opacity-40 cursor-not-allowed text-surface-500'
                : isSelected
                  ? 'bg-primary-500/30 text-primary-300 font-medium ring-1 ring-primary-500/40'
                  : 'text-surface-800 hover:bg-surface-200/60 hover:text-surface-900',
            ].join(' ');
            return (
              <li
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                aria-disabled={opt.disabled}
                class={optCls}
                onClick={() => handleSelect(opt)}
              >
                <span>{opt.label}</span>
                {isSelected && (
                  <Icon name="check" size={14} className="text-primary-400 shrink-0" />
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {error && (
        <Text size="xs" color="error" className="mt-1.5">{error}</Text>
      )}
    </div>
  );
};

export { Select };
