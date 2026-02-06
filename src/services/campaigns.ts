import { BaseClient } from '../client';

/**
 * Filter options for listing campaigns.
 *
 * @example
 * ```typescript
 * const filters: CampaignListFilters = { status: 'active', page: 1, limit: 20 };
 * ```
 */
export interface CampaignListFilters {
  /** Filter campaigns by status (e.g., `'draft'`, `'active'`, `'paused'`, `'completed'`). */
  status?: string;

  /** The page number for pagination (1-indexed). */
  page?: number;

  /** The maximum number of campaigns to return per page. */
  limit?: number;
}

/**
 * Data required to create a new campaign.
 *
 * @example
 * ```typescript
 * const data: CreateCampaignData = {
 *   title: 'Summer Highlights',
 *   description: 'Collect the best summer gaming clips',
 *   budget: 500,
 *   tags: ['gaming', 'summer'],
 * };
 * ```
 */
export interface CreateCampaignData {
  /** The campaign title. */
  title: string;

  /** A detailed description of the campaign and its goals. */
  description: string;

  /** The ID of the game associated with this campaign. */
  gameId?: string;

  /** The total budget allocated for the campaign (in platform currency). */
  budget?: number;

  /** The maximum number of participants allowed in the campaign. */
  maxParticipants?: number;

  /** The campaign start date in ISO 8601 format (e.g., `'2025-06-01T00:00:00Z'`). */
  startDate?: string;

  /** The campaign end date in ISO 8601 format (e.g., `'2025-07-31T23:59:59Z'`). */
  endDate?: string;

  /** Specific requirements or guidelines for clip submissions. */
  requirements?: string;

  /** Tags for categorizing and discovering the campaign. */
  tags?: string[];
}

/**
 * Data for updating an existing campaign. All fields are optional; only
 * provided fields will be updated.
 *
 * @example
 * ```typescript
 * const data: UpdateCampaignData = { title: 'Updated Title', budget: 750 };
 * ```
 */
export interface UpdateCampaignData {
  /** Updated campaign title. */
  title?: string;

  /** Updated campaign description. */
  description?: string;

  /** Updated budget amount. */
  budget?: number;

  /** Updated maximum number of participants. */
  maxParticipants?: number;

  /** Updated start date in ISO 8601 format. */
  startDate?: string;

  /** Updated end date in ISO 8601 format. */
  endDate?: string;

  /** Updated requirements or guidelines. */
  requirements?: string;

  /** Updated tags list. */
  tags?: string[];
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
 * Service client for campaign management operations.
 *
 * Provides methods to list, create, update, join, and manage campaigns
 * and their participants.
 *
 * @example
 * ```typescript
 * const client = new ClipdeckClient({ baseURL: 'https://api.clipdeck.io' });
 *
 * // List active campaigns
 * const { data: campaigns } = await client.campaigns.list({ status: 'active' });
 *
 * // Create a new campaign
 * const campaign = await client.campaigns.create({
 *   title: 'Best Plays',
 *   description: 'Share your best gaming moments',
 * });
 * ```
 */
export class CampaignClient extends BaseClient {
  /**
   * Lists campaigns with optional filtering and pagination.
   *
   * @param filters - Optional filters to narrow results by status and control pagination.
   * @returns A paginated response containing an array of campaign objects.
   * @throws {ApiError} If the request fails or the server returns an error.
   *
   * @example
   * ```typescript
   * // List all active campaigns, page 2
   * const result = await client.campaigns.list({ status: 'active', page: 2, limit: 10 });
   * console.log(result.data); // Campaign[]
   * console.log(result.totalPages); // number
   * ```
   */
  async list(filters?: CampaignListFilters): Promise<PaginatedResponse<Record<string, unknown>>> {
    return this.get('/campaigns', { params: filters });
  }

  /**
   * Retrieves a single campaign by its unique identifier.
   *
   * @param id - The unique campaign ID.
   * @returns The campaign object.
   * @throws {ApiError} If the campaign is not found (HTTP 404) or the request fails.
   *
   * @example
   * ```typescript
   * const campaign = await client.campaigns.getById('camp_abc123');
   * console.log(campaign.title);
   * ```
   */
  async getById(id: string): Promise<Record<string, unknown>> {
    return this.get(`/campaigns/${id}`);
  }

  /**
   * Creates a new campaign.
   *
   * @param data - The campaign creation data including title, description, and optional settings.
   * @returns The newly created campaign object.
   * @throws {ApiError} If validation fails (HTTP 400) or the request is unauthorized (HTTP 401).
   *
   * @example
   * ```typescript
   * const campaign = await client.campaigns.create({
   *   title: 'Epic Moments',
   *   description: 'Share your most epic gaming moments',
   *   budget: 1000,
   *   maxParticipants: 50,
   *   tags: ['gaming', 'highlights'],
   * });
   * ```
   */
  async create(data: CreateCampaignData): Promise<Record<string, unknown>> {
    return this.post('/campaigns', data);
  }

  /**
   * Updates an existing campaign with partial data.
   *
   * Only the fields provided in `data` will be updated; all other fields
   * remain unchanged.
   *
   * @param id - The unique campaign ID.
   * @param data - An object containing the fields to update.
   * @returns The updated campaign object.
   * @throws {ApiError} If the campaign is not found (HTTP 404), validation fails (HTTP 400),
   *   or the user lacks permission (HTTP 403).
   *
   * @example
   * ```typescript
   * const updated = await client.campaigns.update('camp_abc123', {
   *   title: 'Updated Campaign Title',
   *   budget: 2000,
   * });
   * ```
   */
  async update(id: string, data: UpdateCampaignData): Promise<Record<string, unknown>> {
    return this.patch(`/campaigns/${id}`, data);
  }

  /**
   * Joins a campaign as an editor/participant.
   *
   * The authenticated user will be added to the campaign's participant list.
   *
   * @param id - The unique campaign ID to join.
   * @returns The participation record or confirmation object.
   * @throws {ApiError} If the campaign is not found (HTTP 404), is full (HTTP 409),
   *   or the user is already a participant (HTTP 409).
   *
   * @example
   * ```typescript
   * const participation = await client.campaigns.join('camp_abc123');
   * ```
   */
  async join(id: string): Promise<Record<string, unknown>> {
    return this.post(`/campaigns/${id}/join`);
  }

  /**
   * Leaves a campaign that the authenticated user has previously joined.
   *
   * @param id - The unique campaign ID to leave.
   * @returns Resolves when the user has successfully left the campaign.
   * @throws {ApiError} If the campaign is not found (HTTP 404) or the user is not
   *   a participant (HTTP 400).
   *
   * @example
   * ```typescript
   * await client.campaigns.leave('camp_abc123');
   * ```
   */
  async leave(id: string): Promise<void> {
    return this.post(`/campaigns/${id}/leave`);
  }

  /**
   * Retrieves the list of participants for a given campaign.
   *
   * @param id - The unique campaign ID.
   * @returns An array of participant objects.
   * @throws {ApiError} If the campaign is not found (HTTP 404) or the request fails.
   *
   * @example
   * ```typescript
   * const participants = await client.campaigns.getParticipants('camp_abc123');
   * participants.forEach(p => console.log(p.username));
   * ```
   */
  async getParticipants(id: string): Promise<Record<string, unknown>[]> {
    return this.get(`/campaigns/${id}/participants`);
  }

  /**
   * Updates the status of a campaign.
   *
   * Valid status transitions typically follow: `draft` -> `active` -> `paused` -> `completed`.
   *
   * @param id - The unique campaign ID.
   * @param status - The new status value (e.g., `'draft'`, `'active'`, `'paused'`, `'completed'`).
   * @returns The updated campaign object.
   * @throws {ApiError} If the campaign is not found (HTTP 404), the status transition is
   *   invalid (HTTP 400), or the user lacks permission (HTTP 403).
   *
   * @example
   * ```typescript
   * const campaign = await client.campaigns.updateStatus('camp_abc123', 'active');
   * console.log(campaign.status); // 'active'
   * ```
   */
  async updateStatus(id: string, status: string): Promise<Record<string, unknown>> {
    return this.patch(`/campaigns/${id}/status`, { status });
  }
}
