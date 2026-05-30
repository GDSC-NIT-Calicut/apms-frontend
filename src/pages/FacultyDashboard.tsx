import { useNavigate } from 'react-router-dom';
import Profile from '../components/Profile';
import { useUserProfile } from '../hooks/useUserProfile';

const facultyActionButtons = [
  { label: 'Pending Approval', route: '/faculty-pending-approval' },
  { label: 'View Student Status', route: '/faculty-student-status' },
  { label: 'Assign Points', route: '/faculty-assign-points' },
];

type FacultyDashboardProps = {
  setIsLoggedIn: (val: boolean) => void;
};

/**
 * FacultyDashboard Component
 * Fully responsive dashboard layout optimized cleanly for mobile, tablet, and desktop views
 */
export default function FacultyDashboard({ setIsLoggedIn }: FacultyDashboardProps) {
  const { profile, loading, error } = useUserProfile();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#0d1117] text-white justify-center items-center font-medium">
        Loading Faculty Dashboard...
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex min-h-screen bg-[#0d1117] text-red-400 justify-center items-center font-medium px-4 text-center">
        Failed to load faculty details. Please refresh or log in again.
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0d1117]">
      <header className="w-full overflow-hidden">
        <Profile setIsLoggedIn={setIsLoggedIn} user="Faculty" />
      </header>

      {/* Main Responsive Grid Area */}
      <main className="flex-grow flex flex-col px-4 sm:px-6 lg:px-8 py-10 sm:py-16 items-center justify-center max-w-5xl mx-auto w-full">
        
        {/* Dynamic Button Layout Section:
            - Mobile: Stacks buttons in an explicit 1-column list with balanced spacing
            - Laptop/Desktop: Pulls buttons into a clean, uniform horizontal row
        */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full max-w-md sm:max-w-none justify-center">
          {facultyActionButtons.map(({ label, route }) => (
            <button
              key={label}
              onClick={() => navigate(route)}
              className="w-full sm:w-auto rounded-xl sm:rounded-2xl px-6 sm:px-8 py-4 text-white font-bold text-center transition-all bg-gradient-to-r from-[#E2453D] to-[#557FDF] hover:opacity-95 hover:scale-[1.01] active:scale-[0.99] shadow-md hover:shadow-xl cursor-pointer break-words text-base sm:text-lg tracking-wide border border-transparent hover:border-gray-700/40"
            >
              {label}
            </button>
          ))}
        </div>
      </main>

      {/* Footer Element */}
      <footer className="mt-auto px-6 py-8 bg-gradient-to-b from-[#241515] to-[#141a2e] border-t-[2px] border-[rgba(38,134,255,0.4)] w-full min-h-16 relative">
        <div className="absolute top-[-2px] left-[-2px]">
          <div
            className="w-45 h-6 bg-[rgba(38,134,255,0.4)]"
            style={{ clipPath: 'polygon(0 0, 0 100%, 100% 0)' }}
          >
            <div
              className="relative bottom-[2px] w-45 h-6 bg-black"
              style={{ clipPath: 'polygon(0 0, 0 100%, 100% 0)' }}
            />
          </div>
        </div>
      </footer>
    </div>
  );
}