import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Profile from "./Profile";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const isAdminRoute = location.pathname.startsWith("/admin");
  const isFacultyRoute = location.pathname.startsWith("/faculty");
  const isOrganizerRoute = location.pathname.startsWith("/event-organizer");

  const studentItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Submit Activity", path: "/submit-activity" },
    { label: "Rejected Requests", path: "/rejected-requests" },
    { label: "Pending Requests", path: "/pending-requests" },
    { label: "Approved Requests", path: "/approved-requests" },
  ];

  const facultyItems = [
    { label: "Dashboard", path: "/faculty-dashboard" },
    { label: "Pending Approval", path: "/faculty-pending-approval" },
    { label: "View Student Status", path: "/faculty-student-status" },
    { label: "Assign Points", path: "/faculty-assign-points" },
  ];

  const organizerItems = [
    { label: "Dashboard", path: "/event-organizer-dashboard" },
    { label: "Submit Requests", path: "/event-organizer-submit" },
    { label: "Allocated Requests", path: "/event-organizer-allocated" },
    { label: "Revoked Allocation", path: "/event-organizer-revoked" },
  ];

  const adminItems = [
    { label: "Dashboard", path: "/admin-dashboard" },
    { 
      label: "Student Management", 
      section: "student",
      subsections: [
        { label: "Add Student", action: "addStudent" },
        { label: "Edit Student", action: "editStudent" },
        { label: "Bulk Add Students", action: "bulkAddStudents" },
      ]
    },
    { 
      label: "Faculty Management", 
      section: "faculty",
      subsections: [
        { label: "Add Faculty", action: "addFaculty" },
        { label: "Edit Faculty", action: "editFaculty" },
        { label: "Bulk Add Faculty", action: "bulkAddFaculty" },
      ]
    },
    { 
      label: "Event Organizer Management", 
      section: "organizer",
      subsections: [
        { label: "Add Event Organizer", action: "addEventOrganizer" },
        { label: "Edit Event Organizer", action: "editEventOrganizer" },
        { label: "Bulk Add Event Organizers", action: "bulkAddEventOrganizers" },
      ]
    },
    { 
      label: "Admin Management", 
      section: "admin",
      subsections: [
        { label: "Add Admin", action: "addAdmin" },
        { label: "Edit Admin", action: "editAdmin" },
      ]
    },
    { label: "Remove Users", path: "/admin-remove-users" },
  ];

  const navItems = isAdminRoute 
    ? adminItems 
    : isFacultyRoute 
    ? facultyItems 
    : isOrganizerRoute 
      ? organizerItems 
      : studentItems;

  useEffect(() => {
    const current = navItems.find((item: any) => item.path === location.pathname) || 
                    navItems.find((item: any) => location.pathname.startsWith(item.path));
    if (current) {
      setSelected(current.label);
    }
  }, [location.pathname, navItems]);

  const handleNavigation = (path: string, label: string) => {
    setSelected(label);
    setIsOpen(false);
    navigate(path);
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <>
      {/* Mobile Hamburger Toggle Action Icon */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="md:hidden fixed top-4 left-4 z-40 bg-[#161b22] border border-gray-800 p-2.5 rounded-xl text-white shadow-xl flex items-center justify-center cursor-pointer hover:bg-gray-800"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}

      {/* Dimmed Background Overlay */}
      {isOpen && (
        <div onClick={() => setIsOpen(false)} className="md:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-40 transition-opacity" />
      )}

      {/* Sidebar Container Shell */}
      <div
        className={`fixed md:static top-0 left-0 h-full w-72 md:w-64 min-h-screen bg-gradient-to-b md:bg-gradient-to-r from-[rgba(226,69,61,0.18)] to-[rgba(85,127,223,0.22)] bg-[#0d1117] md:bg-transparent z-50 transform md:transform-none transition-transform duration-300 ease-in-out flex flex-col border-r border-gray-800/40 md:border-transparent
          ${isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="hidden md:block absolute top-0 right-0 w-[2px] h-full bg-[rgba(38,134,255,0.4)]" />
        
        {/* Compact Mobile Top Profile Bar */}
        <div className="md:hidden w-full border-b border-[rgba(38,134,255,0.3)] bg-[#141a2e]/90 relative">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 z-50 p-2 text-gray-400 hover:text-white rounded-lg border border-gray-800 cursor-pointer bg-[#0d1117]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <Profile compact />
        </div>

        <div className="hidden md:block absolute left-0 w-full h-[1.5px] bg-[rgba(38,134,255,0.2)]" style={{ top: "80px" }} />

        {/* Action Rails */}
        <nav className="flex flex-col gap-2 md:gap-4 mt-8 md:mt-[25vh] px-2 md:px-0 overflow-y-auto flex-grow pb-8">
          {navItems.map((item: any) => {
            // Standard navigation item (non-admin)
            if (item.path) {
              return (
                <button
                  key={item.label}
                  onClick={() => handleNavigation(item.path, item.label)}
                  className={`w-full text-center py-3.5 sm:py-4 px-4 transition font-semibold rounded-xl md:rounded-none tracking-wide text-sm sm:text-base cursor-pointer border border-transparent
                    ${selected === item.label ? "bg-[#1A3B66] text-white font-bold border-[rgba(38,134,255,0.3)] shadow-md" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
                >
                  {item.label}
                </button>
              );
            }

            // Admin collapsible section
            if (item.section) {
              const isExpanded = expandedSections[item.section];
              return (
                <div key={item.label} className="flex flex-col">
                  <button
                    onClick={() => toggleSection(item.section)}
                    className={`w-full text-left py-3.5 sm:py-4 px-4 transition font-semibold rounded-xl md:rounded-none tracking-wide text-sm sm:text-base cursor-pointer border border-transparent flex items-center justify-between
                      ${selected === item.label ? "bg-[#1A3B66] text-white font-bold border-[rgba(38,134,255,0.3)] shadow-md" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
                  >
                    {item.label}
                    <svg 
                      className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </button>
                  
                  {/* Subsections */}
                  {isExpanded && (
                    <div className="bg-[#0d1117]/50 border-l border-gray-800/40 ml-2 pl-2">
                      {item.subsections.map((sub: any) => (
                        <button
                          key={sub.action}
                          onClick={() => {
                            setSelected(sub.label);
                            setIsOpen(false);
                            // Dispatch event or callback to parent dashboard
                            window.dispatchEvent(new CustomEvent('adminAction', { detail: { action: sub.action } }));
                          }}
                          className="w-full text-left py-2.5 px-4 transition font-medium rounded-lg tracking-wide text-xs sm:text-sm cursor-pointer text-gray-400 hover:text-white hover:bg-white/5"
                        >
                          {sub.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return null;
          })}
        </nav>
      </div>
    </>
  );
}