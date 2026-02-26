import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import DisputeList from '../../pages/Disputes/DisputeList';
import { DisputeStatus, DisputeReason, type Dispute } from '../../models/DisputeObjects';

const testDisputes: Dispute[] = [
  { id: 'TEST-001', transactionId: 'T1', reasonCode: DisputeReason.Unauthorized, details: 'Test dispute 1', evidenceAttached: true, status: DisputeStatus.Pending, submittedAt: '2024-01-20T10:00:00Z', estimatedResolutionDate: '2024-01-27' },
  { id: 'TEST-002', transactionId: 'T2', reasonCode: DisputeReason.Duplicate, details: 'Test dispute 2', evidenceAttached: false, status: DisputeStatus.UnderReview, submittedAt: '2024-01-19T14:30:00Z', estimatedResolutionDate: '2024-01-26' },
  { id: 'TEST-003', transactionId: 'T3', reasonCode: DisputeReason.IncorrectAmount, details: 'Test dispute 3', evidenceAttached: true, status: DisputeStatus.Resolved, submittedAt: '2024-01-18T09:15:00Z', estimatedResolutionDate: '2024-01-25' },
  { id: 'TEST-004', transactionId: 'T4', reasonCode: DisputeReason.NotReceived, details: 'Test dispute 4', evidenceAttached: false, status: DisputeStatus.Rejected, submittedAt: '2024-01-17T16:45:00Z', estimatedResolutionDate: '2024-01-24' },
  { id: 'TEST-005', transactionId: 'T5', reasonCode: DisputeReason.Fraudulent, details: 'Test dispute 5', evidenceAttached: true, status: DisputeStatus.Pending, submittedAt: '2024-01-16T11:20:00Z', estimatedResolutionDate: '2024-01-23' },
  { id: 'TEST-006', transactionId: 'T6', reasonCode: DisputeReason.Cancelled, details: 'Test dispute 6', evidenceAttached: false, status: DisputeStatus.UnderReview, submittedAt: '2024-01-15T13:00:00Z', estimatedResolutionDate: '2024-01-22' },
];

describe('DisputeList', () => {
  it('renders dispute list title', () => {
    render(<DisputeList initialDisputes={testDisputes} />);
    expect(screen.getByText('My Disputes')).toBeInTheDocument();
  });

  it('displays paginated disputes (5 per page)', () => {
    render(<DisputeList initialDisputes={testDisputes} />);
    expect(screen.getByText(/TEST-001/)).toBeInTheDocument();
    expect(screen.getByText(/TEST-005/)).toBeInTheDocument();
    expect(screen.queryByText(/TEST-006/)).not.toBeInTheDocument();
  });

  it('navigates to next page', () => {
    render(<DisputeList initialDisputes={testDisputes} />);
    fireEvent.click(screen.getByText('Next'));
    expect(screen.getByText(/TEST-006/)).toBeInTheDocument();
  });

  it('disables Previous button on first page', () => {
    render(<DisputeList initialDisputes={testDisputes} />);
    expect(screen.getByText('Previous')).toBeDisabled();
  });

  it('sorts by date when Date button clicked', () => {
    render(<DisputeList initialDisputes={testDisputes} />);
    const dateButton = screen.getByText(/Date/);
    fireEvent.click(dateButton);
    expect(dateButton).toHaveTextContent('↑');
  });
});
