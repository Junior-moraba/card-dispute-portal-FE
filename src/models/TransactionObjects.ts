export interface Transaction {
  id: string;
  date: string;
  merchant: Merchant;
  amount: number;
  currency: string;
  status: TransactionStatus;
}



export interface Merchant {
  name: string;
  category: string;
}

export enum TransactionStatus{
  Completed = 'completed',
  Pending = 'pending',
  Disputed = 'disputed'
}
