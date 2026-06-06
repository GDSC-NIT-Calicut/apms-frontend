import { useState, useEffect } from 'react';
import { getCachedData, getCacheTTL, setCacheData } from '../utils/cache';
import useClientPagination from '../hooks/useClientPagination';
import { getTimeAgo } from '../utils/time';

type StudentStatus = {
  student_name: string;
  roll_number: string;
  total_points: number;
  institute_level_points: number;
  department_level_points: number;
  fa_assigned_points: number;
  graduation_eligible: boolean | string;
};

type FacultyStudentStatusProps = {
  setIsLoggedIn: (val: boolean) => void;
};

const FACULTY_STATUS_CACHE_KEY = 'faculty_student_status_cache';
const FACULTY_CACHE_TTL_ENV = 'VITE_OTHER_ROLES_CACHE_ACTIVE_TIME';
const DEFAULT_CACHE_TTL_MINUTES = 10;

export default function FacultyStudentStatus({ /*setIsLoggedIn*/ }: FacultyStudentStatusProps) {
  const [studentsRaw, setStudentsRaw] = useState<StudentStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [fromCache, setFromCache] = useState(false);

  useEffect(() => {
    fetchStudentStatus();
  }, []);

  const { items, loadMore, hasMore } = useClientPagination<StudentStatus>(studentsRaw, 15);

  const fetchStudentStatus = async (bypass = false) => {
    try {
      setLoading(true);
      setError(null);

      if (!bypass) {
        const cachedData = getCachedData<StudentStatus[]>(FACULTY_STATUS_CACHE_KEY);
        if (cachedData && cachedData.length) {
          const rawCache = sessionStorage.getItem(FACULTY_STATUS_CACHE_KEY);
          const cacheEntry = rawCache ? JSON.parse(rawCache) : null;
          setStudentsRaw(cachedData);
          setLastUpdated(cacheEntry?.timestamp || Date.now());
          setFromCache(true);
          setLoading(false);
          return;
        }
      }

      const response = await fetch('/api/faculty/students/status', { method: 'GET', credentials: 'include' });
      const rawTextData = await response.text();

      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      if (!rawTextData.trim()) {
        setStudentsRaw([]);
        setLastUpdated(Date.now());
        setFromCache(false);
        return;
      }

      const data = JSON.parse(rawTextData);
      const list = Array.isArray(data) ? data : [];
      setStudentsRaw(list);

      const cacheTTL = getCacheTTL(FACULTY_CACHE_TTL_ENV, DEFAULT_CACHE_TTL_MINUTES);
      setCacheData(FACULTY_STATUS_CACHE_KEY, list, cacheTTL);
      setLastUpdated(Date.now());
      setFromCache(false);
    } catch (err: any) {
      console.error('Failed to fetch student status:', err);
      setError(err.message || 'Failed to load student status matrix.');
      setStudentsRaw([]);
    } finally {
      setLoading(false);
    }
  };

  const toTitleCase = (str: string) => {
    if (!str) return '';
    return str.split(' ').map(w => w ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : '').join(' ');
  };

  const checkEligibility = (status: boolean | string): boolean => {
    if (typeof status === 'boolean') return status;
    if (typeof status === 'string') {
      const cleanStr = status.trim().toLowerCase();
      return cleanStr === 'yes' || cleanStr === 'true';
    }
    return false;
  };

  if (loading) return <div className="text-white bg-[#0d1117] min-h-screen flex items-center justify-center font-mono text-sm">Loading tracking roster...</div>;

  return (
    <div className="w-full min-h-screen bg-[#0d1117]">
      {/* Centered clean workspace container mapping into the global wrapper shell layout */}
      <main className="flex-grow p-4 sm:p-6 lg:p-10 flex flex-col min-w-0 text-white max-w-6xl mx-auto w-full">
        <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-[#E2453D] via-[#916296] to-[#557FDF] bg-clip-text text-transparent tracking-tight">
              View Student Status
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-300 mt-2">
              {lastUpdated && (
                <span className="inline-flex items-center gap-2 rounded-full border border-gray-700 bg-white/5 px-3 py-2">
                  Last updated {getTimeAgo(lastUpdated)}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => fetchStudentStatus(true)}
            className="rounded-lg border border-gray-700 bg-[#111827] px-4 py-2 text-white transition hover:bg-[#1f2937]"
          >
            Refresh
          </button>
        </div>

        {error && studentsRaw.length === 0 && (
          <div className="bg-red-950/40 border border-red-900/50 text-red-400 px-4 py-3 rounded-xl mb-5 text-sm">
            {error}
          </div>
        )}

        {studentsRaw.length === 0 ? (
          <div className="text-center text-gray-500 py-16 bg-[#161b22]/30 border border-gray-800 rounded-2xl">
            <p className="text-base sm:text-lg">No students are currently mapped to your advisor profile records.</p>
          </div>
        ) : (
          <div className="w-full">
            {/* 1. DESKTOP ROW VIEW LAYOUT TABLE */}
            <div className="hidden lg:block bg-[#161b22]/20 border border-gray-800 rounded-2xl overflow-hidden shadow-xl p-4">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-800 text-gray-500 font-mono text-xs uppercase tracking-wider">
                    <th className="px-5 py-4 text-left font-bold">Student Name</th>
                    <th className="px-5 py-4 text-left font-bold">Roll Number</th>
                    <th className="px-5 py-4 text-center font-bold">Total</th>
                    <th className="px-5 py-4 text-center font-bold">Inst. Level</th>
                    <th className="px-5 py-4 text-center font-bold">Dept. Level</th>
                    <th className="px-5 py-4 text-center font-bold">FA Assigned</th>
                    <th className="px-5 py-4 text-center font-bold">Grad Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-900/40 text-sm font-medium">
                  {items.map((student, idx) => {
                    const isEligible = checkEligibility(student.graduation_eligible);
                    return (
                      <tr key={idx} className="hover:bg-gray-800/20 transition-colors">
                        <td className="px-5 py-4 text-gray-100 whitespace-nowrap">{toTitleCase(student.student_name)}</td>
                        <td className="px-5 py-4 text-gray-400 font-mono uppercase tracking-wide">{student.roll_number}</td>
                        <td className="px-5 py-4 text-center text-white font-bold">{student.total_points}</td>
                        <td className="px-5 py-4 text-center text-gray-300 font-mono">{student.institute_level_points}</td>
                        <td className="px-5 py-4 text-center text-gray-300 font-mono">{student.department_level_points}</td>
                        <td className="px-5 py-4 text-center text-gray-300 font-mono">{student.fa_assigned_points}</td>
                        <td className="px-5 py-4 text-center whitespace-nowrap">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                              isEligible
                                ? 'bg-green-950/60 text-green-400 border border-green-900/40'
                                : 'bg-red-950/60 text-red-400 border border-red-900/40'
                            }`}
                          >
                            {isEligible ? 'Eligible' : 'Ineligible'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* 2. MOBILE CARD GRID DECK VIEW (Exact Match Data Mapping) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden w-full">
              {items.map((student, idx) => {
                const isEligible = checkEligibility(student.graduation_eligible);
                return (
                  <div key={idx} className="bg-[#161b22]/40 border border-gray-800 rounded-2xl p-5 shadow-lg space-y-4">
                    <div className="flex justify-between items-start border-b border-gray-800 pb-2.5">
                      <div>
                        <h3 className="text-base font-black tracking-wide text-gray-100">{toTitleCase(student.student_name)}</h3>
                        <p className="text-xs text-gray-500 font-mono mt-0.5 uppercase">{student.roll_number?.toUpperCase()}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                          isEligible
                            ? 'bg-green-950/60 text-green-400 border border-green-900/40'
                            : 'bg-red-950/60 text-red-400 border border-red-900/40'
                        }`}
                      >
                        {isEligible ? 'Eligible' : 'Ineligible'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs font-medium">
                      <div className="bg-[#0d1117] p-2.5 border border-gray-800 rounded-xl">
                        <span className="text-gray-500 font-bold block uppercase tracking-wider text-[9px] mb-0.5">Total Points</span>
                        <span className="text-white text-sm font-bold font-mono">{student.total_points}</span>
                      </div>
                      <div className="bg-[#0d1117] p-2.5 border border-gray-800 rounded-xl">
                        <span className="text-gray-500 font-bold block uppercase tracking-wider text-[9px] mb-0.5">FA Assigned</span>
                        <span className="text-white text-sm font-bold font-mono">{student.fa_assigned_points}</span>
                      </div>
                      <div className="bg-[#0d1117] p-2.5 border border-gray-800 rounded-xl">
                        <span className="text-gray-500 font-bold block uppercase tracking-wider text-[9px] mb-0.5">Inst. Level</span>
                        <span className="text-white text-sm font-bold font-mono">{student.institute_level_points}</span>
                      </div>
                      <div className="bg-[#0d1117] p-2.5 border border-gray-800 rounded-xl">
                        <span className="text-gray-500 font-bold block uppercase tracking-wider text-[9px] mb-0.5">Dept. Level</span>
                        <span className="text-white text-sm font-bold font-mono">{student.department_level_points}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
              {hasMore && (
                <div className="w-full flex justify-center mt-6 col-span-full">
                  <button onClick={loadMore} className="px-4 py-2 bg-blue-600 rounded text-white">Load more</button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}