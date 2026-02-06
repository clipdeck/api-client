import { BaseClient } from '../client';

export interface ClipListFilters {
  campaignId?: string;
  editorId?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface SubmitClipData {
  campaignId: string;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  duration?: number;
  platform?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class ClipClient extends BaseClient {
  async list(filters?: ClipListFilters): Promise<PaginatedResponse<Record<string, unknown>>> {
    return this.get('/clips', { params: filters });
  }

  async getById(id: string): Promise<Record<string, unknown>> {
    return this.get(`/clips/${id}`);
  }

  async submit(data: SubmitClipData): Promise<Record<string, unknown>> {
    return this.post('/clips', data);
  }

  async updateStatus(id: string, status: string, reason?: string): Promise<Record<string, unknown>> {
    return this.patch(`/clips/${id}/status`, { status, reason });
  }

  async getStats(id: string): Promise<Record<string, unknown>> {
    return this.get(`/clips/${id}/stats`);
  }

  async getStatsHistory(id: string): Promise<Record<string, unknown>[]> {
    return this.get(`/clips/${id}/stats/history`);
  }
}
