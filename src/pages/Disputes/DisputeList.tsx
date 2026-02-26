import { useState, useEffect } from 'react';
import { DisputeStatus, DisputeReason, type Dispute, type DisputeListResponse } from '../../models/DisputeObjects';
import { disputeService } from '../../services/disputeService';
import { useAuth } from '../../context/AuthContext';
import { Paperclip, Info } from 'lucide-react';
import Spinner from '../../components/Spinner';

export default function DisputeList() {
  const [disputeData, setDisputeData] = useState<DisputeListResponse>({} as DisputeListResponse);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const { userId } = useAuth();

  useEffect(() => {
    const fetchDisputes = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        const response = await disputeService.getDisputes({
          page: currentPage,
          limit: 5,
          sortBy: 'date'
        });
        setDisputeData(response);
      } catch (error) {
        setError('Failed to load disputes');
        console.error('Error fetching disputes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDisputes();
  }, [userId, currentPage]);

  const handlePageChange = async (page: number) => {
    try {
      setLoading(true);
      const response = await disputeService.getDisputes({
        page,
        limit: 5,
        sortBy: 'date'
      });
      setDisputeData(response);
      setCurrentPage(page);
    } catch (error) {
      setError('Failed to load disputes');
    } finally {
      setLoading(false);
    }
  };

  const canEscalate = (dispute: Dispute) => {
    const resolutionDate = new Date(dispute.estimatedResolutionDate);
    const today = new Date();
    return today > resolutionDate && dispute.status !== DisputeStatus.Resolved;
  };

  const handleEscalate = (disputeId: string) => {
    console.log('Escalating dispute:', disputeId);
    // TODO: Implement escalation API call
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

  if (!disputeData.data.items?.length) {
    return (
      <div className="w-full p-8 text-center text-gray-500">
        <p>No disputes found</p>
      </div>
    );
  }

  return (
    <div className="w-full p-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">My Disputes ({disputeData.data.totalCount})</h2>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 flex items-start gap-2">
        <Info className="w-5 h-5 text-blue-600 mt-0.5" />
        <p className="text-sm text-blue-800">
          <strong>Escalation:</strong> The escalate button will only be available after the estimated resolution date has passed for unresolved disputes.
        </p>
      </div>
      
      <div className="space-y-4">
        {disputeData.data.items.map((dispute) => (
          <div key={dispute.id} className="border border-gray-300 rounded-lg p-4 bg-white shadow">
            <div className="flex justify-between gap-2 items-start mb-2">
              <div>
                <p className="text-gray-600"><strong>Dispute ID:</strong> {dispute.id}</p>
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
            <div className='flex flex-col gap-2'>
                <p className="text-sm text-gray-600"><strong>Reference:</strong> {dispute.reference}</p>
                <p className="text-sm text-gray-600"><strong>Merchant:</strong> {dispute.merchant.name}</p>
                <p className="text-sm text-gray-600"><strong>Reason:</strong> {dispute.reasonCode}</p>
                <p className="text-sm text-gray-600"><strong>Details:</strong> {dispute.details}</p>
            </div>
            
            <div className="flex justify-between text-sm text-gray-600 mb-3">
              <span><strong>Submitted:</strong> {new Date(dispute.submittedAt).toLocaleDateString()}</span>
              <span><strong>Est. Resolution:</strong> {new Date(dispute.estimatedResolutionDate).toLocaleDateString()}</span>
            </div>
            {dispute.evidenceAttached && (
              <div className='flex flex-row gap-2 items-center mb-3'>
                <Paperclip className='text-blue6500 w-4 h-4 '/>
                <p className="text-sm text-blue-600"> Evidence attached</p>
              </div> 
            )}
            <div className="flex justify-end">
              <button
                onClick={() => handleEscalate(dispute.id!)}
                disabled={!canEscalate(dispute)}
                className="bg-red-500 text-white hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed px-4 py-2 rounded text-sm font-semibold"
              >
                Escalate
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 items-center justify-center mt-6">
        <button 
          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Previous
        </button>
        <span>Page {currentPage} of {disputeData.data.totalPages}</span>
        <button 
          onClick={() => handlePageChange(Math.min(disputeData.data.totalPages, currentPage + 1))}
          disabled={currentPage === disputeData.data.totalPages}
          className="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
}
