type FC<P> = (props: P) => unknown;
import {
  Text,
  Input,
  type InputSize,
  type InputProps,
} from "../../atoms/index.js";

export interface FormFieldProps {
  label: string;
  name: string;
  error?: string;
  hint?: string;
  required?: boolean;
  size?: InputSize;
  children?: unknown;
  [key: string]: unknown;
  inputProps?: Omit<InputProps, "name" | "size">;
}

const FormField: FC<FormFieldProps> = ({
  label,
  name,
  error,
  hint,
  required = false,
  size = "md",
  inputProps,
}) => {
  return (
    <div class="flex flex-col gap-1.5">
      <Text as="label" size="sm" weight="medium" className="text-surface-800">
        {label}
        {required && <span class="text-error-500 ml-0.5">*</span>}
      </Text>
      <Input
        name={name}
        size={size}
        error={error}
        required={required}
        {...inputProps}
      />
      {hint && !error && (
        <Text size="xs" color="muted">
          {hint}
        </Text>
      )}
      {error && (
        <Text size="xs" color="error">
          {error}
        </Text>
      )}
    </div>
  );
};

export { FormField };
