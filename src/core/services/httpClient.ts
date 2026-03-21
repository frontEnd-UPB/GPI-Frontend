import { API_BASE_URL, AUTH_STORAGE_KEYS } from "../constants";

export class ApiError extends Error {
  readonly status: number;
  readonly data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export interface HttpRequestOptions
  extends Omit<RequestInit, "body" | "headers"> {
  body?: BodyInit | Record<string, unknown> | unknown[] | null;
  headers?: HeadersInit;
  skipAuth?: boolean;
}

export type QueryParamValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | Array<string | number | boolean>;

export type QueryParams = Record<string, QueryParamValue>;

export type AuthTokenResolver = () => string | null | undefined;

let authTokenResolver: AuthTokenResolver | null = null;

export function setAuthTokenResolver(resolver: AuthTokenResolver): void {
  authTokenResolver = resolver;
}

export function clearAuthTokenResolver(): void {
  authTokenResolver = null;
}

function resolveAuthToken(): string | null {
  const sessionToken = authTokenResolver?.();
  if (typeof sessionToken === "string" && sessionToken.trim().length > 0) {
    return sessionToken;
  }

  return localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN);
}

function isSerializableJsonBody(body: HttpRequestOptions["body"]): boolean {
  if (body == null) return false;
  if (typeof body === "string") return false;
  if (body instanceof FormData) return false;
  if (body instanceof URLSearchParams) return false;
  if (body instanceof Blob) return false;
  if (body instanceof ArrayBuffer) return false;
  return true;
}

async function parseResponseBody(response: Response): Promise<unknown> {
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    try {
      return await response.json();
    } catch {
      return null;
    }
  }

  const text = await response.text();
  return text ? text : null;
}

function getErrorMessage(response: Response, responseBody: unknown): string {
  if (typeof responseBody === "object" && responseBody !== null) {
    const maybeMessage =
      "message" in responseBody && typeof responseBody.message === "string"
        ? responseBody.message
        : null;
    if (maybeMessage && maybeMessage.trim().length > 0) {
      return maybeMessage;
    }

    const maybeError =
      "error" in responseBody && typeof responseBody.error === "string"
        ? responseBody.error
        : null;
    if (maybeError && maybeError.trim().length > 0) {
      return maybeError;
    }
  }

  if (typeof responseBody === "string" && responseBody.trim().length > 0) {
    return responseBody;
  }

  return response.statusText || `Request failed with status ${response.status}`;
}

function buildUrl(endpoint: string, query?: QueryParams): string {
  const baseUrl = endpoint;
  if (!query) return baseUrl;

  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value == null) return;

    if (Array.isArray(value)) {
      value.forEach((item) => {
        params.append(key, String(item));
      });
      return;
    }

    params.append(key, String(value));
  });

  const queryString = params.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

export async function httpRequest<T>(
  endpoint: string,
  options: HttpRequestOptions = {}
): Promise<T> {
  const { body, headers, skipAuth = false, ...requestInit } = options;
  const requestHeaders = new Headers(headers);

  if (!skipAuth) {
    const token = resolveAuthToken();
    if (token && !requestHeaders.has("Authorization")) {
      requestHeaders.set("Authorization", `Bearer ${token}`);
    }
  }

  let requestBody: BodyInit | null = null;
  if (body != null) {
    if (isSerializableJsonBody(body)) {
      if (!requestHeaders.has("Content-Type")) {
        requestHeaders.set("Content-Type", "application/json");
      }
      requestBody = JSON.stringify(body);
    } else {
      requestBody = body as BodyInit;
    }
  }

  if (!requestHeaders.has("Accept")) {
    requestHeaders.set("Accept", "application/json");
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...requestInit,
      headers: requestHeaders,
      body: requestBody,
    });
  } catch (error) {
    throw new ApiError("Internal server error (500)", 500, {
      reason: "NETWORK_ERROR",
      details: error instanceof Error ? error.message : String(error),
    });
  }

  const responseBody = await parseResponseBody(response);

  if (!response.ok) {
    const message = getErrorMessage(response, responseBody);

    throw new ApiError(message, response.status, responseBody);
  }

  return responseBody as T;
}

interface ApiRequestOptions extends Omit<HttpRequestOptions, "method"> {
  query?: QueryParams;
}

interface ApiClient {
  request<T>(method: string, endpoint: string, options?: ApiRequestOptions): Promise<T>;
  get<T>(endpoint: string, options?: Omit<ApiRequestOptions, "body">): Promise<T>;
  post<T>(endpoint: string, body?: HttpRequestOptions["body"], options?: Omit<ApiRequestOptions, "body">): Promise<T>;
  put<T>(endpoint: string, body?: HttpRequestOptions["body"], options?: Omit<ApiRequestOptions, "body">): Promise<T>;
  patch<T>(endpoint: string, body?: HttpRequestOptions["body"], options?: Omit<ApiRequestOptions, "body">): Promise<T>;
  delete<T>(endpoint: string, options?: ApiRequestOptions): Promise<T>;
}

export const apiClient: ApiClient = {
  request<T>(method: string, endpoint: string, options: ApiRequestOptions = {}) {
    const { query, ...rest } = options;
    const url = buildUrl(endpoint, query);
    return httpRequest<T>(url, {
      ...rest,
      method,
    });
  },

  get<T>(endpoint: string, options: Omit<ApiRequestOptions, "body"> = {}) {
    return this.request<T>("GET", endpoint, options);
  },

  post<T>(
    endpoint: string,
    body?: HttpRequestOptions["body"],
    options: Omit<ApiRequestOptions, "body"> = {}
  ) {
    return this.request<T>("POST", endpoint, {
      ...options,
      body,
    });
  },

  put<T>(
    endpoint: string,
    body?: HttpRequestOptions["body"],
    options: Omit<ApiRequestOptions, "body"> = {}
  ) {
    return this.request<T>("PUT", endpoint, {
      ...options,
      body,
    });
  },

  patch<T>(
    endpoint: string,
    body?: HttpRequestOptions["body"],
    options: Omit<ApiRequestOptions, "body"> = {}
  ) {
    return this.request<T>("PATCH", endpoint, {
      ...options,
      body,
    });
  },

  delete<T>(endpoint: string, options: ApiRequestOptions = {}) {
    return this.request<T>("DELETE", endpoint, options);
  },
};
