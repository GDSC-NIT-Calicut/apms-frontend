import React, { useState } from 'react';
import { updateAllocationDetails, reallocatePointsGroup } from '../utils/eventOrganizer';

type ActionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  allocationId: number;
  initialName: string;
  initialDate: string;
  initialType: string;
  mode: 'update_details' | 'reallocate';
  onSuccess: () => void;
};

export default function AllocationActionModal({ isOpen, onClose, allocationId, initialName, initialDate, initialType, mode, onSuccess }: ActionModalProps) {
  const [name, setName] = useState(initialName);
  const [date, setDate] = useState(initialDate);
  const [type, setType] = useState(initialType);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'update_details') {
        // Targets Endpoint 3 (JSON payload, text-only updates)
        await updateAllocationDetails({
          allocation_id: allocationId,
          event_name: name !== initialName ? name.trim() : undefined,
          event_date: date !== initialDate ? date : undefined,
          event_type: type !== initialType ? type : undefined
        });
      } else {
        // Targets Endpoint 2 (Form-Data payload, structural recalculations)
        await reallocatePointsGroup({
          allocation_id: allocationId,
          event_name: name.trim(),
          event_date: date,
          event_type: type,
          file: file || undefined
        });
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update point boundaries.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#161b22] border border-gray-800 rounded-2xl w-full max-w-md p-6 text-white shadow-2xl">
        <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-[#E2453D] to-[#557FDF] bg-clip-text text-transparent uppercase tracking-wide text-sm">
          {mode === 'update_details' ? 'Update Details Only' : 'Full Points Re-Allocation'}
        </h3>

        {error && (
          <div className="bg-red-950/40 border border-red-900/50 text-red-400 p-3 rounded-xl text-xs font-medium mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 font-semibold text-xs mb-1">Event Description / Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#0d1117] border border-gray-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-400 font-semibold text-xs mb-1">Event Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{ colorScheme: 'dark' }}
                className="w-full bg-[#0d1117] border border-gray-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 font-semibold text-xs mb-1">Point Category</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-[#0d1117] border border-gray-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 h-[38px]"
                required
              >
                <option value="institute_level">Institute Level</option>
                <option value="department_level">Department Level</option>
              </select>
            </div>
          </div>

          {mode === 'reallocate' && (
            <div>
              <label className="block text-gray-400 font-semibold text-xs mb-1">New Attendee Document (.CSV)</label>
              <div className="p-3 bg-[#0d1117] border border-gray-800 rounded-xl flex items-center justify-between">
                <input
                  type="file"
                  accept=".csv"
                  id="modal_csv_realloc"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                <label
                  htmlFor="modal_csv_realloc"
                  className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-[10px] font-bold rounded-lg cursor-pointer uppercase tracking-wider"
                >
                  Choose File
                </label>
                <span className="text-xs text-gray-400 font-mono max-w-[200px] truncate">
                  {file ? file.name : 'Leave blank to use original CSV'}
                </span>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-3 border-t border-gray-800/80">
            <button
              type="button"
              disabled={loading}
              onClick={onClose}
              className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 text-xs font-bold rounded-xl uppercase tracking-wider transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 bg-gradient-to-r from-[#E2453D] to-[#557FDF] text-xs font-bold rounded-xl uppercase tracking-wider transition-opacity hover:opacity-90"
            >
              {loading ? 'Processing...' : 'Save Updates'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}