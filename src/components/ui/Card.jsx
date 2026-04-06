/**
 * Card — clickable surface that can render as a <div> or a <Link>.
 *
 * @prop {ReactNode} children
 * @prop {string}  [className]
 * @prop {function} [onClick]
 * @prop {string}  [to]        — if provided, renders as a React Router <Link>
 * @prop {"default"|"elevated"} [variant]
 * @prop {object}  [style]
 */
import { Link } from "react-router";
import styles from "./Card.module.css";

export default function Card({
  children,
  className,
  onClick,
  to,
  variant = "default",
  style,
}) {
  const isElevated = variant === "elevated";

  if (to) {
    const classes = [
      styles.link,
      isElevated ? styles.elevated : "",
      className ?? "",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <Link to={to} className={classes} style={style}>
        {children}
      </Link>
    );
  }

  const classes = [
    styles.card,
    isElevated ? styles.elevated : "",
    onClick ? styles.clickable : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={classes}
      style={style}
      onClick={onClick}
      onKeyDown={onClick ? (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(e);
        }
      } : undefined}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
}
