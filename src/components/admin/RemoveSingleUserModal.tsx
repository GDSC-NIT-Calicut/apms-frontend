import React, { useState } from 'react';
import { removeSingleUser } from '../../utils/admin';

type RemoveSingleUserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export default function RemoveSingleUserModal({ isOpen, onClose, onSuccess }: RemoveSingleUserModalProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const validateEmail = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return 'Please enter an email address';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return 'Please enter a valid email address';
    if (!trimmed.toLowerCase().endsWith('@nit.ac.in')) return 'Only nit.ac.in email addresses are allowed';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const validationError = validateEmail(email);
    if (validationError) {
      setError(validationError);
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to remove ${email.trim()}? This action cannot be undone.`
    );
    if (!confirmed) return;

    setLoading(true);
    try {
      await removeSingleUser(email.trim());
      setSuccess('User removed successfully!');
      setEmail('');
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to remove user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#161b22] border border-gray-800 rounded-2xl w-full max-w-md p-6 text-white shadow-2xl">
        <h2 className="text-2xl font-bold mb-1 text-white">🧾 Remove Single User</h2>
        <p className="text-gray-400 text-sm mb-6">Enter the email of the NITC user you want to remove.</p>

        {error && (
          <div className="bg-red-950/40 border border-red-900/50 text-red-400 p-3 rounded-xl text-xs font-medium mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-950/40 border border-green-900/50 text-green-400 p-3 rounded-xl text-xs font-medium mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 font-semibold text-xs mb-1">User Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@nit.ac.in"
              className="w-full bg-[#0d1117] border border-gray-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
              required
            />
          </div>

          <div className="bg-[#0d1117] border border-gray-800 rounded-xl p-4">
            <p className="text-xs font-semibold text-gray-400 mb-2">Important</p>
            <p className="text-xs text-gray-500">
              Only <span className="font-semibold">nit.ac.in</span> email addresses may be removed here. Super admin and dummy faculty cannot be deleted.
            </p>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-800">
            <button
              type="button"
              disabled={loading}
              onClick={onClose}
              className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 text-xs font-bold rounded-xl uppercase tracking-wider transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-xs font-bold rounded-xl uppercase tracking-wider transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {loading ? 'Removing...' : 'Remove User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
