import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { createMockAxiosInstance, MockAxiosInstance } from '../setup';

vi.mock('axios', () => ({
  default: {
    create: vi.fn(),
    isAxiosError: vi.fn(),
  },
}));

import { BalanceClient } from '../../src/services/balance';

describe('BalanceClient', () => {
  let client: BalanceClient;
  let mockAxios: MockAxiosInstance;

  beforeEach(() => {
    vi.clearAllMocks();
    mockAxios = createMockAxiosInstance();
    vi.mocked(axios.create).mockReturnValue(mockAxios as any);
    client = new BalanceClient({ baseURL: 'https://api.test.com' });
  });

  describe('getBalance', () => {
    it('should call GET /balance', async () => {
      const mockBalance = { available: 100.50, pending: 25.00 };
      mockAxios.get.mockResolvedValue({ data: mockBalance });

      const result = await client.getBalance();
      expect(mockAxios.get).toHaveBeenCalledWith('/balance', undefined);
      expect(result).toEqual(mockBalance);
    });
  });

  describe('getTransactions', () => {
    it('should call GET /balance/transactions with no params', async () => {
      const mockResponse = { data: [], total: 0, page: 1, limit: 10, totalPages: 0 };
      mockAxios.get.mockResolvedValue({ data: mockResponse });

      const result = await client.getTransactions();
      expect(mockAxios.get).toHaveBeenCalledWith('/balance/transactions', { params: undefined });
      expect(result).toEqual(mockResponse);
    });

    it('should call GET /balance/transactions with params', async () => {
      const params = { type: 'payout', page: 2, limit: 5 };
      const mockResponse = { data: [], total: 0, page: 2, limit: 5, totalPages: 0 };
      mockAxios.get.mockResolvedValue({ data: mockResponse });

      const result = await client.getTransactions(params);
      expect(mockAxios.get).toHaveBeenCalledWith('/balance/transactions', { params });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('requestPayout', () => {
    it('should call POST /balance/payouts with body', async () => {
      const payoutData = {
        amount: 50,
        method: 'paypal',
        details: { email: 'user@example.com' },
      };
      const mockResponse = { id: 'payout-1', status: 'pending', ...payoutData };
      mockAxios.post.mockResolvedValue({ data: mockResponse });

      const result = await client.requestPayout(payoutData);
      expect(mockAxios.post).toHaveBeenCalledWith('/balance/payouts', payoutData, undefined);
      expect(result).toEqual(mockResponse);
    });
  });
});
