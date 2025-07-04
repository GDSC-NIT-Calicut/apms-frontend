import {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import Profile from '../components/Profile'

const applicationButtons = [
  { label: 'Submit Requests', route: '/submit-requests' },
  { label: 'Allocated Requests', route: '/allocated-requests' },
  { label: 'Revoked Allocations', route: '/revoked-allocations' },
];

type OrganizerProfile = {
    name: string,
    rollno: string,
    department: string,
    faAssigned: string;
}

type DashboardData = {
    profile: OrganizerProfile,
}
type OrganizerDashboardProps = {
     setIsLoggedIn: (val:boolean) => void;
}

export default function OrganizerDashboard( {setIsLoggedIn}: OrganizerDashboardProps) {
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
        <>
            <header className="w-full overflow-hidden relative top-0 max-h-inherit">
                <Profile setIsLoggedIn={setIsLoggedIn} user="Event Organizer"/>
            </header>
            <main className="w-full mt-15 mb-23">
                <section className='ml-[20%]'>
                    <h2 className="text-2xl font-bold text-white mb-10 ml-5 mt-5">Applications</h2>
                    <nav className="flex flex-col mb-10 ml-5 gap-5 max-w-xl ">
                        {applicationButtons.map(({ label, route }) => (
                        <button
                            key={label}
                            onClick={() => navigate(route)}
                            className="w-80 rounded-2xl px-6 py-3 text-white font-semibold transition-all bg-gradient-to-r from-[#E2453D] to-[#557FDF] hover:opacity-90 hover:cursor-pointer"
                        >
                            {label}
                        </button>
                        ))}
                    </nav>
                </section>    
            </main>
            <footer className="absolute bottom-0 mt-auto px-6 py-[32px] bg-gradient-to-b from-[#241515] to-[#141a2e] border-t-[2px] border-[rgba(38,134,255,0.4)] w-full min-h-17 ">
                <div className="absolute top-[-2px] left-[-2px]">
                <div className={'w-45 h-6 bg-[rgba(38,134,255,0.4)]'} style={{ clipPath: 'polygon(0 0, 0 100%, 100% 0)' }}>
                    <div className={'relative bottom-[2px] w-45 h-6 bg-black'} style={{ clipPath: 'polygon(0 0, 0 100%, 100% 0)' }} />
                </div>
                </div>
            </footer>
        </>    

    )
}