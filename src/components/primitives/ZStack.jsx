/**
 * ZStack — position:relative wrapper for layering children with absolute positioning.
 *
 * @prop {string} [as]        — HTML tag (default "div")
 * @prop {string} [className]
 * @prop {object} [style]
 */
export default function ZStack({ style, className, as: Tag = 'div', children, ...rest }) {
  return <Tag style={{ position: 'relative', ...style }} className={className} {...rest}>{children}</Tag>;
}
