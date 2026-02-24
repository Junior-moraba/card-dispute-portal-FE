import { useState } from 'react';
import { type Transaction } from '../models/TransactionObjects';

interface Props {
  transaction: Transaction;
  onSubmit: (reason: string, description: string) => void;
  onCancel: () => void;
}

export default function DisputeForm({ transaction, onSubmit, onCancel }: Props) {
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reason && description) {
      onSubmit(reason, description);
    }
  };

  return (
    <div className="flex w-full max-w-md flex-col gap-6 rounded-lg bg-white p-6 shadow-md">
      <h2>Dispute Transaction</h2>
      <div className="transaction-details">
        <div className='flex flex-row gap-2'> 
          <label htmlFor="merchantName" className='font-bold'>Merchant:</label> 
          <p id="merchantName">{transaction.merchant.name}</p>
        </div>
        <div className='flex flex-row gap-2'> 
          <label htmlFor="merchantCategory" className='font-bold'>Category:</label> 
          <p id="merchantCategory">{transaction.merchant.category}</p>
        </div>
        <div className='flex flex-row gap-2'> 
          <label  htmlFor="transactionAmount" className='font-bold'>Amount:</label> 
          <p id="transactionAmount">R {transaction.amount.toFixed(2)}</p>
        </div>
        <div className='flex flex-row gap-2'> 
          <label  htmlFor="transactionDate" className='font-bold'>Date:</label> 
          <p id="transactionDate">{new Date(transaction.date).toLocaleDateString()}</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <div className="flex gap-2">
          <label className='font-bold' htmlFor="reason">Reason:</label>
          <select className='border rounded-md p-2' id="reason" value={reason} onChange={(e) => setReason(e.target.value)} required>
            <option value="">Select a reason</option>
            <option value="unauthorized">Unauthorized Transaction</option>
            <option value="duplicate">Duplicate Charge</option>
            <option value="incorrect_amount">Incorrect Amount</option>
            <option value="not_received">Product/Service Not Received</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide details about the dispute"
            rows={4}
            required
            className='border border-blue-600 w-full rounded-md'
          />
        </div>
        <div className="flex flex-row gap-4 justify-end">
          <button className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-green-600' type="submit">Submit Dispute</button>
          <button className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600' type="button" onClick={onCancel}>Close</button>
        </div>
      </form>
    </div>
  );
}
