import axios from 'axios';

/**
 * Represents a structured API error returned by the Clipdeck API.
 *
 * All HTTP and network errors thrown by the client are normalized into this
 * class, providing a consistent error-handling interface regardless of the
 * underlying failure mode.
 *
 * @example
 * ```typescript
 * try {
 *   await client.campaigns.getById('non-existent');
 * } catch (error) {
 *   if (error instanceof ApiError) {
 *     console.error(`[${error.code}] ${error.message} (HTTP ${error.status})`);
 *     // => "[NOT_FOUND] Campaign not found (HTTP 404)"
 *     if (error.details) {
 *       console.error('Details:', error.details);
 *     }
 *   }
 * }
 * ```
 */
export class ApiError extends Error {
  /**
   * Creates a new ApiError instance.
   *
   * @param code - A machine-readable error code (e.g., `'NOT_FOUND'`, `'VALIDATION_ERROR'`,
   *   `'UNAUTHORIZED'`, `'NETWORK_ERROR'`).
   * @param message - A human-readable error message describing what went wrong.
   * @param status - The HTTP status code from the server response. `0` indicates a network
   *   or client-side error where no HTTP response was received.
   * @param details - Optional additional error details, such as field-level validation
   *   errors or constraint violations.
   */
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

/**
 * Transforms an unknown error into a standardized {@link ApiError} instance.
 *
 * This function handles three categories of errors:
 *
 * 1. **Server errors** (Axios error with a response) -- extracts the error code,
 *    message, status, and details from the response body.
 * 2. **Network errors** (Axios error with a request but no response) -- creates an
 *    `ApiError` with code `'NETWORK_ERROR'` and status `0`.
 * 3. **Client errors** (any other `Error` or unknown value) -- wraps the error
 *    message in an `ApiError` with code `'CLIENT_ERROR'` or `'UNKNOWN_ERROR'`.
 *
 * @param error - The raw error caught from an Axios request or other source.
 * @returns A normalized {@link ApiError} instance.
 *
 * @example
 * ```typescript
 * try {
 *   await axios.get('/some-endpoint');
 * } catch (error) {
 *   const apiError = handleApiError(error);
 *   console.error(apiError.code, apiError.message);
 * }
 * ```
 */
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
