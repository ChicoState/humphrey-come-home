/**
 * VStack — vertical flex container (column direction).
 *
 * @prop {number} [gap]      — spacing between children (multiplied by 4px)
 * @prop {"start"|"end"|"center"|"stretch"|"baseline"} [align]
 * @prop {"start"|"end"|"center"|"between"|"around"} [justify]
 * @prop {number} [padding]  — all-sides padding (× 4px)
 * @prop {number} [paddingX] — horizontal padding (× 4px)
 * @prop {number} [paddingY] — vertical padding (× 4px)
 * @prop {string} [as]       — HTML tag to render (default "div")
 */
const alignMap = { start: 'flex-start', end: 'flex-end', center: 'center', stretch: 'stretch', baseline: 'baseline' };
const justifyMap = { start: 'flex-start', end: 'flex-end', center: 'center', between: 'space-between', around: 'space-around' };

export default function VStack({ gap, align, justify, padding, paddingX, paddingY, style, className, as: Tag = 'div', children, ...rest }) {
  const s = {
    display: 'flex',
    flexDirection: 'column',
    ...(gap != null && { gap: `${gap * 4}px` }),
    ...(align && { alignItems: alignMap[align] || align }),
    ...(justify && { justifyContent: justifyMap[justify] || justify }),
    ...(padding != null && { padding: `${padding * 4}px` }),
    ...(paddingX != null && { paddingLeft: `${paddingX * 4}px`, paddingRight: `${paddingX * 4}px` }),
    ...(paddingY != null && { paddingTop: `${paddingY * 4}px`, paddingBottom: `${paddingY * 4}px` }),
    ...style,
  };

  return <Tag style={s} className={className} {...rest}>{children}</Tag>;
}
