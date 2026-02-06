import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { handleApiError } from './errors';

export interface ClientConfig {
  baseURL: string;
  getToken?: () => Promise<string | null>;
  timeout?: number;
}

export class BaseClient {
  protected http: AxiosInstance;

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

  protected async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.http.get<T>(url, config);
    return response.data;
  }

  protected async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.http.post<T>(url, data, config);
    return response.data;
  }

  protected async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.http.put<T>(url, data, config);
    return response.data;
  }

  protected async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.http.patch<T>(url, data, config);
    return response.data;
  }

  protected async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.http.delete<T>(url, config);
    return response.data;
  }
}
