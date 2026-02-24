export interface Dispute {
  id: string;
  transactionId: string;
  reasonCode: DisputeReason;
  details: string;
  evidenceAttached: boolean;
  status: DisputeStatus;
  submittedAt: string;
  estimatedResolutionDate: string;
}

export enum DisputeStatus {
  Pending = 'pending',
  UnderReview = 'under_review',
  Resolved = 'resolved',
  Rejected = 'rejected'
}

export enum DisputeReason {
  Unauthorized = 'UNAUTH',
  Duplicate = 'DUP',
  IncorrectAmount = 'INCAMT',
  NotReceived = 'NOTREC',
  Fraudulent = 'FRAUD',
  Cancelled = 'CANCEL',
  Other = 'OTHER'
}
