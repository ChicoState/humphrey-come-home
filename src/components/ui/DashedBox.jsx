/**
 * DashedBox — SVG-based dashed border container with customizable stroke.
 *
 * @prop {number} [dash]        — dash length (default 10)
 * @prop {number} [gap]         — gap between dashes (default 8)
 * @prop {number} [strokeWidth] — border thickness (default 3)
 * @prop {string} [color]       — stroke color CSS value
 * @prop {number} [radius]      — corner radius (default 16)
 * @prop {string} [className]
 * @prop {object} [style]
 * @prop {ReactNode} children
 */
import styles from './DashedBox.module.css';

export default function DashedBox({
  dash = 10,
  gap = 8,
  strokeWidth = 3,
  color = 'var(--color-gray-300)',
  radius = 16,
  children,
  className,
  style,
}) {
  const offset = strokeWidth / 2;

  return (
    <div className={`${styles.box} ${className || ''}`} style={style}>
      <svg className={styles.border}>
        <rect
          x={offset}
          y={offset}
          rx={radius - offset}
          ry={radius - offset}
          style={{ width: `calc(100% - ${strokeWidth}px)`, height: `calc(100% - ${strokeWidth}px)` }}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={`${dash} ${gap}`}
          strokeLinecap="round"
          strokeDashoffset={radius + dash}
        />
      </svg>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
