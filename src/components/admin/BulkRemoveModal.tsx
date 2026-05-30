import React, { useState } from 'react';
import { bulkRemoveUsers } from '../../utils/admin';

type BulkRemoveModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export default function BulkRemoveModal({ isOpen, onClose, onSuccess }: BulkRemoveModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      setError(null);
    } else {
      setError('Please select a valid CSV file');
      setFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!file) {
      setError('Please select a CSV file');
      return;
    }

    const confirmed = window.confirm(
      'Are you sure you want to remove these users? This action cannot be undone. Students assigned to these faculty will be reassigned to dummy faculty.'
    );

    if (!confirmed) return;

    setLoading(true);
    try {
      await bulkRemoveUsers(file);
      setSuccess('Users removed successfully!');
      setFile(null);
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to remove users');
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    const csv = 'email\nuser@nitc.ac.in';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'remove_users_template.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#161b22] border border-gray-800 rounded-2xl w-full max-w-md p-6 text-white shadow-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-1 text-white">🗑️ Bulk Remove Users</h2>
        <p className="text-gray-400 text-sm mb-6">Remove multiple users from any role</p>

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
          {/* CSV Instructions */}
          <div className="bg-[#0d1117] border border-gray-800 rounded-xl p-4">
            <p className="text-xs font-semibold text-gray-400 mb-2">Required CSV Column:</p>
            <div className="flex gap-1 mb-3">
              <span className="px-2 py-1 bg-gray-800 rounded text-xs text-blue-400">email</span>
            </div>
            <p className="text-xs text-gray-500">
              ⚠️ Warning: Cannot remove super admin or dummy faculty. Students reassigned to dummy faculty will keep their progress.
            </p>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-gray-400 font-semibold text-xs mb-1">Select CSV File *</label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              id="bulk_remove_csv"
              className="hidden"
            />
            <label
              htmlFor="bulk_remove_csv"
              className="w-full flex items-center justify-between p-3 bg-[#0d1117] border border-gray-800 rounded-xl cursor-pointer hover:border-red-500/50"
            >
              <span className="text-xs text-gray-400">
                {file ? file.name : 'Click to select CSV file'}
              </span>
              <span className="text-xs px-3 py-1 bg-red-800 hover:bg-red-700 text-red-400 rounded font-semibold">
                Browse
              </span>
            </label>
          </div>

          {/* Download Template Button */}
          <button
            type="button"
            onClick={downloadTemplate}
            className="w-full py-2 px-4 bg-gray-800 hover:bg-gray-700 text-xs font-bold rounded-xl uppercase tracking-wider transition-colors"
          >
            📥 Download CSV Template
          </button>

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
              disabled={loading || !file}
              className="flex-1 py-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-xs font-bold rounded-xl uppercase tracking-wider transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {loading ? 'Removing...' : 'Remove'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
