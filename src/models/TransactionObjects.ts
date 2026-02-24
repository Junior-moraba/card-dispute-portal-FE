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
