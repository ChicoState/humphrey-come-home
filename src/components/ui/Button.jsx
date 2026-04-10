/**
 * Button — primary action component.
 *
 * @prop {"primary"|"secondary"|"ghost"|"danger"|"outline"} [variant]
 * @prop {"sm"|"md"|"lg"} [size]
 * @prop {Component} [icon]          — Lucide icon component
 * @prop {"left"|"right"} [iconPosition]
 * @prop {boolean} [loading]         — shows spinner and disables button
 * @prop {boolean} [block]           — full-width
 * @prop {string}  [type]            — "button" (default), "submit", etc.
 * ...rest is spread onto the <button>
 */
import Spinner from "./Spinner";
import styles from "./Button.module.css";

const ICON_SIZES = { sm: 19, md: 19, lg: 22 };

export default function Button({
  variant = "primary",
  size = "md",
  icon: Icon,
  iconPosition = "left",
  loading = false,
  disabled = false,
  block = false,
  type = "button",
  onClick,
  children,
  className,
  ...rest
}) {
  const iconOnly = Icon && !children;
  const hasIcon = !!Icon;

  const classes = [
    styles.button,
    styles[variant],
    styles[size],
    hasIcon ? styles.hasIcon : "",
    iconOnly ? styles.iconOnly : "",
    block ? styles.block : "",
    loading ? styles.loading : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  const iconSize = ICON_SIZES[size] || 19;

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      {...rest}
    >
      {loading ? (
        <Spinner size="sm" className={styles.spinner} />
      ) : (
        <>
          {Icon && iconPosition === "left" && (
            <Icon size={iconSize} strokeWidth={2.4} className={styles.icon} />
          )}
          {children && <span className={styles.label}>{children}</span>}
          {Icon && iconPosition === "right" && (
            <Icon size={iconSize} strokeWidth={2.4} className={styles.icon} />
          )}
        </>
      )}
    </button>
  );
}
