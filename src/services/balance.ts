import { BaseClient } from '../client';

export interface TransactionListParams {
  page?: number;
  limit?: number;
  type?: string;
  startDate?: string;
  endDate?: string;
}

export interface RequestPayoutData {
  amount: number;
  method: string;
  details: Record<string, string>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class BalanceClient extends BaseClient {
  async getBalance(): Promise<Record<string, unknown>> {
    return this.get('/balance');
  }

  async getTransactions(params?: TransactionListParams): Promise<PaginatedResponse<Record<string, unknown>>> {
    return this.get('/balance/transactions', { params });
  }

  async requestPayout(data: RequestPayoutData): Promise<Record<string, unknown>> {
    return this.post('/balance/payouts', data);
  }
}
