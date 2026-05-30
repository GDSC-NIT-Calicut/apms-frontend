import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SidebarLayout from './layouts/SidebarLayout';
import LoginPage from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import FacultyDashboard from './pages/FacultyDashboard';
import FacultyPendingApproval from './pages/FacultyPendingApproval';
import FacultyStudentStatus from './pages/FacultyStudentStatus';
import FacultyAssignPoints from './pages/FacultyAssignPoints';
import SubmitActivity from './pages/SubmitActivity';
import ProtectedRoute from './components/protectedRoute';
import PendingRequests from './pages/PendingRequests';
import ApprovedRequests from './pages/ApprovedRequests';
import RejectedRequests from './pages/RejectedRequests';
import EventDashboard from './pages/EventDashboard';
import SubmitEventRequest from './pages/SubmitEventRequest';
import AllocatedRequests from './pages/AllocatedRequests';
import RevokedAllocation from './pages/RevokedAllocation';
import GoogleAuthLoading from './pages/GoogleAuthLoading';
import GoogleAuthFailure from './pages/GoogleAuthFailure';
import { isAuthenticated, getUserRole } from './utils/user';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // Check if user already has a valid session cookie from backend
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const role = localStorage.getItem('role');

  // On app mount, verify if user has valid authentication
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const authenticated = await isAuthenticated();
        if (authenticated) {
          // Fetch role from backend and persist it so routing can use it
          let roleFromApi: string | null = null;
          try {
            roleFromApi = await getUserRole();
          } catch (err) {
            console.warn('Failed to fetch role after auth check:', err);
          }

          setIsLoggedIn(true);
          localStorage.setItem('isLoggedIn', 'true');
          if (roleFromApi) {
            // Normalize and store exact role string returned by backend
            localStorage.setItem('role', roleFromApi);
          }
        } else {
          setIsLoggedIn(false);
          localStorage.removeItem('isLoggedIn');
          localStorage.removeItem('role');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsLoggedIn(false);
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('role');
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuthentication();
  }, []);

  /**
   * Normalize role strings returned by backend or present in URL
   * to the canonical role labels used in the frontend routing.
   */
  const normalizeRole = (raw?: string | null) => {
    if (!raw) return null;
    const s = raw.toString().trim().toLowerCase();
    if (s.includes('admin')) return 'admin';
    if (s.includes('event')) return 'Event Organizer';
    if (s.includes('faculty') || s.includes('staff')) return 'Faculty';
    if (s.includes('student')) return 'Student';
    return raw; // fallback to whatever the backend returned
  };

  /**
   * Component used to capture backend redirects of the form
   * `/dashboard/<role>` and persist the role in localStorage,
   * then redirect to the canonical dashboard route.
   */
  function SetRoleRedirect() {
    const { role: roleParam } = useParams();
    const nav = useNavigate();

    useEffect(() => {
      const normalized = normalizeRole(roleParam);
      console.debug('SetRoleRedirect:', { roleParam, normalized });
      if (normalized) {
        localStorage.setItem('role', normalized);
        localStorage.setItem('isLoggedIn', 'true');
      }
      
      // Redirect to the canonical dashboard for this role
      const dest = (() => {
        switch (normalized) {
          case 'admin':
            return '/admin-dashboard';
          case 'Event Organizer':
            return '/event-organizer-dashboard';
          case 'Faculty':
            return '/faculty-dashboard';
          case 'Student':
          default:
            return '/dashboard';
        }
      })();
      nav(dest, { replace: true });
    }, [roleParam, nav]);

    return null;
  }

  // Show loading while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0d1117] text-white">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="font-mono text-sm text-gray-400">Verifying security tokens...</p>
        </div>
      </div>
    );
  }

  /**
   * Determine default dashboard based on role
   * Routes users to their respective dashboard
   */
  const getDefaultDashboard = () => {
    const cleanRole = role?.trim().toLowerCase() || '';
    if (cleanRole.includes('admin')) return '/admin-dashboard';
    if (cleanRole.includes('event')) return '/event-organizer-dashboard';
    if (cleanRole.includes('faculty') || cleanRole.includes('staff')) return '/faculty-dashboard';
    return '/dashboard';
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage onLogin={() => setIsLoggedIn(true)} />} />
        <Route path="/adminlogin" element={<AdminLogin onLogin={() => setIsLoggedIn(true)} />} />
        {/* Backend may redirect to /dashboard/:role after OAuth - capture and redirect */}
        <Route path="/dashboard/:role" element={<SetRoleRedirect />} />
        <Route path="/google-auth-loading" element={<GoogleAuthLoading />} />
        <Route path="/failuresigninwithgoogle" element={<GoogleAuthFailure />} />

        {/* Protected Routes Block */}
        <Route element={<ProtectedRoute isLoggedIn={isLoggedIn} />}>
          
          {/* 1. STUDENT VIEW SYSTEM */}
          <Route path="/dashboard" element={<StudentDashboard setIsLoggedIn={setIsLoggedIn} />} />
          <Route element={<SidebarLayout setIsLoggedIn={setIsLoggedIn} />}>
            <Route path="/submit-activity" element={<SubmitActivity />} />
            <Route path="/pending-requests" element={<PendingRequests />} />
            <Route path="/approved-requests" element={<ApprovedRequests />} />
            <Route path="/rejected-requests" element={<RejectedRequests />} />
          </Route>

          {/* 2. ADMIN VIEW SYSTEM */}
          <Route path="/admin-dashboard" element={<AdminDashboard setIsLoggedIn={setIsLoggedIn} />} />

          {/* 3. FACULTY VIEW SYSTEM */}
          <Route path="/faculty-dashboard" element={<FacultyDashboard setIsLoggedIn={setIsLoggedIn} />} />
          <Route element={<SidebarLayout setIsLoggedIn={setIsLoggedIn} />}>
            <Route path="/faculty-pending-approval" element={<FacultyPendingApproval setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/faculty-student-status" element={<FacultyStudentStatus setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/faculty-assign-points" element={<FacultyAssignPoints setIsLoggedIn={setIsLoggedIn} />} />
          </Route>

          {/* 4. EVENT ORGANIZER VIEW SYSTEM */}
          <Route path="/event-organizer-dashboard" element={<EventDashboard setIsLoggedIn={setIsLoggedIn} />} />
          <Route element={<SidebarLayout setIsLoggedIn={setIsLoggedIn} />}>
            {/* FIXED: Removed the extraneous setIsLoggedIn attributes that were breaking the compiler */}
            <Route path="/event-organizer-submit" element={<SubmitEventRequest />} />
            <Route path="/event-organizer-allocated" element={<AllocatedRequests />} />
            <Route path="/event-organizer-revoked" element={<RevokedAllocation />} />
          </Route>
        </Route>

        {/* Fallback Redirect Strategy Handler */}
        <Route
          path="*"
          element={
            <Navigate
              to={isLoggedIn ? getDefaultDashboard() : '/login'}
              replace
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;