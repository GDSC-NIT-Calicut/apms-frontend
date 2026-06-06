import React, { useState } from 'react';
import { editStudentDetails, EditStudentPayload } from '../../utils/admin';

type EditStudentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export default function EditStudentModal({ isOpen, onClose, onSuccess }: EditStudentModalProps) {
  const [formData, setFormData] = useState({
    email: '',
    student_name: '',
    roll_number: '',
    batch_year: '',
    fa_name: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<any>(null);
  const [pendingPayload, setPendingPayload] = useState<EditStudentPayload | null>(null);

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
    setWarning(null);
    setConfirmation(null);
    setLoading(true);

    try {
      const submitData: any = { email: formData.email };
      if (formData.student_name) submitData.student_name = formData.student_name;
      if (formData.roll_number) submitData.roll_number = formData.roll_number;
      if (formData.batch_year) submitData.batch_year = parseInt(formData.batch_year);
      if (formData.fa_name) submitData.fa_name = formData.fa_name;

      setPendingPayload(submitData);
      const result = await editStudentDetails(submitData);

      if (result?.conflict) {
        setConfirmation(result);
        return;
      }

      setSuccess(result.message || 'Student updated successfully!');
      setWarning(result.warning || null);
      setFormData({ email: '', student_name: '', roll_number: '', batch_year: '', fa_name: '' });
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to update student');
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
      const result = await editStudentDetails(pendingPayload, true);
      if (result?.conflict) {
        setError(result.message || 'Confirmation still required to update student');
        return;
      }

      setSuccess(result.message || 'Student updated successfully!');
      setWarning(result.warning || null);
      setConfirmation(null);
      setPendingPayload(null);
      setFormData({ email: '', student_name: '', roll_number: '', batch_year: '', fa_name: '' });
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to confirm student update');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#161b22] border border-gray-800 rounded-2xl w-full max-w-md p-6 text-white shadow-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-1 text-white">Edit Student</h2>
        <p className="text-gray-400 text-sm mb-6">Update student information (email required)</p>

        {error && (
          <div className="bg-red-950/40 border border-red-900/50 text-red-400 p-3 rounded-xl text-xs font-medium mb-4">
            {error}
          </div>
        )}

        {confirmation && (
          <div className="bg-orange-950/40 border border-orange-900/50 text-orange-300 p-3 rounded-xl text-xs font-medium mb-4">
            <div className="font-semibold mb-2">⚠️ {confirmation.message || 'Department change requires confirmation'}</div>
            <div className="text-[11px] leading-5">{confirmation.warning}</div>
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
            <label className="block text-gray-400 font-semibold text-xs mb-1">Email * (required to identify student)</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="student@nitc.ac.in"
              className="w-full bg-[#0d1117] border border-gray-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-400 font-semibold text-xs mb-1">Student Name (optional)</label>
            <input
              type="text"
              name="student_name"
              value={formData.student_name}
              onChange={handleChange}
              placeholder="Leave blank to keep existing"
              className="w-full bg-[#0d1117] border border-gray-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-gray-400 font-semibold text-xs mb-1">Roll Number (optional)</label>
            <input
              type="text"
              name="roll_number"
              value={formData.roll_number}
              onChange={handleChange}
              placeholder="b230395cs"
              className="w-full bg-[#0d1117] border border-gray-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-gray-400 font-semibold text-xs mb-1">Batch Year (optional)</label>
            <input
              type="number"
              name="batch_year"
              value={formData.batch_year}
              onChange={handleChange}
              placeholder="Leave blank to keep existing"
              className="w-full bg-[#0d1117] border border-gray-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-gray-400 font-semibold text-xs mb-1">Faculty Advisor Name (optional)</label>
            <input
              type="text"
              name="fa_name"
              value={formData.fa_name}
              onChange={handleChange}
              placeholder="Leave blank to keep existing"
              className="w-full bg-[#0d1117] border border-gray-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
            />
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
                {loading ? 'Confirming...' : 'Proceed with Dummy FA'}
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
