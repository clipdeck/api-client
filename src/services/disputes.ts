import { BaseClient } from '../client';

/**
 * Filter options for listing disputes.
 *
 * @example
 * ```typescript
 * const filters: DisputeListFilters = { status: 'open', page: 1, limit: 20 };
 * ```
 */
export interface DisputeListFilters {
  /** Filter disputes by status (e.g., `'open'`, `'resolved'`, `'rejected'`). */
  status?: string;

  /** The page number for pagination (1-indexed). */
  page?: number;

  /** The maximum number of disputes to return per page. */
  limit?: number;
}

/**
 * Data required to create a new dispute.
 *
 * @example
 * ```typescript
 * const data: CreateDisputeData = {
 *   clipId: 'clip_xyz789',
 *   reason: 'copyright',
 *   description: 'This clip uses copyrighted music without permission',
 *   evidence: ['https://example.com/screenshot1.png'],
 * };
 * ```
 */
export interface CreateDisputeData {
  /** The ID of the clip being disputed. */
  clipId: string;

  /** The reason category for the dispute (e.g., `'copyright'`, `'quality'`, `'inappropriate'`). */
  reason: string;

  /** A detailed description of the dispute and why it was filed. */
  description: string;

  /** Optional array of URLs pointing to evidence supporting the dispute. */
  evidence?: string[];
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
 * Service client for dispute resolution operations.
 *
 * Provides methods to file disputes against clips, list disputes, and resolve
 * them (accept or reject).
 *
 * @example
 * ```typescript
 * const client = new ClipdeckClient({ baseURL: 'https://api.clipdeck.io' });
 *
 * // File a dispute
 * const dispute = await client.disputes.create({
 *   clipId: 'clip_xyz789',
 *   reason: 'copyright',
 *   description: 'Unauthorized use of copyrighted material',
 * });
 *
 * // Get my disputes
 * const myDisputes = await client.disputes.getMine();
 * ```
 */
export class DisputeClient extends BaseClient {
  /**
   * Lists disputes with optional filtering and pagination.
   *
   * @param filters - Optional filters to narrow results by status and control pagination.
   * @returns A paginated response containing an array of dispute objects.
   * @throws {ApiError} If the request fails or the server returns an error.
   *
   * @example
   * ```typescript
   * const result = await client.disputes.list({ status: 'open', page: 1, limit: 10 });
   * console.log(result.data); // Dispute[]
   * ```
   */
  async list(filters?: DisputeListFilters): Promise<PaginatedResponse<Record<string, unknown>>> {
    return this.get('/disputes', { params: filters });
  }

  /**
   * Retrieves a single dispute by its unique identifier.
   *
   * @param id - The unique dispute ID.
   * @returns The dispute object.
   * @throws {ApiError} If the dispute is not found (HTTP 404) or the request fails.
   *
   * @example
   * ```typescript
   * const dispute = await client.disputes.getById('disp_abc123');
   * console.log(dispute.reason, dispute.status);
   * ```
   */
  async getById(id: string): Promise<Record<string, unknown>> {
    return this.get(`/disputes/${id}`);
  }

  /**
   * Creates a new dispute against a clip.
   *
   * @param data - The dispute creation data including clip ID, reason, and description.
   * @returns The newly created dispute object.
   * @throws {ApiError} If validation fails (HTTP 400), the clip is not found (HTTP 404),
   *   or the user is not authenticated (HTTP 401).
   *
   * @example
   * ```typescript
   * const dispute = await client.disputes.create({
   *   clipId: 'clip_xyz789',
   *   reason: 'copyright',
   *   description: 'This clip contains copyrighted music',
   *   evidence: ['https://example.com/proof.png'],
   * });
   * console.log(`Dispute ${dispute.id} created`);
   * ```
   */
  async create(data: CreateDisputeData): Promise<Record<string, unknown>> {
    return this.post('/disputes', data);
  }

  /**
   * Retrieves all disputes filed by the authenticated user.
   *
   * @returns An array of the user's dispute objects.
   * @throws {ApiError} If the user is not authenticated (HTTP 401) or the request fails.
   *
   * @example
   * ```typescript
   * const myDisputes = await client.disputes.getMine();
   * myDisputes.forEach(d => console.log(d.reason, d.status));
   * ```
   */
  async getMine(): Promise<Record<string, unknown>[]> {
    return this.get('/disputes/mine');
  }

  /**
   * Resolves a dispute by accepting or rejecting it.
   *
   * Typically performed by administrators or campaign owners.
   *
   * @param id - The unique dispute ID to resolve.
   * @param action - The resolution action (e.g., `'accept'` or `'reject'`).
   * @param notes - Optional notes explaining the resolution decision.
   * @returns The updated dispute object with its resolution.
   * @throws {ApiError} If the dispute is not found (HTTP 404), the action is invalid
   *   (HTTP 400), or the user lacks permission (HTTP 403).
   *
   * @example
   * ```typescript
   * // Accept a dispute
   * const resolved = await client.disputes.resolve('disp_abc123', 'accept', 'Valid copyright claim');
   *
   * // Reject a dispute
   * const rejected = await client.disputes.resolve('disp_abc123', 'reject', 'Insufficient evidence');
   * ```
   */
  async resolve(id: string, action: string, notes?: string): Promise<Record<string, unknown>> {
    return this.post(`/disputes/${id}/resolve`, { action, notes });
  }
}
