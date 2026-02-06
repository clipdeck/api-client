import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { createMockAxiosInstance, MockAxiosInstance } from '../setup';

vi.mock('axios', () => ({
  default: {
    create: vi.fn(),
    isAxiosError: vi.fn(),
  },
}));

import { UserClient } from '../../src/services/users';

describe('UserClient', () => {
  let client: UserClient;
  let mockAxios: MockAxiosInstance;

  beforeEach(() => {
    vi.clearAllMocks();
    mockAxios = createMockAxiosInstance();
    vi.mocked(axios.create).mockReturnValue(mockAxios as any);
    client = new UserClient({ baseURL: 'https://api.test.com' });
  });

  describe('getMe', () => {
    it('should call GET /users/me', async () => {
      const mockUser = { id: 'user-1', displayName: 'TestUser' };
      mockAxios.get.mockResolvedValue({ data: mockUser });

      const result = await client.getMe();
      expect(mockAxios.get).toHaveBeenCalledWith('/users/me', undefined);
      expect(result).toEqual(mockUser);
    });
  });

  describe('updateMe', () => {
    it('should call PATCH /users/me with body', async () => {
      const updateData = { displayName: 'NewName' };
      const mockResponse = { id: 'user-1', displayName: 'NewName' };
      mockAxios.patch.mockResolvedValue({ data: mockResponse });

      const result = await client.updateMe(updateData);
      expect(mockAxios.patch).toHaveBeenCalledWith('/users/me', updateData, undefined);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getProfile', () => {
    it('should call GET /users/me/profile', async () => {
      const mockProfile = { bio: 'Hello world', skills: ['editing'] };
      mockAxios.get.mockResolvedValue({ data: mockProfile });

      const result = await client.getProfile();
      expect(mockAxios.get).toHaveBeenCalledWith('/users/me/profile', undefined);
      expect(result).toEqual(mockProfile);
    });
  });

  describe('updateProfile', () => {
    it('should call PATCH /users/me/profile with body', async () => {
      const profileData = { bio: 'Updated bio', timezone: 'UTC' };
      const mockResponse = { ...profileData };
      mockAxios.patch.mockResolvedValue({ data: mockResponse });

      const result = await client.updateProfile(profileData);
      expect(mockAxios.patch).toHaveBeenCalledWith('/users/me/profile', profileData, undefined);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getById', () => {
    it('should call GET /users/:id', async () => {
      const mockUser = { id: 'user-42', displayName: 'SomeUser' };
      mockAxios.get.mockResolvedValue({ data: mockUser });

      const result = await client.getById('user-42');
      expect(mockAxios.get).toHaveBeenCalledWith('/users/user-42', undefined);
      expect(result).toEqual(mockUser);
    });
  });

  describe('getByUsername', () => {
    it('should call GET /users/username/:username', async () => {
      const mockUser = { id: 'user-1', username: 'johndoe' };
      mockAxios.get.mockResolvedValue({ data: mockUser });

      const result = await client.getByUsername('johndoe');
      expect(mockAxios.get).toHaveBeenCalledWith('/users/username/johndoe', undefined);
      expect(result).toEqual(mockUser);
    });
  });

  describe('search', () => {
    it('should call GET /users/search with params { query }', async () => {
      const mockResults = [{ id: 'user-1', displayName: 'John' }];
      mockAxios.get.mockResolvedValue({ data: mockResults });

      const result = await client.search('john');
      expect(mockAxios.get).toHaveBeenCalledWith('/users/search', {
        params: { query: 'john', limit: undefined },
      });
      expect(result).toEqual(mockResults);
    });

    it('should call GET /users/search with params { query, limit }', async () => {
      const mockResults = [{ id: 'user-1', displayName: 'John' }];
      mockAxios.get.mockResolvedValue({ data: mockResults });

      const result = await client.search('john', 5);
      expect(mockAxios.get).toHaveBeenCalledWith('/users/search', {
        params: { query: 'john', limit: 5 },
      });
      expect(result).toEqual(mockResults);
    });
  });

  describe('getReferralStats', () => {
    it('should call GET /users/me/referrals', async () => {
      const mockStats = { totalReferrals: 10, earnings: 50 };
      mockAxios.get.mockResolvedValue({ data: mockStats });

      const result = await client.getReferralStats();
      expect(mockAxios.get).toHaveBeenCalledWith('/users/me/referrals', undefined);
      expect(result).toEqual(mockStats);
    });
  });

  describe('generateReferralCode', () => {
    it('should call POST /users/me/referrals/generate', async () => {
      const mockResponse = { code: 'REF-ABC123' };
      mockAxios.post.mockResolvedValue({ data: mockResponse });

      const result = await client.generateReferralCode();
      expect(mockAxios.post).toHaveBeenCalledWith(
        '/users/me/referrals/generate',
        undefined,
        undefined
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('applyReferral', () => {
    it('should call POST /users/me/referrals/apply with { code }', async () => {
      const mockResponse = { success: true };
      mockAxios.post.mockResolvedValue({ data: mockResponse });

      const result = await client.applyReferral('REF-ABC123');
      expect(mockAxios.post).toHaveBeenCalledWith(
        '/users/me/referrals/apply',
        { code: 'REF-ABC123' },
        undefined
      );
      expect(result).toEqual(mockResponse);
    });
  });
});
