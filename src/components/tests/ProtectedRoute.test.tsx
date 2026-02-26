import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom/vitest';
import ProtectedRoute from '../ProtectedRoute';
import { useAuth } from '../../context/AuthContext';

vi.mock('../../context/AuthContext');

const TestChild = () => <div>Protected Content</div>;

describe('ProtectedRoute', () => {
  it('shows spinner when loading', () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
      userId: null,
      phoneNumber: null,
      login: vi.fn(),
      logout: vi.fn(),
      sendOtp: vi.fn(),
      verifyOtp: vi.fn(),
      refreshToken: vi.fn()
    });

    render(
      <BrowserRouter>
        <ProtectedRoute><TestChild /></ProtectedRoute>
      </BrowserRouter>
    );
    
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('renders children when authenticated', () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      userId: 'test',
      phoneNumber: null,
      login: vi.fn(),
      logout: vi.fn(),
      sendOtp: vi.fn(),
      verifyOtp: vi.fn(),
      refreshToken: vi.fn()
    });

    render(
      <BrowserRouter>
        <ProtectedRoute><TestChild /></ProtectedRoute>
      </BrowserRouter>
    );
    
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});
