import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  isLoggedIn: boolean;
  requiredRole?: string | string[]; // Optional: specify required role(s)
}

/**
 * ProtectedRoute Component
 * Ensures user is authenticated before accessing protected routes
 * Can optionally restrict to specific roles
 *
 * @param isLoggedIn - Boolean indicating if user is logged in
 * @param requiredRole - Optional single role or array of allowed roles
 */
export default function ProtectedRoute({
  isLoggedIn,
  requiredRole,
}: ProtectedRouteProps) {
  // Check if user is authenticated
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Check if specific role is required
  if (requiredRole) {
    const userRole = localStorage.getItem('role');
    const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];

    if (!userRole || !allowedRoles.includes(userRole)) {
      // User doesn't have required role, redirect to their default dashboard
      const defaultRoute = getDefaultDashboardByRole(userRole);
      return <Navigate to={defaultRoute} replace />;
    }
  }

  return <Outlet />;
}

/**
 * Helper function to get default dashboard based on user role
 * @param role - User's role from localStorage
 * @returns Default dashboard route for the role
 */
function getDefaultDashboardByRole(role: string | null): string {
  switch (role) {
    case 'admin':
    case 'Admin':
      return '/admin-dashboard';
    case 'Event Organizer':
    case 'event_organizer':
      return '/event-dashboard';
    case 'Faculty':
    case 'faculty':
    case 'Staff':
    case 'staff':
      return '/faculty-dashboard';
    case 'Student':
    case 'student':
    default:
      return '/dashboard';
  }
}