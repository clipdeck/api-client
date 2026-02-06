import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { createMockAxiosInstance, MockAxiosInstance } from '../setup';

vi.mock('axios', () => ({
  default: {
    create: vi.fn(),
    isAxiosError: vi.fn(),
  },
}));

import { CampaignClient } from '../../src/services/campaigns';

describe('CampaignClient', () => {
  let client: CampaignClient;
  let mockAxios: MockAxiosInstance;

  beforeEach(() => {
    vi.clearAllMocks();
    mockAxios = createMockAxiosInstance();
    vi.mocked(axios.create).mockReturnValue(mockAxios as any);
    client = new CampaignClient({ baseURL: 'https://api.test.com' });
  });

  describe('list', () => {
    it('should call GET /campaigns with no params', async () => {
      const mockResponse = { data: [], total: 0, page: 1, limit: 10, totalPages: 0 };
      mockAxios.get.mockResolvedValue({ data: mockResponse });

      const result = await client.list();
      expect(mockAxios.get).toHaveBeenCalledWith('/campaigns', { params: undefined });
      expect(result).toEqual(mockResponse);
    });

    it('should call GET /campaigns with filters', async () => {
      const filters = { status: 'active', page: 2, limit: 20 };
      const mockResponse = { data: [], total: 0, page: 2, limit: 20, totalPages: 0 };
      mockAxios.get.mockResolvedValue({ data: mockResponse });

      const result = await client.list(filters);
      expect(mockAxios.get).toHaveBeenCalledWith('/campaigns', { params: filters });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getById', () => {
    it('should call GET /campaigns/:id', async () => {
      const mockCampaign = { id: 'camp-1', title: 'Test Campaign' };
      mockAxios.get.mockResolvedValue({ data: mockCampaign });

      const result = await client.getById('camp-1');
      expect(mockAxios.get).toHaveBeenCalledWith('/campaigns/camp-1', undefined);
      expect(result).toEqual(mockCampaign);
    });
  });

  describe('create', () => {
    it('should call POST /campaigns with body', async () => {
      const createData = { title: 'New Campaign', description: 'A great campaign' };
      const mockResponse = { id: 'camp-2', ...createData };
      mockAxios.post.mockResolvedValue({ data: mockResponse });

      const result = await client.create(createData);
      expect(mockAxios.post).toHaveBeenCalledWith('/campaigns', createData, undefined);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('update', () => {
    it('should call PATCH /campaigns/:id with body', async () => {
      const updateData = { title: 'Updated Title' };
      const mockResponse = { id: 'camp-1', title: 'Updated Title' };
      mockAxios.patch.mockResolvedValue({ data: mockResponse });

      const result = await client.update('camp-1', updateData);
      expect(mockAxios.patch).toHaveBeenCalledWith('/campaigns/camp-1', updateData, undefined);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('join', () => {
    it('should call POST /campaigns/:id/join', async () => {
      const mockResponse = { success: true };
      mockAxios.post.mockResolvedValue({ data: mockResponse });

      const result = await client.join('camp-1');
      expect(mockAxios.post).toHaveBeenCalledWith('/campaigns/camp-1/join', undefined, undefined);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('leave', () => {
    it('should call POST /campaigns/:id/leave', async () => {
      mockAxios.post.mockResolvedValue({ data: undefined });

      await client.leave('camp-1');
      expect(mockAxios.post).toHaveBeenCalledWith('/campaigns/camp-1/leave', undefined, undefined);
    });
  });

  describe('getParticipants', () => {
    it('should call GET /campaigns/:id/participants', async () => {
      const mockParticipants = [{ userId: 'user-1' }, { userId: 'user-2' }];
      mockAxios.get.mockResolvedValue({ data: mockParticipants });

      const result = await client.getParticipants('camp-1');
      expect(mockAxios.get).toHaveBeenCalledWith('/campaigns/camp-1/participants', undefined);
      expect(result).toEqual(mockParticipants);
    });
  });

  describe('updateStatus', () => {
    it('should call PATCH /campaigns/:id/status with { status }', async () => {
      const mockResponse = { id: 'camp-1', status: 'active' };
      mockAxios.patch.mockResolvedValue({ data: mockResponse });

      const result = await client.updateStatus('camp-1', 'active');
      expect(mockAxios.patch).toHaveBeenCalledWith(
        '/campaigns/camp-1/status',
        { status: 'active' },
        undefined
      );
      expect(result).toEqual(mockResponse);
    });
  });
});
