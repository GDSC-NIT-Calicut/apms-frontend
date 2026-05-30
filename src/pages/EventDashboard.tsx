import { useNavigate } from 'react-router-dom';
import Profile from '../components/Profile';

const organizerActionButtons = [
  { label: 'Submit Requests', route: '/event-organizer-submit' },
  { label: 'Allocated Requests', route: '/event-organizer-allocated' },
  { label: 'Revoked Allocation', route: '/event-organizer-revoked' },
];

type EventOrganizerDashboardProps = {
  setIsLoggedIn: (val: boolean) => void;
};

export default function EventOrganizerDashboard({ setIsLoggedIn }: EventOrganizerDashboardProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-[#0d1117]">
      {/* Top Profile Header Layer Banner */}
      <header className="w-full overflow-hidden">
        <Profile setIsLoggedIn={setIsLoggedIn} user="Event Organizer" />
      </header>

      {/* Main Layout Area - Formatted with identical padding and alignments as student/faculty layouts */}
      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        
        {/* Symmetric Action Button Flex Grid Box Container matching image_da7749.png styles */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full max-w-4xl px-2">
          {organizerActionButtons.map(({ label, route }) => (
            <button
              key={label}
              onClick={() => navigate(route)}
              className="w-full sm:w-64 rounded-xl px-6 py-4 text-white font-bold text-center transition-all bg-gradient-to-r from-[#E2453D] to-[#557FDF] hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] shadow-lg cursor-pointer text-sm sm:text-base tracking-wide"
            >
              {label}
            </button>
          ))}
        </div>

      </main>

      {/* Styled App Footer Canvas Accent Vector */}
      <footer className="mt-auto px-6 py-8 bg-gradient-to-b from-[#241515] to-[#141a2e] border-t-[2px] border-[rgba(38,134,255,0.4)] w-full min-h-16 relative">
        <div className="absolute top-[-2px] left-[-2px]">
          <div className="w-45 h-6 bg-[rgba(38,134,255,0.4)]" style={{ clipPath: 'polygon(0 0, 0 100%, 100% 0)' }}>
            <div className="relative bottom-[2px] w-45 h-6 bg-black" style={{ clipPath: 'polygon(0 0, 0 100%, 100% 0)' }} />
          </div>
        </div>
      </footer>
    </div>
  );
}