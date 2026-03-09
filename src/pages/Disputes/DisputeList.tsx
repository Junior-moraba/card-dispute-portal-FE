import { useState, useEffect } from "react";
import {
  DisputeStatus,
  type Dispute,
  type DisputeListResponse,
} from "../../models/DisputeObjects";
import { disputeService } from "../../services/disputeService";
import { useAuth } from "../../context/AuthContext";
import {
  Paperclip,
  Info,
  CheckCircle,
  Clock,
  XCircle,
  EyeIcon,
  ChevronUp,
  ChevronDown,
  AlertCircle,
} from "lucide-react";
import Spinner from "../../components/Spinner";

export default function DisputeList() {
  const [disputeData, setDisputeData] = useState<DisputeListResponse>(
    {} as DisputeListResponse,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { userId } = useAuth();
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [isLegendOpen, setIsLegendOpen] = useState(false);
  const [showEscalateModal, setShowEscalateModal] = useState(false);
  const [selectedDisputeId, setSelectedDisputeId] = useState<string | null>(null);

  const timelineSteps = Object.entries(DisputeStatus).map(([key, value]) => ({
    status: key,
    label: value,
    icon:
      key === "Pending"
        ? Clock
        : key === "UnderReview"
          ? EyeIcon
          : key === "Resolved"
            ? CheckCircle
            : XCircle,
  }));

  const getStepStatus = (disputeStatus: string, stepStatus: string) => {
    if (disputeStatus === stepStatus) return "current";

    const statusOrder = Object.keys(DisputeStatus);
    const currentIndex = statusOrder.indexOf(disputeStatus);
    const stepIndex = statusOrder.indexOf(stepStatus);

    if (stepIndex !== -1 && currentIndex !== -1 && stepIndex < currentIndex) {
      return "completed";
    }

    return "inactive";
  };

  useEffect(() => {
    const fetchDisputes = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        const response = await disputeService.getDisputes({
          page: currentPage,
          limit: 5,
          sortBy: sortBy,
          sortOrder: sortOrder,
        });
        setDisputeData(response);
      } catch (error) {
        setError("Failed to load disputes");
        console.error("Error fetching disputes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDisputes();
  }, [userId, currentPage, sortBy, sortOrder]);

  const handlePageChange = async (page: number) => {
    try {
      setLoading(true);
      const response = await disputeService.getDisputes({
        page,
        limit: 5,
        sortBy: sortBy,
        sortOrder: sortOrder,
      });
      setDisputeData(response);
      setCurrentPage(page);
    } catch (error) {
      setError("Failed to load disputes");
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
    setSelectedDisputeId(disputeId);
    setShowEscalateModal(true);
  };

  const closeModal = () => {
    setShowEscalateModal(false);
    setSelectedDisputeId(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <Spinner size="md" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <p>{error}</p>
      </div>
    );
  }

  if (!disputeData.data.items?.length) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <p>No disputes found</p>
      </div>
    );
  }

  return (
    <div className="w-full p-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">
          My Disputes ({disputeData.data.totalCount})
        </h2>

        <div className="flex gap-2">
          <button
            onClick={() => {
              setSortBy("date");
              setSortOrder(
                sortBy === "date"
                  ? sortOrder === "asc"
                    ? "desc"
                    : "asc"
                  : "desc",
              );
            }}
            data-testid="sort-date"
            className={`px-3 py-1 rounded text-sm ${sortBy === "date" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            Date {sortBy === "date" && (sortOrder === "asc" ? "↑" : "↓")}
          </button>
          <button
            onClick={() => {
              setSortBy("status");
              setSortOrder(
                sortBy === "status"
                  ? sortOrder === "asc"
                    ? "desc"
                    : "asc"
                  : "desc",
              );
            }}
            data-testid="sort-status"
            className={`px-3 py-1 rounded text-sm ${sortBy === "status" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            Status {sortBy === "status" && (sortOrder === "asc" ? "↑" : "↓")}
          </button>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 flex items-start gap-2">
        <Info className="w-5 h-5 text-blue-600 mt-0.5" />
        <p className="text-sm text-blue-800">
          <strong>Escalation:</strong> The escalate button will only be
          available after the estimated resolution date has passed for
          unresolved disputes.
        </p>
      </div>

       {/* Collapsible Status Legend */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg mb-4">
        <button
          onClick={() => setIsLegendOpen(!isLegendOpen)}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-100 transition-colors"
        >
          <h3 className="text-sm font-semibold text-gray-700">Status Legend</h3>
          {isLegendOpen ? (
            <ChevronUp className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-600" />
          )}
        </button>

       {isLegendOpen && (
          <div className="px-4 pb-4">
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-gray-700">Completed Step</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-gray-700">Current Step</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-gray-500" />
                </div>
                <span className="text-sm text-gray-700">Pending Step</span>
              </div>
            </div>
          </div>
        )}
        </div>

      <div className="space-y-4">
        {disputeData.data.items.map((dispute) => (
          <div
            key={dispute.id}
            className="border border-gray-300 rounded-lg p-4 bg-white shadow"
          >
            <div className="flex justify-between gap-2 items-start mb-4">
              <div>
                <p className="text-gray-600">
                  <strong>Dispute ID:</strong> {dispute.id}
                </p>
              </div>
            </div>

            {/* Timeline */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                Status Timeline
              </h4>
              <div className="flex items-center justify-between">
                {timelineSteps.map((step, index) => {
                  const status = getStepStatus(dispute.status, step.status);
                  const IconComponent = step.icon;

                  return (
                    <div key={step.status} className="flex items-center">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            status === "completed"
                              ? "bg-green-500 text-white"
                              : status === "current"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-300 text-gray-500"
                          }`}
                        >
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <span
                          className={`text-xs text-center mt-1 ${
                            status === "completed"
                              ? "text-green-600"
                              : status === "current"
                                ? "text-blue-600"
                                : "text-gray-400"
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                      {index < timelineSteps.length - 1 && (
                        <div
                          className={`flex-1 h-0.5 mx-2 ${
                            status === "completed"
                              ? "bg-green-500"
                              : "bg-gray-300"
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-sm text-gray-600">
                <strong>Reference:</strong> {dispute.reference}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Merchant:</strong> {dispute.merchant.name}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Reason:</strong> {dispute.reasonCode}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Details:</strong> {dispute.details}
              </p>
            </div>

            <div className="flex justify-between text-sm text-gray-600 mb-3">
              <span>
                <strong>Submitted:</strong>{" "}
                {new Date(dispute.submittedAt).toLocaleDateString()}
              </span>
              <span>
                <strong>Est. Resolution:</strong>{" "}
                {new Date(dispute.estimatedResolutionDate).toLocaleDateString()}
              </span>
            </div>
            {dispute.evidenceAttached && (
              <div className="flex flex-row gap-2 items-center mb-3">
                <Paperclip className="text-blue6500 w-4 h-4 " />
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
        <span>
          Page {currentPage} of {disputeData.data.totalPages}
        </span>
        <button
          onClick={() =>
            handlePageChange(
              Math.min(disputeData.data.totalPages, currentPage + 1),
            )
          }
          disabled={currentPage === disputeData.data.totalPages}
          className="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
      {showEscalateModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm bg-opacity-150 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-start gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-orange-500 shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Escalation Feature
                </h3>
                <p className="text-gray-600 mb-4">
                 Feature is currently under development and will be available soon.
                </p>
                <p className="text-sm text-gray-500">
                  Please contact customer support directly if you need immediate assistance with this dispute.
                </p>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={closeModal}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
