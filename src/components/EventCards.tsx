import React from "react";

type CardProps = {
  title: string;
  date: string;
  actions: Array<"Revoke Allocation" | "Re-Allocate" | "Update Details">;
  onActionClick?: (action: "Revoke Allocation" | "Re-Allocate" | "Update Details") => void;
};

export default function EventCards({ title, date, actions, onActionClick }: CardProps): React.ReactElement {
  return (
    <div className="w-full bg-[#161b22]/40 border border-gray-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col justify-between h-full transition-all hover:border-gray-700/60">
      
      {/* Upper Compartment: Meta Core Information Description */}
      <div className="space-y-1.5 mb-5">
        <h4 className="text-base sm:text-lg font-bold tracking-wide text-gray-100 break-words">
          {title}
        </h4>
        <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{date}</span>
        </div>
      </div>

      {/* Lower Compartment: Mobile-first Flex Actions Row Sheet */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-3 border-t border-gray-900/60">
        {actions.map((action) => {
          // Contextual conditional badge layout styling parameters
          const isRevoke = action === "Revoke Allocation";
          
          return (
            <button
              key={action}
              onClick={() => onActionClick?.(action)}
              className={`flex-1 text-center py-2.5 px-2 font-bold rounded-xl text-xs uppercase tracking-wider cursor-pointer transition-all active:scale-[0.98] border
                ${
                  isRevoke
                    ? "bg-red-950/40 hover:bg-red-900/30 border-red-900/40 text-red-400"
                    : "bg-gray-800/80 hover:bg-gray-700/80 border-gray-700/50 text-gray-200"
                }`}
            >
              {action === "Update Details" ? "Update" : action}
            </button>
          );
        })}
      </div>

    </div>
  );
}