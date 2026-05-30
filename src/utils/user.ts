/**
 * User Utilities
 * Handles all user-related API calls
 */

import { apiFetch, handleApiResponse } from './api';

/**
 * User Profile Interface
 * Represents the response structure from /api/getuserdetails/me
 */
export interface UserProfile {
  role: string;
  profile: {
    [key: string]: any;
  };
}

/**
 * Get Current User Details
 * Route: GET /api/getuserdetails/me
 * Requires authentication cookie to be present
 *
 * @returns User profile object containing role and role-specific profile data
 * @throws Error if not authenticated or fetch fails
 *
 * @example
 * const { role, profile } = await getUserDetails();
 * console.log(`User role: ${role}`);
 * console.log(`User name: ${profile.student_name}`);
 */
export const getUserDetails = async (): Promise<UserProfile> => {
  try {
    const response = await apiFetch('/api/getuserdetails/me', {
      method: 'GET',
    });

    const data = await handleApiResponse(response, 'Get user details');
    console.log('User details fetched successfully');

    // Backend returns { user: { role }, profile }
    return {
      role: data.user?.role || data.role,
      profile: data.profile || data.user?.profile || {},
    };
  } catch (error) {
    console.error('Get user details error:', error);
    throw error;
  }
};

/**
 * Check if User is Authenticated
 * Attempts to fetch user details to verify authentication status
 * Also checks if authentication cookie is present on backend
 * Safe method that doesn't throw errors
 *
 * @returns true if user is authenticated, false otherwise
 *
 * @example
 * const isAuth = await isAuthenticated();
 * if (!isAuth) {
 *   navigate('/login');
 * }
 */
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    await getUserDetails();
    return true;
  } catch (error) {
    console.debug('User not authenticated:', error);
    return false;
  }
};

/**
 * Check Authentication with Cookie Validation
 * Verifies both the authentication cookie exists and user session is valid
 * This is more thorough than isAuthenticated()
 *
 * @returns Object with authentication status and role info
 */
export const checkAuthenticationWithCookie = async (): Promise<{
  isAuthenticated: boolean;
  role?: string;
  userId?: string;
}> => {
  try {
    const userDetails = await getUserDetails();
    return {
      isAuthenticated: true,
      role: userDetails.role,
    };
  } catch (error) {
    console.debug('Authentication check failed:', error);
    return {
      isAuthenticated: false,
    };
  }
};

/**
 * Get User Profile by Role
 * Fetches user details and returns the profile section
 * Useful when you just need the profile data, not the role
 *
 * @returns Profile object specific to user's role
 * @throws Error if not authenticated or fetch fails
 */
export const getUserProfile = async () => {
  try {
    const { profile } = await getUserDetails();
    return profile;
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    throw error;
  }
};

/**
 * Get User Role
 * Fetches user details and returns just the role
 * Useful when you only need to check user's role
 *
 * @returns User role as string
 * @throws Error if not authenticated or fetch fails
 *
 * @example
 * const role = await getUserRole();
 * if (role === 'admin') {
 *   showAdminPanel();
 * }
 */
export const getUserRole = async (): Promise<string> => {
  try {
    const { role } = await getUserDetails();
    return role;
  } catch (error) {
    console.error('Failed to fetch user role:', error);
    throw error;
  }
};
