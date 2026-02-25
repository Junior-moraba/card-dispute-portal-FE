import { useState, useEffect, useRef } from 'react';
import TransactionList from '../../components/TransactionList';
import DisputeForm, { type DisputeFormData } from '../../components/DisputeForm';
import { TransactionStatus, type Transaction, type TransactionListData } from '../../models/TransactionObjects';
import { DisputeReason, DisputeStatus, type Dispute } from '../../models/DisputeObjects';
import { transactionService } from '../../services/transactionService';
import { useAuth } from '../../context/AuthContext';

function Home() {
  const [transactions, setTransactions] = useState<TransactionListData>({} as TransactionListData);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { userId } = useAuth();
  const hasFetched = useRef(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
   useEffect(() => {
    const fetchTransactions = async () => {
      if (hasFetched.current) return;
      
      try {
        setLoading(true);
        hasFetched.current = true;
        const response = await transactionService.getTransactions({
          page: 1,
          limit: 10,
          sortBy: 'date',
          sortOrder: 'desc'
        });
        setTransactions(response.data);
      } catch (error) {
        setError('Failed to load transactions');
        console.error('Error fetching transactions:', error);
        hasFetched.current = false;
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchTransactions();
    }
  }, [userId]);

  const handlePageChange = async (page: number) => {
    try {
      setLoading(true);
      const response = await transactionService.getTransactions({
        page,
        limit: 10,
        sortBy,
        sortOrder
      });
      setTransactions(response.data);
      setCurrentPage(page);
    } catch (error) {
      setError('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleSort = async (field: 'date' | 'amount') => {
    const newSortOrder = sortBy === field && sortOrder === 'desc' ? 'asc' : 'desc';
    setSortBy(field);
    setSortOrder(newSortOrder);
    setCurrentPage(1);
    
    try {
      setLoading(true);
      const response = await transactionService.getTransactions({
        page: 1,
        limit: 10,
        sortBy: field,
        sortOrder: newSortOrder
      });
      setTransactions(response.data);
    } catch (error) {
      setError('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleDispute = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
  };

  const handleSubmitDispute = (formData: DisputeFormData) => {
    if (selectedTransaction && formData.reasonCode !== '') {
      const dispute: Dispute = {
        transactionId: selectedTransaction.id,
        reasonCode: formData.reasonCode as DisputeReason,
        details: formData.details,
        evidenceAttached: formData.evidenceAttached,
        status: DisputeStatus.Pending,
        estimatedResolutionDate: getEstimatedResolutionDate(),
        submittedAt: new Date().toISOString(),
      };
      
      setDisputes([...disputes, dispute]);
      setTransactions({
        ...transactions,
        items: transactions.items.map(t =>  
        t.id === selectedTransaction.id ? { ...t, status: TransactionStatus.Disputed } : t
      )});
      setSelectedTransaction(null);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const getEstimatedResolutionDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 3);
    return date.toISOString().split('T')[0];
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <p>Loading transactions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full gap-4 flex flex-col items-center p-4">
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
          transactionData={transactions}
          onDispute={handleDispute}
          onPageChange={handlePageChange}
          currentPage={currentPage}
          onSort={handleSort}
          sortBy={sortBy}
          sortOrder={sortOrder}
        />
      )}
    </div>
  );
}

export default Home;
