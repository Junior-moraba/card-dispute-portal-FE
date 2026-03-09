// src/components/ErrorModal.tsx
interface Props {
  onRetry: () => void;
  onClose: () => void;
  retryCount: number;
  maxRetries: number;
}

export default function ErrorModal({ onRetry, onClose, retryCount, maxRetries }: Props) {
  const canRetry = retryCount < maxRetries;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Dispute Submission Failed</h2>
        <p className="text-gray-700 mb-4">
          We couldn't submit your dispute at this time. Please try again.
        </p>
        <p className="text-gray-600 mb-6">
          If this is an emergency, please call us at <span className="font-bold">0860 10 20 43</span>
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Close
          </button>
          <button
            onClick={onRetry}
            disabled={!canRetry}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Retry {canRetry && `(${maxRetries - retryCount} left)`}
          </button>
        </div>
      </div>
    </div>
  );
}
