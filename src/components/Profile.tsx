import { useEffect, useState } from 'react';
import userIcon from '../assets/userIco.png';
import { useNavigate } from 'react-router-dom';

type StudentProfile = {
  name: string;
  rollNo: string;
  department: string;
  faAssigned: string;
};

type ProfileProps = {
  compact?: boolean;
  setIsLoggedIn?: (val:boolean)=>void;
};

export default function Profile({ compact = false, setIsLoggedIn }: ProfileProps) {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/profile.json')
      .then((res) => res.json())
      .then((data) => setProfile(data))
      .catch((err) => console.error('Failed to fetch profile:', err));
  }, []);

  const handleLogout = () => {
    const confirmed = window.confirm('Are you sure you want to log out?');
    if (confirmed) {
      localStorage.clear();
      setIsLoggedIn?.(false);
      navigate('/login', { replace: true });
    }
  };

  if (!profile) return <div className="text-white p-4">Loading...</div>;

  return (
    <header className="relative w-full overflow-hidden">
        {/* Bordered and backgrounded content */}
        <div
            className={`relative flex items-center justify-between px-8 py-6 text-white
            bg-gradient-to-b from-[#241515] to-[#141a2e] border-b-[2px] border-[rgba(38,134,255,0.4)]
            ${compact ? 'max-w-full max-h-40' : 'max-h-65'}`}
        >


        {/* Triangle with border */}
        <div className="absolute bottom-[-3px] left-[-2px]">
        {/* Border wrapper */}
        <div className={`${compact ? 'w-36 h-9' : 'w-48 h-9'} bg-[rgba(38,134,255,0.4)]`} style={{ clipPath: 'polygon(0 100%, 0 0, 100% 100%)' }}>
            {/* Inner triangle (actual content) */}
            <div className={`${compact ? 'w-34 h-9' : 'w-46 h-9'} bg-black`} style={{ clipPath: 'polygon(0 100%, 0 0, 100% 100%)' }} />
        </div>
        </div>


        {/* Left: Avatar + Info */}
        <div className="flex items-center gap-6 z-10">
          <figure className="w-16 h-16 mr-15 ml-10 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(0,132,255,0.5)] flex items-center justify-center overflow-hidden">
            <img src={userIcon} alt="User" className="w-16 h-16 object-contain" />
          </figure>

          {compact ? (
            <section className="text-[1.1rem] leading-relaxed tracking-wide">
              <span className="font-bold">{profile.name}</span><br/>
              <span>{profile.rollNo}</span>
            </section>
          ) : (
            <section className='mb-10'>
              <h1 className="text-2xl font-bold mt-10 mb-5 leading-loose">Student Dashboard</h1>
              <dl className="space-y-1 text-1.5sm">
                <div><span className="font-bold leading-loose">Name:</span> {profile.name}</div>
                <div><span className="font-bold leading-loose">Roll No:</span> {profile.rollNo}</div>
                <div><span className="font-bold leading-loose">Department:</span> {profile.department}</div>
                <div><span className="font-bold leading-loose">FA Assigned:</span> {profile.faAssigned}</div>
              </dl>
            </section>
          )}
        </div>

        {/* Right: Logout */}
        <section className="flex items-center bg-transparent w-[20%] h-[30%] absolute right-[1%] bottom-[12%] justify-end"
            style={{
                    borderRight: '1px solid',
                    borderBottom: '1px solid',
                    borderImage: 'linear-gradient(to top, rgba(152, 48, 43, 0.8),  rgba(57, 141, 244, 0.6)) 1'
                }}
        >
            
            <button
            onClick={handleLogout}
            className={`z-10  mr-10 ${compact ? 'mb-10' : 'mb-70' } flex items-start gap-2 text-lg text-[#E2453D80] hover:text-[#ff7369] px-4 py-2 rounded-lg font-semibold transition`}>
            <img src={userIcon} alt="icon" className="w-7 h-7 object-contain rounded-full bg-blue-400 shadow-[0_0_10px_rgba(0,132,255,0.5)] mr-1" />
            Logout
            </button>
        </section>
      </div>
    </header>
  );
}