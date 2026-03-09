import { useState, useEffect, useRef } from "react";
import TransactionList from "../../components/TransactionList";
import DisputeForm, {
  type DisputeFormData,
} from "../../components/DisputeForm";
import {
  TransactionStatus,
  type Transaction,
  type TransactionListData,
} from "../../models/TransactionObjects";
import {
  DisputeReason,
  type Dispute,
} from "../../models/DisputeObjects";
import { transactionService } from "../../services/transactionService";
import { disputeService } from "../../services/disputeService";
import { useAuth } from "../../context/AuthContext";
import Spinner from "../../components/Spinner";
import ErrorModal from "../../components/ErrorModal";
import { useAnalytics } from '../../hooks/useAnalytics';
import { usePerformanceMonitor } from '../../hooks/usePerformanceMonitor';
import { logger } from '../../services/logger';

function Home() {
  const [transactions, setTransactions] = useState<TransactionListData>(
    {} as TransactionListData,
  );
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { userId } = useAuth();
  const hasFetched = useRef(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<"date" | "amount">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [pendingDisputeData, setPendingDisputeData] = useState<DisputeFormData | null>(null);
  const { trackEvent, trackPageView } = useAnalytics();
  usePerformanceMonitor('Home');


  useEffect(() => {
    trackPageView('Home');
  }, [trackPageView]);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (hasFetched.current) return;

      try {
        setLoading(true);
        hasFetched.current = true;
        const response = await transactionService.getTransactions({
          userId: userId!,
          page: 1,
          limit: 10,
          sortBy: "date",
          sortOrder: "desc",
        });
        setTransactions(response.data);
      } catch (error) {
        setError("Failed to load transactions");
        console.error("Error fetching transactions:", error);
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
        userId: userId!,
        page,
        limit: 10,
        sortBy,
        sortOrder,
      });
      setTransactions(response.data);
      setCurrentPage(page);
    } catch (error) {
      setError("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  const handleSort = async (field: "date" | "amount") => {
    const newSortOrder =
      sortBy === field && sortOrder === "desc" ? "asc" : "desc";
    setSortBy(field);
    setSortOrder(newSortOrder);
    setCurrentPage(1);

    if (userId) {
      try {
        setLoading(true);
        const response = await transactionService.getTransactions({
          userId: userId,
          page: 1,
          limit: 10,
          sortBy: field,
          sortOrder: newSortOrder,
        });
        setTransactions(response.data);
      } catch (error) {
        setError("Failed to load transactions");
      } finally {
        setLoading(false);
      }
    }
  };

   const handleDispute = (transaction: Transaction) => {
    trackEvent('Dispute Initiated', {
      transactionId: transaction.id,
      amount: transaction.amount,
    });
    setSelectedTransaction(transaction);
  };


  const handleSubmitDispute = async (formData: DisputeFormData) => {
    logger.info('Dispute Submission Started', {
      transactionId: selectedTransaction?.id,
      reasonCode: formData.reasonCode,
    });
    if (selectedTransaction && formData.reasonCode !== "" && userId) {
      try {
        setLoading(true);

        const disputeRequest = {
          userId,
          transactionId: selectedTransaction.id,
          reasonCode: formData.reasonCode as DisputeReason,
          details: formData.details,
          evidence: formData.evidenceFiles?.[0],
        };

        const createdDispute = await disputeService.createDispute(disputeRequest);

        setDisputes([...disputes, createdDispute]);
        setTransactions({
          ...transactions,
          items: transactions.items.map((t) =>
            t.id === selectedTransaction.id
              ? { ...t, status: TransactionStatus.Disputed }
              : t,
          ),
        });
        setSelectedTransaction(null);
        setShowSuccess(true);
        setRetryCount(0);
        setPendingDisputeData(null);
        setTimeout(() => setShowSuccess(false), 3000);
        logger.info('Dispute Submission Success');
      } catch (error) {
        logger.error('Dispute Submission Failed', error, {
          transactionId: selectedTransaction?.id,
        });
        trackEvent('Dispute Submission Failed', {
          transactionId: selectedTransaction?.id,
        });
        setPendingDisputeData(formData);
        setShowErrorModal(true);
        console.error("Error submitting dispute:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRetryDispute = () => {
    setRetryCount(retryCount + 1);
    setShowErrorModal(false);
    if (pendingDisputeData) {
      handleSubmitDispute(pendingDisputeData);
    }
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
    setRetryCount(0);
    setPendingDisputeData(null);
  };


  const handleCreateDummyTransactions = async () => {
    try {
      setLoading(true);
      await transactionService.createDummyTransactions(userId!);
      // Refresh transactions
      const response = await transactionService.getTransactions({
        userId: userId!,
        page: 1,
        limit: 10,
        sortBy: "date",
        sortOrder: "desc",
      });
      setTransactions(response.data);
    } catch (error) {
      setError("Failed to create transactions");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <Spinner size="lg" />
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

if (!transactions.items || transactions.items.length === 0) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center gap-4">
      <p className="text-5xl font-bold">Card Dispute Portal</p>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
        <p className="text-xl text-gray-700 mb-2">No Transactions Found</p>
        <p className="text-gray-600 mb-4">You don't have any transactions yet.</p>
        <button
          onClick={handleCreateDummyTransactions}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Create Transactions
        </button>
      </div>
    </div>
  );
}


  return (
    <div className="min-h-screen w-full gap-4 flex flex-col items-center p-4">
      <header>
        <p className="text-5xl font-bold">Card Dispute Portal</p>
      </header>

      {showSuccess && (
        <div className="success-message">Dispute submitted successfully!</div>
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

      {showErrorModal && (
        <ErrorModal
          onRetry={handleRetryDispute}
          onClose={handleCloseErrorModal}
          retryCount={retryCount}
          maxRetries={2}
        />
      )}
    </div>
  );
}

export default Home;
