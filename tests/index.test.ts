import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { createMockAxiosInstance } from './setup';

vi.mock('axios', () => ({
  default: {
    create: vi.fn(),
    isAxiosError: vi.fn(),
  },
}));

import { ClipdeckClient } from '../src/index';
import { CampaignClient } from '../src/services/campaigns';
import { ClipClient } from '../src/services/clips';
import { UserClient } from '../src/services/users';
import { NotificationClient } from '../src/services/notifications';
import { BalanceClient } from '../src/services/balance';
import { StudioClient } from '../src/services/studios';
import { DisputeClient } from '../src/services/disputes';

describe('ClipdeckClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    const mockAxios = createMockAxiosInstance();
    vi.mocked(axios.create).mockReturnValue(mockAxios as any);
  });

  it('should create all 7 service client instances', () => {
    const client = new ClipdeckClient({ baseURL: 'https://api.clipdeck.com' });

    expect(client.campaigns).toBeDefined();
    expect(client.clips).toBeDefined();
    expect(client.users).toBeDefined();
    expect(client.notifications).toBeDefined();
    expect(client.balance).toBeDefined();
    expect(client.studios).toBeDefined();
    expect(client.disputes).toBeDefined();
  });

  it('should create CampaignClient instance', () => {
    const client = new ClipdeckClient({ baseURL: 'https://api.clipdeck.com' });
    expect(client.campaigns).toBeInstanceOf(CampaignClient);
  });

  it('should create ClipClient instance', () => {
    const client = new ClipdeckClient({ baseURL: 'https://api.clipdeck.com' });
    expect(client.clips).toBeInstanceOf(ClipClient);
  });

  it('should create UserClient instance', () => {
    const client = new ClipdeckClient({ baseURL: 'https://api.clipdeck.com' });
    expect(client.users).toBeInstanceOf(UserClient);
  });

  it('should create NotificationClient instance', () => {
    const client = new ClipdeckClient({ baseURL: 'https://api.clipdeck.com' });
    expect(client.notifications).toBeInstanceOf(NotificationClient);
  });

  it('should create BalanceClient instance', () => {
    const client = new ClipdeckClient({ baseURL: 'https://api.clipdeck.com' });
    expect(client.balance).toBeInstanceOf(BalanceClient);
  });

  it('should create StudioClient instance', () => {
    const client = new ClipdeckClient({ baseURL: 'https://api.clipdeck.com' });
    expect(client.studios).toBeInstanceOf(StudioClient);
  });

  it('should create DisputeClient instance', () => {
    const client = new ClipdeckClient({ baseURL: 'https://api.clipdeck.com' });
    expect(client.disputes).toBeInstanceOf(DisputeClient);
  });

  it('should pass config to all service clients', () => {
    // axios.create is called 7 times (once per service client)
    const config = { baseURL: 'https://api.clipdeck.com', timeout: 5000 };
    new ClipdeckClient(config);

    expect(axios.create).toHaveBeenCalledTimes(7);
    for (const call of vi.mocked(axios.create).mock.calls) {
      expect(call[0]).toEqual(
        expect.objectContaining({
          baseURL: 'https://api.clipdeck.com',
          timeout: 5000,
        })
      );
    }
  });
});
