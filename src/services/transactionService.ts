import { apiRequest } from "./api";
import {
  type Transaction,
  type TransactionListParams,
  type TransactionListResponse,
} from "../models/TransactionObjects";

export const transactionService = {
  getTransactions: (
    params: TransactionListParams = {
      userId: sessionStorage.getItem("userId") || "",
    },
  ) => {
    return apiRequest<TransactionListResponse>("/transactions/list", {
      method: "POST",
      body: JSON.stringify({ ...params }),
    });
  },

  getTransaction: (id: string) =>
    apiRequest<Transaction>(`/transactions/${id}`),


  createDummyTransactions: (userId: string) =>
    apiRequest<void>('/transactions/create-dummy', {
      method: 'POST',
      body: JSON.stringify({ userId }),
    }),

};
