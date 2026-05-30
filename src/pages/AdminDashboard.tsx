import { useEffect, useState } from 'react';
import Profile from '../components/Profile';
import { useUserProfile } from '../hooks/useUserProfile';
import RegisterStudentModal from '../components/admin/RegisterStudentModal';
import RegisterAdminModal from '../components/admin/RegisterAdminModal';
import RegisterEventOrganizerModal from '../components/admin/RegisterEventOrganizerModal';
import RegisterFacultyModal from '../components/admin/RegisterFacultyModal';
import EditStudentModal from '../components/admin/EditStudentModal';
import EditFacultyModal from '../components/admin/EditFacultyModal';
import EditEventOrganizerModal from '../components/admin/EditEventOrganizerModal';
import EditAdminModal from '../components/admin/EditAdminModal';
import BulkUploadModal from '../components/admin/BulkUploadModal';
import BulkRemoveModal from '../components/admin/BulkRemoveModal';
import RemoveSingleUserModal from '../components/admin/RemoveSingleUserModal.tsx';

type AdminDashboardProps = {
  setIsLoggedIn: (val: boolean) => void;
};

type ModalType = 
  | 'addStudent' | 'editStudent' | 'bulkAddStudents'
  | 'addFaculty' | 'editFaculty' | 'bulkAddFaculty'
  | 'addEventOrganizer' | 'editEventOrganizer' | 'bulkAddEventOrganizers'
  | 'addAdmin' | 'editAdmin'
  | 'bulkRemoveUsers' | 'removeSingleUser' | null;

export default function AdminDashboard({ setIsLoggedIn }: AdminDashboardProps) {
  const { profile, loading, error } = useUserProfile();
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const handleAdminAction = (event: Event) => {
      const customEvent = event as CustomEvent;
      const action = customEvent.detail?.action;
      setActiveModal(action as ModalType);
    };

    window.addEventListener('adminAction', handleAdminAction);
    return () => window.removeEventListener('adminAction', handleAdminAction);
  }, []);

  const handleModalClose = () => {
    setActiveModal(null);
  };

  const handleModalSuccess = () => {
    setRefreshKey(prev => prev + 1);
    setActiveModal(null);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#0d1117] text-white justify-center items-center font-medium">
        Loading Admin Dashboard...
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex min-h-screen bg-[#0d1117] text-red-400 justify-center items-center font-medium px-4 text-center">
        Failed to load admin details. Please refresh or log in again.
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0d1117]">
      <header className="w-full overflow-hidden">
        <Profile setIsLoggedIn={setIsLoggedIn} user="Admin" />
      </header>

      {/* Main Content */}
      <main className="flex-grow px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto">
          {/* Title Section */}
          <div className="mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-[#E2453D] via-[#916296] to-[#557FDF] bg-clip-text text-transparent">
              Admin Management Dashboard
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">Manage users across all roles</p>
          </div>

          {/* 4 Quadrants Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-8">
            {/* Quadrant 1: Student Management */}
            <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-6 sm:p-8 hover:border-blue-500/30 transition">
              <h2 className="text-xl sm:text-2xl font-bold mb-1 text-white flex items-center gap-2">
                <span className="text-blue-400">👥</span> Student Management
              </h2>
              <p className="text-gray-400 text-xs sm:text-sm mb-6">Register, edit, and bulk manage student accounts</p>
              <div className="space-y-3">
                <button
                  onClick={() => setActiveModal('addStudent')}
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold rounded-xl transition text-sm sm:text-base"
                >
                  + Add Single Student
                </button>
                <button
                  onClick={() => setActiveModal('editStudent')}
                  className="w-full py-3 px-4 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-semibold rounded-xl transition text-sm sm:text-base"
                >
                  ✎ Edit Student
                </button>
                <button
                  onClick={() => setActiveModal('bulkAddStudents')}
                  className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-semibold rounded-xl transition text-sm sm:text-base"
                >
                  📋 Bulk Add Students (CSV)
                </button>
              </div>
            </div>

            {/* Quadrant 2: Faculty Management */}
            <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-6 sm:p-8 hover:border-purple-500/30 transition">
              <h2 className="text-xl sm:text-2xl font-bold mb-1 text-white flex items-center gap-2">
                <span className="text-purple-400">🎓</span> Faculty Advisor Management
              </h2>
              <p className="text-gray-400 text-xs sm:text-sm mb-6">Register, edit, and bulk manage faculty advisor accounts</p>
              <div className="space-y-3">
                <button
                  onClick={() => setActiveModal('addFaculty')}
                  className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-semibold rounded-xl transition text-sm sm:text-base"
                >
                  + Add Single Faculty
                </button>
                <button
                  onClick={() => setActiveModal('editFaculty')}
                  className="w-full py-3 px-4 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-semibold rounded-xl transition text-sm sm:text-base"
                >
                  ✎ Edit Faculty
                </button>
                <button
                  onClick={() => setActiveModal('bulkAddFaculty')}
                  className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-semibold rounded-xl transition text-sm sm:text-base"
                >
                  📋 Bulk Add Faculty (CSV)
                </button>
              </div>
            </div>

            {/* Quadrant 3: Event Organizer Management */}
            <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-6 sm:p-8 hover:border-orange-500/30 transition">
              <h2 className="text-xl sm:text-2xl font-bold mb-1 text-white flex items-center gap-2">
                <span className="text-orange-400">🎉</span> Event Organizer Management
              </h2>
              <p className="text-gray-400 text-xs sm:text-sm mb-6">Register, edit, and bulk manage event organizer accounts</p>
              <div className="space-y-3">
                <button
                  onClick={() => setActiveModal('addEventOrganizer')}
                  className="w-full py-3 px-4 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-semibold rounded-xl transition text-sm sm:text-base"
                >
                  + Add Single Event Organizer
                </button>
                <button
                  onClick={() => setActiveModal('editEventOrganizer')}
                  className="w-full py-3 px-4 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-semibold rounded-xl transition text-sm sm:text-base"
                >
                  ✎ Edit Event Organizer
                </button>
                <button
                  onClick={() => setActiveModal('bulkAddEventOrganizers')}
                  className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-semibold rounded-xl transition text-sm sm:text-base"
                >
                  📋 Bulk Add Event Organizers (CSV)
                </button>
              </div>
            </div>

            {/* Quadrant 4: Admin Management */}
            <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-6 sm:p-8 hover:border-pink-500/30 transition">
              <h2 className="text-xl sm:text-2xl font-bold mb-1 text-white flex items-center gap-2">
                <span className="text-pink-400">⚙️</span> Admin Management
              </h2>
              <p className="text-gray-400 text-xs sm:text-sm mb-6">Register and edit admin accounts</p>
              <div className="space-y-3">
                <button
                  onClick={() => setActiveModal('addAdmin')}
                  className="w-full py-3 px-4 bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600 text-white font-semibold rounded-xl transition text-sm sm:text-base"
                >
                  + Add Single Admin
                </button>
                <button
                  onClick={() => setActiveModal('editAdmin')}
                  className="w-full py-3 px-4 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-semibold rounded-xl transition text-sm sm:text-base"
                >
                  ✎ Edit Admin
                </button>
              </div>
            </div>
          </div>

          {/* Bulk Remove Users - Full Width Bottom Section */}
          <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-6 sm:p-8 hover:border-red-500/30 transition">
            <h2 className="text-xl sm:text-2xl font-bold mb-1 text-white flex items-center gap-2">
              <span className="text-red-400">🗑️</span> Remove Users
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm mb-6">Remove a single user by email or remove multiple users from any role with CSV.</p>
            <div className="space-y-3">
              <button
                onClick={() => setActiveModal('removeSingleUser')}
                className="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-semibold rounded-xl transition text-sm sm:text-base"
              >
                🧾 Remove Single User
              </button>
              <button
                onClick={() => setActiveModal('bulkRemoveUsers')}
                className="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-semibold rounded-xl transition text-sm sm:text-base"
              >
                🗑️ Bulk Remove Users (CSV)
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <RegisterStudentModal 
        isOpen={activeModal === 'addStudent'} 
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
      />
      <EditStudentModal 
        isOpen={activeModal === 'editStudent'} 
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
      />
      <BulkUploadModal 
        isOpen={activeModal === 'bulkAddStudents'} 
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        type="student"
      />

      <RegisterFacultyModal 
        isOpen={activeModal === 'addFaculty'} 
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
      />
      <EditFacultyModal 
        isOpen={activeModal === 'editFaculty'} 
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
      />
      <BulkUploadModal 
        isOpen={activeModal === 'bulkAddFaculty'} 
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        type="faculty"
      />

      <RegisterEventOrganizerModal 
        isOpen={activeModal === 'addEventOrganizer'} 
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
      />
      <EditEventOrganizerModal 
        isOpen={activeModal === 'editEventOrganizer'} 
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
      />
      <BulkUploadModal 
        isOpen={activeModal === 'bulkAddEventOrganizers'} 
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        type="organizer"
      />

      <RegisterAdminModal 
        isOpen={activeModal === 'addAdmin'} 
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
      />
      <EditAdminModal 
        isOpen={activeModal === 'editAdmin'} 
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
      />

      <BulkRemoveModal 
        isOpen={activeModal === 'bulkRemoveUsers'} 
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
      />
      <RemoveSingleUserModal
        isOpen={activeModal === 'removeSingleUser'}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
      />

      {/* Footer */}
      <footer className="mt-auto px-6 py-8 bg-gradient-to-b from-[#241515] to-[#141a2e] border-t-[2px] border-[rgba(38,134,255,0.4)] w-full min-h-16 relative">
        <div className="absolute top-[-2px] left-[-2px]">
          <div
            className="w-45 h-6 bg-[rgba(38,134,255,0.4)]"
            style={{ clipPath: 'polygon(0 0, 0 100%, 100% 0)' }}
          >
            <div
              className="relative bottom-[2px] w-45 h-6 bg-black"
              style={{ clipPath: 'polygon(0 0, 0 100%, 100% 0)' }}
            />
          </div>
        </div>
      </footer>
    </div>
  );
}
