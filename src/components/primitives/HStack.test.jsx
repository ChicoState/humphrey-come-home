import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import HStack from './HStack';

describe('HStack', () => {
  it('renders children', () => {
    render(<HStack>Hello</HStack>);

    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('has flex row styles by default', () => {
    render(<HStack data-testid="stack" />);

    expect(screen.getByTestId('stack')).toHaveStyle({
      display: 'flex',
      flexDirection: 'row',
    });
  });

  it('applies gap', () => {
    render(<HStack data-testid="stack" gap={2} />);

    expect(screen.getByTestId('stack')).toHaveStyle({
      gap: '8px',
    });
  });

  it('applies align and justify', () => {
    render(<HStack data-testid="stack" align="center" justify="between" />);

    expect(screen.getByTestId('stack')).toHaveStyle({
      alignItems: 'center',
      justifyContent: 'space-between',
    });
  });

  it('applies padding', () => {
    render(<HStack data-testid="stack" padding={3} />);

    expect(screen.getByTestId('stack')).toHaveStyle({
      padding: '12px',
    });
  });

  it('supports custom tag and className', () => {
    render(<HStack as="section" className="test" data-testid="stack" />);

    const stack = screen.getByTestId('stack');

    expect(stack.tagName).toBe('SECTION');
    expect(stack).toHaveClass('test');
  });
});