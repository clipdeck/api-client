import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { createMockAxiosInstance, MockAxiosInstance } from '../setup';

vi.mock('axios', () => ({
  default: {
    create: vi.fn(),
    isAxiosError: vi.fn(),
  },
}));

import { DisputeClient } from '../../src/services/disputes';

describe('DisputeClient', () => {
  let client: DisputeClient;
  let mockAxios: MockAxiosInstance;

  beforeEach(() => {
    vi.clearAllMocks();
    mockAxios = createMockAxiosInstance();
    vi.mocked(axios.create).mockReturnValue(mockAxios as any);
    client = new DisputeClient({ baseURL: 'https://api.test.com' });
  });

  describe('list', () => {
    it('should call GET /disputes with no params', async () => {
      const mockResponse = { data: [], total: 0, page: 1, limit: 10, totalPages: 0 };
      mockAxios.get.mockResolvedValue({ data: mockResponse });

      const result = await client.list();
      expect(mockAxios.get).toHaveBeenCalledWith('/disputes', { params: undefined });
      expect(result).toEqual(mockResponse);
    });

    it('should call GET /disputes with filters', async () => {
      const filters = { status: 'open', page: 1, limit: 10 };
      const mockResponse = { data: [], total: 0, page: 1, limit: 10, totalPages: 0 };
      mockAxios.get.mockResolvedValue({ data: mockResponse });

      const result = await client.list(filters);
      expect(mockAxios.get).toHaveBeenCalledWith('/disputes', { params: filters });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getById', () => {
    it('should call GET /disputes/:id', async () => {
      const mockDispute = { id: 'dispute-1', reason: 'Copyright' };
      mockAxios.get.mockResolvedValue({ data: mockDispute });

      const result = await client.getById('dispute-1');
      expect(mockAxios.get).toHaveBeenCalledWith('/disputes/dispute-1', undefined);
      expect(result).toEqual(mockDispute);
    });
  });

  describe('create', () => {
    it('should call POST /disputes with body', async () => {
      const createData = {
        clipId: 'clip-1',
        reason: 'Copyright infringement',
        description: 'This clip uses my content without permission',
      };
      const mockResponse = { id: 'dispute-2', ...createData };
      mockAxios.post.mockResolvedValue({ data: mockResponse });

      const result = await client.create(createData);
      expect(mockAxios.post).toHaveBeenCalledWith('/disputes', createData, undefined);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getMine', () => {
    it('should call GET /disputes/mine', async () => {
      const mockDisputes = [{ id: 'dispute-1' }, { id: 'dispute-2' }];
      mockAxios.get.mockResolvedValue({ data: mockDisputes });

      const result = await client.getMine();
      expect(mockAxios.get).toHaveBeenCalledWith('/disputes/mine', undefined);
      expect(result).toEqual(mockDisputes);
    });
  });

  describe('resolve', () => {
    it('should call POST /disputes/:id/resolve with { action }', async () => {
      const mockResponse = { id: 'dispute-1', status: 'resolved' };
      mockAxios.post.mockResolvedValue({ data: mockResponse });

      const result = await client.resolve('dispute-1', 'approve');
      expect(mockAxios.post).toHaveBeenCalledWith(
        '/disputes/dispute-1/resolve',
        { action: 'approve', notes: undefined },
        undefined
      );
      expect(result).toEqual(mockResponse);
    });

    it('should call POST /disputes/:id/resolve with { action, notes }', async () => {
      const mockResponse = { id: 'dispute-1', status: 'resolved' };
      mockAxios.post.mockResolvedValue({ data: mockResponse });

      const result = await client.resolve('dispute-1', 'reject', 'Insufficient evidence');
      expect(mockAxios.post).toHaveBeenCalledWith(
        '/disputes/dispute-1/resolve',
        { action: 'reject', notes: 'Insufficient evidence' },
        undefined
      );
      expect(result).toEqual(mockResponse);
    });
  });
});
