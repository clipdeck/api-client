import { BaseClient } from '../client';

export interface StudioListFilters {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
}

export interface CreateStudioData {
  name: string;
  slug: string;
  description?: string;
  avatarUrl?: string;
  website?: string;
  socialLinks?: Record<string, string>;
}

export interface UpdateStudioData {
  name?: string;
  description?: string;
  avatarUrl?: string;
  website?: string;
  socialLinks?: Record<string, string>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class StudioClient extends BaseClient {
  async list(filters?: StudioListFilters): Promise<PaginatedResponse<Record<string, unknown>>> {
    return this.get('/studios', { params: filters });
  }

  async getBySlug(slug: string): Promise<Record<string, unknown>> {
    return this.get(`/studios/${slug}`);
  }

  async create(data: CreateStudioData): Promise<Record<string, unknown>> {
    return this.post('/studios', data);
  }

  async update(slug: string, data: UpdateStudioData): Promise<Record<string, unknown>> {
    return this.patch(`/studios/${slug}`, data);
  }

  async remove(slug: string): Promise<void> {
    await this.delete(`/studios/${slug}`);
  }

  async getMembers(slug: string): Promise<Record<string, unknown>[]> {
    return this.get(`/studios/${slug}/members`);
  }

  async join(slug: string): Promise<Record<string, unknown>> {
    return this.post(`/studios/${slug}/join`);
  }

  async leave(slug: string): Promise<void> {
    return this.post(`/studios/${slug}/leave`);
  }

  async rate(slug: string, rating: number, review?: string): Promise<Record<string, unknown>> {
    return this.post(`/studios/${slug}/rate`, { rating, review });
  }

  async getInvites(): Promise<Record<string, unknown>[]> {
    return this.get('/studios/invites');
  }
}
