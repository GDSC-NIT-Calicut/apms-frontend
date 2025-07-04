import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function EventSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems: { label: string; path: string }[] = [
    { label: "Dashboard", path: "/event-dashboard" },
    { label: "Submit Requests", path: "/submit-event-request" },
    { label: "Allocated Requests", path: "/allocated-requests" },
    { label: "Revoked Allocation", path: "/revoked-allocation" }
  ];

  const [selected, setSelected] = useState("Dashboard");

  // Highlight correct item on page load or URL change
  useEffect(() => {
    const current = navItems.find((item) =>
      location.pathname.startsWith(item.path)
    );
    if (current) {
      setSelected(current.label);
    }
  }, [location.pathname]);

  return (
    <div className="hidden md:block w-64 min-h-screen bg-gradient-to-r from-[rgba(226,69,61,0.15)] to-[rgba(85,127,223,0.2)] relative">
      <div className="absolute top-0 right-0 w-[2px] h-full bg-[rgba(38,134,255,0.4)]" />
      <div
        className="absolute left-0 w-full h-[1.5px] bg-[rgba(38,134,255,0.2)]"
        style={{ top: "80px" }}
      />
  
      <nav className="flex flex-col gap-4 mt-[25vh]">
        {navItems.map(({ label, path }) => (
          <button
            key={label}
            onClick={() => {
              setSelected(label);
              navigate(path);
            }}
            className={`w-full text-center py-4 px-4 transition font-redhat font-semibold cursor-pointer
              ${
                selected === label
                  ? "bg-[#1A3B66] text-white"
                  : "text-white hover:bg-white/10"
              }`}
          >
            {label}
          </button>
        ))}
      </nav>
    </div>
  );  
}