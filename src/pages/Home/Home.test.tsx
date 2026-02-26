import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom/vitest';
import Home from './Home';
import { useAuth } from '../../context/AuthContext';
import { transactionService } from '../../services/transactionService';
import { disputeService } from '../../services/disputeService';
import { TransactionStatus } from '../../models/TransactionObjects';

vi.mock('../../context/AuthContext');
vi.mock('../../services/transactionService');
vi.mock('../../services/disputeService');

const mockTransactionData = {
  data: {
    items: [
      {
        id: 'T1',
        date: '2024-01-20',
        merchant: { name: 'Amazon', category: 'Online' },
        amount: 299.99,
        currency: 'ZAR',
        status: TransactionStatus.Completed,
        reference: 'REF001'
      }
    ],
    totalCount: 1,
    page: 1,
    totalPages: 1,
    returnedCount: 1
  },
  success: true
};

const renderHome = () => render(<BrowserRouter><Home /></BrowserRouter>);

describe('Home', () => {
  beforeEach(() => {
    vi.mocked(useAuth).mockReturnValue({
      userId: 'test-user',
      isAuthenticated: true,
      phoneNumber: '1234567890',
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
      sendOtp: vi.fn(),
      verifyOtp: vi.fn(),
      refreshToken: vi.fn()
    });
    vi.mocked(transactionService.getTransactions).mockResolvedValue(mockTransactionData);
    vi.mocked(disputeService.createDispute).mockResolvedValue({} as any);
  });

  it('renders loading spinner initially', () => {
    renderHome();
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('renders transaction list after loading', async () => {
    renderHome();
    await waitFor(() => {
      expect(screen.getByText('Recent Transactions')).toBeInTheDocument();
      expect(screen.getByText('Amazon')).toBeInTheDocument();
    });
  });

  it('opens dispute form when dispute button clicked', async () => {
    renderHome();
    await waitFor(() => screen.getByText('Dispute'));
    fireEvent.click(screen.getByText('Dispute'));
    expect(screen.getByText('Dispute Transaction')).toBeInTheDocument();
  });

  it('shows success message after dispute submission', async () => {
    renderHome();
    await waitFor(() => screen.getByText('Dispute'));
    fireEvent.click(screen.getByText('Dispute'));
    
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Unauthorized' } });
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Test dispute' } });
    fireEvent.click(screen.getByText('Submit Dispute'));
    
    await waitFor(() => {
      expect(screen.getByText('Dispute submitted successfully!')).toBeInTheDocument();
    });
  });

  it('handles sort functionality', async () => {
    renderHome();
    await waitFor(() => screen.getByText(/Date/));
    fireEvent.click(screen.getByText(/Date/));
    expect(transactionService.getTransactions).toHaveBeenCalledWith(
      expect.objectContaining({ sortBy: 'date', sortOrder: 'asc' })
    );
  });
});
