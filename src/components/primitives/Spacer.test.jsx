import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Spacer from './Spacer';

describe('Spacer', () => {
  it('renders a div', () => {
    const { container } = render(<Spacer />);

    expect(container.firstChild.tagName).toBe('DIV');
  });

  it('has flex: 1 style', () => {
    const { container } = render(<Spacer />);

    expect(container.firstChild).toHaveStyle({
      flex: 1,
    });
  });
});