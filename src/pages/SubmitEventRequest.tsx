import React, { useState, useRef } from 'react'; // 🌟 Added useRef
import { allocatePointsBulk } from '../utils/eventOrganizer';

export default function SubmitEventRequest() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // 🌟 1. Create a reference to target the hidden file input element
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    date: '',
    category: '',
    file: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, files } = target;
    
    if (name === 'file') {
      setFormData(prev => ({ ...prev, file: files?.[0] || null }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // 🌟 Helper to cleanly reset everything including the native DOM input
  const handleClearForm = () => {
    setFormData({ title: '', date: '', category: '', file: null });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.title.trim() || !formData.date || !formData.category || !formData.file) {
      setError('Please fill in all details and upload an attendee criteria CSV template file.');
      return;
    }

    try {
      setLoading(true);
      const responseData = await allocatePointsBulk({
        event_name: formData.title.trim(),
        event_date: formData.date,
        event_type: formData.category,
        file: formData.file,
      });

      setSuccess(`Successfully allocated points to ${responseData.students_allocated || 0} students!`);
      
      // 🌟 2. Use our clear utility upon successful completion
      handleClearForm();
      
      setTimeout(() => setSuccess(null), 4000);
    } catch (err: any) {
      console.error('Submit points allocation failed:', err);
      setError(err.message || 'Failed to submit event metrics allocation file.');
      
      // 🌟 3. Clear file DOM path tracking on error so they can try re-uploading the fixed file immediately
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="pt-14 md:pt-0 p-5 sm:p-10 text-white max-w-3xl mx-auto w-full">
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-6 bg-gradient-to-r from-[#E2453D] via-[#916296] to-[#557FDF] bg-clip-text text-transparent tracking-tight">
        Submit Requests
      </h1>

      {error && <div className="bg-red-950/40 border border-red-900/50 text-red-400 px-4 py-3 rounded-xl text-sm font-medium mb-5">{error}</div>}
      {success && <div className="bg-green-950/40 border border-green-900/50 text-green-400 px-4 py-3 rounded-xl text-sm font-medium mb-5">{success}</div>}

      <div className="bg-[#161b22]/40 border border-gray-800 rounded-2xl p-5 sm:p-8 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-300 font-semibold mb-1.5 text-sm">Event Description / Name</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Tathva Machine Learning Workshop"
              className="w-full bg-[#0d1117] text-white px-4 py-3 rounded-xl border border-gray-800 focus:outline-none focus:border-blue-500 transition-all placeholder-gray-700 text-sm font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 font-semibold mb-1.5 text-sm">Event Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                style={{ colorScheme: 'dark' }}
                className="w-full bg-[#0d1117] text-white px-4 py-3 rounded-xl border border-gray-800 focus:outline-none focus:border-blue-500 transition-all text-sm font-medium cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-gray-300 font-semibold mb-1.5 text-sm">Activity Point Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-[#0d1117] text-white px-4 py-3 rounded-xl border border-gray-800 focus:outline-none focus:border-blue-500 transition-all text-sm font-medium cursor-pointer h-[46px]"
              >
                <option value="" disabled>Select distribution track...</option>
                <option value="institute_level">Institute Level Points</option>
                <option value="department_level">Department Level Points</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-300 font-semibold mb-2 text-sm">Student Attendee Ledger List (.CSV)</label>
            <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-[#0d1117] border border-gray-800 rounded-xl">
              <input
                id="csv_file_input"
                name="file"
                type="file"
                accept=".csv"
                ref={fileInputRef} // 🌟 4. Bound the ref tracking node here
                className="hidden"
                onChange={handleChange}
              />
              <label
                htmlFor="csv_file_input"
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-xs text-white font-bold rounded-xl uppercase tracking-wider cursor-pointer transition-colors whitespace-nowrap"
              >
                Choose CSV File
              </label>
              
              <div className="text-xs text-gray-400 font-medium truncate max-w-full">
                {formData.file ? (
                  <span className="font-mono font-bold text-green-400">{formData.file.name}</span>
                ) : (
                  <span>No file selected (Must contain headers: <code>roll_number</code>, <code>points</code>)</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-3 flex-col sm:flex-row">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 order-1 sm:order-2 py-3.5 bg-gradient-to-r from-[#E2453D] to-[#557FDF] hover:opacity-95 disabled:opacity-50 text-white font-bold rounded-xl shadow-md transition-all uppercase text-xs tracking-wider cursor-pointer"
            >
              {loading ? 'Processing File...' : 'Submit Records'}
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={handleClearForm} // 🌟 5. Point directly to our full reset implementation
              className="flex-1 order-2 sm:order-1 py-3.5 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 text-gray-300 font-bold rounded-xl border border-gray-700/60 transition-all uppercase text-xs tracking-wider cursor-pointer"
            >
              Clear Form
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}