import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { createMockAxiosInstance, MockAxiosInstance } from './setup';

vi.mock('axios', () => {
  return {
    default: {
      create: vi.fn(),
      isAxiosError: vi.fn(),
    },
  };
});

// We need to import BaseClient after mocking axios
import { BaseClient } from '../src/client';

describe('BaseClient', () => {
  let mockAxios: MockAxiosInstance;

  beforeEach(() => {
    vi.clearAllMocks();
    mockAxios = createMockAxiosInstance();
    vi.mocked(axios.create).mockReturnValue(mockAxios as any);
  });

  describe('constructor', () => {
    it('should create axios instance with correct baseURL', () => {
      new BaseClient({ baseURL: 'https://api.clipdeck.com' });

      expect(axios.create).toHaveBeenCalledWith({
        baseURL: 'https://api.clipdeck.com',
        timeout: 10000,
        headers: { 'Content-Type': 'application/json' },
      });
    });

    it('should use default timeout of 10000', () => {
      new BaseClient({ baseURL: 'https://api.test.com' });

      expect(axios.create).toHaveBeenCalledWith(
        expect.objectContaining({ timeout: 10000 })
      );
    });

    it('should respect custom timeout', () => {
      new BaseClient({ baseURL: 'https://api.test.com', timeout: 30000 });

      expect(axios.create).toHaveBeenCalledWith(
        expect.objectContaining({ timeout: 30000 })
      );
    });

    it('should set Content-Type header to application/json', () => {
      new BaseClient({ baseURL: 'https://api.test.com' });

      expect(axios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: { 'Content-Type': 'application/json' },
        })
      );
    });
  });

  describe('auth interceptor', () => {
    it('should add auth interceptor when getToken is provided', () => {
      const getToken = vi.fn().mockResolvedValue('my-token');
      new BaseClient({ baseURL: 'https://api.test.com', getToken });

      expect(mockAxios.interceptors.request.use).toHaveBeenCalledTimes(1);
    });

    it('should add Bearer token to request headers', async () => {
      const getToken = vi.fn().mockResolvedValue('my-token');
      new BaseClient({ baseURL: 'https://api.test.com', getToken });

      // Get the interceptor callback
      const interceptorFn = mockAxios.interceptors.request.use.mock.calls[0][0];
      const reqConfig = { headers: {} as any };
      const result = await interceptorFn(reqConfig);

      expect(result.headers.Authorization).toBe('Bearer my-token');
    });

    it('should skip Authorization header when getToken returns null', async () => {
      const getToken = vi.fn().mockResolvedValue(null);
      new BaseClient({ baseURL: 'https://api.test.com', getToken });

      const interceptorFn = mockAxios.interceptors.request.use.mock.calls[0][0];
      const reqConfig = { headers: {} as any };
      const result = await interceptorFn(reqConfig);

      expect(result.headers.Authorization).toBeUndefined();
    });

    it('should not add auth interceptor when getToken is not provided', () => {
      new BaseClient({ baseURL: 'https://api.test.com' });

      expect(mockAxios.interceptors.request.use).not.toHaveBeenCalled();
    });
  });

  describe('response error interceptor', () => {
    it('should register a response interceptor', () => {
      new BaseClient({ baseURL: 'https://api.test.com' });

      expect(mockAxios.interceptors.response.use).toHaveBeenCalledTimes(1);
    });

    it('should pass through successful responses', () => {
      new BaseClient({ baseURL: 'https://api.test.com' });

      const [successHandler] = mockAxios.interceptors.response.use.mock.calls[0];
      const response = { data: { test: true }, status: 200 };
      expect(successHandler(response)).toBe(response);
    });

    it('should transform errors via handleApiError', () => {
      new BaseClient({ baseURL: 'https://api.test.com' });

      const [, errorHandler] = mockAxios.interceptors.response.use.mock.calls[0];

      // Mock isAxiosError for the error handler
      vi.mocked(axios.isAxiosError).mockReturnValue(false);

      const error = new Error('test error');
      expect(() => errorHandler(error)).toThrow();

      try {
        errorHandler(error);
      } catch (e: any) {
        expect(e.code).toBe('CLIENT_ERROR');
        expect(e.name).toBe('ApiError');
      }
    });
  });

  describe('HTTP methods', () => {
    // Create a test subclass to expose protected methods
    class TestClient extends BaseClient {
      public testGet<T>(url: string, config?: any) {
        return this.get<T>(url, config);
      }
      public testPost<T>(url: string, data?: unknown, config?: any) {
        return this.post<T>(url, data, config);
      }
      public testPut<T>(url: string, data?: unknown, config?: any) {
        return this.put<T>(url, data, config);
      }
      public testPatch<T>(url: string, data?: unknown, config?: any) {
        return this.patch<T>(url, data, config);
      }
      public testDelete<T>(url: string, config?: any) {
        return this.delete<T>(url, config);
      }
    }

    let client: TestClient;

    beforeEach(() => {
      client = new TestClient({ baseURL: 'https://api.test.com' });
    });

    it('get() calls axios.get and returns response.data', async () => {
      const mockData = { id: '1', name: 'Test' };
      mockAxios.get.mockResolvedValue({ data: mockData });

      const result = await client.testGet('/test');
      expect(mockAxios.get).toHaveBeenCalledWith('/test', undefined);
      expect(result).toEqual(mockData);
    });

    it('get() passes config to axios.get', async () => {
      mockAxios.get.mockResolvedValue({ data: [] });

      await client.testGet('/test', { params: { page: 1 } });
      expect(mockAxios.get).toHaveBeenCalledWith('/test', { params: { page: 1 } });
    });

    it('post() calls axios.post and returns response.data', async () => {
      const mockData = { id: '1' };
      mockAxios.post.mockResolvedValue({ data: mockData });

      const body = { name: 'Test' };
      const result = await client.testPost('/test', body);
      expect(mockAxios.post).toHaveBeenCalledWith('/test', body, undefined);
      expect(result).toEqual(mockData);
    });

    it('put() calls axios.put and returns response.data', async () => {
      const mockData = { id: '1', updated: true };
      mockAxios.put.mockResolvedValue({ data: mockData });

      const body = { name: 'Updated' };
      const result = await client.testPut('/test', body);
      expect(mockAxios.put).toHaveBeenCalledWith('/test', body, undefined);
      expect(result).toEqual(mockData);
    });

    it('patch() calls axios.patch and returns response.data', async () => {
      const mockData = { id: '1', patched: true };
      mockAxios.patch.mockResolvedValue({ data: mockData });

      const body = { name: 'Patched' };
      const result = await client.testPatch('/test', body);
      expect(mockAxios.patch).toHaveBeenCalledWith('/test', body, undefined);
      expect(result).toEqual(mockData);
    });

    it('delete() calls axios.delete and returns response.data', async () => {
      const mockData = { deleted: true };
      mockAxios.delete.mockResolvedValue({ data: mockData });

      const result = await client.testDelete('/test');
      expect(mockAxios.delete).toHaveBeenCalledWith('/test', undefined);
      expect(result).toEqual(mockData);
    });
  });
});
