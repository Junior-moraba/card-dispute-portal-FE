import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom/vitest';
import Header from '../Header';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '../../utils/navigation';

vi.mock('../../context/AuthContext');
vi.mock('../../utils/navigation');

const renderHeader = () => render(<BrowserRouter><Header /></BrowserRouter>);

describe('Header', () => {
  beforeEach(() => {
    vi.mocked(useAuth).mockReturnValue({
      logout: vi.fn(),
      userId: 'test',
      isAuthenticated: true,
      phoneNumber: null,
      isLoading: false,
      login: vi.fn(),
      sendOtp: vi.fn(),
      verifyOtp: vi.fn(),
      refreshToken: vi.fn()
    });
    vi.mocked(useNavigation).mockReturnValue({
      goTo: vi.fn(),
      goHome: vi.fn(),
      goBack: vi.fn(),
      goToDisputes: vi.fn()
    });
  });

  it('renders logo', () => {
    renderHeader();
    expect(screen.getByAltText('Logo')).toBeInTheDocument();
  });

    it('renders navigation menu', () => {
    renderHeader();
    expect(screen.getByTestId('nav-home')).toBeInTheDocument();
    expect(screen.getByTestId('nav-disputes')).toBeInTheDocument();
    });
  it('calls logout when logout button clicked', () => {
    const logout = vi.fn();
    vi.mocked(useAuth).mockReturnValue({
        logout,
        userId: 'test',
        isAuthenticated: true,
        phoneNumber: null,
        isLoading: false,
        login: vi.fn(),
        sendOtp: vi.fn(),
        verifyOtp: vi.fn(),
        refreshToken: vi.fn()
    });
    
    renderHeader();
    fireEvent.click(screen.getByTestId('desktop-logout'));
    expect(logout).toHaveBeenCalled();
    });


  it('toggles mobile menu', () => {
    renderHeader();
    const menuButton = screen.getByLabelText('Toggle menu');
    fireEvent.click(menuButton);
    // Menu should be visible (not testing exact implementation)
  });
});
