export interface DOMEvents {
  onClick?: (event: MouseEvent) => void;
  onDblClick?: (event: MouseEvent) => void;
  onMouseDown?: (event: MouseEvent) => void;
  onMouseUp?: (event: MouseEvent) => void;
  onMouseEnter?: (event: MouseEvent) => void;
  onMouseLeave?: (event: MouseEvent) => void;
  onMouseMove?: (event: MouseEvent) => void;
  onMouseOver?: (event: MouseEvent) => void;
  onMouseOut?: (event: MouseEvent) => void;
  onFocus?: (event: FocusEvent) => void;
  onBlur?: (event: FocusEvent) => void;
  onKeyDown?: (event: KeyboardEvent) => void;
  onKeyUp?: (event: KeyboardEvent) => void;
  onKeyPress?: (event: KeyboardEvent) => void;
  onInput?: (event: Event) => void;
  onChange?: (event: Event) => void;
  onSubmit?: (event: Event) => void;
  onScroll?: (event: Event) => void;
  onWheel?: (event: WheelEvent) => void;
  onDrag?: (event: DragEvent) => void;
  onDragStart?: (event: DragEvent) => void;
  onDragEnd?: (event: DragEvent) => void;
  onDragOver?: (event: DragEvent) => void;
  onDragEnter?: (event: DragEvent) => void;
  onDragLeave?: (event: DragEvent) => void;
  onDrop?: (event: DragEvent) => void;
  onTouchStart?: (event: TouchEvent) => void;
  onTouchEnd?: (event: TouchEvent) => void;
  onTouchMove?: (event: TouchEvent) => void;
  onTouchCancel?: (event: TouchEvent) => void;
  onPointerDown?: (event: PointerEvent) => void;
  onPointerUp?: (event: PointerEvent) => void;
  onPointerMove?: (event: PointerEvent) => void;
  onPointerEnter?: (event: PointerEvent) => void;
  onPointerLeave?: (event: PointerEvent) => void;
  onPointerOver?: (event: PointerEvent) => void;
  onPointerOut?: (event: PointerEvent) => void;
  onPointerCancel?: (event: PointerEvent) => void;
  onAnimationStart?: (event: AnimationEvent) => void;
  onAnimationEnd?: (event: AnimationEvent) => void;
  onAnimationIteration?: (event: AnimationEvent) => void;
  onTransitionEnd?: (event: TransitionEvent) => void;
  onTransitionRun?: (event: TransitionEvent) => void;
  onTransitionStart?: (event: TransitionEvent) => void;
  onTransitionCancel?: (event: TransitionEvent) => void;
  onCopy?: (event: ClipboardEvent) => void;
  onCut?: (event: ClipboardEvent) => void;
  onPaste?: (event: ClipboardEvent) => void;
  onLoad?: (event: Event) => void;
  onError?: (event: Event) => void;
}

export interface HTMLAttributes extends DOMEvents {
  [key: string]: unknown;
  id?: string;
  className?: string;
  class?: string;
  style?: string | Record<string, string>;
  title?: string;
  lang?: string;
  dir?: string;
  tabIndex?: number;
  accessKey?: string;
  hidden?: boolean;
  draggable?: boolean;
  contentEditable?: boolean;
  spellCheck?: boolean;
  role?: string;
  slot?: string;
  part?: string;
  exportParts?: string;
  inert?: boolean;
  popover?: string;
}

export interface AriaAttributes {
  role?: string;
  ariaLabel?: string;
  ariaLabelledby?: string;
  ariaDescribedby?: string;
  ariaDescribedat?: string;
  ariaDetails?: string;
  ariaDisabled?: boolean;
  ariaHidden?: boolean;
  ariaExpanded?: boolean;
  ariaPressed?: boolean;
  ariaCurrent?: string | boolean;
  ariaChecked?: boolean | 'mixed';
  ariaSelected?: boolean;
  ariaActiveDescendant?: string;
  ariaAutocomplete?: 'none' | 'inline' | 'list' | 'both';
  ariaBusy?: boolean;
  ariaColCount?: number;
  ariaColIndex?: number;
  ariaColSpan?: number;
  ariaControls?: string;
  ariaDropEffect?: 'none' | 'copy' | 'execute' | 'link' | 'move' | 'popup';
  ariaHasPopup?: boolean | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';
  ariaInvalid?: boolean | 'grammar' | 'spelling';
  ariaKeyShortcuts?: string;
  ariaLevel?: number;
  ariaLive?: 'off' | 'assertive' | 'polite';
  ariaModal?: boolean;
  ariaMultiLine?: boolean;
  ariaMultiSelectable?: boolean;
  ariaOrientation?: 'horizontal' | 'vertical';
  ariaOwns?: string;
  ariaPlaceholder?: string;
  ariaPosInSet?: number;
  ariaReadOnly?: boolean;
  ariaRelevant?: 'additions' | 'additions text' | 'all' | 'removals' | 'text';
  ariaRequired?: boolean;
  ariaRoledescription?: string;
  ariaRowCount?: number;
  ariaRowIndex?: number;
  ariaRowSpan?: number;
  ariaSort?: 'ascending' | 'descending' | 'none' | 'other';
  ariaValueMax?: number;
  ariaValueMin?: number;
  ariaValueNow?: number;
  ariaValueText?: string;
}

export interface DataAttributes {
}

export interface InputSpecificAttributes {
  accept?: string;
  alt?: string;
  autoComplete?: string;
  autoFocus?: boolean;
  capture?: boolean | 'user' | 'environment';
  checked?: boolean;
  crossOrigin?: string;
  disabled?: boolean;
  form?: string;
  formAction?: string;
  formEncType?: string;
  formMethod?: string;
  formNoValidate?: boolean;
  formTarget?: string;
  height?: number | string;
  list?: string;
  max?: number | string;
  maxLength?: number;
  min?: number | string;
  minLength?: number;
  multiple?: boolean;
  name?: string;
  pattern?: string;
  placeholder?: string;
  readOnly?: boolean;
  required?: boolean;
  size?: number;
  src?: string;
  step?: number | string;
  type?: string;
  value?: string | number | readonly string[];
  width?: number | string;
}

export interface SelectSpecificAttributes {
  autoFocus?: boolean;
  disabled?: boolean;
  form?: string;
  multiple?: boolean;
  name?: string;
  required?: boolean;
  size?: number;
  value?: string | readonly string[] | number;
}

export type InputHTMLAttributes = HTMLAttributes & AriaAttributes & DataAttributes & InputSpecificAttributes;
export type SelectHTMLAttributes = HTMLAttributes & AriaAttributes & DataAttributes & SelectSpecificAttributes;
export type ButtonHTMLAttributes = HTMLAttributes & AriaAttributes & DataAttributes;
export type TextareaHTMLAttributes = HTMLAttributes & AriaAttributes & DataAttributes;
