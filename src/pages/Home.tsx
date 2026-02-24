import { useState } from 'react';
import TransactionList from '../components/TransactionList';
import DisputeForm from '../components/DisputeForm';
import { TransactionStatus, type Transaction } from '../models/TransactionObjects';
import { DisputeReason, DisputeStatus, type Dispute } from '../models/DisputeObjects';


const mockTransactions: Transaction[] = [
  { id: '1', date: '2024-01-15', merchant: { name: 'Amazon', category: 'Retail' }, amount: 1299.99, currency: 'ZAR', status: TransactionStatus.Completed },
  { id: '2', date: '2024-01-14', merchant: { name: 'Woolworths', category: 'Groceries' }, amount: 450.50, currency: 'ZAR', status: TransactionStatus.Completed },
  { id: '3', date: '2024-01-13', merchant: { name: 'Uber', category: 'Transport' }, amount: 85.00, currency: 'ZAR', status: TransactionStatus.Completed },
  { id: '4', date: '2024-01-12', merchant: { name: 'Netflix', category: 'Entertainment' }, amount: 199.00, currency: 'ZAR', status: TransactionStatus.Completed },
  { id: '5', date: '2024-01-11', merchant: { name: 'Takealot', category: 'Retail' }, amount: 2500.00, currency:'ZAR' , status: TransactionStatus.Completed },
];

function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleDispute = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
  };

  const handleSubmitDispute = (reason: string, description: string) => {
    if (selectedTransaction) {
      const dispute: Dispute = {
        transactionId: selectedTransaction.id,
        reasonCode: DisputeReason[reason as keyof typeof DisputeReason],
        details: description,
        status: DisputeStatus.Pending,
        estimatedResolutionDate: getEstimatedResolutionDate(),
        submittedAt: new Date().toISOString(),
      };
      
      setDisputes([...disputes, dispute]);
      setTransactions(transactions.map(t => 
        t.id === selectedTransaction.id ? { ...t, status: TransactionStatus.Disputed } : t
      ));
      setSelectedTransaction(null);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const getEstimatedResolutionDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 3);
    return date.toISOString().split('T')[0]; // Return in YYYY-MM-DD format
  };

  

  return (
    <div className="app">
      <header>
        <p className='text-5xl font-bold'>Card Dispute Portal</p>
      </header>
      
      {showSuccess && (
        <div className="success-message">
          Dispute submitted successfully!
        </div>
      )}

      {selectedTransaction ? (
        <DisputeForm
          transaction={selectedTransaction}
          onSubmit={handleSubmitDispute}
          onCancel={() => setSelectedTransaction(null)}
        />
      ) : (
        <TransactionList
          transactions={transactions}
          onDispute={handleDispute}
        />
      )}
    </div>
  );
}

export default Home;
