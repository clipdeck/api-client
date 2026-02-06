import { ClientConfig } from './client';
import { CampaignClient } from './services/campaigns';
import { ClipClient } from './services/clips';
import { UserClient } from './services/users';
import { NotificationClient } from './services/notifications';
import { BalanceClient } from './services/balance';
import { StudioClient } from './services/studios';
import { DisputeClient } from './services/disputes';

export class ClipdeckClient {
  public campaigns: CampaignClient;
  public clips: ClipClient;
  public users: UserClient;
  public notifications: NotificationClient;
  public balance: BalanceClient;
  public studios: StudioClient;
  public disputes: DisputeClient;

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
