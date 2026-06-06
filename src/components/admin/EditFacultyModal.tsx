import React, { useState } from 'react';
import type { EditFacultyPayload } from '../../utils/admin';
import { editFacultyDetails } from '../../utils/admin';

type EditFacultyModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

const DEPARTMENTS = ['cs', 'ec', 'me', 'ee'];

export default function EditFacultyModal({ isOpen, onClose, onSuccess }: EditFacultyModalProps) {
  const [formData, setFormData] = useState({
    email: '',
    fa_name: '',
    department: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<any>(null);
  const [pendingPayload, setPendingPayload] = useState<EditFacultyPayload | null>(null);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
    setWarning(null);
    setConfirmation(null);
    setLoading(true);

    try {
      const submitData: any = { email: formData.email };
      if (formData.fa_name) submitData.fa_name = formData.fa_name;
      if (formData.department) submitData.department = formData.department;

      setPendingPayload(submitData);
      const result = await editFacultyDetails(submitData);

      if (result?.conflict) {
        setConfirmation(result);
        return;
      }

      setSuccess(result.message || 'Faculty updated successfully!');
      setWarning(result.warning || null);
      setFormData({ email: '', fa_name: '', department: '' });
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to update faculty');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmUpdate = async () => {
    if (!pendingPayload) return;
    setError(null);
    setSuccess(null);
    setWarning(null);
    setLoading(true);

    try {
      const result = await editFacultyDetails(pendingPayload, true);
      if (result?.conflict) {
        setError(result.message || 'Confirmation still required to update faculty');
        return;
      }

      setSuccess(result.message || 'Faculty updated successfully!');
      setWarning(result.warning || null);
      setConfirmation(null);
      setPendingPayload(null);
      setFormData({ email: '', fa_name: '', department: '' });
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to confirm faculty update');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#161b22] border border-gray-800 rounded-2xl w-full max-w-md p-6 text-white shadow-2xl">
        <h2 className="text-2xl font-bold mb-1 text-white">Edit Faculty Advisor</h2>
        <p className="text-gray-400 text-sm mb-6">Update faculty information (email required)</p>

        {error && (
          <div className="bg-red-950/40 border border-red-900/50 text-red-400 p-3 rounded-xl text-xs font-medium mb-4">
            {error}
          </div>
        )}

        {confirmation && (
          <div className="bg-orange-950/40 border border-orange-900/50 text-orange-300 p-3 rounded-xl text-xs font-medium mb-4">
            <div className="font-semibold mb-2">⚠️ {confirmation.message || 'Department change requires confirmation'}</div>
            <div className="text-[11px] leading-5">{confirmation.warning}</div>
            {confirmation.activeStudentCount != null && (
              <div className="mt-2 text-[11px] text-amber-200">Affected students: {confirmation.activeStudentCount}</div>
            )}
          </div>
        )}

        {warning && (
          <div className="bg-orange-950/40 border border-orange-900/50 text-orange-300 p-3 rounded-xl text-xs font-medium mb-4">
            {warning}
          </div>
        )}

        {success && (
          <div className="bg-green-950/40 border border-green-900/50 text-green-400 p-3 rounded-xl text-xs font-medium mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 font-semibold text-xs mb-1">Email * (required to identify faculty)</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="faculty@nitc.ac.in"
              className="w-full bg-[#0d1117] border border-gray-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-400 font-semibold text-xs mb-1">Faculty Name (optional)</label>
            <input
              type="text"
              name="fa_name"
              value={formData.fa_name}
              onChange={handleChange}
              placeholder="Leave blank to keep existing"
              className="w-full bg-[#0d1117] border border-gray-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-gray-400 font-semibold text-xs mb-1">Department (optional)</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full bg-[#0d1117] border border-gray-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 h-[38px]"
            >
              <option value="">Keep existing</option>
              {DEPARTMENTS.map(dept => (
                <option key={dept} value={dept}>
                  {dept.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-800">
            <button
              type="button"
              disabled={loading}
              onClick={() => {
                if (confirmation) {
                  setConfirmation(null);
                  setPendingPayload(null);
                  setWarning(null);
                } else {
                  onClose();
                }
              }}
              className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 text-xs font-bold rounded-xl uppercase tracking-wider transition-colors disabled:opacity-50"
            >
              {confirmation ? 'Cancel' : 'Cancel'}
            </button>
            {confirmation ? (
              <button
                type="button"
                disabled={loading}
                onClick={handleConfirmUpdate}
                className="flex-1 py-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-xs font-bold rounded-xl uppercase tracking-wider transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {loading ? 'Confirming...' : 'Proceed & Change Department'}
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-xs font-bold rounded-xl uppercase tracking-wider transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
