import { useState } from 'react';
import Profile from '../components/Profile';
import Sidebar from '../components/Sidebar';

type FacultyAssignPointsProps = {
  setIsLoggedIn: (val: boolean) => void;
};

export default function FacultyAssignPoints({ setIsLoggedIn }: FacultyAssignPointsProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    roll_number: '',
    event_name: '',
    event_date: '',
    points: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.roll_number.trim() || !formData.event_name.trim() || !formData.event_date.trim() || !formData.points) {
      setError('Please fill in all layout fields accurately.');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/faculty/assign', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roll_number: formData.roll_number.trim().toUpperCase(),
          event_name: formData.event_name.trim(),
          event_date: formData.event_date.trim(),
          points: Number(formData.points),
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to complete transaction allocation.');
      }

      setSuccess('Points assigned successfully!');
      setFormData({ roll_number: '', event_name: '', event_date: '', points: '' });
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to assign points');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0d1117]">
      <header className="w-full overflow-hidden">
        <Profile setIsLoggedIn={setIsLoggedIn} user="Faculty" />
      </header>

      <div className="flex flex-col md:flex-row flex-grow w-full">
        <Sidebar />

        <main className="flex-grow p-5 sm:p-10 text-white max-w-3xl mx-auto w-full">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-6 bg-gradient-to-r from-[#E2453D] via-[#916296] to-[#557FDF] bg-clip-text text-transparent tracking-tight">
            Assign Points
          </h1>

          {error && <div className="bg-red-950/40 border border-red-900/50 text-red-400 px-4 py-3 rounded-xl text-sm font-medium mb-5">{error}</div>}
          {success && <div className="bg-green-950/40 border border-green-900/50 text-green-400 px-4 py-3 rounded-xl text-sm font-medium mb-5">{success}</div>}

          <div className="bg-[#161b22]/40 border border-gray-800 rounded-2xl p-5 sm:p-8 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-gray-300 font-semibold mb-1.5 text-sm">Student Roll Number</label>
                <input
                  type="text"
                  name="roll_number"
                  value={formData.roll_number}
                  onChange={handleInputChange}
                  placeholder="e.g., B230658CS"
                  className="w-full bg-[#0d1117] text-white px-4 py-3 rounded-xl border border-gray-800 focus:outline-none focus:border-blue-500 transition-all uppercase placeholder-gray-700 text-sm font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1.5 text-sm">Event Date</label>
                  <input
                    type="date"
                    name="event_date"
                    value={formData.event_date}
                    onChange={handleInputChange}
                    // CRITICAL UPDATE: Forced dark-scheme styling tells browser engines to use native white iconography
                    style={{ colorScheme: 'dark' }}
                    className="w-full bg-[#0d1117] text-white px-4 py-3 rounded-xl border border-gray-800 focus:outline-none focus:border-blue-500 transition-all text-sm font-medium cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-1.5 text-sm">Points Awarded</label>
                  <input
                    type="number"
                    name="points"
                    value={formData.points}
                    onChange={handleInputChange}
                    placeholder="e.g., 15"
                    min="1"
                    className="w-full bg-[#0d1117] text-white px-4 py-3 rounded-xl border border-gray-800 focus:outline-none focus:border-blue-500 transition-all placeholder-gray-700 text-sm font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1.5 text-sm">Event Description / Name</label>
                <input
                  type="text"
                  name="event_name"
                  value={formData.event_name}
                  onChange={handleInputChange}
                  placeholder="e.g., Tathva Workshop Coordinator"
                  className="w-full bg-[#0d1117] text-white px-4 py-3 rounded-xl border border-gray-800 focus:outline-none focus:border-blue-500 transition-all placeholder-gray-700 text-sm font-medium"
                />
              </div>

              <div className="flex gap-4 pt-3 flex-col sm:flex-row">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 order-1 sm:order-2 py-3.5 bg-gradient-to-r from-[#E2453D] to-[#557FDF] hover:opacity-95 disabled:opacity-50 text-white font-bold rounded-xl shadow-md transition-all uppercase text-xs tracking-wider cursor-pointer"
                >
                  {loading ? 'Assigning...' : 'Assign Points'}
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ roll_number: '', event_name: '', event_date: '', points: '' })}
                  className="flex-1 order-2 sm:order-1 py-3.5 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold rounded-xl border border-gray-700/60 transition-all uppercase text-xs tracking-wider cursor-pointer"
                >
                  Clear Form
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}