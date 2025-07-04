import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import SidebarLayout from './layouts/SidebarLayout.tsx';
import LoginPage from './pages/Login';
import Dashboard from './pages/Dashboard';
import SubmitActivity from './pages/SubmitActivity';
import ProtectedRoute from './components/protectedRoute';
import PendingRequests from './pages/PendingRequests.tsx';
import ApprovedRequests from './pages/ApprovedRequests.tsx';
import RejectedRequests from './pages/RejectedRequests';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(()=>{
    return localStorage.getItem("isLoggedIn")==="true";
  });

  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<LoginPage onLogin={() => setIsLoggedIn(true)} />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute isLoggedIn={isLoggedIn} />}>
          {/* Dashboard with no sidebar */}
          <Route path="/dashboard" element={<Dashboard setIsLoggedIn={setIsLoggedIn}/>} />

          {/* Sidebar Layout Routes */}
          <Route element={<SidebarLayout setIsLoggedIn={setIsLoggedIn}/>}>
            <Route path="/submit-activity" element={<SubmitActivity />} />
            <Route path="/pending-requests" element={<PendingRequests />} />
            <Route path="/approved-requests" element={<ApprovedRequests />} />
            <Route path="/rejected-requests" element={<RejectedRequests />} />
            {/* Add more routes with sidebar here */}
          </Route>
        </Route>

        {/* Fallback */}
        <Route
          path="*"
          element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;