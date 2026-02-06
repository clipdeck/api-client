import { BaseClient } from '../client';

/**
 * Filter options for listing studios.
 *
 * @example
 * ```typescript
 * const filters: StudioListFilters = { search: 'gaming', sortBy: 'rating', limit: 20 };
 * ```
 */
export interface StudioListFilters {
  /** The page number for pagination (1-indexed). */
  page?: number;

  /** The maximum number of studios to return per page. */
  limit?: number;

  /** A search query to filter studios by name or description. */
  search?: string;

  /** The field to sort results by (e.g., `'rating'`, `'members'`, `'created'`). */
  sortBy?: string;
}

/**
 * Data required to create a new studio.
 *
 * @example
 * ```typescript
 * const data: CreateStudioData = {
 *   name: 'Pixel Editors',
 *   slug: 'pixel-editors',
 *   description: 'A studio for pixel-perfect video editors',
 *   website: 'https://pixeleditors.com',
 * };
 * ```
 */
export interface CreateStudioData {
  /** The display name of the studio. */
  name: string;

  /** A unique URL-safe slug for the studio (used in URLs and lookups). */
  slug: string;

  /** An optional description of the studio. */
  description?: string;

  /** An optional URL for the studio's avatar image. */
  avatarUrl?: string;

  /** An optional URL for the studio's website. */
  website?: string;

  /** An optional map of social platform names to profile URLs. */
  socialLinks?: Record<string, string>;
}

/**
 * Data for updating an existing studio. All fields are optional; only
 * provided fields will be updated.
 *
 * @example
 * ```typescript
 * const data: UpdateStudioData = { description: 'Updated description' };
 * ```
 */
export interface UpdateStudioData {
  /** Updated studio name. */
  name?: string;

  /** Updated studio description. */
  description?: string;

  /** Updated avatar image URL. */
  avatarUrl?: string;

  /** Updated website URL. */
  website?: string;

  /** Updated social links map. */
  socialLinks?: Record<string, string>;
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
 * Service client for studio management operations.
 *
 * Provides methods to create, update, join, leave, rate, and manage studios
 * and their members.
 *
 * @example
 * ```typescript
 * const client = new ClipdeckClient({ baseURL: 'https://api.clipdeck.io' });
 *
 * // List studios
 * const { data: studios } = await client.studios.list({ search: 'gaming' });
 *
 * // Create a new studio
 * const studio = await client.studios.create({
 *   name: 'Clip Masters',
 *   slug: 'clip-masters',
 *   description: 'Elite video editing studio',
 * });
 * ```
 */
export class StudioClient extends BaseClient {
  /**
   * Lists studios with optional filtering, search, and pagination.
   *
   * @param filters - Optional filters to search, sort, and paginate results.
   * @returns A paginated response containing an array of studio objects.
   * @throws {ApiError} If the request fails or the server returns an error.
   *
   * @example
   * ```typescript
   * const result = await client.studios.list({
   *   search: 'esports',
   *   sortBy: 'rating',
   *   page: 1,
   *   limit: 10,
   * });
   * console.log(result.data); // Studio[]
   * ```
   */
  async list(filters?: StudioListFilters): Promise<PaginatedResponse<Record<string, unknown>>> {
    return this.get('/studios', { params: filters });
  }

  /**
   * Retrieves a studio by its unique slug.
   *
   * @param slug - The unique URL-safe slug of the studio.
   * @returns The studio object.
   * @throws {ApiError} If the studio is not found (HTTP 404) or the request fails.
   *
   * @example
   * ```typescript
   * const studio = await client.studios.getBySlug('pixel-editors');
   * console.log(studio.name, studio.memberCount);
   * ```
   */
  async getBySlug(slug: string): Promise<Record<string, unknown>> {
    return this.get(`/studios/${slug}`);
  }

  /**
   * Creates a new studio.
   *
   * @param data - The studio creation data including name, slug, and optional details.
   * @returns The newly created studio object.
   * @throws {ApiError} If validation fails (HTTP 400), the slug is already taken (HTTP 409),
   *   or the user is not authenticated (HTTP 401).
   *
   * @example
   * ```typescript
   * const studio = await client.studios.create({
   *   name: 'Highlight Hub',
   *   slug: 'highlight-hub',
   *   description: 'The best gaming highlights',
   *   website: 'https://highlighthub.gg',
   * });
   * ```
   */
  async create(data: CreateStudioData): Promise<Record<string, unknown>> {
    return this.post('/studios', data);
  }

  /**
   * Updates an existing studio with partial data.
   *
   * Only the fields provided in `data` will be updated; all other fields
   * remain unchanged.
   *
   * @param slug - The unique slug of the studio to update.
   * @param data - An object containing the fields to update.
   * @returns The updated studio object.
   * @throws {ApiError} If the studio is not found (HTTP 404), validation fails (HTTP 400),
   *   or the user lacks permission (HTTP 403).
   *
   * @example
   * ```typescript
   * const updated = await client.studios.update('pixel-editors', {
   *   description: 'A premier studio for pixel-perfect editing',
   *   website: 'https://newsite.com',
   * });
   * ```
   */
  async update(slug: string, data: UpdateStudioData): Promise<Record<string, unknown>> {
    return this.patch(`/studios/${slug}`, data);
  }

  /**
   * Deletes a studio by its slug.
   *
   * This action is permanent and cannot be undone. Only studio owners
   * can delete a studio.
   *
   * @param slug - The unique slug of the studio to delete.
   * @returns Resolves when the studio has been deleted.
   * @throws {ApiError} If the studio is not found (HTTP 404) or the user lacks
   *   permission (HTTP 403).
   *
   * @example
   * ```typescript
   * await client.studios.remove('old-studio');
   * ```
   */
  async remove(slug: string): Promise<void> {
    await this.delete(`/studios/${slug}`);
  }

  /**
   * Retrieves the list of members for a given studio.
   *
   * @param slug - The unique slug of the studio.
   * @returns An array of member objects.
   * @throws {ApiError} If the studio is not found (HTTP 404) or the request fails.
   *
   * @example
   * ```typescript
   * const members = await client.studios.getMembers('pixel-editors');
   * members.forEach(m => console.log(m.username, m.role));
   * ```
   */
  async getMembers(slug: string): Promise<Record<string, unknown>[]> {
    return this.get(`/studios/${slug}/members`);
  }

  /**
   * Joins a studio as a member.
   *
   * The authenticated user will be added to the studio's member list.
   *
   * @param slug - The unique slug of the studio to join.
   * @returns The membership record or confirmation object.
   * @throws {ApiError} If the studio is not found (HTTP 404), the user is already
   *   a member (HTTP 409), or the user is not authenticated (HTTP 401).
   *
   * @example
   * ```typescript
   * const membership = await client.studios.join('pixel-editors');
   * console.log('Joined studio as', membership.role);
   * ```
   */
  async join(slug: string): Promise<Record<string, unknown>> {
    return this.post(`/studios/${slug}/join`);
  }

  /**
   * Leaves a studio that the authenticated user has previously joined.
   *
   * @param slug - The unique slug of the studio to leave.
   * @returns Resolves when the user has successfully left the studio.
   * @throws {ApiError} If the studio is not found (HTTP 404) or the user is not
   *   a member (HTTP 400).
   *
   * @example
   * ```typescript
   * await client.studios.leave('pixel-editors');
   * ```
   */
  async leave(slug: string): Promise<void> {
    return this.post(`/studios/${slug}/leave`);
  }

  /**
   * Submits a rating and optional review for a studio.
   *
   * @param slug - The unique slug of the studio to rate.
   * @param rating - A numeric rating value (typically 1-5).
   * @param review - An optional text review to accompany the rating.
   * @returns The created rating/review object.
   * @throws {ApiError} If the studio is not found (HTTP 404), the rating value is
   *   invalid (HTTP 400), or the user is not authenticated (HTTP 401).
   *
   * @example
   * ```typescript
   * const result = await client.studios.rate('pixel-editors', 5, 'Amazing studio!');
   * ```
   */
  async rate(slug: string, rating: number, review?: string): Promise<Record<string, unknown>> {
    return this.post(`/studios/${slug}/rate`, { rating, review });
  }

  /**
   * Retrieves pending studio invites for the authenticated user.
   *
   * @returns An array of pending invite objects.
   * @throws {ApiError} If the user is not authenticated (HTTP 401) or the request fails.
   *
   * @example
   * ```typescript
   * const invites = await client.studios.getInvites();
   * invites.forEach(invite => {
   *   console.log(`Invited to: ${invite.studioName}`);
   * });
   * ```
   */
  async getInvites(): Promise<Record<string, unknown>[]> {
    return this.get('/studios/invites');
  }
}
