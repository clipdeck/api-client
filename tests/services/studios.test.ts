import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { createMockAxiosInstance, MockAxiosInstance } from '../setup';

vi.mock('axios', () => ({
  default: {
    create: vi.fn(),
    isAxiosError: vi.fn(),
  },
}));

import { StudioClient } from '../../src/services/studios';

describe('StudioClient', () => {
  let client: StudioClient;
  let mockAxios: MockAxiosInstance;

  beforeEach(() => {
    vi.clearAllMocks();
    mockAxios = createMockAxiosInstance();
    vi.mocked(axios.create).mockReturnValue(mockAxios as any);
    client = new StudioClient({ baseURL: 'https://api.test.com' });
  });

  describe('list', () => {
    it('should call GET /studios with no params', async () => {
      const mockResponse = { data: [], total: 0, page: 1, limit: 10, totalPages: 0 };
      mockAxios.get.mockResolvedValue({ data: mockResponse });

      const result = await client.list();
      expect(mockAxios.get).toHaveBeenCalledWith('/studios', { params: undefined });
      expect(result).toEqual(mockResponse);
    });

    it('should call GET /studios with filters', async () => {
      const filters = { search: 'gaming', sortBy: 'name', page: 1, limit: 10 };
      const mockResponse = { data: [], total: 0, page: 1, limit: 10, totalPages: 0 };
      mockAxios.get.mockResolvedValue({ data: mockResponse });

      const result = await client.list(filters);
      expect(mockAxios.get).toHaveBeenCalledWith('/studios', { params: filters });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getBySlug', () => {
    it('should call GET /studios/:slug', async () => {
      const mockStudio = { slug: 'my-studio', name: 'My Studio' };
      mockAxios.get.mockResolvedValue({ data: mockStudio });

      const result = await client.getBySlug('my-studio');
      expect(mockAxios.get).toHaveBeenCalledWith('/studios/my-studio', undefined);
      expect(result).toEqual(mockStudio);
    });
  });

  describe('create', () => {
    it('should call POST /studios with body', async () => {
      const createData = { name: 'New Studio', slug: 'new-studio', description: 'A studio' };
      const mockResponse = { id: 'studio-1', ...createData };
      mockAxios.post.mockResolvedValue({ data: mockResponse });

      const result = await client.create(createData);
      expect(mockAxios.post).toHaveBeenCalledWith('/studios', createData, undefined);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('update', () => {
    it('should call PATCH /studios/:slug with body', async () => {
      const updateData = { name: 'Updated Studio' };
      const mockResponse = { slug: 'my-studio', name: 'Updated Studio' };
      mockAxios.patch.mockResolvedValue({ data: mockResponse });

      const result = await client.update('my-studio', updateData);
      expect(mockAxios.patch).toHaveBeenCalledWith('/studios/my-studio', updateData, undefined);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('remove', () => {
    it('should call DELETE /studios/:slug', async () => {
      mockAxios.delete.mockResolvedValue({ data: undefined });

      await client.remove('my-studio');
      expect(mockAxios.delete).toHaveBeenCalledWith('/studios/my-studio', undefined);
    });
  });

  describe('getMembers', () => {
    it('should call GET /studios/:slug/members', async () => {
      const mockMembers = [{ userId: 'user-1', role: 'admin' }];
      mockAxios.get.mockResolvedValue({ data: mockMembers });

      const result = await client.getMembers('my-studio');
      expect(mockAxios.get).toHaveBeenCalledWith('/studios/my-studio/members', undefined);
      expect(result).toEqual(mockMembers);
    });
  });

  describe('join', () => {
    it('should call POST /studios/:slug/join', async () => {
      const mockResponse = { success: true };
      mockAxios.post.mockResolvedValue({ data: mockResponse });

      const result = await client.join('my-studio');
      expect(mockAxios.post).toHaveBeenCalledWith('/studios/my-studio/join', undefined, undefined);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('leave', () => {
    it('should call POST /studios/:slug/leave', async () => {
      mockAxios.post.mockResolvedValue({ data: undefined });

      await client.leave('my-studio');
      expect(mockAxios.post).toHaveBeenCalledWith('/studios/my-studio/leave', undefined, undefined);
    });
  });

  describe('rate', () => {
    it('should call POST /studios/:slug/rate with { rating }', async () => {
      const mockResponse = { success: true };
      mockAxios.post.mockResolvedValue({ data: mockResponse });

      const result = await client.rate('my-studio', 5);
      expect(mockAxios.post).toHaveBeenCalledWith(
        '/studios/my-studio/rate',
        { rating: 5, review: undefined },
        undefined
      );
      expect(result).toEqual(mockResponse);
    });

    it('should call POST /studios/:slug/rate with { rating, review }', async () => {
      const mockResponse = { success: true };
      mockAxios.post.mockResolvedValue({ data: mockResponse });

      const result = await client.rate('my-studio', 5, 'Great studio!');
      expect(mockAxios.post).toHaveBeenCalledWith(
        '/studios/my-studio/rate',
        { rating: 5, review: 'Great studio!' },
        undefined
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getInvites', () => {
    it('should call GET /studios/invites', async () => {
      const mockInvites = [{ studioId: 'studio-1', invitedBy: 'user-1' }];
      mockAxios.get.mockResolvedValue({ data: mockInvites });

      const result = await client.getInvites();
      expect(mockAxios.get).toHaveBeenCalledWith('/studios/invites', undefined);
      expect(result).toEqual(mockInvites);
    });
  });
});
