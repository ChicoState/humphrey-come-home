/**
 * Select — styled native select field with label and error state.
 *
 * @prop {string} label
 * @prop {string} id
 * @prop {Array<{ value: string, label: string }>} options
 * @prop {string} [error]
 * @prop {boolean} [required]
 */
import { VStack } from "@/components/primitives";
import styles from "./Select.module.css";

export default function Select({
  label,
  id,
  options = [],
  error,
  required = false,
  className,
  ...rest
}) {
  const selectClasses = [styles.select, error ? styles.error : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <VStack gap={1} className={className}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
          {required && <span className={styles.required}> *</span>}
        </label>
      )}
      <select
        id={id}
        className={selectClasses}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        required={required}
        {...rest}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={`${id}-error`} className={styles.errorMessage} role="alert">
          {error}
        </p>
      )}
    </VStack>
  );
}
