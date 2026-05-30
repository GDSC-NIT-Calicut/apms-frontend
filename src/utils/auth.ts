/**
 * Authentication Utilities
 * Handles all authentication-related API calls
 */

import { apiFetch, handleApiResponse, API_BASE_URL } from './api';

/**
 * Admin Login
 * Route: POST /api/auth/login
 * Sends email and password, backend handles cookie setting and redirect
 *
 * @param email - Admin email address
 * @param password - Admin password
 * @returns Response data from backend
 * @throws Error if login fails
 */
export const adminLogin = async (email: string, password: string) => {
  try {
    const response = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    const data = await handleApiResponse(response, 'Admin login');
    console.log('Admin login successful');
    return data;
  } catch (error) {
    console.error('Admin login error:', error);
    throw error;
  }
};

/**
 * Google OAuth Sign-in Initiation
 * Route: GET /api/auth/google
 * Redirects to Google sign-in page via backend
 *
 * Note: This function redirects the page to Google OAuth flow
 * Backend will handle the OAuth callback and redirect back to app
 */
export const initiateGoogleAuth = () => {
  try {
    // Redirect to backend OAuth endpoint
    // Backend will redirect to Google, then handle callback
    window.location.href = `${API_BASE_URL}/api/auth/google`;
  } catch (error) {
    console.error('Failed to initiate Google Auth:', error);
    throw error;
  }
};

/**
 * Google OAuth Sign-in for Admin
 * Route: GET /api/auth/google-admin
 * Redirects to Google sign-in page via backend (admin specific)
 *
 * Note: This function redirects the page to Google OAuth flow for admin
 * Backend will handle the OAuth callback and redirect to admin dashboard
 */
export const initiateGoogleAuthAdmin = () => {
  try {
    // Redirect to backend OAuth endpoint for admin
    // Backend will redirect to Google, then handle callback
    window.location.href = `${API_BASE_URL}/api/auth/google-admin`;
  } catch (error) {
    console.error('Failed to initiate Admin Google Auth:', error);
    throw error;
  }
};

/**
 * Logout User
 * Route: POST /api/auth/logout
 * Clears backend session and cookies
 *
 * @throws Error if logout fails (but doesn't prevent local cleanup)
 */
export const logout = async () => {
  try {
    const response = await apiFetch('/api/auth/logout', {
      method: 'POST',
    });

    if (!response.ok) {
      console.warn('Logout response not ok, but clearing local state');
    } else {
      await handleApiResponse(response, 'Logout');
      console.log('Logout successful');
    }
  } catch (error) {
    console.error('Logout error:', error);
    // Don't throw - still want to clear local state even if API call fails
  }
};

/**
 * Check Token/Session Validity
 * This is a helper to verify if current session is still valid
 * Used during app initialization
 *
 * @returns true if session is valid, false otherwise
 */
export const verifySession = async (): Promise<boolean> => {
  try {
    const response = await apiFetch('/api/auth/verify', {
      method: 'GET',
    });
    return response.ok;
  } catch (error) {
    return false;
  }
};
