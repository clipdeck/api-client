import { BaseClient } from '../client';

/**
 * Parameters for listing balance transactions with pagination and filtering.
 *
 * @example
 * ```typescript
 * const params: TransactionListParams = {
 *   type: 'earning',
 *   startDate: '2025-01-01',
 *   endDate: '2025-06-30',
 *   limit: 50,
 * };
 * ```
 */
export interface TransactionListParams {
  /** The page number for pagination (1-indexed). */
  page?: number;

  /** The maximum number of transactions to return per page. */
  limit?: number;

  /** Filter transactions by type (e.g., `'earning'`, `'payout'`, `'bonus'`). */
  type?: string;

  /** Filter transactions from this date onward (ISO 8601 format). */
  startDate?: string;

  /** Filter transactions up to this date (ISO 8601 format). */
  endDate?: string;
}

/**
 * Data required to request a payout.
 *
 * @example
 * ```typescript
 * const data: RequestPayoutData = {
 *   amount: 100.00,
 *   method: 'paypal',
 *   details: { email: 'user@example.com' },
 * };
 * ```
 */
export interface RequestPayoutData {
  /** The payout amount in platform currency. */
  amount: number;

  /** The payout method (e.g., `'paypal'`, `'bank_transfer'`, `'crypto'`). */
  method: string;

  /** Method-specific details (e.g., PayPal email, bank account info). */
  details: Record<string, string>;
}

/**
 * A generic paginated response wrapper.
 *
 * @typeParam T - The type of items in the `data` array.
 */
export interface PaginatedResponse<T> {
  /** The array of items for the current page. */
  data: T[];

  /** The total number of matching items across all pages. */
  total: number;

  /** The current page number (1-indexed). */
  page: number;

  /** The number of items per page. */
  limit: number;

  /** The total number of pages available. */
  totalPages: number;
}

/**
 * Service client for balance and payout operations.
 *
 * Provides methods to check the authenticated user's balance, list transaction
 * history, and request payouts.
 *
 * @example
 * ```typescript
 * const client = new ClipdeckClient({ baseURL: 'https://api.clipdeck.io' });
 *
 * // Check current balance
 * const balance = await client.balance.getBalance();
 * console.log(`Available: $${balance.available}`);
 *
 * // Request a payout
 * await client.balance.requestPayout({
 *   amount: 50,
 *   method: 'paypal',
 *   details: { email: 'me@example.com' },
 * });
 * ```
 */
export class BalanceClient extends BaseClient {
  /**
   * Retrieves the authenticated user's current account balance.
   *
   * Returns information including available balance, pending earnings,
   * and lifetime totals.
   *
   * @returns An object containing balance information.
   * @throws {ApiError} If the user is not authenticated (HTTP 401) or the request fails.
   *
   * @example
   * ```typescript
   * const balance = await client.balance.getBalance();
   * console.log(`Available: $${balance.available}`);
   * console.log(`Pending: $${balance.pending}`);
   * ```
   */
  async getBalance(): Promise<Record<string, unknown>> {
    return this.get('/balance');
  }

  /**
   * Lists the authenticated user's balance transactions with optional filtering.
   *
   * Transactions include earnings from clips, payouts, bonuses, and other
   * balance-affecting events.
   *
   * @param params - Optional parameters to filter by type, date range, and control pagination.
   * @returns A paginated response containing an array of transaction objects.
   * @throws {ApiError} If the user is not authenticated (HTTP 401) or the request fails.
   *
   * @example
   * ```typescript
   * // List recent earnings
   * const result = await client.balance.getTransactions({
   *   type: 'earning',
   *   page: 1,
   *   limit: 25,
   * });
   * result.data.forEach(tx => console.log(tx.amount, tx.description));
   * ```
   */
  async getTransactions(params?: TransactionListParams): Promise<PaginatedResponse<Record<string, unknown>>> {
    return this.get('/balance/transactions', { params });
  }

  /**
   * Requests a payout from the authenticated user's available balance.
   *
   * The payout will be processed according to the specified method and details.
   * Processing times vary by payout method.
   *
   * @param data - Payout request data including amount, method, and method-specific details.
   * @returns The created payout request object, including its status and estimated processing time.
   * @throws {ApiError} If the balance is insufficient (HTTP 400), validation fails (HTTP 400),
   *   or the user is not authenticated (HTTP 401).
   *
   * @example
   * ```typescript
   * const payout = await client.balance.requestPayout({
   *   amount: 100,
   *   method: 'paypal',
   *   details: { email: 'editor@example.com' },
   * });
   * console.log(`Payout ${payout.id} is ${payout.status}`);
   * ```
   */
  async requestPayout(data: RequestPayoutData): Promise<Record<string, unknown>> {
    return this.post('/balance/payouts', data);
  }
}
