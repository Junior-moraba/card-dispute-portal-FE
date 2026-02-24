import { useState } from 'react';
import { type Transaction } from '../models/TransactionObjects';
import { DisputeReason } from '../models/DisputeObjects';

export interface DisputeFormData {
  reasonCode: DisputeReason | '';
  details: string;
  evidenceAttached: boolean;
  evidenceFiles?: File[];
}

interface Props {
  transaction: Transaction;
  onSubmit: (formData: DisputeFormData) => void;
  onCancel: () => void;
}

export default function DisputeForm({ transaction, onSubmit, onCancel }: Props) {
  const [formData, setFormData] = useState<DisputeFormData>({
    reasonCode: '',
    details: '',
    evidenceAttached: false,
    evidenceFiles: [],
  });

  const isValid = formData.reasonCode !== '' && formData.details.trim().length >= 10;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 2);
    setFormData({...formData, evidenceFiles: files});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      onSubmit(formData);
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
          <label htmlFor="transactionAmount" className='font-bold'>Amount:</label> 
          <p id="transactionAmount">R {transaction.amount.toFixed(2)}</p>
        </div>
        <div className='flex flex-row gap-2'> 
          <label htmlFor="transactionDate" className='font-bold'>Date:</label> 
          <p id="transactionDate">{new Date(transaction.date).toLocaleDateString()}</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <div className="flex gap-2">
          <label className='font-bold' htmlFor="reason">Reason:</label>
          <select 
            className='border border-blue-600 rounded-md p-2' 
            id="reason" 
            value={formData.reasonCode} 
            onChange={(e) => setFormData({...formData, reasonCode: e.target.value as DisputeReason})} 
            required
          >
            <option value="">Select a reason</option>
            <option value={DisputeReason.Unauthorized}>Unauthorized Transaction</option>
            <option value={DisputeReason.Duplicate}>Duplicate Charge</option>
            <option value={DisputeReason.IncorrectAmount}>Incorrect Amount</option>
            <option value={DisputeReason.NotReceived}>Product/Service Not Received</option>
            <option value={DisputeReason.Fraudulent}>Fraudulent Transaction</option>
            <option value={DisputeReason.Cancelled}>Cancelled Service</option>
            <option value={DisputeReason.Other}>Other</option>
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="description">Description (min 10 characters)</label>
          <textarea
            id="description"
            value={formData.details}
            onChange={(e) => setFormData({...formData, details: e.target.value})}
            placeholder="Provide details about the dispute"
            rows={4}
            required
            className='border border-blue-600 w-full rounded-md p-2'
          />
        </div>
        <div className="flex gap-2">
          <input
            type="checkbox"
            id="evidence"
            checked={formData.evidenceAttached}
            onChange={(e) => setFormData({...formData, evidenceAttached: e.target.checked, evidenceFiles: []})}
          />
          <label htmlFor="evidence">I have evidence to support this dispute</label>
        </div>
        {formData.evidenceAttached && (
          <div className="flex flex-col gap-2">
            <label htmlFor="files">Upload Evidence (Max 4 mb)</label>
            <input
              type="file"
              id="files"
              onChange={handleFileChange}
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              className="border border-blue-600 rounded-md p-2"
            />
            {formData.evidenceFiles && formData.evidenceFiles.length > 0 && (
              <div className="text-sm text-gray-600">
                {formData.evidenceFiles.map((file, idx) => (
                  <p key={idx}>{file.name}</p>
                ))}
              </div>
            )}
          </div>
        )}
        <div className="flex flex-row gap-4 justify-end">
          <button 
            className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed' 
            type="submit"
            disabled={!isValid}
          >
            Submit Dispute
          </button>
          <button className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600' type="button" onClick={onCancel}>Close</button>
        </div>
      </form>
    </div>
  );
}
