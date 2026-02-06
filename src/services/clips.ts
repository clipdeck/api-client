import { BaseClient } from '../client';

/**
 * Filter options for listing clips.
 *
 * @example
 * ```typescript
 * const filters: ClipListFilters = { campaignId: 'camp_abc123', status: 'approved' };
 * ```
 */
export interface ClipListFilters {
  /** Filter clips by the campaign they belong to. */
  campaignId?: string;

  /** Filter clips by the editor who submitted them. */
  editorId?: string;

  /** Filter clips by review status (e.g., `'pending'`, `'approved'`, `'rejected'`). */
  status?: string;

  /** The page number for pagination (1-indexed). */
  page?: number;

  /** The maximum number of clips to return per page. */
  limit?: number;
}

/**
 * Data required to submit a new clip to a campaign.
 *
 * @example
 * ```typescript
 * const data: SubmitClipData = {
 *   campaignId: 'camp_abc123',
 *   title: 'Amazing Play',
 *   videoUrl: 'https://cdn.example.com/clips/my-clip.mp4',
 *   duration: 45,
 *   platform: 'twitch',
 * };
 * ```
 */
export interface SubmitClipData {
  /** The ID of the campaign this clip is being submitted to. */
  campaignId: string;

  /** The title of the clip. */
  title: string;

  /** An optional description providing context about the clip. */
  description?: string;

  /** The URL of the video file or embed. */
  videoUrl: string;

  /** An optional URL for the clip's thumbnail image. */
  thumbnailUrl?: string;

  /** The duration of the clip in seconds. */
  duration?: number;

  /** The platform where the clip was originally created (e.g., `'twitch'`, `'youtube'`). */
  platform?: string;
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
 * Service client for clip submission, review, and statistics operations.
 *
 * Provides methods to submit clips to campaigns, review them (approve/reject),
 * and retrieve performance statistics.
 *
 * @example
 * ```typescript
 * const client = new ClipdeckClient({ baseURL: 'https://api.clipdeck.io' });
 *
 * // Submit a clip
 * const clip = await client.clips.submit({
 *   campaignId: 'camp_abc123',
 *   title: 'Best Play',
 *   videoUrl: 'https://cdn.example.com/clip.mp4',
 * });
 *
 * // Get clip stats
 * const stats = await client.clips.getStats(clip.id as string);
 * ```
 */
export class ClipClient extends BaseClient {
  /**
   * Lists clips with optional filtering and pagination.
   *
   * @param filters - Optional filters to narrow results by campaign, editor, status, and pagination.
   * @returns A paginated response containing an array of clip objects.
   * @throws {ApiError} If the request fails or the server returns an error.
   *
   * @example
   * ```typescript
   * // List all approved clips for a campaign
   * const result = await client.clips.list({
   *   campaignId: 'camp_abc123',
   *   status: 'approved',
   *   page: 1,
   *   limit: 25,
   * });
   * console.log(result.data); // Clip[]
   * ```
   */
  async list(filters?: ClipListFilters): Promise<PaginatedResponse<Record<string, unknown>>> {
    return this.get('/clips', { params: filters });
  }

  /**
   * Retrieves a single clip by its unique identifier.
   *
   * @param id - The unique clip ID.
   * @returns The clip object.
   * @throws {ApiError} If the clip is not found (HTTP 404) or the request fails.
   *
   * @example
   * ```typescript
   * const clip = await client.clips.getById('clip_xyz789');
   * console.log(clip.title, clip.status);
   * ```
   */
  async getById(id: string): Promise<Record<string, unknown>> {
    return this.get(`/clips/${id}`);
  }

  /**
   * Submits a new clip to a campaign.
   *
   * The clip will be created with a `'pending'` status and will need to be
   * reviewed (approved or rejected) by the campaign owner.
   *
   * @param data - The clip submission data including campaign ID, title, and video URL.
   * @returns The newly created clip object.
   * @throws {ApiError} If validation fails (HTTP 400), the user is not a campaign
   *   participant (HTTP 403), or the campaign is not active (HTTP 400).
   *
   * @example
   * ```typescript
   * const clip = await client.clips.submit({
   *   campaignId: 'camp_abc123',
   *   title: 'Incredible Clutch',
   *   description: 'A 1v5 clutch in the final round',
   *   videoUrl: 'https://cdn.example.com/clips/clutch.mp4',
   *   duration: 30,
   *   platform: 'twitch',
   * });
   * ```
   */
  async submit(data: SubmitClipData): Promise<Record<string, unknown>> {
    return this.post('/clips', data);
  }

  /**
   * Updates the review status of a clip (approve or reject).
   *
   * Typically called by the campaign owner to review submitted clips.
   *
   * @param id - The unique clip ID.
   * @param status - The new status (e.g., `'approved'` or `'rejected'`).
   * @param reason - An optional reason for the status change, especially useful
   *   when rejecting a clip.
   * @returns The updated clip object.
   * @throws {ApiError} If the clip is not found (HTTP 404), the status transition is
   *   invalid (HTTP 400), or the user lacks permission (HTTP 403).
   *
   * @example
   * ```typescript
   * // Approve a clip
   * await client.clips.updateStatus('clip_xyz789', 'approved');
   *
   * // Reject a clip with a reason
   * await client.clips.updateStatus('clip_xyz789', 'rejected', 'Does not meet quality standards');
   * ```
   */
  async updateStatus(id: string, status: string, reason?: string): Promise<Record<string, unknown>> {
    return this.patch(`/clips/${id}/status`, { status, reason });
  }

  /**
   * Retrieves current performance statistics for a clip.
   *
   * Returns metrics such as view count, engagement rate, and other
   * performance indicators.
   *
   * @param id - The unique clip ID.
   * @returns An object containing the clip's performance statistics.
   * @throws {ApiError} If the clip is not found (HTTP 404) or the request fails.
   *
   * @example
   * ```typescript
   * const stats = await client.clips.getStats('clip_xyz789');
   * console.log(stats.views, stats.engagement);
   * ```
   */
  async getStats(id: string): Promise<Record<string, unknown>> {
    return this.get(`/clips/${id}/stats`);
  }

  /**
   * Retrieves the historical performance statistics for a clip.
   *
   * Returns an array of stats snapshots over time, useful for charting
   * performance trends.
   *
   * @param id - The unique clip ID.
   * @returns An array of historical stats snapshot objects.
   * @throws {ApiError} If the clip is not found (HTTP 404) or the request fails.
   *
   * @example
   * ```typescript
   * const history = await client.clips.getStatsHistory('clip_xyz789');
   * history.forEach(snapshot => {
   *   console.log(snapshot.date, snapshot.views);
   * });
   * ```
   */
  async getStatsHistory(id: string): Promise<Record<string, unknown>[]> {
    return this.get(`/clips/${id}/stats/history`);
  }
}
