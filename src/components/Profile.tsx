import { useState } from 'react';
import userIcon from '../assets/userIco.png';
import { useNavigate } from 'react-router-dom';
import { logout } from '../utils/auth';
import { useUserProfile, formatProfileData } from '../hooks/useUserProfile';
import { getTimeAgo } from '../utils/time';

type ProfileProps = {
  compact?: boolean;
  setIsLoggedIn?: (val: boolean) => void;
  user?: string;
  graduationEligible?: 'Yes' | 'No' | string;
};

export default function Profile({ compact = false, setIsLoggedIn, graduationEligible }: ProfileProps) {
  const { profile, loading, error, refetch, lastUpdated } = useUserProfile();
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    const confirmed = window.confirm('Are you sure you want to log out?');
    if (confirmed) {
      setLoggingOut(true);
      try {
        await logout();
      } catch (err) {
        console.error('Logout error:', err);
      } finally {
        localStorage.clear();
        sessionStorage.clear();
        setIsLoggedIn?.(false);
        navigate('/login', { replace: true });
      }
    }
  };

  const toTitleCase = (str: string) => {
    if (!str) return '';
    return str
      .split(' ')
      .map(word => {
        if (word === '') return '';
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(' ');
  };

  if (loading) return <div className="text-white p-4">Loading profile...</div>;
  if (error || !profile) {
    return (
      <div className="text-red-400 p-4">
        Failed to load profile. Please refresh or log in again.
      </div>
    );
  }

  const formattedProfile = formatProfileData(profile);
  const formattedName = toTitleCase(formattedProfile.name || '');
  
  const userRole = profile?.role?.toString().trim().toLowerCase() || '';
  const isFaculty = userRole.includes('faculty') || userRole.includes('staff') || userRole === 'faculty_advisor';
  const isEventOrganizer = userRole.includes('event') || userRole === 'event_organizer';
  const isAdmin = userRole === 'admin';

  const rawOrganization = (formattedProfile as any).organization || '';
  const formattedOrganization = toTitleCase(rawOrganization);

  return (
    /* Global Fix: Large profile cards are no longer blindly hidden; they style neatly on mobile! */
    <header className="relative w-full overflow-hidden">
      {/* Main Adaptive Layout Wrapper Frame */}
      <div
        className={`relative flex flex-col sm:flex-row items-center sm:items-start justify-between px-6 sm:px-8 py-6 text-white
            bg-gradient-to-b from-[#241515] to-[#141a2e] border-b-[2px] border-[rgba(38,134,255,0.4)] gap-6
            ${compact ? 'max-w-full' : 'min-h-[140px] sm:min-h-[180px]'}`}
      >
        {/* Triangle background accent clip */}
        <div className="absolute bottom-[-3px] left-[-2px] hidden sm:block">
          <div
            className={`${compact ? 'w-36 h-9' : 'w-48 h-9'} bg-[rgba(38,134,255,0.4)]`}
            style={{ clipPath: 'polygon(0 100%, 0 0, 100% 100%)' }}
          >
            <div
              className={`${compact ? 'w-34 h-9' : 'w-46 h-9'} bg-black`}
              style={{ clipPath: 'polygon(0 100%, 0 0, 100% 100%)' }}
            />
          </div>
        </div>

        {/* Left Section: Avatar & User Metadata */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 z-10 text-center sm:text-left w-full sm:w-auto">
          <figure className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(0,132,255,0.5)] flex items-center justify-center overflow-hidden flex-shrink-0">
            <img src={userIcon} alt="User" className="w-full h-full object-contain" />
          </figure>

          {compact ? (
            <section className="text-[1.1rem] leading-relaxed tracking-wide">
              <span className="font-bold bg-gradient-to-r from-[#E2453D] via-[#916296] to-[#557FDF] bg-clip-text text-transparent">
                {formattedName}
              </span>
              <br />
              {formattedProfile.rollNo && formattedProfile.rollNo !== 'N/A' && (
                <span className="text-gray-300 text-sm">
                  {formattedProfile.rollNo.toUpperCase()}
                </span>
              )}
            </section>
          ) : (
            <section className="flex flex-col items-center sm:items-start max-w-full overflow-hidden">
              <h1 className="text-xl sm:text-2xl font-bold mt-1 mb-2 leading-snug bg-gradient-to-r from-[#E2453D] via-[#916296] to-[#557FDF] bg-clip-text text-transparent tracking-wide break-words text-center sm:text-left max-w-full pl-10 sm:pl-0">
                Welcome, {formattedName}
              </h1>
              
              <dl className="space-y-1 text-sm text-gray-300">
                {formattedProfile.department && (
                  <div className="flex flex-wrap justify-center sm:justify-start gap-1">
                    <span className="font-bold text-white">Department:</span>
                    <span className="uppercase">{formattedProfile.department.toUpperCase()}</span>
                  </div>
                )}
                
                {/* Roll Number Row (Students Only) */}
                {formattedProfile.rollNo && formattedProfile.rollNo !== 'N/A' && (
                  <div className="flex flex-wrap justify-center sm:justify-start gap-1">
                    <span className="font-bold text-white">Roll No:</span>
                    <span>{formattedProfile.rollNo.toUpperCase()}</span>
                  </div>
                )}

                {/* Faculty Advisor Row (Students Only) */}
                {formattedProfile.faAssigned && formattedProfile.faAssigned !== 'Not Assigned' && (
                  <div className="flex flex-wrap justify-center sm:justify-start gap-1">
                    <span className="font-bold text-white">FA Assigned:</span>
                    <span>{toTitleCase(formattedProfile.faAssigned)}</span>
                  </div>
                )}

                {/* ID Display Row — Automatically skips if user is Faculty, Event Organizer, or Admin */}
                {!isFaculty && !isEventOrganizer && !isAdmin && (formattedProfile as any).id && (formattedProfile as any).id !== 'N/A' && (
                  <div className="flex flex-wrap justify-center sm:justify-start gap-1">
                    <span className="font-bold text-white">ID:</span>
                    <span>{(formattedProfile as any).id}</span>
                  </div>
                )}

                {/* Organization Row (Event Organizers Only) */}
                {isEventOrganizer && formattedOrganization && formattedOrganization !== 'N/A' && (
                  <div className="flex flex-wrap justify-center sm:justify-start gap-1">
                    <span className="font-bold text-white">Organization:</span>
                    <span>{formattedOrganization}</span>
                  </div>
                )}
              </dl>
            </section>
          )}
        </div>

        {/* Right Section: Core Utility Action Triggers */}
        <div className="flex flex-col items-center sm:items-end gap-3 z-10 w-full sm:w-auto sm:pt-2">
          {/* Logout Action Button */}
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center gap-2 text-base sm:text-lg text-[#E2453D] hover:text-[#ff7369] font-semibold transition disabled:opacity-50 cursor-pointer bg-[#161b22]/30 sm:bg-transparent px-4 py-2 sm:p-0 rounded-xl border border-gray-800/40 sm:border-transparent"
          >
            <img
              src={userIcon}
              alt="logout icon"
              className="w-5 h-5 sm:w-6 sm:h-6 object-contain rounded-full bg-blue-400 shadow-[0_0_8px_rgba(0,132,255,0.5)]"
            />
            {loggingOut ? 'Logging out...' : 'Logout'}
          </button>

          {/* Graduation Badge System (Students Only) */}
          {!compact && graduationEligible && (
            <div className="flex items-center gap-3 bg-[#111622] border border-gray-800 bg-opacity-90 px-4 py-2 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.5)] mt-2">
              <span className="text-gray-300 text-xs sm:text-sm font-semibold tracking-wide">
                Graduation Status:
              </span>
              <span
                className={`font-black tracking-wider px-2.5 py-0.5 text-xs rounded uppercase ${
                  graduationEligible === 'Yes'
                    ? 'bg-[#1b4332] text-[#4ade80] border border-[#2d6a4f]/40'
                    : 'bg-[#641e1e] text-[#f87171] border border-[#9b2226]/40'
                }`}
              >
                {graduationEligible === 'Yes' ? 'Eligible' : 'Not Eligible'}
              </span>
            </div>
          )}

          {/* Profile Refresh and Last Updated */}
          {!compact && (
            <div className="flex items-center justify-center sm:justify-end gap-3 text-xs text-gray-300 mt-2">
              {lastUpdated && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/5 border border-gray-700">
                  Last updated {getTimeAgo(lastUpdated)}
                </span>
              )}
              <button
                onClick={() => refetch(true)}
                className="px-3 py-1 rounded bg-[#0d1117] border border-gray-700 hover:bg-[#15202b] transition"
              >
                Refresh profile
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}