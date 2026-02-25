import { useState, useEffect } from 'react';
import { DisputeStatus, DisputeReason, type Dispute } from '../models/DisputeObjects';
import { disputeService } from '../services/disputeService';
import { useAuth } from '../context/AuthContext';
import { Paperclip } from 'lucide-react';
import Spinner from './Spinner';

export default function DisputeList() {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortField, setSortField] = useState<'submittedAt' | 'status'>('submittedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const { userId } = useAuth();
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchDisputes = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        const response = await disputeService.getDisputes();
        setDisputes(response.disputes);
      } catch (error) {
        setError('Failed to load disputes');
        console.error('Error fetching disputes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDisputes();
  }, [userId]);

  const sortedDisputes = [...disputes].sort((a, b) => {
    const multiplier = sortOrder === 'asc' ? 1 : -1;
    if (sortField === 'submittedAt') {
      return multiplier * (new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime());
    }
    return multiplier * a.status.localeCompare(b.status);
  });

  const totalPages = Math.ceil(sortedDisputes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDisputes = sortedDisputes.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (field: 'submittedAt' | 'status') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  if (loading) {
    return (
      <div className="w-full p-8 text-center">
        <Spinner size="md" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-8 text-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (disputes.length === 0) {
    return (
      <div className="w-full p-8 text-center text-gray-500">
        <p>No disputes found</p>
      </div>
    );
  }

  return (
    <div className="w-full p-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">My Disputes</h2>
        <div className="flex gap-2">
          <button onClick={() => handleSort('submittedAt')} className="px-3 py-1 bg-gray-200 rounded text-sm">
            Date {sortField === 'submittedAt' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
          <button onClick={() => handleSort('status')} className="px-3 py-1 bg-gray-200 rounded text-sm">
            Status {sortField === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        {paginatedDisputes.map((dispute) => (
          <div key={dispute.id} className="border border-gray-300 rounded-lg p-4 bg-white shadow">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-bold">Dispute ID: {dispute.id}</p>
                <p className="text-sm text-gray-600">Transaction: {dispute.transactionId}</p>
                <p className="text-sm text-gray-600">Reason: {dispute.reasonCode}</p>
              </div>
              <span className={`px-3 py-1 rounded text-sm font-semibold ${
                dispute.status === DisputeStatus.Pending ? 'bg-yellow-100 text-yellow-800' :
                dispute.status === DisputeStatus.UnderReview ? 'bg-blue-100 text-blue-800' :
                dispute.status === DisputeStatus.Resolved ? 'bg-green-100 text-green-800' :
                'bg-red-100 text-red-800'
              }`}>
                {dispute.status}
              </span>
            </div>
            <p className="text-gray-700 mb-2">{dispute.details}</p>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Submitted: {new Date(dispute.submittedAt).toLocaleDateString()}</span>
              <span>Est. Resolution: {new Date(dispute.estimatedResolutionDate).toLocaleDateString()}</span>
            </div>
            {dispute.evidenceAttached && (
              <div className='flex flex-row gap-2 items-center '>
                <Paperclip className='text-blue6500 w-4 h-4 '/>
                <p className="text-sm text-blue-600 mt-2"> Evidence attached</p>
              </div> 
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-2 items-center justify-center mt-6">
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
