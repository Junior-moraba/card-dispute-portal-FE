import { apiRequest } from "./api";
import {
  type CreateDisputeRequest,
  type Dispute,
  type DisputeListParams,
  type DisputeListResponse,
} from "../models/DisputeObjects";

export const disputeService = {
  getDisputes: (params: DisputeListParams = {}) => {
    const userId = sessionStorage.getItem("userId");
    if (!userId) throw new Error("User ID not found");

    return apiRequest<DisputeListResponse>("/disputes/list", {
      method: "POST",
      body: JSON.stringify({ ...params, userId }),
    });
  },

  getDispute: (id: string) => apiRequest<Dispute>(`/disputes/${id}`),

  createDispute: async (disputeData: CreateDisputeRequest) => {
    const formData = new FormData();
    formData.append("userId", disputeData.userId);
    formData.append("transactionId", disputeData.transactionId);
    formData.append("reasonCode", disputeData.reasonCode);
    formData.append("details", disputeData.details);

    if (disputeData.evidence) {
      formData.append("evidence", disputeData.evidence);
    }

    return apiRequest<Dispute>("/disputes", {
      method: "POST",
      headers: {},
      body: formData,
    });
  },

  updateDispute: (id: string, updates: Partial<Dispute>) =>
    apiRequest<Dispute>(`/disputes/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    }),
};
