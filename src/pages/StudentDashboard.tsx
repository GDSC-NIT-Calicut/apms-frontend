import { useNavigate } from 'react-router-dom';
import Profile from '../components/Profile';
import { useUserProfile, formatProfileData } from '../hooks/useUserProfile';

const applicationButtons = [
  { label: 'Submit Activity', route: '/submit-activity' },
  { label: 'Rejected Requests', route: '/rejected-requests' },
  { label: 'Pending Requests', route: '/pending-requests' },
  { label: 'Approved Requests', route: '/approved-requests' },
];

type StudentDashboardProps = {
  setIsLoggedIn: (val: boolean) => void;
};

export default function StudentDashboard({ setIsLoggedIn }: StudentDashboardProps) {
  const { profile, loading, error } = useUserProfile();
  const navigate = useNavigate();

  if (loading) return <div className="text-white p-4 text-center mt-10">Loading Dashboard...</div>;
  
  if (error || !profile) {
    return (
      <div className="text-red-400 p-4 text-center mt-10">
        Error loading dashboard data. Please try refreshing the page or log in again.
      </div>
    );
  }

  const formattedProfile = formatProfileData(profile);

  const activityData = {
    required: 80, 
    earned: formattedProfile.totalPoints ?? 0,
    instituteCount: (profile.profile as any)?.institute_level_points ?? 0,
    departmentCount: (profile.profile as any)?.department_level_points ?? 0,
    faPoints: formattedProfile.faPoints ?? 0, 
    eligible: formattedProfile.graduationEligible ? 'Yes' : 'No'
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0d1117]">
      <header className="w-full overflow-hidden">
        <Profile 
          setIsLoggedIn={setIsLoggedIn} 
          user="Student" 
          graduationEligible={activityData.eligible} 
        />
      </header>

      {/* Main Layout Area */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start mt-4">
          
          {/* Left Column: Activity Points Card */}
          <section className="lg:col-span-2 text-white bg-[#161b22] bg-opacity-40 p-6 sm:p-8 rounded-2xl border border-gray-800 shadow-xl flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-6 tracking-wide border-b border-gray-800 pb-3 w-full text-left">
              Activity Points Overview
            </h2>
            
            {/* Top Row: Core Visual Gauge Meter */}
            <ActivityMeter current={activityData.earned} target={activityData.required} />

            {/* Bottom Row: Re-engineered Concentric Radial Split View System */}
            <div className="w-full mt-6 pt-6 border-t border-gray-800 flex flex-col items-center">
              <h3 className="text-xs font-semibold tracking-wider text-gray-400 uppercase mb-6 self-start">
                Category Requirements Split
              </h3>
              
              <div className="flex flex-col md:flex-row items-center justify-around w-full gap-8">
                {/* Concentric SVG Graphic Container */}
                <CategoryRadialChart 
                  institute={activityData.instituteCount}
                  department={activityData.departmentCount}
                  fa={activityData.faPoints}
                />

                {/* Explanatory Legend Guide Board */}
                <div className="flex flex-col gap-4 w-full md:w-auto min-w-[240px]">
                  <LegendItem 
                    label="Institute Level Points" 
                    value={activityData.instituteCount} 
                    min={20} 
                    colorClass="text-emerald-400"
                    bgTrack="border-emerald-500/20"
                  />
                  <LegendItem 
                    label="Department Level Points" 
                    value={activityData.departmentCount} 
                    min={20} 
                    colorClass="text-amber-400"
                    bgTrack="border-amber-500/20"
                  />
                  <LegendItem 
                    label="FA Assigned Points" 
                    value={activityData.faPoints} 
                    min={0} 
                    colorClass="text-blue-400"
                    bgTrack="border-blue-500/20"
                  />
                </div>
              </div>

            </div>
          </section>

          {/* Right Column: Applications Action buttons */}
          <section className="text-white bg-[#161b22] bg-opacity-40 p-6 sm:p-8 rounded-2xl border border-gray-800 shadow-xl flex flex-col justify-start">
            <h2 className="text-2xl font-bold mb-6 tracking-wide border-b border-gray-800 pb-3">
              Applications
            </h2>
            
            <nav className="flex flex-col gap-4 pt-2">
              {applicationButtons.map(({ label, route }) => (
                <button
                  key={label}
                  onClick={() => navigate(route)}
                  className="w-full rounded-xl px-5 py-4 text-white font-semibold text-center transition-all bg-gradient-to-r from-[#E2453D] to-[#557FDF] hover:opacity-90 active:scale-[0.98] shadow-md hover:shadow-lg cursor-pointer break-words"
                >
                  {label}
                </button>
              ))}
            </nav>
          </section>

        </div>
      </main>

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

// Reusable Inner Legend Descriptor Component
function LegendItem({ label, value, min, colorClass, /*bgTrack */}: { label: string; value: number; min: number; colorClass: string; bgTrack: string }) {
  const met = value >= min;
  return (
    <div className={`p-3 bg-[#0d1117]/60 rounded-xl border border-gray-800 flex items-center justify-between gap-4 w-full`}>
      <div className="flex flex-col">
        <span className="text-xs font-semibold text-gray-300">{label}</span>
        {min > 0 && (
          <span className={`text-[10px] font-bold font-mono mt-0.5 ${met ? 'text-green-500' : 'text-amber-500'}`}>
            Target: {min} PTS {met ? '(Met)' : '(Pending)'}
          </span>
        )}
      </div>
      <div className={`font-mono text-sm font-black px-2.5 py-1 rounded bg-gray-900 border border-gray-800 ${colorClass}`}>
        {value} PTS
      </div>
    </div>
  );
}

// Nested Tri-Ring Concentric SVG Graphic Renderer
function CategoryRadialChart({ institute, department, fa }: { institute: number; department: number; fa: number }) {
  const maxScale = 40;
  
  // Math calculations for Arc Length maps (Circumference = 2 * PI * Radius)
  const calculateArcProps = (val: number, radius: number) => {
    const percentage = Math.min(val / maxScale, 1);
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - percentage * circumference;
    // Calculate cutoff line marker offset position exactly at 20 point milestone (50% mark)
    const cutoffOffset = circumference - 0.5 * circumference;
    return { circumference, strokeDashoffset, cutoffOffset };
  };

  const ringInst = calculateArcProps(institute, 75);
  const ringDept = calculateArcProps(department, 55);
  const ringFa = calculateArcProps(fa, 35);

  return (
    <div className="relative flex items-center justify-center w-[200px] h-[200px] select-none">
      <svg className="w-full h-full transform -rotate-90 overflow-visible" viewBox="0 0 200 200">
        {/* Ring 1: Institute Level Points (Outer Track) */}
        <circle cx="100" cy="100" r="75" fill="none" stroke="#1f2937" strokeWidth="12" />
        <circle 
          cx="100" cy="100" r="75" fill="none" 
          stroke={institute >= 20 ? '#10b981' : '#f59e0b'} 
          strokeWidth="12" strokeLinecap="round"
          strokeDasharray={ringInst.circumference}
          strokeDashoffset={ringInst.strokeDashoffset}
          className="transition-all duration-1000 ease-out"
        />
        {/* Milestone Tick at 20 PTS */}
        <circle 
          cx="100" cy="100" r="75" fill="none" stroke="#ffffff" strokeWidth="14"
          strokeDasharray={`2 ${ringInst.circumference}`}
          strokeDashoffset={ringInst.cutoffOffset}
          className="opacity-90 shadow-lg"
        />

        {/* Ring 2: Department Level Points (Middle Track) */}
        <circle cx="100" cy="100" r="55" fill="none" stroke="#1f2937" strokeWidth="12" />
        <circle 
          cx="100" cy="100" r="55" fill="none" 
          stroke={department >= 20 ? '#34d399' : '#fbbf24'} 
          strokeWidth="12" strokeLinecap="round"
          strokeDasharray={ringDept.circumference}
          strokeDashoffset={ringDept.strokeDashoffset}
          className="transition-all duration-1000 ease-out"
        />
        {/* Milestone Tick at 20 PTS */}
        <circle 
          cx="100" cy="100" r="55" fill="none" stroke="#ffffff" strokeWidth="14"
          strokeDasharray={`2 ${ringDept.circumference}`}
          strokeDashoffset={ringDept.cutoffOffset}
          className="opacity-90"
        />

        {/* Ring 3: FA Assigned Points (Inner Track - No minimum bottleneck) */}
        <circle cx="100" cy="100" r="35" fill="none" stroke="#1f2937" strokeWidth="12" />
        <circle 
          cx="100" cy="100" r="35" fill="none" stroke="#3b82f6" strokeWidth="12" strokeLinecap="round"
          strokeDasharray={ringFa.circumference}
          strokeDashoffset={ringFa.strokeDashoffset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      
      {/* Decorative center micro icon housing */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-10 h-10 rounded-full bg-gray-900/60 border border-gray-800 flex items-center justify-center text-[10px] font-mono font-black text-gray-500 shadow-inner">
          PTS
        </div>
      </div>
    </div>
  );
}

function ActivityMeter({ current, target = 80 }: { current: number; target: number }) {
  const maxPoints = 120;
  const validPoints = Math.min(current, maxPoints);
  const percentage = validPoints / maxPoints;
  const rotationAngle = percentage * 180 - 90;

  let statusColor = 'text-[#ef4444]'; 
  if (current >= target) {
    statusColor = 'text-[#4ade80]'; 
  } else if (current >= 40) {
    statusColor = 'text-[#facc15]'; 
  }

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-[320px] p-2 bg-[#0d1117] bg-opacity-50 border border-gray-800 rounded-xl shadow-inner">
      <div className="relative w-full h-[160px] flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 200 100" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="35%" stopColor="#ef4444" />
              <stop offset="50%" stopColor="#facc15" />
              <stop offset="66%" stopColor="#facc15" /> 
              <stop offset="67%" stopColor="#4ade80" /> 
              <stop offset="100%" stopColor="#22c55e" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <path
            d="M 20 90 A 80 80 0 0 1 180 90"
            fill="none"
            stroke="#1f2937"
            strokeWidth="16"
            strokeLinecap="round"
          />
          <path
            d="M 20 90 A 80 80 0 0 1 180 90"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="16"
            strokeLinecap="round"
          />
          <g transform={`rotate(${rotationAngle}, 100, 90)`} className="transition-transform duration-1000 ease-out">
            <line x1="100" y1="90" x2="100" y2="15" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
            <circle cx="100" cy="90" r="6" fill="#ffffff" />
          </g>
        </svg>
        <div className="absolute bottom-1 flex flex-col items-center justify-center">
          <span className={`text-4xl font-black tracking-tight font-mono ${statusColor}`}>
            {current}
          </span>
          <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mt-0.5">
            Total Earned Points
          </span>
        </div>
      </div>
      <div className="flex justify-between w-full px-4 text-[11px] font-bold font-mono text-gray-500 mt-2">
        <span>0 PTS</span>
        <span className="text-[#4ade80]">TARGET: {target}</span>
        <span>120+</span>
      </div>
    </div>
  );
}