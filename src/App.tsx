import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import SidebarLayout from './layouts/SidebarLayout';
import EventSidebarLayout from './layouts/EventSidebarLayout'; // NEW
import LoginPage from './pages/Login';
import Dashboard from './pages/Dashboard';
import SubmitActivity from './pages/SubmitActivity';
import ProtectedRoute from './components/protectedRoute';
import PendingRequests from './pages/PendingRequests';
import ApprovedRequests from './pages/ApprovedRequests';
import RejectedRequests from './pages/RejectedRequests';
import EventDashboard from './pages/EventDashboard';
import SubmitEventRequest from './pages/SubmitEventRequest';
import AllocatedRequests from './pages/AllocatedRequests';
import RevokedAllocation from './pages/RevokedAllocation';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });

  const role = localStorage.getItem("role");

  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<LoginPage onLogin={() => setIsLoggedIn(true)} />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute isLoggedIn={isLoggedIn} />}>

          <Route path="/dashboard" element={<Dashboard setIsLoggedIn={setIsLoggedIn} />} />

          <Route element={<SidebarLayout setIsLoggedIn={setIsLoggedIn} />}>
            <Route path="/submit-activity" element={<SubmitActivity />} />
            <Route path="/pending-requests" element={<PendingRequests />} />
            <Route path="/approved-requests" element={<ApprovedRequests />} />
            <Route path="/rejected-requests" element={<RejectedRequests />} />
          </Route>

          <Route path="/event-dashboard" element={<EventDashboard setIsLoggedIn={setIsLoggedIn} />} />

          <Route element={<EventSidebarLayout setIsLoggedIn={setIsLoggedIn} />}>
            <Route path="/submit-requests" element={<SubmitEventRequest />} />
            <Route path="/allocated-requests" element={<AllocatedRequests />} />
            <Route path="/revoked-allocations" element={<RevokedAllocation />} />
          </Route>

        </Route>

        {/* Fallback */}
        <Route
          path="*"
          element={<Navigate to={isLoggedIn ? { pathname: role === "Event Organizer" ? "/event-dashboard" : "/dashboard" } : "/login"} replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;