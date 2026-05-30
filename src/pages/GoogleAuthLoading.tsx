import { useEffect } from 'react';

/**
 * Loading page shown while Google OAuth is in progress
 * This page appears after user initiates Google sign-in and waits for backend redirect
 */
const GoogleAuthLoading: React.FC = () => {
  useEffect(() => {
    // If this page is shown for too long (30 seconds), redirect to failure page
    const timeout = setTimeout(() => {
      window.location.href = '/failuresigninwithgoogle?reason=timeout';
    }, 30000);

    return () => clearTimeout(timeout);
  }, []);

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
          Activity Point Management Portal
        </h1>
        <p
          className="mt-7 text-lg bg-clip-text text-transparent tracking-wide"
          style={{
            backgroundImage: 'linear-gradient(to right, #A24DA0, #557FDF, #2EA14D)',
          }}
        >
          Signing you in...
        </p>
      </div>

      {/* Right side - Loading Animation */}
      <div className="flex-1 flex justify-center items-center p-6 sm:p-8">
        <div className="relative w-full max-w-[500px] h-[80vh] p-6 sm:p-8 flex flex-col justify-center items-center gap-6 text-center bg-none lg:bg-[url('/src/assets/border.png')] bg-no-repeat bg-center bg-[length:100%_100%]">
          <div className="w-full flex flex-col items-center gap-12">
            <h2
              className="text-2xl sm:text-3xl font-bold text-center mt-4 sm:mt-8"
              style={{
                backgroundImage: 'linear-gradient(to right, #A24DA0, #557FDF, #2EA14D)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Signing In with Google
            </h2>

            {/* Animated Loading Spinner */}
            <div className="flex flex-col items-center gap-8">
              <div className="relative w-20 h-20">
                {/* Outer rotating ring */}
                <div
                  className="absolute inset-0 rounded-full border-4 border-transparent"
                  style={{
                    backgroundImage: 'linear-gradient(to right, #557FDF, #2EA14D)',
                    WebkitMaskImage:
                      'linear-gradient(to right, transparent, black, black, transparent)',
                    maskImage:
                      'linear-gradient(to right, transparent, black, black, transparent)',
                    animation: 'spin 2s linear infinite',
                  }}
                />
                {/* Inner circle */}
                <div
                  className="absolute inset-2 rounded-full"
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  }}
                />
              </div>

              <p className="text-gray-400 text-sm">
                Please wait while we redirect you to Google...
              </p>
            </div>

            {/* Style for spinning animation */}
            <style>{`
              @keyframes spin {
                from {
                  transform: rotate(0deg);
                }
                to {
                  transform: rotate(360deg);
                }
              }
            `}</style>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleAuthLoading;
