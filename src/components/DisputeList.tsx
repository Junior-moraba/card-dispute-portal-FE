import { useState } from 'react';
import { DisputeStatus, DisputeReason, type Dispute } from '../models/DisputeObjects';
import { Paperclip } from 'lucide-react';


interface Props {
  initialDisputes?: Dispute[];
}
const dummyDisputes: Dispute[] = [
  { id: 'DSP-001', transactionId: '1', reasonCode: DisputeReason.Unauthorized, details: 'Unauthorized transaction on my account', evidenceAttached: true, status: DisputeStatus.Pending, submittedAt: '2024-01-20T10:00:00Z', estimatedResolutionDate: '2024-01-27' },
  { id: 'DSP-002', transactionId: '2', reasonCode: DisputeReason.Duplicate, details: 'Duplicate charge for the same service', evidenceAttached: false, status: DisputeStatus.UnderReview, submittedAt: '2024-01-19T14:30:00Z', estimatedResolutionDate: '2024-01-26' },
  { id: 'DSP-003', transactionId: '3', reasonCode: DisputeReason.IncorrectAmount, details: 'Charged incorrect amount', evidenceAttached: true, status: DisputeStatus.Resolved, submittedAt: '2024-01-18T09:15:00Z', estimatedResolutionDate: '2024-01-25' },
  { id: 'DSP-004', transactionId: '4', reasonCode: DisputeReason.NotReceived, details: 'Product never received', evidenceAttached: false, status: DisputeStatus.Rejected, submittedAt: '2024-01-17T16:45:00Z', estimatedResolutionDate: '2024-01-24' },
  { id: 'DSP-005', transactionId: '5', reasonCode: DisputeReason.Fraudulent, details: 'Fraudulent transaction detected', evidenceAttached: true, status: DisputeStatus.Pending, submittedAt: '2024-01-16T11:20:00Z', estimatedResolutionDate: '2024-01-23' },
  { id: 'DSP-006', transactionId: '6', reasonCode: DisputeReason.Cancelled, details: 'Service was cancelled but still charged', evidenceAttached: false, status: DisputeStatus.UnderReview, submittedAt: '2024-01-15T13:00:00Z', estimatedResolutionDate: '2024-01-22' },
  { id: 'DSP-007', transactionId: '7', reasonCode: DisputeReason.Other, details: 'Other dispute reason', evidenceAttached: true, status: DisputeStatus.Pending, submittedAt: '2024-01-14T08:30:00Z', estimatedResolutionDate: '2024-01-21' },
  { id: 'DSP-008', transactionId: '8', reasonCode: DisputeReason.Unauthorized, details: 'Card used without permission', evidenceAttached: false, status: DisputeStatus.Resolved, submittedAt: '2024-01-13T15:10:00Z', estimatedResolutionDate: '2024-01-20' },
  { id: 'DSP-009', transactionId: '9', reasonCode: DisputeReason.Duplicate, details: 'Double billing issue', evidenceAttached: true, status: DisputeStatus.UnderReview, submittedAt: '2024-01-12T12:40:00Z', estimatedResolutionDate: '2024-01-19' },
  { id: 'DSP-010', transactionId: '10', reasonCode: DisputeReason.IncorrectAmount, details: 'Amount does not match receipt', evidenceAttached: false, status: DisputeStatus.Pending, submittedAt: '2024-01-11T10:25:00Z', estimatedResolutionDate: '2024-01-18' },
];

export default function DisputeList({ initialDisputes }: Props = {}) {
  const [disputes] = useState<Dispute[]>(initialDisputes || dummyDisputes);
  const [sortField, setSortField] = useState<'submittedAt' | 'status'>('submittedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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
