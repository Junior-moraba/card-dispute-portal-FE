import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import TransactionList from '../TransactionList';
import { TransactionStatus } from '../../models/TransactionObjects';

const mockTransactions = [
  { id: '1', date: '2024-01-15', merchant: { name: 'Amazon', category: 'Retail' },reference: "monthly subscription", amount: 1299.99, currency: 'ZAR', status: TransactionStatus.Completed },
  { id: '2', date: '2024-01-14', merchant: { name: 'Woolworths', category: 'Groceries' },reference: "Woolies cafe", amount: 450.50, currency: 'ZAR', status: TransactionStatus.Completed },
  { id: '3', date: '2024-01-13', merchant: { name: 'Uber', category: 'Transport' },reference: "UberPlus", amount: 85.00, currency: 'ZAR', status: TransactionStatus.Disputed },
  { id: '4', date: '2024-01-12', merchant: { name: 'Netflix', category: 'Entertainment' },reference: "monthly subscription", amount: 199.00, currency: 'ZAR', status: TransactionStatus.Completed },
  { id: '5', date: '2024-01-11', merchant: { name: 'Takealot', category: 'Retail' },reference: "Take1021", amount: 2500.00, currency: 'ZAR', status: TransactionStatus.Completed },
  { id: '6', date: '2024-01-10', merchant: { name: 'Checkers', category: 'Groceries' },reference: "Sixty60-232ls", amount: 350.00, currency: 'ZAR', status: TransactionStatus.Completed },
];

describe('TransactionList', () => {
  it('shows recent list title', () => {
    render(<TransactionList transactions={mockTransactions} onDispute={vi.fn()} />);
    expect(screen.getByText('Recent Transactions')).toBeInTheDocument();
  });

  it('displays paginated transactions (5 per page)', () => {
    render(<TransactionList transactions={mockTransactions} onDispute={vi.fn()} />);
    expect(screen.getByText('Amazon')).toBeInTheDocument();
    expect(screen.queryByText('Checkers')).not.toBeInTheDocument();
  });

  it('navigates to next page', () => {
    render(<TransactionList transactions={mockTransactions} onDispute={vi.fn()} />);
    fireEvent.click(screen.getByText('Next'));
    expect(screen.getByText('Checkers')).toBeInTheDocument();
  });

  it('disables Previous button on first page', () => {
    render(<TransactionList transactions={mockTransactions} onDispute={vi.fn()} />);
    expect(screen.getByText('Previous')).toBeDisabled();
  });

  it('sorts by date when Date header clicked', () => {
    render(<TransactionList transactions={mockTransactions} onDispute={vi.fn()} />);
    const dateHeader = screen.getByText(/Date/);
    fireEvent.click(dateHeader);
    expect(dateHeader).toHaveTextContent('↑');
  });

  it('sorts by amount when Amount header clicked', () => {
    render(<TransactionList transactions={mockTransactions} onDispute={vi.fn()} />);
    const amountHeader = screen.getByText(/Amount/);
    fireEvent.click(amountHeader);
    expect(amountHeader).toHaveTextContent('↓');
  });

  it('calls onDispute when Dispute button clicked', () => {
    const onDispute = vi.fn();
    render(<TransactionList transactions={mockTransactions} onDispute={onDispute} />);
    const disputeButtons = screen.getAllByText('Dispute');
    fireEvent.click(disputeButtons[0]);
    expect(onDispute).toHaveBeenCalledWith(expect.objectContaining({ id: '1' }));
  });

  it('does not show Dispute button for disputed transactions', () => {
    render(<TransactionList transactions={mockTransactions} onDispute={vi.fn()} />);
    const rows = screen.getAllByRole('row');
    const uberRow = rows.find(row => row.textContent?.includes('Uber'));
    expect(uberRow).not.toHaveTextContent('Dispute');
  });
});
