import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { createMockAxiosInstance, MockAxiosInstance } from '../setup';

vi.mock('axios', () => ({
  default: {
    create: vi.fn(),
    isAxiosError: vi.fn(),
  },
}));

import { NotificationClient } from '../../src/services/notifications';

describe('NotificationClient', () => {
  let client: NotificationClient;
  let mockAxios: MockAxiosInstance;

  beforeEach(() => {
    vi.clearAllMocks();
    mockAxios = createMockAxiosInstance();
    vi.mocked(axios.create).mockReturnValue(mockAxios as any);
    client = new NotificationClient({ baseURL: 'https://api.test.com' });
  });

  describe('list', () => {
    it('should call GET /notifications with no params', async () => {
      const mockResponse = { data: [], total: 0, page: 1, limit: 10, totalPages: 0 };
      mockAxios.get.mockResolvedValue({ data: mockResponse });

      const result = await client.list();
      expect(mockAxios.get).toHaveBeenCalledWith('/notifications', { params: undefined });
      expect(result).toEqual(mockResponse);
    });

    it('should call GET /notifications with params', async () => {
      const params = { unreadOnly: true, page: 1, limit: 20 };
      const mockResponse = { data: [], total: 0, page: 1, limit: 20, totalPages: 0 };
      mockAxios.get.mockResolvedValue({ data: mockResponse });

      const result = await client.list(params);
      expect(mockAxios.get).toHaveBeenCalledWith('/notifications', { params });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getUnreadCount', () => {
    it('should call GET /notifications/unread/count', async () => {
      const mockResponse = { count: 5 };
      mockAxios.get.mockResolvedValue({ data: mockResponse });

      const result = await client.getUnreadCount();
      expect(mockAxios.get).toHaveBeenCalledWith('/notifications/unread/count', undefined);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('markAsRead', () => {
    it('should call PATCH /notifications/:id/read when id is provided', async () => {
      mockAxios.patch.mockResolvedValue({ data: undefined });

      await client.markAsRead('notif-1');
      expect(mockAxios.patch).toHaveBeenCalledWith(
        '/notifications/notif-1/read',
        undefined,
        undefined
      );
    });

    it('should call PATCH /notifications/read when no id is provided', async () => {
      mockAxios.patch.mockResolvedValue({ data: undefined });

      await client.markAsRead();
      expect(mockAxios.patch).toHaveBeenCalledWith('/notifications/read', undefined, undefined);
    });
  });

  describe('markAllAsRead', () => {
    it('should call PATCH /notifications/read-all', async () => {
      mockAxios.patch.mockResolvedValue({ data: undefined });

      await client.markAllAsRead();
      expect(mockAxios.patch).toHaveBeenCalledWith(
        '/notifications/read-all',
        undefined,
        undefined
      );
    });
  });

  describe('remove', () => {
    it('should call DELETE /notifications/:id', async () => {
      mockAxios.delete.mockResolvedValue({ data: undefined });

      await client.remove('notif-1');
      expect(mockAxios.delete).toHaveBeenCalledWith('/notifications/notif-1', undefined);
    });
  });
});
