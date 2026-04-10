/**
 * Dropdown — click-triggered popover menu.
 *
 * @prop {ReactNode} trigger  — element that toggles the menu (e.g. a Button)
 * @prop {Array}     items    — menu items, each: { label, icon?, onPress, separator?, danger? }
 * @prop {"left"|"right"} [align] — horizontal alignment of the popover
 * @prop {"bottom"|"top"} [position] — open below or above the trigger
 */
import { useState, useRef, useEffect } from "react";
import styles from "./Dropdown.module.css";

export default function Dropdown({ trigger, items, align = "right", position = "bottom" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div className={styles.wrapper} ref={ref}>
      <div onClick={() => setOpen((o) => !o)}>{trigger}</div>
      {open && (
        <div className={`${styles.menu} ${styles[align]} ${position === "top" ? styles.top : ""}`}>
          {items.map((item, i) => {
            if (item.separator) {
              return <div key={i} className={styles.separator} />;
            }
            const Icon = item.icon;
            return (
              <button
                key={i}
                className={`${styles.item} ${item.danger ? styles.danger : ""}`}
                onClick={() => { setOpen(false); item.onPress?.(); }}
              >
                {Icon && <Icon size={16} strokeWidth={2.2} className={styles.itemIcon} />}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
