/**
 * Image — lazy-loaded <img> wrapper with priority option.
 *
 * @prop {string}  src
 * @prop {string}  [alt]
 * @prop {number}  [width]
 * @prop {number}  [height]
 * @prop {boolean} [priority]   — if true, loads eagerly with high fetch-priority
 * @prop {string}  [className]
 * @prop {object}  [style]
 * ...rest is spread onto the <img>
 */
export default function Image({
  src,
  alt = '',
  width,
  height,
  priority = false,
  className,
  style,
  ...rest
}) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
      draggable={false}
      className={className}
      style={style}
      {...rest}
    />
  );
}
