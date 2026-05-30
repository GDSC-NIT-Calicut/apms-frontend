import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { initiateGoogleAuth } from '../utils/auth';
import { isAuthenticated } from '../utils/user';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndInitiate = async () => {
      try {
        // Check if user has valid cookie from backend
        const authenticated = await isAuthenticated();

        if (authenticated) {
          // User has valid cookie, they're already logged in
          console.log('User already authenticated via cookie');
          localStorage.setItem('isLoggedIn', 'true');
          onLogin();
          // App.tsx will handle redirect to appropriate dashboard
          navigate('/dashboard'); // This will be redirected by App.tsx based on role
        } else {
          // No valid cookie, automatically initiate Google auth
          console.log('No valid cookie found, initiating Google auth');
          setIsCheckingAuth(false);
          initiateGoogleAuth();
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        setError('Failed to check authentication. Please try again.');
        setIsCheckingAuth(false);
      }
    };

    checkAuthAndInitiate();
  }, [onLogin, navigate]);

  if (isCheckingAuth) {
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
            Welcome to the Activity Point Management Portal
          </h1>
          <p
            className="mt-7 text-lg bg-clip-text text-transparent tracking-wide"
            style={{
              backgroundImage: 'linear-gradient(to right, #A24DA0, #557FDF, #2EA14D)',
            }}
          >
            Track. <span>Verify.</span> Achieve.
          </p>
        </div>

        {/* Right side - Loading */}
        <div className="flex-1 flex justify-center items-center p-6 sm:p-8">
          <div className="relative w-full max-w-[500px] h-auto min-h-[80vh] p-6 sm:p-8 flex flex-col justify-center items-center gap-6 text-center bg-none lg:bg-[url('/src/assets/border.png')] bg-no-repeat bg-center bg-[length:100%_100%]">
            <div className="w-full flex flex-col items-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-400">Checking authentication...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
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
            Welcome to the Activity Point Management Portal
          </h1>
          <p
            className="mt-7 text-lg bg-clip-text text-transparent tracking-wide"
            style={{
              backgroundImage: 'linear-gradient(to right, #A24DA0, #557FDF, #2EA14D)',
            }}
          >
            Track. <span>Verify.</span> Achieve.
          </p>
        </div>

        {/* Right side - Error */}
        <div className="flex-1 flex justify-center items-center p-6 sm:p-8">
          <div className="relative w-full max-w-[500px] h-auto min-h-[80vh] p-6 sm:p-8 flex flex-col justify-center items-center gap-6 text-center bg-none lg:bg-[url('/src/assets/border.png')] bg-no-repeat bg-center bg-[length:100%_100%]">
            <div className="w-full flex flex-col items-center">
              <div className="mb-4 p-4 bg-red-900 bg-opacity-50 border border-red-700 rounded text-red-200 text-sm">
                {error}
              </div>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-6 py-2 rounded font-semibold text-white transition-all"
                style={{
                  backgroundImage: 'linear-gradient(to right, #E2453E, #557FDF)',
                }}
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default LoginPage;