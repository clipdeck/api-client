import axios from 'axios';

export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function handleApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error) && error.response) {
    const data = error.response.data as any;
    return new ApiError(
      data?.error?.code || 'UNKNOWN_ERROR',
      data?.error?.message || error.message || 'Unknown error',
      error.response.status,
      data?.error?.details
    );
  }

  if (axios.isAxiosError(error) && error.request) {
    return new ApiError('NETWORK_ERROR', 'Network error - unable to reach server', 0);
  }

  if (error instanceof Error) {
    return new ApiError('CLIENT_ERROR', error.message, 0);
  }

  return new ApiError('UNKNOWN_ERROR', 'An unknown error occurred', 0);
}
