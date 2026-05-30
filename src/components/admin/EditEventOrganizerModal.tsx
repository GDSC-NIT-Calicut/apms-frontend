import React, { useState } from 'react';
import { editEventOrganizerDetails } from '../../utils/admin';

type EditEventOrganizerModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export default function EditEventOrganizerModal({ isOpen, onClose, onSuccess }: EditEventOrganizerModalProps) {
  const [formData, setFormData] = useState({
    email: '',
    organizer_name: '',
    organization_name: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const submitData: any = { email: formData.email };
      if (formData.organizer_name) submitData.organizer_name = formData.organizer_name;
      if (formData.organization_name) submitData.organization_name = formData.organization_name;

      await editEventOrganizerDetails(submitData);
      setSuccess('Event organizer updated successfully!');
      setFormData({ email: '', organizer_name: '', organization_name: '' });
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to update event organizer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#161b22] border border-gray-800 rounded-2xl w-full max-w-md p-6 text-white shadow-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-1 text-white">Edit Event Organizer</h2>
        <p className="text-gray-400 text-sm mb-6">Update event organizer information (email required)</p>

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
            <label className="block text-gray-400 font-semibold text-xs mb-1">Email * (required to identify organizer)</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="organizer@nitc.ac.in"
              className="w-full bg-[#0d1117] border border-gray-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-400 font-semibold text-xs mb-1">Organizer Name (optional)</label>
            <input
              type="text"
              name="organizer_name"
              value={formData.organizer_name}
              onChange={handleChange}
              placeholder="Leave blank to keep existing"
              className="w-full bg-[#0d1117] border border-gray-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-gray-400 font-semibold text-xs mb-1">Organization Name (optional)</label>
            <input
              type="text"
              name="organization_name"
              value={formData.organization_name}
              onChange={handleChange}
              placeholder="Leave blank to keep existing"
              className="w-full bg-[#0d1117] border border-gray-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
            />
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
              className="flex-1 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-xs font-bold rounded-xl uppercase tracking-wider transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
