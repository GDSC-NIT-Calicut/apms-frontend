import { useEffect, useState } from 'react';
import Profile from '../components/Profile';
import { useNavigate} from 'react-router-dom';

const applicationButtons = [
  { label: 'Submit Requests', route: '/submit-event-request' },
  { label: 'Allocated Requests', route: '/allocated-requests' },
  { label: 'Revoked Allocation', route: '/revoked-allocation' }
];

type ActivityData = {
  required: number;
  earned: number;
  instituteCount: number;
  departmentCount: number;
  eligible: boolean;
};

type StudentProfile = {
  name: string;
  rollNo: string;
  department: string;
  faAssigned: string;
};

type DashboardData = {
  profile: StudentProfile;
  activity: ActivityData;
};

type DashboardProps = {
  setIsLoggedIn: (val:boolean) => void;
};

export default function EventDashboard({setIsLoggedIn}:DashboardProps) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetch('/dashboard.json')
      .then(res => res.json())
      .then((data: DashboardData) => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch dashboard data", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-white p-4">Loading Dashboard...</div>;
  if (!data) return <div className="text-red-400 p-4">Error loading dashboard</div>;

  return (
    <div className="flex flex-col">
      <header className="w-full overflow-hidden">
        <Profile setIsLoggedIn={setIsLoggedIn}/>
      </header>
      <main className="flex mt-2 ml-40 mr-40 gap-[20%]">
        <section className="p-6">
          <h2 className="text-2xl font-bold text-white mb-10 ml-5 mt-5">Applications</h2>
          <nav className="flex flex-col gap-8 max-w-2xl ">
            {applicationButtons.map(({ label, route }) => (
              <button
                key={label}
                onClick={() => navigate(route)}
                className="w-60 rounded-2xl px-6 py-3 text-white font-semibold transition-all bg-gradient-to-r from-[#E2453D] to-[#557FDF] hover:opacity-90 hover:cursor-pointer"
              >
                {label}
              </button>
            ))}
          </nav>
        </section>
      </main>

      <footer className="relative px-6 py-[32px] bg-gradient-to-b from-[#241515] to-[#141a2e] border-t-[2px] border-[rgba(38,134,255,0.4)] w-full min-h-16">
        <div className="absolute top-[-2px] left-[-2px]">
          <div className={'w-45 h-6 bg-[rgba(38,134,255,0.4)]'} style={{ clipPath: 'polygon(0 0, 0 100%, 100% 0)' }}>
            <div className={'relative bottom-[2px] w-45 h-6 bg-black'} style={{ clipPath: 'polygon(0 0, 0 100%, 100% 0)' }} />
          </div>
        </div>
      </footer>
    </div>
  )
}