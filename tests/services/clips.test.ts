import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { createMockAxiosInstance, MockAxiosInstance } from '../setup';

vi.mock('axios', () => ({
  default: {
    create: vi.fn(),
    isAxiosError: vi.fn(),
  },
}));

import { ClipClient } from '../../src/services/clips';

describe('ClipClient', () => {
  let client: ClipClient;
  let mockAxios: MockAxiosInstance;

  beforeEach(() => {
    vi.clearAllMocks();
    mockAxios = createMockAxiosInstance();
    vi.mocked(axios.create).mockReturnValue(mockAxios as any);
    client = new ClipClient({ baseURL: 'https://api.test.com' });
  });

  describe('list', () => {
    it('should call GET /clips with no params', async () => {
      const mockResponse = { data: [], total: 0, page: 1, limit: 10, totalPages: 0 };
      mockAxios.get.mockResolvedValue({ data: mockResponse });

      const result = await client.list();
      expect(mockAxios.get).toHaveBeenCalledWith('/clips', { params: undefined });
      expect(result).toEqual(mockResponse);
    });

    it('should call GET /clips with filters', async () => {
      const filters = { campaignId: 'camp-1', status: 'approved', page: 1, limit: 10 };
      const mockResponse = { data: [], total: 0, page: 1, limit: 10, totalPages: 0 };
      mockAxios.get.mockResolvedValue({ data: mockResponse });

      const result = await client.list(filters);
      expect(mockAxios.get).toHaveBeenCalledWith('/clips', { params: filters });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getById', () => {
    it('should call GET /clips/:id', async () => {
      const mockClip = { id: 'clip-1', title: 'My Clip' };
      mockAxios.get.mockResolvedValue({ data: mockClip });

      const result = await client.getById('clip-1');
      expect(mockAxios.get).toHaveBeenCalledWith('/clips/clip-1', undefined);
      expect(result).toEqual(mockClip);
    });
  });

  describe('submit', () => {
    it('should call POST /clips with body', async () => {
      const submitData = {
        campaignId: 'camp-1',
        title: 'New Clip',
        videoUrl: 'https://example.com/video.mp4',
      };
      const mockResponse = { id: 'clip-2', ...submitData };
      mockAxios.post.mockResolvedValue({ data: mockResponse });

      const result = await client.submit(submitData);
      expect(mockAxios.post).toHaveBeenCalledWith('/clips', submitData, undefined);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('updateStatus', () => {
    it('should call PATCH /clips/:id/status with { status }', async () => {
      const mockResponse = { id: 'clip-1', status: 'approved' };
      mockAxios.patch.mockResolvedValue({ data: mockResponse });

      const result = await client.updateStatus('clip-1', 'approved');
      expect(mockAxios.patch).toHaveBeenCalledWith(
        '/clips/clip-1/status',
        { status: 'approved', reason: undefined },
        undefined
      );
      expect(result).toEqual(mockResponse);
    });

    it('should call PATCH /clips/:id/status with { status, reason }', async () => {
      const mockResponse = { id: 'clip-1', status: 'rejected' };
      mockAxios.patch.mockResolvedValue({ data: mockResponse });

      const result = await client.updateStatus('clip-1', 'rejected', 'Low quality');
      expect(mockAxios.patch).toHaveBeenCalledWith(
        '/clips/clip-1/status',
        { status: 'rejected', reason: 'Low quality' },
        undefined
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getStats', () => {
    it('should call GET /clips/:id/stats', async () => {
      const mockStats = { views: 1000, likes: 50 };
      mockAxios.get.mockResolvedValue({ data: mockStats });

      const result = await client.getStats('clip-1');
      expect(mockAxios.get).toHaveBeenCalledWith('/clips/clip-1/stats', undefined);
      expect(result).toEqual(mockStats);
    });
  });

  describe('getStatsHistory', () => {
    it('should call GET /clips/:id/stats/history', async () => {
      const mockHistory = [{ date: '2024-01-01', views: 100 }];
      mockAxios.get.mockResolvedValue({ data: mockHistory });

      const result = await client.getStatsHistory('clip-1');
      expect(mockAxios.get).toHaveBeenCalledWith('/clips/clip-1/stats/history', undefined);
      expect(result).toEqual(mockHistory);
    });
  });
});
