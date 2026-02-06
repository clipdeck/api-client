import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { handleApiError } from './errors';

/**
 * Configuration options for initializing a Clipdeck API client.
 *
 * @example
 * ```typescript
 * const config: ClientConfig = {
 *   baseURL: 'https://api.clipdeck.io',
 *   getToken: async () => localStorage.getItem('auth_token'),
 *   timeout: 15000,
 * };
 * ```
 */
export interface ClientConfig {
  /** The base URL of the Clipdeck API (e.g., `'https://api.clipdeck.io'`). */
  baseURL: string;

  /**
   * An optional async function that returns the current authentication token.
   * When provided, the token is automatically attached to every request as a
   * `Bearer` token in the `Authorization` header. Return `null` to send an
   * unauthenticated request.
   */
  getToken?: () => Promise<string | null>;

  /**
   * Request timeout in milliseconds.
   * @defaultValue 10000
   */
  timeout?: number;
}

/**
 * Abstract base HTTP client that all service clients extend.
 *
 * Handles Axios instance creation, automatic Bearer-token injection via a
 * request interceptor, and automatic error transformation via a response
 * interceptor (all errors are converted to {@link ApiError} instances).
 *
 * **Not intended for direct use** -- use {@link ClipdeckClient} or one of the
 * specific service clients instead.
 *
 * @example
 * ```typescript
 * // Typically consumed through ClipdeckClient:
 * const client = new ClipdeckClient({
 *   baseURL: 'https://api.clipdeck.io',
 *   getToken: async () => myAuthToken,
 * });
 * ```
 */
export class BaseClient {
  /** @internal The underlying Axios instance used for HTTP requests. */
  protected http: AxiosInstance;

  /**
   * Creates a new BaseClient instance.
   *
   * @param config - Client configuration options including base URL, optional
   *   token provider, and optional timeout.
   *
   * @throws {ApiError} If the initial configuration is invalid or a network
   *   issue occurs during interceptor setup.
   *
   * @example
   * ```typescript
   * const client = new BaseClient({
   *   baseURL: 'https://api.clipdeck.io',
   *   getToken: async () => sessionStorage.getItem('token'),
   *   timeout: 5000,
   * });
   * ```
   */
  constructor(config: ClientConfig) {
    this.http = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 10000,
      headers: { 'Content-Type': 'application/json' },
    });

    // Add auth token interceptor
    if (config.getToken) {
      const getToken = config.getToken;
      this.http.interceptors.request.use(async (reqConfig) => {
        const token = await getToken();
        if (token) {
          reqConfig.headers.Authorization = `Bearer ${token}`;
        }
        return reqConfig;
      });
    }

    // Transform errors
    this.http.interceptors.response.use(
      (response) => response,
      (error) => { throw handleApiError(error); }
    );
  }

  /**
   * Sends an HTTP GET request.
   *
   * @typeParam T - The expected response body type.
   * @param url - The request URL path (relative to `baseURL`).
   * @param config - Optional Axios request configuration (headers, params, etc.).
   * @returns A promise that resolves with the parsed response body of type `T`.
   * @throws {ApiError} If the server returns an error response or a network error occurs.
   *
   * @example
   * ```typescript
   * const campaigns = await this.get<Campaign[]>('/campaigns');
   * ```
   */
  protected async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.http.get<T>(url, config);
    return response.data;
  }

  /**
   * Sends an HTTP POST request.
   *
   * @typeParam T - The expected response body type.
   * @param url - The request URL path (relative to `baseURL`).
   * @param data - Optional request body payload.
   * @param config - Optional Axios request configuration (headers, params, etc.).
   * @returns A promise that resolves with the parsed response body of type `T`.
   * @throws {ApiError} If the server returns an error response or a network error occurs.
   *
   * @example
   * ```typescript
   * const newCampaign = await this.post<Campaign>('/campaigns', { title: 'My Campaign' });
   * ```
   */
  protected async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.http.post<T>(url, data, config);
    return response.data;
  }

  /**
   * Sends an HTTP PUT request.
   *
   * @typeParam T - The expected response body type.
   * @param url - The request URL path (relative to `baseURL`).
   * @param data - Optional request body payload.
   * @param config - Optional Axios request configuration (headers, params, etc.).
   * @returns A promise that resolves with the parsed response body of type `T`.
   * @throws {ApiError} If the server returns an error response or a network error occurs.
   *
   * @example
   * ```typescript
   * const updated = await this.put<Campaign>('/campaigns/123', campaignData);
   * ```
   */
  protected async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.http.put<T>(url, data, config);
    return response.data;
  }

  /**
   * Sends an HTTP PATCH request.
   *
   * @typeParam T - The expected response body type.
   * @param url - The request URL path (relative to `baseURL`).
   * @param data - Optional request body payload.
   * @param config - Optional Axios request configuration (headers, params, etc.).
   * @returns A promise that resolves with the parsed response body of type `T`.
   * @throws {ApiError} If the server returns an error response or a network error occurs.
   *
   * @example
   * ```typescript
   * const patched = await this.patch<Campaign>('/campaigns/123', { title: 'Updated' });
   * ```
   */
  protected async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.http.patch<T>(url, data, config);
    return response.data;
  }

  /**
   * Sends an HTTP DELETE request.
   *
   * @typeParam T - The expected response body type.
   * @param url - The request URL path (relative to `baseURL`).
   * @param config - Optional Axios request configuration (headers, params, etc.).
   * @returns A promise that resolves with the parsed response body of type `T`.
   * @throws {ApiError} If the server returns an error response or a network error occurs.
   *
   * @example
   * ```typescript
   * await this.delete<void>('/campaigns/123');
   * ```
   */
  protected async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.http.delete<T>(url, config);
    return response.data;
  }
}
