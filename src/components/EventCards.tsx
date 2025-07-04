import React from "react";

type CardProps = {
  title: string;
  date: string;
  actions: Array<"Revoke Allocation" | "Re-Allocate" | "Update Details">;
};

const statusStyles: Record<string, string> = {
  "Revoke Allocation": "bg-gradient-to-r from-[#992622] to-[#1E3A8A] text-white",
  "Re-Allocate": "bg-gradient-to-r from-[#992622] to-[#1E3A8A] text-white",
  "Update Details": "bg-gradient-to-r from-[#992622] to-[#1E3A8A] text-white",
};

const EventCards: React.FC<CardProps> = ({ title, date, actions }) => {
  return (
    <div className="w-full max-w-[500px] px-5 py-5 bg-black text-white border border-white/40 shadow-sm flex flex-col gap-6">
      <div className="text-lg">{title}</div>
      <div className="text-sm text-gray-300">{date}</div>

      <div className="flex justify-between gap-6">
        {actions.map((action) => (
          <button
            key={action}
            className={`flex-1 text-sm py-3 px-1 font-semibold text-center cursor-pointer ${statusStyles[action]}`}
          >
            {action}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EventCards;
