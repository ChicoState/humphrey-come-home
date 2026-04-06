/**
 * Container — centered max-width wrapper.
 *
 * @prop {"sm"|"md"|"lg"|"xl"|"full"} [size] — max-width (sm=480, md=640, lg=1024, xl=1200)
 * @prop {number} [padding] — horizontal padding (× 4px, default 4)
 * @prop {string} [className]
 * @prop {object} [style]
 */
const sizeMap = { sm: '480px', md: '640px', lg: '1024px', xl: '1200px', full: '100%' };

export default function Container({ size = 'lg', padding = 4, style, className, children, ...rest }) {
  const s = {
    width: '100%',
    maxWidth: sizeMap[size] || size,
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingLeft: `${padding * 4}px`,
    paddingRight: `${padding * 4}px`,
    ...style,
  };

  return <div style={s} className={className} {...rest}>{children}</div>;
}
