import { BaseClient } from '../client';

export interface UpdateUserData {
  displayName?: string;
  email?: string;
  avatarUrl?: string;
}

export interface UpdateProfileData {
  bio?: string;
  socialLinks?: Record<string, string>;
  skills?: string[];
  timezone?: string;
  language?: string;
}

export class UserClient extends BaseClient {
  async getMe(): Promise<Record<string, unknown>> {
    return this.get('/users/me');
  }

  async updateMe(data: UpdateUserData): Promise<Record<string, unknown>> {
    return this.patch('/users/me', data);
  }

  async getProfile(): Promise<Record<string, unknown>> {
    return this.get('/users/me/profile');
  }

  async updateProfile(data: UpdateProfileData): Promise<Record<string, unknown>> {
    return this.patch('/users/me/profile', data);
  }

  async getById(id: string): Promise<Record<string, unknown>> {
    return this.get(`/users/${id}`);
  }

  async getByUsername(username: string): Promise<Record<string, unknown>> {
    return this.get(`/users/username/${username}`);
  }

  async search(query: string, limit?: number): Promise<Record<string, unknown>[]> {
    return this.get('/users/search', { params: { query, limit } });
  }

  async getReferralStats(): Promise<Record<string, unknown>> {
    return this.get('/users/me/referrals');
  }

  async generateReferralCode(): Promise<Record<string, unknown>> {
    return this.post('/users/me/referrals/generate');
  }

  async applyReferral(code: string): Promise<Record<string, unknown>> {
    return this.post('/users/me/referrals/apply', { code });
  }
}
