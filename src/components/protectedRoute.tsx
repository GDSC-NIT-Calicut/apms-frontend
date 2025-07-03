import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  isLoggedIn: boolean;
}

export default function ProtectedRoute({ isLoggedIn }: ProtectedRouteProps) {
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
}