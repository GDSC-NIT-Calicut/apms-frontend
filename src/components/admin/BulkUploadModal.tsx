import React, { useState, useRef } from 'react'; // 🌟 Added useRef
import { bulkRegisterStudents, bulkRegisterFaculty, bulkRegisterEventOrganizers } from '../../utils/admin';

type BulkUploadModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  type: 'student' | 'faculty' | 'organizer';
};

const CSV_TEMPLATES = {
  student: {
    title: 'Bulk Add Students',
    description: 'Upload CSV with student details',
    columns: ['email', 'student_name', 'roll_number', 'batch_year', 'fa_name'],
    note: 'Column order is flexible. Roll number format: [program][6digits][dept] e.g., b230395cs',
    example: 'student@nitc.ac.in,John Doe,b230395cs,2023,Dr. Smith',
    api: bulkRegisterStudents,
  },
  faculty: {
    title: 'Bulk Add Faculty',
    description: 'Upload CSV with faculty advisor details',
    columns: ['email', 'fa_name', 'department'],
    note: 'Column order is flexible. Department codes: cs, ec, me, ee',
    example: 'faculty@nitc.ac.in,Dr. Smith,cs',
    api: bulkRegisterFaculty,
  },
  organizer: {
    title: 'Bulk Add Event Organizers',
    description: 'Upload CSV with event organizer details',
    columns: ['email', 'organizer_name', 'organization_name'],
    note: 'Column order is flexible',
    example: 'organizer@nitc.ac.in,Jane Doe,GDSC NITC',
    api: bulkRegisterEventOrganizers,
  },
};

export default function BulkUploadModal({ isOpen, onClose, onSuccess, type }: BulkUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // 🌟 1. Create a reference to target the hidden file input element
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const template = CSV_TEMPLATES[type];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      setError(null);
    } else {
      setError('Please select a valid CSV file');
      setFile(null);
      // 🌟 Clear DOM track on validation failure
      if (e.target) e.target.value = '';
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

    setLoading(true);
    try {
      await template.api(file);
      setSuccess('File uploaded and processed successfully!');
      setFile(null);
      
      // 🌟 2. Clear the element value right away so it doesn't get stuck on error or re-try
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to upload file');
      // 🌟 3. Crucial addition: Clear the file input tracking even on a failure!
      // This lets them click upload, fix something in the same CSV file, and pick it again immediately.
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    const header = template.columns.join(',');
    const csv = `${header}\n${template.example}`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}_template.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#161b22] border border-gray-800 rounded-2xl w-full max-w-md p-6 text-white shadow-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-1 text-white">{template.title}</h2>
        <p className="text-gray-400 text-sm mb-6">{template.description}</p>

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
            <p className="text-xs font-semibold text-gray-400 mb-2">Required CSV Columns:</p>
            <div className="flex flex-wrap gap-1">
              {template.columns.map(col => (
                <span key={col} className="px-2 py-1 bg-gray-800 rounded text-xs text-blue-400">
                  {col}
                </span>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3">{template.note}</p>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-gray-400 font-semibold text-xs mb-1">Select CSV File *</label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              id="bulk_csv_upload"
              ref={fileInputRef} // 🌟 4. Bind the ref here
              className="hidden"
            />
            <label
              htmlFor="bulk_csv_upload"
              className="w-full flex items-center justify-between p-3 bg-[#0d1117] border border-gray-800 rounded-xl cursor-pointer hover:border-green-500/50"
            >
              <span className="text-xs text-gray-400">
                {file ? file.name : 'Click to select CSV file'}
              </span>
              <span className="text-xs px-3 py-1 bg-green-800 hover:bg-green-700 text-green-400 rounded font-semibold">
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
              className="flex-1 py-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-xs font-bold rounded-xl uppercase tracking-wider transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {loading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}