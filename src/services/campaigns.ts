import { BaseClient } from '../client';

export interface CampaignListFilters {
  status?: string;
  page?: number;
  limit?: number;
}

export interface CreateCampaignData {
  title: string;
  description: string;
  gameId?: string;
  budget?: number;
  maxParticipants?: number;
  startDate?: string;
  endDate?: string;
  requirements?: string;
  tags?: string[];
}

export interface UpdateCampaignData {
  title?: string;
  description?: string;
  budget?: number;
  maxParticipants?: number;
  startDate?: string;
  endDate?: string;
  requirements?: string;
  tags?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class CampaignClient extends BaseClient {
  async list(filters?: CampaignListFilters): Promise<PaginatedResponse<Record<string, unknown>>> {
    return this.get('/campaigns', { params: filters });
  }

  async getById(id: string): Promise<Record<string, unknown>> {
    return this.get(`/campaigns/${id}`);
  }

  async create(data: CreateCampaignData): Promise<Record<string, unknown>> {
    return this.post('/campaigns', data);
  }

  async update(id: string, data: UpdateCampaignData): Promise<Record<string, unknown>> {
    return this.patch(`/campaigns/${id}`, data);
  }

  async join(id: string): Promise<Record<string, unknown>> {
    return this.post(`/campaigns/${id}/join`);
  }

  async leave(id: string): Promise<void> {
    return this.post(`/campaigns/${id}/leave`);
  }

  async getParticipants(id: string): Promise<Record<string, unknown>[]> {
    return this.get(`/campaigns/${id}/participants`);
  }

  async updateStatus(id: string, status: string): Promise<Record<string, unknown>> {
    return this.patch(`/campaigns/${id}/status`, { status });
  }
}
