import type { Merchant } from "./TransactionObjects";

export interface Dispute {
  id?: string;
  transactionId: string;
  reasonCode: DisputeReason;
  merchant:Merchant;
  reference: string;
  details: string;
  evidenceAttached?: boolean;
  status: DisputeStatus;
  submittedAt: string;
  estimatedResolutionDate: string;
}

export enum DisputeStatus {
  Pending = 'Dispute Pending',
  UnderReview = 'Dispute Under Review by agents',
  Resolved = 'Dispute Resolved',
  Rejected = 'Dispute Rejected'
}

export enum DisputeReason {
  Unauthorized = 'Unauthorized Transaction',
  Duplicate = 'Duplicate Charge',
  IncorrectAmount = 'Incorrect Amount',
  NotReceived = 'Product/Service Not Received',
  Fraudulent = 'Fraudulent Transaction',
  Cancelled = 'Cancelled Service',
  Other = 'OTHER'
}


export interface CreateDisputeRequest {
  userId: string;
  transactionId: string;
  reasonCode: DisputeReason;
  details: string;
  evidence?: File;
}

export interface DisputeListParams {
  page?: number;
  limit?: number;
  sortBy?: string;
}

export interface DisputeListResponse {
  success: boolean;
  data: DisputeData;
}

export interface DisputeData{
  page: number;
  returnedCount: number;
  totalCount: number;
  totalPages: number;
  items: Dispute[];
}