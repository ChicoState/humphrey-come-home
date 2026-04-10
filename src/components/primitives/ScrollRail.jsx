/**
 * ScrollRail — horizontal scroll container with optional infinite marquee animation.
 *
 * @prop {number}  [gap]      — spacing between items (× 4px, default 4)
 * @prop {boolean} [animated] — enable auto-scrolling marquee
 * @prop {number}  [speed]    — marquee animation duration in seconds (default 28)
 * @prop {string}  [className]
 * @prop {object}  [style]
 */
import { Children } from 'react';
import styles from './ScrollRail.module.css';

export default function ScrollRail({ gap = 4, animated = false, speed = 28, children, className, style, ...rest }) {
  const gapPx = gap * 4;

  if (animated) {
    const items = Children.toArray(children);
    return (
      <div
        className={[styles.marquee, className].filter(Boolean).join(' ')}
        style={{ '--gap': `${gapPx}px`, '--speed': `${speed}s`, ...style }}
        {...rest}
      >
        <div className={styles.track}>
          <div className={styles.segment} style={{ display: 'flex', gap: `${gapPx}px` }}>
            {items}
          </div>
          <div className={styles.segment} style={{ display: 'flex', gap: `${gapPx}px` }}>
            {items}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={[styles.rail, className].filter(Boolean).join(' ')}
      style={{ display: 'flex', gap: `${gapPx}px`, overflowX: 'auto', scrollSnapType: 'x proximity', ...style }}
      {...rest}
    >
      {children}
    </div>
  );
}
