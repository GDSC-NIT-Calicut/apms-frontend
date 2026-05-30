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
export const handleApiResponse = async (response: Response, context: string) => {
  // If request is 2xx, return data cleanly
  if (response.ok) {
    return await response.json();
  }

  // Parse the error payload sent by the backend controller
  const errorData = await response.json().catch(() => ({}));

  // Combine backend descriptions if available (e.g., "Registration failed: duplicate key...")
  const failureMessage = errorData.error 
    ? `${errorData.message}: ${errorData.error}` 
    : (errorData.message || `${context} failed`);

  // Fallback to generic text ONLY if the backend didn't send a body payload
  if (response.status === 500 && !errorData.message) {
    throw new Error('Server error - Please try again later');
  }

  throw new Error(failureMessage);
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
