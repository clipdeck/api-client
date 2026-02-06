import { BaseClient } from '../client';

/**
 * Data for updating the authenticated user's account details.
 *
 * All fields are optional; only provided fields will be updated.
 *
 * @example
 * ```typescript
 * const data: UpdateUserData = {
 *   displayName: 'ProGamer42',
 *   avatarUrl: 'https://cdn.example.com/avatars/me.png',
 * };
 * ```
 */
export interface UpdateUserData {
  /** Updated display name. */
  displayName?: string;

  /** Updated email address. */
  email?: string;

  /** Updated avatar image URL. */
  avatarUrl?: string;
}

/**
 * Data for updating the authenticated user's profile information.
 *
 * All fields are optional; only provided fields will be updated.
 *
 * @example
 * ```typescript
 * const data: UpdateProfileData = {
 *   bio: 'Professional video editor and content creator',
 *   skills: ['video-editing', 'motion-graphics'],
 *   timezone: 'America/New_York',
 * };
 * ```
 */
export interface UpdateProfileData {
  /** A short biography or description. */
  bio?: string;

  /** A map of social platform names to profile URLs (e.g., `{ twitter: 'https://...' }`). */
  socialLinks?: Record<string, string>;

  /** A list of skills or specializations. */
  skills?: string[];

  /** The user's timezone identifier (e.g., `'America/New_York'`). */
  timezone?: string;

  /** The user's preferred language code (e.g., `'en'`, `'es'`). */
  language?: string;
}

/**
 * Service client for user account and profile operations.
 *
 * Provides methods to manage the authenticated user's account, retrieve other
 * users' profiles, search for users, and manage referral codes.
 *
 * @example
 * ```typescript
 * const client = new ClipdeckClient({ baseURL: 'https://api.clipdeck.io' });
 *
 * // Get current user
 * const me = await client.users.getMe();
 *
 * // Search for editors
 * const editors = await client.users.search('gamer', 10);
 * ```
 */
export class UserClient extends BaseClient {
  /**
   * Retrieves the authenticated user's account information.
   *
   * @returns The current user's account object.
   * @throws {ApiError} If the user is not authenticated (HTTP 401) or the request fails.
   *
   * @example
   * ```typescript
   * const me = await client.users.getMe();
   * console.log(me.email, me.displayName);
   * ```
   */
  async getMe(): Promise<Record<string, unknown>> {
    return this.get('/users/me');
  }

  /**
   * Updates the authenticated user's account details.
   *
   * Only the fields provided in `data` will be updated.
   *
   * @param data - An object containing the account fields to update.
   * @returns The updated user account object.
   * @throws {ApiError} If validation fails (HTTP 400) or the user is not authenticated (HTTP 401).
   *
   * @example
   * ```typescript
   * const updated = await client.users.updateMe({
   *   displayName: 'NewDisplayName',
   *   avatarUrl: 'https://cdn.example.com/new-avatar.png',
   * });
   * ```
   */
  async updateMe(data: UpdateUserData): Promise<Record<string, unknown>> {
    return this.patch('/users/me', data);
  }

  /**
   * Retrieves the authenticated user's profile information.
   *
   * The profile contains extended information such as bio, social links,
   * and skills, separate from the core account data.
   *
   * @returns The current user's profile object.
   * @throws {ApiError} If the user is not authenticated (HTTP 401) or the request fails.
   *
   * @example
   * ```typescript
   * const profile = await client.users.getProfile();
   * console.log(profile.bio, profile.skills);
   * ```
   */
  async getProfile(): Promise<Record<string, unknown>> {
    return this.get('/users/me/profile');
  }

  /**
   * Updates the authenticated user's profile information.
   *
   * Only the fields provided in `data` will be updated.
   *
   * @param data - An object containing the profile fields to update.
   * @returns The updated profile object.
   * @throws {ApiError} If validation fails (HTTP 400) or the user is not authenticated (HTTP 401).
   *
   * @example
   * ```typescript
   * const profile = await client.users.updateProfile({
   *   bio: 'Award-winning clip editor',
   *   socialLinks: { twitter: 'https://twitter.com/editor42' },
   *   skills: ['video-editing', 'color-grading'],
   * });
   * ```
   */
  async updateProfile(data: UpdateProfileData): Promise<Record<string, unknown>> {
    return this.patch('/users/me/profile', data);
  }

  /**
   * Retrieves a user by their unique identifier.
   *
   * @param id - The unique user ID.
   * @returns The user object.
   * @throws {ApiError} If the user is not found (HTTP 404) or the request fails.
   *
   * @example
   * ```typescript
   * const user = await client.users.getById('usr_abc123');
   * console.log(user.displayName);
   * ```
   */
  async getById(id: string): Promise<Record<string, unknown>> {
    return this.get(`/users/${id}`);
  }

  /**
   * Retrieves a user by their username.
   *
   * @param username - The unique username to look up.
   * @returns The user object.
   * @throws {ApiError} If the user is not found (HTTP 404) or the request fails.
   *
   * @example
   * ```typescript
   * const user = await client.users.getByUsername('progamer42');
   * console.log(user.displayName, user.id);
   * ```
   */
  async getByUsername(username: string): Promise<Record<string, unknown>> {
    return this.get(`/users/username/${username}`);
  }

  /**
   * Searches for users by a text query.
   *
   * Matches against usernames, display names, and other searchable profile fields.
   *
   * @param query - The search query string.
   * @param limit - Optional maximum number of results to return.
   * @returns An array of user objects matching the search query.
   * @throws {ApiError} If the request fails.
   *
   * @example
   * ```typescript
   * const results = await client.users.search('editor', 10);
   * results.forEach(user => console.log(user.username));
   * ```
   */
  async search(query: string, limit?: number): Promise<Record<string, unknown>[]> {
    return this.get('/users/search', { params: { query, limit } });
  }

  /**
   * Retrieves the authenticated user's referral statistics.
   *
   * Returns information about referral performance, including total referrals,
   * successful conversions, and earned rewards.
   *
   * @returns An object containing referral statistics.
   * @throws {ApiError} If the user is not authenticated (HTTP 401) or the request fails.
   *
   * @example
   * ```typescript
   * const stats = await client.users.getReferralStats();
   * console.log(stats.totalReferrals, stats.earned);
   * ```
   */
  async getReferralStats(): Promise<Record<string, unknown>> {
    return this.get('/users/me/referrals');
  }

  /**
   * Generates a new referral code for the authenticated user.
   *
   * The generated code can be shared with others to earn referral rewards
   * when they sign up and become active.
   *
   * @returns An object containing the newly generated referral code.
   * @throws {ApiError} If the user is not authenticated (HTTP 401) or the request fails.
   *
   * @example
   * ```typescript
   * const result = await client.users.generateReferralCode();
   * console.log('Share this code:', result.code);
   * ```
   */
  async generateReferralCode(): Promise<Record<string, unknown>> {
    return this.post('/users/me/referrals/generate');
  }

  /**
   * Applies a referral code to the authenticated user's account.
   *
   * This links the user to the referrer, enabling reward tracking for both parties.
   *
   * @param code - The referral code to apply.
   * @returns A confirmation object with the referral application result.
   * @throws {ApiError} If the code is invalid (HTTP 400), already used (HTTP 409),
   *   or the user is not authenticated (HTTP 401).
   *
   * @example
   * ```typescript
   * const result = await client.users.applyReferral('REF-ABC123');
   * console.log(result.message); // 'Referral code applied successfully'
   * ```
   */
  async applyReferral(code: string): Promise<Record<string, unknown>> {
    return this.post('/users/me/referrals/apply', { code });
  }
}
