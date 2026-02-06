import { ClientConfig } from './client';
import { CampaignClient } from './services/campaigns';
import { ClipClient } from './services/clips';
import { UserClient } from './services/users';
import { NotificationClient } from './services/notifications';
import { BalanceClient } from './services/balance';
import { StudioClient } from './services/studios';
import { DisputeClient } from './services/disputes';

/**
 * The main entry-point for the Clipdeck API client library.
 *
 * `ClipdeckClient` aggregates all domain-specific service clients into a single
 * instance, providing a convenient, unified interface for interacting with every
 * Clipdeck API endpoint.
 *
 * Each service client is exposed as a public property:
 *
 * | Property          | Service Client          | Domain                       |
 * | ----------------- | ----------------------- | ---------------------------- |
 * | `campaigns`       | {@link CampaignClient}  | Campaign management          |
 * | `clips`           | {@link ClipClient}      | Clip submission and review   |
 * | `users`           | {@link UserClient}      | User accounts and profiles   |
 * | `notifications`   | {@link NotificationClient} | In-app notifications      |
 * | `balance`         | {@link BalanceClient}   | Balance and payouts          |
 * | `studios`         | {@link StudioClient}    | Studio management            |
 * | `disputes`        | {@link DisputeClient}   | Dispute resolution           |
 *
 * @example
 * ```typescript
 * import { ClipdeckClient } from '@clipdeck/api-client';
 *
 * const client = new ClipdeckClient({
 *   baseURL: 'https://api.clipdeck.io',
 *   getToken: async () => localStorage.getItem('auth_token'),
 * });
 *
 * // Use individual service clients
 * const campaigns = await client.campaigns.list();
 * const me = await client.users.getMe();
 * const unread = await client.notifications.getUnreadCount();
 * ```
 */
export class ClipdeckClient {
  /** Client for campaign management operations. */
  public campaigns: CampaignClient;

  /** Client for clip submission, review, and statistics operations. */
  public clips: ClipClient;

  /** Client for user account and profile operations. */
  public users: UserClient;

  /** Client for in-app notification operations. */
  public notifications: NotificationClient;

  /** Client for balance and payout operations. */
  public balance: BalanceClient;

  /** Client for studio management operations. */
  public studios: StudioClient;

  /** Client for dispute resolution operations. */
  public disputes: DisputeClient;

  /**
   * Creates a new ClipdeckClient instance with all service clients initialized.
   *
   * The provided configuration is shared across all service clients, so each
   * one uses the same base URL, token provider, and timeout settings.
   *
   * @param config - Client configuration options. See {@link ClientConfig}.
   *
   * @example
   * ```typescript
   * const client = new ClipdeckClient({
   *   baseURL: 'https://api.clipdeck.io',
   *   getToken: async () => {
   *     const session = await getSession();
   *     return session?.accessToken ?? null;
   *   },
   *   timeout: 15000,
   * });
   * ```
   */
  constructor(config: ClientConfig) {
    this.campaigns = new CampaignClient(config);
    this.clips = new ClipClient(config);
    this.users = new UserClient(config);
    this.notifications = new NotificationClient(config);
    this.balance = new BalanceClient(config);
    this.studios = new StudioClient(config);
    this.disputes = new DisputeClient(config);
  }
}

export { ApiError } from './errors';
export type { ClientConfig } from './client';
export { BaseClient } from './client';
export { CampaignClient } from './services/campaigns';
export { ClipClient } from './services/clips';
export { UserClient } from './services/users';
export { NotificationClient } from './services/notifications';
export { BalanceClient } from './services/balance';
export { StudioClient } from './services/studios';
export { DisputeClient } from './services/disputes';

// Re-export service types
export type {
  CampaignListFilters,
  CreateCampaignData,
  UpdateCampaignData,
} from './services/campaigns';
export type {
  ClipListFilters,
  SubmitClipData,
} from './services/clips';
export type {
  UpdateUserData,
  UpdateProfileData,
} from './services/users';
export type {
  NotificationListParams,
} from './services/notifications';
export type {
  TransactionListParams,
  RequestPayoutData,
} from './services/balance';
export type {
  StudioListFilters,
  CreateStudioData,
  UpdateStudioData,
} from './services/studios';
export type {
  DisputeListFilters,
  CreateDisputeData,
} from './services/disputes';
