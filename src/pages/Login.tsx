import React, { useState } from 'react';
import borderImage from '../assets/border.png';
import { useNavigate } from 'react-router-dom';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Student');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ email, password, role });
    localStorage.setItem('isLoggedIn', 'true');
    onLogin();
    navigate('/dashboard');
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-black text-white font-poppins">
      
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

      <div className="flex-1 flex justify-center items-center p-6 sm:p-8">
        <div className="relative w-full max-w-[500px] h-[80vh] p-6 sm:p-8 flex flex-col justify-center items-center gap-6 text-center bg-none lg:bg-[url('/src/assets/border.png')] bg-no-repeat bg-center bg-[length:100%_100%]">
          <div className="w-full flex flex-col items-center">
            <h2
              className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 mt-4 sm:mt-8"
              style={{
                backgroundImage: 'linear-gradient(to right, #A24DA0, #557FDF, #2EA14D)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Login
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col space-y-6 w-full items-center">
              <div className="flex flex-col w-full px-4 sm:w-3/4 items-start">
                <label htmlFor="email" className="text-sm mb-1">Email address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-4 py-2 text-white placeholder-gray-500 w-full"
                  style={{
                    backgroundColor: 'rgba(212, 212, 212, 0.14)',
                    border: '1px solid #424242',
                  }}
                  required
                />
              </div>

              <div className="flex flex-col w-full px-4 sm:w-3/4 items-start">
                <label htmlFor="password" className="text-sm mb-1">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="px-4 py-2 text-white placeholder-gray-500 w-full"
                  style={{
                    backgroundColor: 'rgba(212, 212, 212, 0.14)',
                    border: '1px solid #424242',
                  }}
                  required
                />
              </div>

              <div className="flex flex-col w-full px-4 sm:w-3/4 items-start">
                <label htmlFor="role" className="text-sm mb-1">Role</label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="px-4 py-2 text-white w-full"
                  style={{
                    backgroundColor: 'rgba(212, 212, 212, 0.14)',
                    border: '1px solid #424242',
                  }}
                >
                  <option value="Student" className="text-black">Student</option>
                  <option value="Faculty" className="text-black">Faculty</option>
                  <option value="Admin" className="text-black">Admin</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-3/4 sm:w-1/2 py-2 mt-6 mb-6 text-white font-semibold cursor-pointer"
                style={{
                  backgroundImage: 'linear-gradient(to right, #E2453E, #557FDF)',
                }}
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;