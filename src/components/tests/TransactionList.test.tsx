import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import TransactionList from '../TransactionList';
import { TransactionStatus } from '../../models/TransactionObjects';

const mockTransactionData = {
  items: [
    { id: '1', date: '2024-01-15', merchant: { name: 'Amazon', category: 'Retail' }, reference: "monthly subscription", amount: 1299.99, currency: 'ZAR', status: TransactionStatus.Completed },
    { id: '2', date: '2024-01-14', merchant: { name: 'Woolworths', category: 'Groceries' }, reference: "Woolies cafe", amount: 450.50, currency: 'ZAR', status: TransactionStatus.Completed },
    { id: '3', date: '2024-01-13', merchant: { name: 'Uber', category: 'Transport' }, reference: "UberPlus", amount: 85.00, currency: 'ZAR', status: TransactionStatus.Disputed }
  ],
  totalCount: 3,
  page: 1,
  totalPages: 1,
  returnedCount: 3
};

describe('TransactionList', () => {
  const defaultProps = {
    transactionData: mockTransactionData,
    onDispute: vi.fn(),
    onPageChange: vi.fn(),
    currentPage: 1,
    onSort: vi.fn(),
    sortBy: 'date' as const,
    sortOrder: 'desc' as const
  };

  it('shows recent list title', () => {
    render(<TransactionList {...defaultProps} />);
    expect(screen.getByText('Recent Transactions')).toBeInTheDocument();
  });

  it('displays transactions', () => {
    render(<TransactionList {...defaultProps} />);
    expect(screen.getByText('Amazon')).toBeInTheDocument();
    expect(screen.getByText('Woolworths')).toBeInTheDocument();
  });

  it('calls onSort when sort buttons clicked', () => {
    const onSort = vi.fn();
    render(<TransactionList {...defaultProps} onSort={onSort} />);
    
    fireEvent.click(screen.getByText(/Date/));
    expect(onSort).toHaveBeenCalledWith('date');
    
    fireEvent.click(screen.getByText(/Amount/));
    expect(onSort).toHaveBeenCalledWith('amount');
  });

  it('calls onDispute when Dispute button clicked', () => {
    const onDispute = vi.fn();
    render(<TransactionList {...defaultProps} onDispute={onDispute} />);
    
    const disputeButtons = screen.getAllByText('Dispute');
    fireEvent.click(disputeButtons[0]);
    expect(onDispute).toHaveBeenCalledWith(expect.objectContaining({ id: '1' }));
  });

  it('does not show Dispute button for disputed transactions', () => {
    render(<TransactionList {...defaultProps} />);
    
    // Should only have 2 dispute buttons (Amazon and Woolworths are Completed, Uber is Disputed)
    const disputeButtons = screen.queryAllByText('Dispute');
    expect(disputeButtons).toHaveLength(2);
  });

  it('calls onPageChange when pagination buttons clicked', () => {
    const onPageChange = vi.fn();
    const multiPageData = { ...mockTransactionData, totalPages: 2 };
    
    render(<TransactionList {...defaultProps} transactionData={multiPageData} onPageChange={onPageChange} />);
    
    fireEvent.click(screen.getByText('Next'));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });
});
