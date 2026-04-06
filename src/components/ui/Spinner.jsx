/**
 * Spinner — accessible loading indicator.
 *
 * @prop {"sm"|"md"|"lg"} [size]
 * @prop {string} [className]
 */
import styles from "./Spinner.module.css";

export default function Spinner({ size = "md", className }) {
  const classes = [styles.spinner, styles[size], className ?? ""]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={classes} role="status" aria-label="Loading">
      <span className={styles.visuallyHidden}>Loading...</span>
    </span>
  );
}
