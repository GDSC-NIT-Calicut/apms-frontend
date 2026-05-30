import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitStudentActivity } from '../utils/student';

export default function SubmitActivity() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    category: 'institute_level', // Default value safely matching point_category_enum
    points: '',
    file: null as File | null,
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    setFormData((prev) => ({ ...prev, file: files?.[0] || null }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Validation checks
    if (!formData.title || !formData.date || !formData.category || !formData.points || !formData.file) {
      setErrorMessage('Please fill in all fields and upload a valid PDF document.');
      return;
    }

    const pointsNumber = parseInt(formData.points, 10);
    if (isNaN(pointsNumber) || pointsNumber <= 0) {
      setErrorMessage('Points must be a positive number.');
      return;
    }

    try {
      setLoading(true);
      await submitStudentActivity({
        event_name: formData.title,
        event_date: formData.date,
        event_type: formData.category,
        points: pointsNumber,
        proof: formData.file,
      });

      setSuccessMessage('Activity request submitted successfully!');
      // Delay navigation slightly so user sees the success state banner
      setTimeout(() => {
        navigate('/pending-requests');
      }, 1500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit the request. A duplicate pending/approved entry might exist.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0d1117] text-white">
      <main className="flex-1 flex flex-col justify-center items-center px-4 py-8 sm:py-12">
        
        {/* Form Container Wrapper Card */}
        <section className="w-full max-w-lg bg-[#161b22] bg-opacity-40 border border-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl transition-all">
          
          <h2 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-[#E2453D] to-[#557FDF] text-transparent bg-clip-text mb-6 sm:mb-8 text-center tracking-tight">
            Submit Activity Request
          </h2>

          {/* User Feedback Alert Bars */}
          {errorMessage && (
            <div className="mb-5 bg-red-950/40 border border-red-900/50 text-red-400 p-3.5 rounded-xl text-sm font-medium">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="mb-5 bg-green-950/40 border border-green-900/50 text-green-400 p-3.5 rounded-xl text-sm font-medium">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Title / Event Name Input */}
            <div className="flex flex-col">
              <label htmlFor="title" className="text-sm font-semibold text-gray-300 mb-1.5">
                Activity Title / Event Name
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                placeholder="e.g. Hackathon, Workshop..."
                value={formData.title}
                className="w-full p-3 bg-[#0d1117] border border-gray-800 rounded-xl focus:border-blue-500 focus:outline-none transition font-medium placeholder-gray-600 text-sm"
                onChange={handleChange}
              />
            </div>

            {/* Responsive Split row: Date and Points Counter */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label htmlFor="date" className="text-sm font-semibold text-gray-300 mb-1.5">
                  Event Date
                </label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  required
                  value={formData.date}
                  className="w-full p-3 bg-[#0d1117] border border-gray-800 rounded-xl focus:border-blue-500 focus:outline-none transition text-sm text-gray-300"
                  onChange={handleChange}
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="points" className="text-sm font-semibold text-gray-300 mb-1.5">
                  Points Claimed
                </label>
                <input
                  id="points"
                  name="points"
                  type="number"
                  min="1"
                  required
                  placeholder="e.g. 10"
                  value={formData.points}
                  className="w-full p-3 bg-[#0d1117] border border-gray-800 rounded-xl focus:border-blue-500 focus:outline-none transition font-medium placeholder-gray-600 text-sm"
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Category Option Select Picker dropdown */}
            <div className="flex flex-col">
              <label htmlFor="category" className="text-sm font-semibold text-gray-300 mb-1.5">
                Activity Type Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                className="w-full p-3 bg-[#0d1117] border border-gray-800 rounded-xl focus:border-blue-500 focus:outline-none transition text-sm font-medium text-gray-300 cursor-pointer"
                onChange={handleChange}
              >
                <option value="institute_level">Institute Level Activities</option>
                <option value="department_level">Department Level Activities</option>
                <option value="fa_assigned">FA Assigned Activities</option>
              </select>
            </div>

            {/* File Upload Zone */}
            <div className="flex flex-col pt-2">
              <label className="text-sm font-semibold text-gray-300 mb-2">
                Proof Document Verification
              </label>

              <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#0d1117] border border-dashed border-gray-800 p-4 rounded-xl">
                <input
                  id="file"
                  name="file"
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={handleFileChange}
                />
                
                <label
                  htmlFor="file"
                  className="px-5 py-2.5 bg-[#161b22] hover:bg-gray-800 text-xs text-gray-200 font-bold rounded-lg cursor-pointer border border-gray-700 transition active:scale-[0.98] shadow-sm select-none whitespace-nowrap"
                >
                  Choose PDF File
                </label>

                <div className="text-center sm:text-left min-w-0 flex-1">
                  {formData.file ? (
                    <p className="text-xs text-green-400 font-mono truncate font-semibold">
                      {formData.file.name}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-500 font-medium">
                      No document selected (PDF max 10MB)
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Submission button wrapper */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full text-center rounded-xl py-3.5 text-white font-bold transition-all bg-gradient-to-r from-[#E2453D] to-[#557FDF] hover:opacity-95 active:scale-[0.99] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm tracking-wide uppercase"
              >
                {loading ? 'Submitting Request...' : 'Submit to Advisor'}
              </button>
            </div>

          </form>
        </section>
      </main>
    </div>
  );
}