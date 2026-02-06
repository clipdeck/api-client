import { BaseClient } from '../client';

export interface NotificationListParams {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
  type?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class NotificationClient extends BaseClient {
  async list(params?: NotificationListParams): Promise<PaginatedResponse<Record<string, unknown>>> {
    return this.get('/notifications', { params });
  }

  async getUnreadCount(): Promise<{ count: number }> {
    return this.get('/notifications/unread/count');
  }

  async markAsRead(id?: string): Promise<void> {
    if (id) {
      return this.patch(`/notifications/${id}/read`);
    }
    return this.patch('/notifications/read');
  }

  async markAllAsRead(): Promise<void> {
    return this.patch('/notifications/read-all');
  }

  async remove(id: string): Promise<void> {
    await this.delete(`/notifications/${id}`);
  }
}
