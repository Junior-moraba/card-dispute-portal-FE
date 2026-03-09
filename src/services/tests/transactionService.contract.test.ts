/// <reference types="node" />
import { PactV4 } from '@pact-foundation/pact';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as api from '../api';
import { transactionService } from '../transactionService';

const provider = new PactV4({
  consumer: 'card-dispute-portal',
  provider: 'transaction-service',
});

const mockSessionStorage = {
  getItem: vi.fn((key: string) => {
    if (key === 'userId') return 'user-123';
    if (key === 'authToken') return 'test-token';
    return null;
  }),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  key: vi.fn(),
  length: 0,
};

global.sessionStorage = mockSessionStorage as Storage;
global.window = {
  location: {
    href: 'http://localhost:5173',
  },
} as any;
global.performance = {
  now: () => Date.now(),
} as any;

describe('Transaction Service Contract', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('gets transaction list', async () => {
    await provider
      .addInteraction()
      .uponReceiving('a request for transaction list')
      .given('transactions exist for user')
      .withRequest('POST', '/transactions/list', (builder) => {
        builder.jsonBody({ userId: 'user-123' });
      })
      .willRespondWith(200, (builder) => {
        builder.jsonBody({
          success: true,
          data: {
            items: [
              {
                id: 'txn-1',
                date: '2024-01-15T10:30:00Z',
                merchant: { name: 'Store', category: 'Retail' },
                amount: 150.0,
                currency: 'ZAR',
                status: 'Completed',
                reference: 'REF-001',
              },
            ],
            totalCount: 1,
            page: 1,
            totalPages: 1,
            returnedCount: 1,
          },
        });
      })
      .executeTest(async (mockServer) => {
        vi.spyOn(api, 'API_BASE_URL', 'get').mockReturnValue(mockServer.url);
        const result = await transactionService.getTransactions({ userId: 'user-123' });
        expect(result.success).toBe(true);
        expect(result.data.items).toHaveLength(1);
      });
  });

  it('gets single transaction', async () => {
    await provider
      .addInteraction()
      .uponReceiving('a request for transaction by id')
      .given('transaction txn-1 exists')
      .withRequest('GET', '/transactions/txn-1')
      .willRespondWith(200, (builder) => {
        builder.jsonBody({
          id: 'txn-1',
          date: '2024-01-15T10:30:00Z',
          merchant: { name: 'Store', category: 'Retail' },
          amount: 150.0,
          currency: 'ZAR',
          status: 'Completed',
          reference: 'REF-001',
        });
      })
      .executeTest(async (mockServer) => {
        vi.spyOn(api, 'API_BASE_URL', 'get').mockReturnValue(mockServer.url);
        const result = await transactionService.getTransaction('txn-1');
        expect(result.id).toBe('txn-1');
      });
  });
});
