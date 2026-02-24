import { useState } from 'react';
import { type Transaction } from '../models/TransactionObjects';

interface Props {
  transactions: Transaction[];
  onDispute: (transaction: Transaction) => void;
}

export default function TransactionList({ transactions, onDispute }: Props) {
  const [sortField, setSortField] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const sortedTransactions = [...transactions].sort((a, b) => {
    const multiplier = sortOrder === 'asc' ? 1 : -1;
    if (sortField === 'date') {
      return multiplier * (new Date(a.date).getTime() - new Date(b.date).getTime());
    }
    return multiplier * (a.amount - b.amount);
  });

  const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = sortedTransactions.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (field: 'date' | 'amount') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="transaction-list flex w-full flex-col p-8 items-center gap-6">
      <p className='text-2xl w-full text-left font-bold'>Recent Transactions</p>
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('date')} className="cursor-pointer">
              Date {sortField === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th>Merchant</th>
            <th onClick={() => handleSort('amount')} className="cursor-pointer">
              Amount {sortField === 'amount' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {paginatedTransactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{new Date(transaction.date).toLocaleDateString()}</td>
              <td>{transaction.merchant.name}</td>
              <td>R {transaction.amount.toFixed(2)}</td>
              <td>
                <span className={`status ${transaction.status}`}>
                  {transaction.status}
                </span>
              </td>
              <td>
                {transaction.status !== 'disputed' && (
                  <button className='bg-red-400 text-white hover:bg-red-500 px-3 py-1 rounded' onClick={() => onDispute(transaction)}>
                    Dispute
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="flex gap-2 items-center">
        <button 
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button 
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
}
