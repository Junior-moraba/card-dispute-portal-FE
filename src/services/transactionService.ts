import { apiRequest } from './api';
import { type Transaction, type TransactionListParams, type TransactionListResponse } from '../models/TransactionObjects';




export const transactionService = {
  getTransactions: (params: TransactionListParams = {}) => {
    const userId = sessionStorage.getItem('userId');
    if (!userId) throw new Error('User ID not found');
    
    return apiRequest<TransactionListResponse>('/transactions/list', {
      method: 'POST',
      body: JSON.stringify({ ...params, userId }),
    });
  },

  getTransaction: (id: string) =>
    apiRequest<Transaction>(`/transactions/${id}`),
};
