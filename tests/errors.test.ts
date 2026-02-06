import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { ApiError, handleApiError } from '../src/errors';

vi.mock('axios', async (importOriginal) => {
  const actual = await importOriginal<typeof import('axios')>();
  return {
    ...actual,
    default: {
      ...actual.default,
      isAxiosError: actual.default.isAxiosError,
    },
  };
});

describe('ApiError', () => {
  it('should set code, message, status, and details', () => {
    const error = new ApiError('NOT_FOUND', 'Resource not found', 404, { id: '123' });
    expect(error.code).toBe('NOT_FOUND');
    expect(error.message).toBe('Resource not found');
    expect(error.status).toBe(404);
    expect(error.details).toEqual({ id: '123' });
  });

  it('should set name to ApiError', () => {
    const error = new ApiError('TEST', 'test', 500);
    expect(error.name).toBe('ApiError');
  });

  it('should be an instance of Error', () => {
    const error = new ApiError('TEST', 'test', 500);
    expect(error).toBeInstanceOf(Error);
  });

  it('should handle undefined details', () => {
    const error = new ApiError('TEST', 'test', 400);
    expect(error.details).toBeUndefined();
  });
});

describe('handleApiError', () => {
  it('should extract error info from axios response error', () => {
    const axiosError = {
      isAxiosError: true,
      response: {
        status: 404,
        data: {
          error: {
            code: 'NOT_FOUND',
            message: 'Campaign not found',
            details: { campaignId: 'abc' },
          },
        },
      },
      message: 'Request failed with status code 404',
      request: {},
    };

    // Make axios.isAxiosError return true for this
    vi.spyOn(axios, 'isAxiosError').mockImplementation(
      (err: any) => err?.isAxiosError === true
    );

    const result = handleApiError(axiosError);
    expect(result).toBeInstanceOf(ApiError);
    expect(result.code).toBe('NOT_FOUND');
    expect(result.message).toBe('Campaign not found');
    expect(result.status).toBe(404);
    expect(result.details).toEqual({ campaignId: 'abc' });
  });

  it('should use fallback values when response data.error fields are missing', () => {
    vi.spyOn(axios, 'isAxiosError').mockImplementation(
      (err: any) => err?.isAxiosError === true
    );

    const axiosError = {
      isAxiosError: true,
      response: {
        status: 500,
        data: {},
      },
      message: 'Request failed',
      request: {},
    };

    const result = handleApiError(axiosError);
    expect(result.code).toBe('UNKNOWN_ERROR');
    expect(result.message).toBe('Request failed');
    expect(result.status).toBe(500);
    expect(result.details).toBeUndefined();
  });

  it('should return NETWORK_ERROR for axios errors with request but no response', () => {
    vi.spyOn(axios, 'isAxiosError').mockImplementation(
      (err: any) => err?.isAxiosError === true
    );

    const axiosError = {
      isAxiosError: true,
      request: {},
      message: 'Network Error',
    };

    const result = handleApiError(axiosError);
    expect(result).toBeInstanceOf(ApiError);
    expect(result.code).toBe('NETWORK_ERROR');
    expect(result.message).toBe('Network error - unable to reach server');
    expect(result.status).toBe(0);
  });

  it('should return CLIENT_ERROR for generic Error instances', () => {
    vi.spyOn(axios, 'isAxiosError').mockReturnValue(false);

    const error = new Error('Something went wrong');
    const result = handleApiError(error);
    expect(result).toBeInstanceOf(ApiError);
    expect(result.code).toBe('CLIENT_ERROR');
    expect(result.message).toBe('Something went wrong');
    expect(result.status).toBe(0);
  });

  it('should return UNKNOWN_ERROR for unknown error types', () => {
    vi.spyOn(axios, 'isAxiosError').mockReturnValue(false);

    const result = handleApiError('string error');
    expect(result).toBeInstanceOf(ApiError);
    expect(result.code).toBe('UNKNOWN_ERROR');
    expect(result.message).toBe('An unknown error occurred');
    expect(result.status).toBe(0);
  });

  it('should return UNKNOWN_ERROR for null', () => {
    vi.spyOn(axios, 'isAxiosError').mockReturnValue(false);

    const result = handleApiError(null);
    expect(result).toBeInstanceOf(ApiError);
    expect(result.code).toBe('UNKNOWN_ERROR');
    expect(result.message).toBe('An unknown error occurred');
    expect(result.status).toBe(0);
  });
});
