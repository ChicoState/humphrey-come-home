/**
 * Text — typography primitive with predefined variants.
 *
 * @prop {"h1"|"h2"|"h3"|"body"|"lg"|"sm"|"xs"|"label"} [variant] — sets tag, size, weight
 * @prop {string}  [weight]   — override font-weight
 * @prop {"default"|"secondary"|"muted"|"light"|"primary"|"error"|"success"|"white"|"inherit"} [color]
 * @prop {"left"|"center"|"right"} [align]
 * @prop {string}  [as]       — override the HTML tag
 */
const variants = {
  h1:       { tag: 'h1',   fontSize: 'var(--font-size-largeTitle)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.02em' },
  h2:       { tag: 'h2',   fontSize: 'var(--font-size-title)', fontWeight: 700, lineHeight: 1.2 },
  subtitle: { tag: 'h2',   fontSize: '1.35rem', fontWeight: 700, lineHeight: 1.2 },
  h3:       { tag: 'h3',   fontSize: 'var(--font-size-headline)', fontWeight: 600, lineHeight: 1.25 },
  body:     { tag: 'p',    fontSize: 'var(--font-size-body)', fontWeight: 400, lineHeight: 1.5 },
  lg:       { tag: 'p',    fontSize: 'clamp(1.05rem,2.3vw,1.35rem)', fontWeight: 500, lineHeight: 1.35 },
  sm:       { tag: 'span', fontSize: 'var(--font-size-subheadline)', fontWeight: 400, lineHeight: 1.4 },
  xs:       { tag: 'span', fontSize: 'var(--font-size-footnote)', fontWeight: 400, lineHeight: 1.3 },
  label:    { tag: 'span', fontSize: 'var(--font-size-footnote)', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' },
};

const colorMap = {
  default:      'var(--text-primary)',
  secondary:    'var(--text-secondary)',
  muted:        'var(--text-secondary)',
  light:        'var(--text-light)',
  primary:      'var(--brand)',
  error:        'var(--status-error)',
  success:      'var(--status-success)',
  white:        '#fff',
  inherit:      'inherit',
};

export default function Text({ variant = 'body', weight, color = 'default', align, as, style, className, children, ...rest }) {
  const v = variants[variant] || variants.body;
  const Tag = as || v.tag;

  const s = {
    fontSize: v.fontSize,
    fontWeight: weight ?? v.fontWeight,
    lineHeight: v.lineHeight,
    ...(v.letterSpacing && { letterSpacing: v.letterSpacing }),
    ...(v.textTransform && { textTransform: v.textTransform }),
    color: colorMap[color] || color,
    ...(align && { textAlign: align }),
    margin: 0,
    ...style,
  };

  return <Tag style={s} className={className} {...rest}>{children}</Tag>;
}
