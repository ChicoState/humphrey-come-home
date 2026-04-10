/**
 * Badge — small colored label for status or category.
 *
 * @prop {"default"|"success"|"warning"|"error"|"info"} [variant]
 * @prop {"sm"|"md"} [size]
 * @prop {string} [className]
 * @prop {ReactNode} children
 */
import styles from './Badge.module.css';

const variantClasses = {
  default: styles.default,
  success: styles.success,
  warning: styles.warning,
  error: styles.error,
  info: styles.info,
};

const sizeClasses = {
  sm: styles.sm,
  md: styles.md,
};

export default function Badge({
  variant = 'default',
  size = 'sm',
  className,
  children,
}) {
  const cls = [
    styles.badge,
    variantClasses[variant],
    sizeClasses[size],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <span className={cls}>{children}</span>;
}
