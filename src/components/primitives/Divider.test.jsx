import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Divider from './Divider';

describe('Divider', () => {
  it('renders as hr when no label provided', () => {
    const { container } = render(<Divider />);
    const hr = container.querySelector('hr');
    expect(hr).toBeInTheDocument();
  });

  it('displays label text', () => {
    render(<Divider label="My Label" />);
    expect(screen.getByText('My Label')).toBeInTheDocument();
  });
});
