import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import DisputeForm from '../DisputeForm';
import { TransactionStatus, type Transaction } from '../../models/TransactionObjects';
import { DisputeReason } from '../../models/DisputeObjects';

const mockTransaction: Transaction = {
  id: '1',
  date: '2024-01-15',
  merchant: { name: 'Amazon', category: 'Retail' },
  amount: 1299.99,
  currency: 'ZAR',
  reference: 'Laptop - Dell XPS 15',
  status: TransactionStatus.Completed
};

describe('DisputeForm', () => {
  it('renders transaction details', () => {
    render(<DisputeForm transaction={mockTransaction} onSubmit={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByText('Amazon')).toBeInTheDocument();
    expect(screen.getByText('R 1299.99')).toBeInTheDocument();
  });

  it('disables submit button when form is invalid', () => {
    render(<DisputeForm transaction={mockTransaction} onSubmit={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByText('Submit Dispute')).toBeDisabled();
  });

  it('enables submit button when form is valid', () => {
  render(<DisputeForm transaction={mockTransaction} onSubmit={vi.fn()} onCancel={vi.fn()} />);
  
  const select = screen.getByRole('combobox');
  const textarea = screen.getByRole('textbox');
  
  fireEvent.change(select, { target: { value: 'Unauthorized' } });
  fireEvent.change(textarea, { target: { value: 'This is a valid description' } });
  
  expect(screen.getByText('Submit Dispute')).not.toBeDisabled();
});





  it('calls onCancel when Close button clicked', () => {
    const onCancel = vi.fn();
    render(<DisputeForm transaction={mockTransaction} onSubmit={vi.fn()} onCancel={onCancel} />);
    
    fireEvent.click(screen.getByText('Close'));
    expect(onCancel).toHaveBeenCalled();
  });

  it('shows file upload when evidence checkbox is checked', () => {
    render(<DisputeForm transaction={mockTransaction} onSubmit={vi.fn()} onCancel={vi.fn()} />);
    
    expect(screen.queryByLabelText(/Upload Evidence/i)).not.toBeInTheDocument();
    
    fireEvent.click(screen.getByLabelText(/I have evidence/i));
    expect(screen.getByLabelText(/Upload Evidence/i)).toBeInTheDocument();
  });

  it('handles file upload', () => {
    render(<DisputeForm transaction={mockTransaction} onSubmit={vi.fn()} onCancel={vi.fn()} />);
    
    fireEvent.click(screen.getByLabelText(/I have evidence/i));
    
    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    const input = screen.getByLabelText(/Upload Evidence/i) as HTMLInputElement;
    
    fireEvent.change(input, { target: { files: [file] } });
    expect(screen.getByText('test.pdf')).toBeInTheDocument();
  });

  it('validates minimum description length', () => {
    render(<DisputeForm transaction={mockTransaction} onSubmit={vi.fn()} onCancel={vi.fn()} />);
    
    fireEvent.change(screen.getByRole('combobox'), { target: { value: DisputeReason.Other } });
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'short' } });
    
    expect(screen.getByText('Submit Dispute')).toBeDisabled();
  });

 
});
