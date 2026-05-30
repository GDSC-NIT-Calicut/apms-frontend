/**
 * Base API Configuration and Utilities
 * Centralized API configuration and reusable fetch utilities
 */

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Default fetch options with credentials
 * Ensures cookies are included in all requests
 */
export const defaultFetchOptions = {
  credentials: 'include' as const,
  headers: {
    'Content-Type': 'application/json',
  },
};

/**
 * Handles API responses and errors consistently
 * @param response - Fetch response object
 * @param operation - Name of the operation for error messages
 * @returns Parsed JSON response
 */
export const handleApiResponse = async (
  response: Response,
  operation: string = 'API call'
) => {
  if (!response.ok) {
    let errorMessage = `${operation} failed: ${response.statusText}`;

    // Handle specific HTTP status codes
    if (response.status === 401) {
      errorMessage = 'Unauthorized - Please login again';
    } else if (response.status === 403) {
      errorMessage = 'Forbidden - Access denied';
    } else if (response.status === 404) {
      errorMessage = `${operation} - Resource not found`;
    } else if (response.status === 500) {
      errorMessage = 'Server error - Please try again later';
    }

    throw new Error(errorMessage);
  }

  try {
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`${operation} - Failed to parse response`);
  }
};

/**
 * Generic API fetch wrapper
 * @param endpoint - API endpoint path
 * @param options - Fetch options to merge with defaults
 * @returns API response
 */
export const apiFetch = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...defaultFetchOptions,
    ...options,
    headers: {
      ...defaultFetchOptions.headers,
      ...options.headers,
    },
  });
  return response;
};
