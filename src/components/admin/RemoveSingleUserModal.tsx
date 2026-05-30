import { useState } from 'react';
import { removeSingleUser } from '../../utils/admin'; // Double-check this relative path points to your admin.ts utility

type RemoveSingleUserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export default function RemoveSingleUserModal({ isOpen, onClose, onSuccess }: RemoveSingleUserModalProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      setLoading(true);
      setError(null);

      // 🌟 FIX: Instead of raw fetch(), call your clean apiFetch utility function
      await removeSingleUser(email.trim());

      alert('User removed cleanly and successfully!');
      setEmail('');
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred while deleting user.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 text-white">
        <div>
          <h2 className="text-xl font-black bg-gradient-to-r from-[#E2453D] to-[#557FDF] bg-clip-text text-transparent">
            Remove Single User Account
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Deleting a Faculty Advisor automatically maps their students to the backup department Dummy FA profile.
          </p>
        </div>

        {error && (
          <div className="bg-red-950/40 border border-red-900/50 text-red-400 p-3 rounded-xl text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 font-bold text-xs mb-1.5 uppercase tracking-wider">
              User Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@nitc.ac.in"
              required
              className="w-full bg-[#0d1117] text-white px-4 py-3 rounded-xl border border-gray-800 focus:outline-none focus:border-blue-500 transition-all text-sm font-medium"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold rounded-xl border border-gray-700/60 transition-all uppercase tracking-wider cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all uppercase tracking-wider cursor-pointer"
            >
              {loading ? 'Removing...' : 'Delete User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}