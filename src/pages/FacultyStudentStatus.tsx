import { useState, useEffect } from 'react';
import Profile from '../components/Profile';
import Sidebar from '../components/Sidebar';

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

export default function FacultyStudentStatus({ setIsLoggedIn }: FacultyStudentStatusProps) {
  const [students, setStudents] = useState<StudentStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStudentStatus();
  }, []);

  const fetchStudentStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/faculty/students/status', { method: 'GET', credentials: 'include' });
      const rawTextData = await response.text();

      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      if (!rawTextData.trim()) { setStudents([]); return; }

      const data = JSON.parse(rawTextData);
      setStudents(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Failed to fetch student status:', err);
      setError(err.message || 'Failed to load student status matrix.');
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const toTitleCase = (str: string) => {
    if (!str) return '';
    return str.split(' ').map(w => w ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : '').join(' ');
  };

  // Helper method to resolve truthy booleans or string configurations safely
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
    <div className="flex flex-col min-h-screen bg-[#0d1117]">
      <header className="w-full overflow-hidden">
        <Profile setIsLoggedIn={setIsLoggedIn} user="Faculty" />
      </header>

      <div className="flex flex-col md:flex-row flex-grow w-full">
        <Sidebar />

        <main className="flex-grow p-4 sm:p-6 lg:p-10 flex flex-col min-w-0 text-white max-w-6xl mx-auto w-full">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-6 bg-gradient-to-r from-[#E2453D] via-[#916296] to-[#557FDF] bg-clip-text text-transparent tracking-tight">
            View Student Status
          </h1>

          {error && students.length === 0 && (
            <div className="bg-red-950/40 border border-red-900/50 text-red-400 px-4 py-3 rounded-xl mb-5 text-sm">
              {error}
            </div>
          )}

          {students.length === 0 ? (
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
                    {students.map((student, idx) => {
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
                {students.map((student, idx) => {
                  const isEligible = checkEligibility(student.graduation_eligible);
                  return (
                    <div key={idx} className="bg-[#161b22]/40 border border-gray-800 rounded-2xl p-5 shadow-lg space-y-4">
                      {/* Name & Normalized Absolute Eligibility Matching */}
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

                      {/* Explicit Metric Grid Layout WITHOUT extra text modifications or unique color scheme overrides */}
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
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}