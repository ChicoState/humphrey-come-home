/**
 * Divider — horizontal rule, optionally with a centered text label.
 *
 * @prop {string} [label] — text displayed in the middle of the line
 * @prop {object} [style]
 * @prop {string} [className]
 */
import Text from './Text';

const line = {
  flex: 1,
  height: '1px',
  background: 'var(--color-gray-200)',
};

export default function Divider({ label, style, className, ...rest }) {
  if (!label) {
    return (
      <hr
        style={{ border: 'none', height: '1px', background: 'var(--color-gray-200)', margin: 0, ...style }}
        className={className}
        {...rest}
      />
    );
  }

  return (
    <div
      style={{ display: 'flex', alignItems: 'center', gap: '12px', ...style }}
      className={className}
      {...rest}
    >
      <div style={line} />
      <Text variant="label" color="light" style={{ whiteSpace: 'nowrap' }}>
        {label}
      </Text>
      <div style={line} />
    </div>
  );
}
