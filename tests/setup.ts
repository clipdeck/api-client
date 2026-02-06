import { vi } from 'vitest';

export function createMockAxiosInstance() {
  const instance = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    interceptors: {
      request: {
        use: vi.fn(),
      },
      response: {
        use: vi.fn(),
      },
    },
  };
  return instance;
}

export type MockAxiosInstance = ReturnType<typeof createMockAxiosInstance>;
