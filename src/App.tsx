import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Sidebar from "./components/Sidebar";
import Profile from "./components/Profile";
import LoginPage from './pages/Login';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={<LoginPage onLogin={() => setIsLoggedIn(true)} />}
        />
        <Route
          path="/dashboard"
          element={
            isLoggedIn ? (
              <div className="flex">
                <Sidebar />
                <Profile compact /> {/* remove compact to switch to full profile view and vice-versa */}
      {/* <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold">Main Content</h1>
      </div> */}
              </div>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="*"
          element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;