import { BaseClient } from '../client';

/**
 * Parameters for listing notifications with pagination and filtering.
 *
 * @example
 * ```typescript
 * const params: NotificationListParams = { unreadOnly: true, page: 1, limit: 20 };
 * ```
 */
export interface NotificationListParams {
  /** The page number for pagination (1-indexed). */
  page?: number;

  /** The maximum number of notifications to return per page. */
  limit?: number;

  /** When `true`, only unread notifications are returned. */
  unreadOnly?: boolean;

  /** Filter notifications by type (e.g., `'campaign_invite'`, `'clip_approved'`). */
  type?: string;
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
 * Service client for in-app notification operations.
 *
 * Provides methods to list, count, read, and delete notifications for the
 * authenticated user.
 *
 * @example
 * ```typescript
 * const client = new ClipdeckClient({ baseURL: 'https://api.clipdeck.io' });
 *
 * // Check unread count
 * const { count } = await client.notifications.getUnreadCount();
 * console.log(`You have ${count} unread notifications`);
 *
 * // List recent notifications
 * const { data: notifications } = await client.notifications.list({ limit: 5 });
 * ```
 */
export class NotificationClient extends BaseClient {
  /**
   * Lists notifications for the authenticated user with optional filtering and pagination.
   *
   * @param params - Optional parameters to filter by type, read status, and control pagination.
   * @returns A paginated response containing an array of notification objects.
   * @throws {ApiError} If the user is not authenticated (HTTP 401) or the request fails.
   *
   * @example
   * ```typescript
   * // List unread notifications
   * const result = await client.notifications.list({ unreadOnly: true, limit: 10 });
   * console.log(result.data); // Notification[]
   * ```
   */
  async list(params?: NotificationListParams): Promise<PaginatedResponse<Record<string, unknown>>> {
    return this.get('/notifications', { params });
  }

  /**
   * Retrieves the count of unread notifications for the authenticated user.
   *
   * @returns An object containing the `count` of unread notifications.
   * @throws {ApiError} If the user is not authenticated (HTTP 401) or the request fails.
   *
   * @example
   * ```typescript
   * const { count } = await client.notifications.getUnreadCount();
   * if (count > 0) {
   *   console.log(`${count} new notifications`);
   * }
   * ```
   */
  async getUnreadCount(): Promise<{ count: number }> {
    return this.get('/notifications/unread/count');
  }

  /**
   * Marks one or more notifications as read.
   *
   * When called with an `id`, marks that specific notification as read.
   * When called without an `id`, marks all notifications as read.
   *
   * @param id - Optional notification ID. If omitted, all notifications are marked as read.
   * @returns Resolves when the notification(s) have been marked as read.
   * @throws {ApiError} If the notification is not found (HTTP 404) or the user is
   *   not authenticated (HTTP 401).
   *
   * @example
   * ```typescript
   * // Mark a specific notification as read
   * await client.notifications.markAsRead('notif_abc123');
   *
   * // Mark all notifications as read
   * await client.notifications.markAsRead();
   * ```
   */
  async markAsRead(id?: string): Promise<void> {
    if (id) {
      return this.patch(`/notifications/${id}/read`);
    }
    return this.patch('/notifications/read');
  }

  /**
   * Marks all notifications as read for the authenticated user.
   *
   * This is a convenience method that explicitly marks every notification
   * as read, regardless of type or age.
   *
   * @returns Resolves when all notifications have been marked as read.
   * @throws {ApiError} If the user is not authenticated (HTTP 401) or the request fails.
   *
   * @example
   * ```typescript
   * await client.notifications.markAllAsRead();
   * ```
   */
  async markAllAsRead(): Promise<void> {
    return this.patch('/notifications/read-all');
  }

  /**
   * Deletes a notification by its unique identifier.
   *
   * @param id - The unique notification ID to delete.
   * @returns Resolves when the notification has been deleted.
   * @throws {ApiError} If the notification is not found (HTTP 404) or the user is
   *   not authenticated (HTTP 401).
   *
   * @example
   * ```typescript
   * await client.notifications.remove('notif_abc123');
   * ```
   */
  async remove(id: string): Promise<void> {
    await this.delete(`/notifications/${id}`);
  }
}
