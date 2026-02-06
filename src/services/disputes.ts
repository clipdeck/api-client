import { BaseClient } from '../client';

export interface DisputeListFilters {
  status?: string;
  page?: number;
  limit?: number;
}

export interface CreateDisputeData {
  clipId: string;
  reason: string;
  description: string;
  evidence?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class DisputeClient extends BaseClient {
  async list(filters?: DisputeListFilters): Promise<PaginatedResponse<Record<string, unknown>>> {
    return this.get('/disputes', { params: filters });
  }

  async getById(id: string): Promise<Record<string, unknown>> {
    return this.get(`/disputes/${id}`);
  }

  async create(data: CreateDisputeData): Promise<Record<string, unknown>> {
    return this.post('/disputes', data);
  }

  async getMine(): Promise<Record<string, unknown>[]> {
    return this.get('/disputes/mine');
  }

  async resolve(id: string, action: string, notes?: string): Promise<Record<string, unknown>> {
    return this.post(`/disputes/${id}/resolve`, { action, notes });
  }
}
