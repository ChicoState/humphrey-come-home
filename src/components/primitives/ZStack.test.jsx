import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ZStack from './ZStack';

describe('ZStack', () => {
  it('renders children', () => {
    render(<ZStack>Hello</ZStack>);

    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('has position relative', () => {
    render(<ZStack data-testid="zstack" />);

    expect(screen.getByTestId('zstack')).toHaveStyle({
      position: 'relative',
    });
  });

  it('uses the as prop', () => {
    render(<ZStack as="section" data-testid="zstack" />);

    expect(screen.getByTestId('zstack').tagName).toBe('SECTION');
  });

  it('applies className', () => {
    render(<ZStack className="test" data-testid="zstack" />);

    expect(screen.getByTestId('zstack')).toHaveClass('test');
  });
});