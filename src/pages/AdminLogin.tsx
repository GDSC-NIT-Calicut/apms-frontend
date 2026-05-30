import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../utils/auth';

interface AdminLoginProps {
  onLogin: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  /**
   * Handle Admin Login with Email & Password
   */
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your password');
      return;
    }

    setIsLoading(true);

    try {
      const response = await adminLogin(email, password);
      console.log('Admin login response:', response);

      if (response.success) {
        // Store auth state
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('role', response.role || 'admin');
        localStorage.setItem('userId', response.userId || '');

        // Update app state
        onLogin();

        // Redirect to admin dashboard
        navigate('/admin-dashboard');
      } else {
        setError(response.message || 'Invalid credentials');
      }
    } catch (err: any) {
      console.error('Admin login failed:', err);
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-black text-white font-poppins">
      {/* Left side - Branding */}
      <div className="hidden lg:flex flex-1 flex-col justify-center items-center text-center p-8">
        <h1
          className="text-4xl font-bold bg-clip-text text-transparent leading-tight"
          style={{
            backgroundImage: 'linear-gradient(to right, #E2453E, #557FDF, #2EA14D, #D1B712)',
          }}
        >
          Admin Panel - Activity Point Management
        </h1>
        <p
          className="mt-7 text-lg bg-clip-text text-transparent tracking-wide"
          style={{
            backgroundImage: 'linear-gradient(to right, #A24DA0, #557FDF, #2EA14D)',
          }}
        >
          Manage. Monitor. Control.
        </p>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex justify-center items-center p-6 sm:p-8">
        <div className="relative w-full max-w-[500px] h-auto min-h-[80vh] p-6 sm:p-8 flex flex-col justify-center items-center gap-6 text-center bg-none lg:bg-[url('/src/assets/border.png')] bg-no-repeat bg-center bg-[length:100%_100%]">
          <div className="w-full flex flex-col items-center">
            <h2
              className="text-2xl sm:text-3xl font-bold text-center mb-2 sm:mb-4 mt-4 sm:mt-8"
              style={{
                backgroundImage: 'linear-gradient(to right, #A24DA0, #557FDF, #2EA14D)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Admin Login
            </h2>
            <p className="text-gray-400 text-sm mb-8">
              Enter your credentials to access the admin panel
            </p>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-900 bg-opacity-50 border border-red-700 rounded text-red-200 text-sm w-full">
                {error}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleAdminLogin} className="w-full space-y-4">
              {/* Email Input */}
              <div className="w-full">
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-4 py-3 rounded bg-gray-900 bg-opacity-50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:bg-opacity-70 transition-all disabled:opacity-50"
                  required
                />
              </div>

              {/* Password Input */}
              <div className="w-full relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-4 py-3 rounded bg-gray-900 bg-opacity-50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:bg-opacity-70 transition-all disabled:opacity-50 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-300 transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                style={
                  !isLoading
                    ? { backgroundImage: 'linear-gradient(to right, #E2453E, #557FDF)' }
                    : {}
                }
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;