import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useContext } from 'react';
import { AuthProvider, AuthContext } from './AuthContext';

vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(() =>
        Promise.resolve({
          data: { session: null },
        })
      ),
      onAuthStateChange: vi.fn(() => ({
        data: {
          subscription: {
            unsubscribe: vi.fn(),
          },
        },
      })),
    },
  },
}));

function TestComponent() {
  const auth = useContext(AuthContext);

  return (
    <>
      <div>{auth.loading ? 'Loading' : 'Done'}</div>
      <div>{auth.user ? 'User' : 'No User'}</div>
    </>
  );
}

describe('AuthProvider', () => {
  it('renders children', () => {
    render(
      <AuthProvider>
        <div>Hello</div>
      </AuthProvider>
    );

    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('starts loading', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByText(/Loading|Done/)).toBeInTheDocument();
  });

  it('has no user by default', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByText('No User')).toBeInTheDocument();
  });
});