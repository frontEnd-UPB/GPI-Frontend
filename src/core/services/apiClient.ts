import { AUTH_STORAGE_KEYS } from "../constants";

const BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? "";

/**
 * Structured HTTP error carrying the response status code and a message
 * extracted from the response body (or falling back to statusText).
 */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let message = response.statusText;
    try {
      const data = (await response.json()) as { message?: string; error?: string };
      message = data.message ?? data.error ?? message;
    } catch {
      // keep statusText if body is not JSON
    }
    throw new ApiError(response.status, message);
  }

  // 204 No Content – return undefined cast as T
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const apiClient = {
  async get<T>(path: string, params?: Record<string, string | string[]>): Promise<T> {
    const url = new URL(`${BASE_URL}${path}`, window.location.origin);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v) => url.searchParams.append(key, v));
        } else {
          url.searchParams.set(key, value);
        }
      });
    }
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    });
    return handleResponse<T>(response);
  },

  async post<T>(path: string, body?: unknown): Promise<T> {
    const isFormData = body instanceof FormData;
    const response = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: isFormData
        ? { ...getAuthHeaders() }
        : { "Content-Type": "application/json", ...getAuthHeaders() },
      body: isFormData ? body : JSON.stringify(body),
    });
    return handleResponse<T>(response);
  },

  async put<T>(path: string, body?: unknown): Promise<T> {
    const isFormData = body instanceof FormData;
    const response = await fetch(`${BASE_URL}${path}`, {
      method: "PUT",
      headers: isFormData
        ? { ...getAuthHeaders() }
        : { "Content-Type": "application/json", ...getAuthHeaders() },
      body: isFormData ? body : JSON.stringify(body),
    });
    return handleResponse<T>(response);
  },

  async patch<T>(path: string, body?: unknown): Promise<T> {
    const isFormData = body instanceof FormData;
    const response = await fetch(`${BASE_URL}${path}`, {
      method: "PATCH",
      headers: isFormData
        ? { ...getAuthHeaders() }
        : { "Content-Type": "application/json", ...getAuthHeaders() },
      body: isFormData ? body : JSON.stringify(body),
    });
    return handleResponse<T>(response);
  },

  async delete<T>(path: string): Promise<T> {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    });
    return handleResponse<T>(response);
  },
};
