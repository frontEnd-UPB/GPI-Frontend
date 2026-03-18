import {
  ApiError,
  type HttpRequestOptions,
  type QueryParams,
  apiClient as canonicalApiClient,
} from "./httpClient";

type LegacyGetParams = Record<string, string | string[]>;

/**
 * @deprecated Use apiClient from core/services/httpClient directly.
 */
export { ApiError };

/**
 * @deprecated Use apiClient from core/services/httpClient directly.
 */
export const apiClient = {
  get<T>(path: string, params?: LegacyGetParams): Promise<T> {
    return canonicalApiClient.get<T>(path, {
      query: params as QueryParams | undefined,
    });
  },

  post<T>(path: string, body?: unknown): Promise<T> {
    return canonicalApiClient.post<T>(
      path,
      body as HttpRequestOptions["body"]
    );
  },

  put<T>(path: string, body?: unknown): Promise<T> {
    return canonicalApiClient.put<T>(
      path,
      body as HttpRequestOptions["body"]
    );
  },

  patch<T>(path: string, body?: unknown): Promise<T> {
    return canonicalApiClient.patch<T>(
      path,
      body as HttpRequestOptions["body"]
    );
  },

  delete<T>(path: string): Promise<T> {
    return canonicalApiClient.delete<T>(path);
  },
};
