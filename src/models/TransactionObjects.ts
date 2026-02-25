export interface Transaction {
  id: string;
  date: string;
  merchant: Merchant;
  amount: number;
  currency: string;
  status: TransactionStatus;
  reference: string;
}



export interface Merchant {
  name: string;
  category: string;
}

export enum TransactionStatus{
  Completed = 'Completed',
  Pending = 'Pending',
  Disputed = 'Disputed'
}


export interface TransactionListParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface TransactionListResponse {
    data: TransactionListData;
    success: boolean;
}

export interface TransactionListData {
    items: Transaction[];
    totalCount: number;
    page: number;
    returnedCount: number;
}