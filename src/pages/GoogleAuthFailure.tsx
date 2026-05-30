import { useNavigate } from 'react-router-dom';

interface GoogleAuthFailureProps {
  reason?: string;
}

const GoogleAuthFailure: React.FC<GoogleAuthFailureProps> = ({ reason = 'Authentication failed' }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-black text-white font-poppins">
      {/* Left side - Text */}
      <div className="hidden lg:flex flex-1 flex-col justify-center items-center text-center p-8">
        <h1
          className="text-4xl font-bold bg-clip-text text-transparent leading-tight"
          style={{
            backgroundImage: 'linear-gradient(to right, #E2453E, #557FDF, #2EA14D, #D1B712)',
          }}
        >
          Sign In Failed
        </h1>
        <p
          className="mt-7 text-lg bg-clip-text text-transparent tracking-wide"
          style={{
            backgroundImage: 'linear-gradient(to right, #A24DA0, #557FDF, #2EA14D)',
          }}
        >
          Please try again or contact support
        </p>
      </div>

      {/* Right side - Error message */}
      <div className="flex-1 flex justify-center items-center p-6 sm:p-8">
        <div className="relative w-full max-w-[500px] h-[80vh] p-6 sm:p-8 flex flex-col justify-center items-center gap-6 text-center bg-none lg:bg-[url('/src/assets/border.png')] bg-no-repeat bg-center bg-[length:100%_100%]">
          <div className="w-full flex flex-col items-center gap-8">
            <h2
              className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 mt-4 sm:mt-8"
              style={{
                backgroundImage: 'linear-gradient(to right, #E2453E, #557FDF)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Google Sign-In Error
            </h2>

            <div className="flex flex-col items-center gap-4 text-center px-4">
              <p className="text-lg text-gray-300">
                {reason}
              </p>
              <p className="text-sm text-gray-400">
                This could be due to:
              </p>
              <ul className="text-sm text-gray-400 text-left space-y-2">
                <li>• Network connectivity issues</li>
                <li>• Google service temporarily unavailable</li>
                <li>• Invalid authentication credentials</li>
              </ul>
            </div>

            <div className="flex flex-col gap-4 w-full sm:w-3/4 mt-8">
              <button
                onClick={() => navigate('/login')}
                className="w-full py-3 text-white font-semibold cursor-pointer rounded transition-all hover:opacity-90"
                style={{
                  backgroundImage: 'linear-gradient(to right, #E2453E, #557FDF)',
                }}
              >
                Back to Login
              </button>
              <button
                onClick={() => window.location.reload()}
                className="w-full py-3 text-white font-semibold cursor-pointer rounded transition-all border"
                style={{
                  borderColor: 'rgba(212, 212, 212, 0.3)',
                  backgroundColor: 'rgba(212, 212, 212, 0.05)',
                }}
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleAuthFailure;
