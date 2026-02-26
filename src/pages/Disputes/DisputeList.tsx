import { useState, useEffect } from 'react';
import { DisputeStatus, DisputeReason, type Dispute, type DisputeListResponse } from '../../models/DisputeObjects';
import { disputeService } from '../../services/disputeService';
import { useAuth } from '../../context/AuthContext';
import { Paperclip, Info, CheckCircle, Clock, XCircle, EyeIcon } from 'lucide-react';
import Spinner from '../../components/Spinner';

export default function DisputeList() {
  const [disputeData, setDisputeData] = useState<DisputeListResponse>({} as DisputeListResponse);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const { userId } = useAuth();

  const timelineSteps = Object.entries(DisputeStatus).map(([key, value]) => ({
    status: key,
    label:value,
    icon: key === 'Pending' ? Clock : key === 'UnderReview' ? EyeIcon : key === 'Resolved' ? CheckCircle : XCircle
  }));


 const getStepStatus = (disputeStatus: string, stepStatus: string) => {
    if (disputeStatus === stepStatus) return 'current';
    
    const statusOrder = Object.keys(DisputeStatus);
    const currentIndex = statusOrder.indexOf(disputeStatus);
    const stepIndex = statusOrder.indexOf(stepStatus);

    console.log(currentIndex, stepIndex);
    
    if (stepIndex !== -1 && currentIndex !== -1 && stepIndex < currentIndex) {
      return 'completed';
    }
    
    return 'inactive';
};


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
            <div className="flex justify-between gap-2 items-start mb-4">
              <div>
                <p className="text-gray-600"><strong>Dispute ID:</strong> {dispute.id}</p>
              </div>
            </div>

            {/* Timeline */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Status Timeline</h4>
              <div className="flex items-center justify-between">
                {timelineSteps.map((step, index) => {
                  const status = getStepStatus(dispute.status, step.status);
                  const IconComponent = step.icon;
                  
                  return (
                    <div key={step.status} className="flex items-center">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          status === 'completed' ? 'bg-green-500 text-white' :
                          status === 'current' ? 'bg-blue-500 text-white' :
                          'bg-gray-300 text-gray-500'
                        }`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <span className={`text-xs text-center mt-1 ${
                          status === 'completed' ? 'text-green-600' :
                          status === 'current' ? 'text-blue-600' :
                          'text-gray-400'
                        }`}>
                          {step.label}
                        </span>
                      </div>
                      {index < timelineSteps.length - 1 && (
                        <div className={`flex-1 h-0.5 mx-2 ${
                          status === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                        }`} />
                      )}
                    </div>
                  );
                })}
              </div>
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
                className="bg-orange-500 text-white hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed px-4 py-2 rounded text-sm font-semibold"
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
