/**
 * Input — styled text input or textarea.
 *
 * @prop {string}  label     — visible label text
 * @prop {string}  id        — links label to input; used for aria attributes
 * @prop {string}  [type]    — "text" (default), "email", "textarea", etc.
 * @prop {string}  [error]   — error message shown below input
 * @prop {boolean} [required]
 * @prop {string}  [className]
 * ...rest is spread onto the <input>/<textarea>
 */
import { VStack } from "@/components/primitives";
import styles from "./Input.module.css";

export default function Input({
  label,
  id,
  type = "text",
  error,
  required = false,
  className,
  ...rest
}) {
  const isTextarea = type === "textarea";
  const InputElement = isTextarea ? "textarea" : "input";

  const inputClasses = [styles.input, error ? styles.error : ""]
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
      <InputElement
        id={id}
        type={isTextarea ? undefined : type}
        className={inputClasses}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        required={required}
        rows={isTextarea ? 4 : undefined}
        {...rest}
      />
      {error && (
        <p id={`${id}-error`} className={styles.errorMessage} role="alert">
          {error}
        </p>
      )}
    </VStack>
  );
}
