import {
  TransactionStatus,
  type Transaction,
  type TransactionListData,
} from "../models/TransactionObjects";

interface Props {
  transactionData: TransactionListData;
  onDispute: (transaction: Transaction) => void;
  onPageChange: (page: number) => void;
  currentPage: number;
  onSort: (field: "date" | "amount") => void;
  sortBy: "date" | "amount";
  sortOrder: "asc" | "desc";
}

export default function TransactionList({
  transactionData,
  onDispute,
  onPageChange,
  currentPage,
  onSort,
  sortBy,
  sortOrder,
}: Props) {
  const totalPages = transactionData.totalPages || 1;

  const getStatusColor = (status: TransactionStatus) => {
    switch (status) {
      case TransactionStatus.Completed:
        return "bg-green-100 text-green-800";
      case TransactionStatus.Pending:
        return "bg-orange-100 text-orange-800";
      case TransactionStatus.Disputed:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="w-full flex flex-col p-8 gap-6">
      <div className="flex justify-between items-center">
        <p className="text-2xl font-bold">Recent Transactions</p>
        <div className="flex gap-2">
          <button
            onClick={() => onSort("date")}
            className="px-3 py-1 bg-gray-200 rounded text-sm"
          >
            Date {sortBy === "date" && (sortOrder === "asc" ? "↑" : "↓")}
          </button>
          <button
            onClick={() => onSort("amount")}
            className="px-3 py-1 bg-gray-200 rounded text-sm"
          >
            Amount {sortBy === "amount" && (sortOrder === "asc" ? "↑" : "↓")}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {transactionData.items?.map((transaction, index) => (
          <div
            key={transaction.id}
            className={`${index % 2 === 0 ? "bg-white" : "bg-blue-100"} border border-gray-300 rounded-lg p-4 shadow-sm`}
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <p className="font-bold text-lg">{transaction.merchant.name}</p>
                <p className="text-sm text-gray-600">{transaction.reference}</p>
                <p className="text-xs text-gray-500">
                  {new Date(transaction.date).toLocaleDateString()}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-gray-500 font-medium">
                    Status:
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold border-2 ${getStatusColor(transaction.status)}`}
                  >
                    {transaction.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-3">
              <p className="text-xl font-bold">
                R {transaction.amount.toFixed(2)}
              </p>
              {transaction.status === TransactionStatus.Completed && (
                <button
                  className="bg-red-500 text-white hover:bg-red-600 px-4 py-2 rounded font-semibold"
                  onClick={() => onDispute(transaction)}
                >
                  Dispute
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 items-center justify-center">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
}
