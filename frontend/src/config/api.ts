// API Configuration for backend communication
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

// API Response types based on backend controller patterns
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  error?: string;
  // Data can be at root level or nested
  data?: T;
}

// Custom error class for API errors
export class ApiError extends Error {
  status?: number;
  details?: unknown;

  constructor(message: string, status?: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

// API Client class with common HTTP methods
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  // Generic request method
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    const defaultHeaders = {
      "Content-Type": "application/json",
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      // Handle non-JSON responses
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        if (!response.ok) {
          throw new ApiError(
            `HTTP Error: ${response.status} ${response.statusText}`,
            response.status,
          );
        }
        return {
          success: true,
          data: (await response.text()) as T,
        };
      }

      const data = await response.json();

      if (!response.ok) {
        throw new ApiError(
          data.message || `HTTP Error: ${response.status}`,
          response.status,
          data,
        );
      }

      // Handle different response formats from backend
      // Some endpoints return data directly, others wrap it in specific fields
      const normalizedResponse: ApiResponse<T> = {
        success: data.success ?? true,
        message: data.message,
        error: data.error,
        data: data.data as T,
      };

      return normalizedResponse;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      // Network or other errors
      throw new ApiError(
        error instanceof Error ? error.message : "Network error occurred",
        0,
        error,
      );
    }
  }

  // GET request
  async get<T>(
    endpoint: string,
    options?: RequestInit,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: "GET",
    });
  }

  // POST request
  async post<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT request
  async put<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  async delete<T>(
    endpoint: string,
    options?: RequestInit,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: "DELETE",
    });
  }
}

// Create and export the API client instance
export const apiClient = new ApiClient();

// Export individual methods for convenience
export const { get, post, put, delete: del } = apiClient;

// API endpoints constants
export const API_ENDPOINTS = {
  PROJECTS: "/projects",
  TASKS: "/tasks",
  AI_ASSISTANT: "/ai",
} as const;

// Helper function to handle API errors in components
export const handleApiError = (error: unknown): string => {
  if (error instanceof ApiError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred";
};

// Helper function to check if error is an API error
export const isApiError = (error: unknown): error is ApiError => {
  return error instanceof ApiError;
};

// Helper function to check if response is successful
export const isSuccessResponse = (response: ApiResponse): boolean => {
  return response.success === true;
};

// Helper function to get error message from response
export const getErrorMessage = (response: ApiResponse): string => {
  return response.error || response.message || "An error occurred";
};

export default apiClient;
