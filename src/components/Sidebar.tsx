import { useState } from "react";

export default function Sidebar() {
    const [selected,setSelected] = useState("Dashboard");
    const navItems = ["Dashboard", "Submit Activity", "Rejected Requests","Pending Requests","Approved Requests"];
  return (
    <div className="w-64 min-h-screen bg-gradient-to-r from-[rgba(226,69,61,0.15)] to-[rgba(85,127,223,0.2)] relative">
      <div className="absolute top-0 right-0 w-[2px] h-full bg-[rgba(38,134,255,0.4)]" />
      <nav className="flex flex-col gap-4 mt-[25vh]">
        {navItems.map((item) => (
          <button
            key={item}
            onClick={()=>setSelected(item)}
            className={`w-full text-center py-4 px-4 transition font-redhat font-semibold
            ${selected === item
            ? "bg-[#1A3B66] text-white"
            : "text-white hover:bg-white/10"}`}
          >
            {item}
          </button>
        ))}
      </nav>
    </div>
  );
}