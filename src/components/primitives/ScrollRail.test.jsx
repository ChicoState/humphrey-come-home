import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ScrollRail from './ScrollRail';

describe('ScrollRail', () => {
  it('renders children', () => {
    render(
      <ScrollRail>
        <p>Item 1</p>
        <p>Item 2</p>
      </ScrollRail>
    );

    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it('applies flex and gap styles when not animated', () => {
    render(
      <ScrollRail gap={2} data-testid="rail">
        <p>Item</p>
      </ScrollRail>
    );

    expect(screen.getByTestId('rail')).toHaveStyle({
      display: 'flex',
      gap: '8px',
      overflowX: 'auto',
    });
  });

  it('applies className', () => {
    render(
      <ScrollRail className="custom-class" data-testid="rail">
        <p>Item</p>
      </ScrollRail>
    );

    expect(screen.getByTestId('rail')).toHaveClass('custom-class');
  });

});