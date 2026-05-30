import React from 'react';

// 1. Update the interface to accept the new backend properties
export interface CardProps {
  title: string;
  date: string;
  status: string;
  points?: number;    // Added to support real backend point values
  category?: string;  // Added to support the event type label
}

export default function Cards({ 
  title, 
  date, 
  status, 
  points, 
  category 
}: CardProps): React.ReactElement {
  
  // Format the category text beautifully for the UI badge (e.g., institute_level -> Institute Level)
  const formatCategory = (cat?: string) => {
    if (!cat) return '';
    return cat.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <div className="w-full bg-[#161b22] border border-gray-800 rounded-xl p-5 shadow-md flex flex-col justify-between gap-3 relative overflow-hidden">
      
      {/* Top Section: Title & Status Indicator */}
      <div className="flex justify-between items-start w-full gap-2">
        <h3 className="font-bold text-lg text-white tracking-wide truncate max-w-[70%]">
          {title}
        </h3>
        <span className="px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-yellow-950/50 text-yellow-500 border border-yellow-900/30">
          {status}
        </span>
      </div>

      {/* Dynamic Metric Badges (Only render if provided by the backend) */}
      <div className="flex flex-wrap items-center gap-2 mt-1">
        {points !== undefined && (
          <span className="bg-blue-950/40 border border-blue-900/40 text-blue-400 font-mono font-bold text-xs px-2 py-0.5 rounded">
            {points} PTS
          </span>
        )}
        {category && (
          <span className="bg-gray-800/60 border border-gray-700/40 text-gray-400 font-medium text-xs px-2 py-0.5 rounded">
            {formatCategory(category)}
          </span>
        )}
      </div>

      {/* Bottom Section: Timestamp */}
      <div className="flex justify-between items-center text-xs text-gray-500 mt-2 border-t border-gray-800/60 pt-2">
        <span>Submission Date</span>
        <span className="font-mono">{date}</span>
      </div>
      
    </div>
  );
}