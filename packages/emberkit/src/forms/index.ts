export interface FormConfig {
  action?: string;
  method?: 'get' | 'post' | 'put' | 'delete' | 'patch';
  encType?: 'application/x-www-form-urlencoded' | 'multipart/form-data' | 'text/plain';
  validation?: ValidationSchema;
  onSubmit?: FormSubmitHandler;
  onError?: FormErrorHandler;
}

export interface ValidationSchema {
  fields: Record<string, FieldValidator>;
  validateOnSubmit?: boolean;
  validateOnBlur?: boolean;
}

export interface FieldValidator {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: unknown) => string | null;
}

export type FormSubmitHandler = (
  data: FormData,
  event: SubmitEvent,
) => Promise<void> | void;

export type FormErrorHandler = (
  errors: FormErrors,
  event: SubmitEvent,
) => void;

export interface FormErrors {
  [field: string]: string | undefined;
}

export interface FormState {
  values: Record<string, unknown>;
  errors: FormErrors;
  touched: Set<string>;
  dirty: boolean;
  submitting: boolean;
  submitted: boolean;
}

export class FormValidator {
  private schema: ValidationSchema;

  constructor(schema: ValidationSchema) {
    this.schema = schema;
  }

  validate(data: Record<string, unknown>): FormErrors {
    const errors: FormErrors = {};

    for (const [field, validator] of Object.entries(this.schema.fields)) {
      const value = data[field];
      const error = this.validateField(field, value, validator);

      if (error) {
        errors[field] = error;
      }
    }

    return errors;
  }

  validateField(
    name: string,
    value: unknown,
    validator: FieldValidator,
  ): string | undefined {
    if (validator.required && (value === undefined || value === null || value === '')) {
      return `${name} is required`;
    }

    if (typeof value === 'string') {
      if (validator.minLength && value.length < validator.minLength) {
        return `${name} must be at least ${validator.minLength} characters`;
      }

      if (validator.maxLength && value.length > validator.maxLength) {
        return `${name} must be at most ${validator.maxLength} characters`;
      }

      if (validator.pattern && !validator.pattern.test(value)) {
        return `${name} is invalid`;
      }
    }

    if (validator.custom) {
      const customError = validator.custom(value);

      if (customError) {
        return customError;
      }
    }

    return undefined;
  }

  validateFieldOnly(name: string, value: unknown): string | undefined {
    const validator = this.schema.fields[name];

    if (!validator) return undefined;

    return this.validateField(name, value, validator);
  }
}

export function createFormValidator(schema: ValidationSchema): FormValidator {
  return new FormValidator(schema);
}

export function parseFormData(form: HTMLFormElement): Record<string, unknown> {
  const formData = new FormData(form);
  const data: Record<string, unknown> = {};

  for (const [key, value] of formData.entries()) {
    if (data[key] !== undefined) {
      if (!Array.isArray(data[key])) {
        data[key] = [data[key]];
      }
      (data[key] as unknown[]).push(value);
    } else {
      data[key] = value;
    }
  }

  return data;
}

export function createFormState(initial: Record<string, unknown> = {}): FormState {
  return {
    values: { ...initial },
    errors: {},
    touched: new Set(),
    dirty: false,
    submitting: false,
    submitted: false,
  };
}

export function updateFormState(
  state: FormState,
  updates: Partial<FormState>,
): FormState {
  return { ...state, ...updates };
}

export function getFieldValue(
  state: FormState,
  name: string,
): unknown {
  return state.values[name];
}

export function setFieldValue(
  state: FormState,
  name: string,
  value: unknown,
): FormState {
  return {
    ...state,
    values: { ...state.values, [name]: value },
    dirty: true,
  };
}

export function setFieldError(
  state: FormState,
  name: string,
  error: string | undefined,
): FormState {
  return {
    ...state,
    errors: { ...state.errors, [name]: error },
  };
}

export function clearFormState(state: FormState): FormState {
  return {
    values: {},
    errors: {},
    touched: new Set(),
    dirty: false,
    submitting: false,
    submitted: false,
  };
}

export async function handleFormSubmit(
  event: SubmitEvent,
  config: FormConfig,
): Promise<boolean> {
  event.preventDefault();

  const form = event.target as HTMLFormElement;
  const data = parseFormData(form);

  if (config.validation) {
    const validator = new FormValidator(config.validation);
    const errors = validator.validate(data);

    if (Object.keys(errors).length > 0) {
      config.onError?.(errors, event);
      return false;
    }
  }

  if (config.onSubmit) {
    const formData = new FormData(form);

    try {
      await config.onSubmit(formData, event);
      return true;
    } catch (err) {
      return false;
    }
  }

  return true;
}

export const DEFAULT_VALIDATORS: Record<string, FieldValidator> = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    custom: (v) => typeof v === 'string' && !v.includes('@') ? 'Invalid email' : null,
  },
  url: {
    pattern: /^https?:\/\/.+/,
  },
  phone: {
    pattern: /^\+?[\d\s-]{10,}$/,
  },
};

export function applyDefaultValidator(
  field: string,
  validator: FieldValidator,
): FieldValidator {
  const defaultValidator = DEFAULT_VALIDATORS[field];

  if (!defaultValidator) return validator;

  return {
    ...defaultValidator,
    ...validator,
    custom: (value) => {
      const defaultError = defaultValidator.custom?.(value);
      if (defaultError) return defaultError;
      return validator.custom?.(value);
    },
  };
}

export interface FormSubmitOptions {
  method?: string;
  action?: string;
  target?: string;
}

export function buildFormAction(
  action: string,
  method: string,
  params?: Record<string, string>,
): string {
  const url = new URL(action, 'http://localhost');

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }
  }

  return url.toString();
}