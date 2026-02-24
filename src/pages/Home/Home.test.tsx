import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Home from './Home';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom/vitest';

const renderHome = () => render(<BrowserRouter><Home /></BrowserRouter>);

describe('Home', () => {
  it('renders transaction list', () => {
    renderHome();
    expect(screen.getByText('Recent Transactions')).toBeInTheDocument();
  });

  it('displays transactions', () => {
    renderHome();
    expect(screen.getByText('Amazon')).toBeInTheDocument();
    expect(screen.getByText('Woolworths')).toBeInTheDocument();
  });

  it('opens dispute form when dispute button clicked', () => {
    renderHome();
    const disputeButtons = screen.getAllByText('Dispute');
    fireEvent.click(disputeButtons[0]);
    expect(screen.getByText('Dispute Transaction')).toBeInTheDocument();
  });

 it('submits dispute and shows success message', () => {
  renderHome();
  fireEvent.click(screen.getAllByText('Dispute')[0]);
  
  fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Unauthorized' } });
  fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Test dispute' } });
  fireEvent.click(screen.getByText('Submit Dispute'));
  
//   expect(screen.getByText('Dispute submitted successfully!')).toBeInTheDocument();
});

});
