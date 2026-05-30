import React, { useEffect, useState } from "react";
import Cards from "../components/Cards";
import { getPendingRequests, viewProofDocument } from "../utils/student";

interface PendingItem {
  point_id: number | string;
  event_name: string;
  event_date: string;
  points: number;
  event_type: string;
  status: "PENDING" | string;
}

export default function PendingRequests(): React.ReactElement {
  const [pendingItems, setPendingItems] = useState<PendingItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getPendingRequests();
        
        // Safety check to ensure the backend payload response is parsed as a true iterable array
        setPendingItems(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(err.message || "Failed to load your pending requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // Format utility to convert raw database dates safely into localized clean display strings
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    try {
      const dateObj = new Date(dateStr);
      if (isNaN(dateObj.getTime())) return dateStr; // Falls back to raw text if pre-formatted
      return dateObj.toLocaleDateString("en-GB"); // Output format: DD/MM/YYYY
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#0d1117] text-white justify-center items-center font-mono text-sm">
        Loading pending requests...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0d1117] text-white">
      <main className="flex-1 flex flex-col px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <section className="max-w-6xl mx-auto w-full flex flex-col items-center">
          
          {/* Theme Gradient Page Title */}
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#E2453D] to-[#557FDF] text-transparent bg-clip-text mb-8 tracking-tight text-center">
            Pending Requests
          </h2>

          {/* Runtime Error Information Alert Box */}
          {error && (
            <div className="w-full max-w-xl bg-red-950/40 border border-red-900/50 text-red-400 p-4 rounded-xl text-sm font-medium mb-6 shadow-md">
              {error}
            </div>
          )}

          {/* Safe Null/Empty Array State Handler Block */}
          {!error && pendingItems.length === 0 ? (
            <div className="w-full max-w-md bg-[#161b22] border border-gray-800 rounded-2xl p-8 text-center shadow-2xl mt-4">
              <svg 
                className="w-12 h-12 text-gray-500 mx-auto mb-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-200 mb-1">No Pending Submissions</h3>
              <p className="text-sm text-gray-400">
                You don't have any requests currently waiting for processing approval.
              </p>
            </div>
          ) : (
            <div className="w-full">
              {/* Dynamic Header Item Counter Row */}
              <div className="text-gray-500 font-mono text-xs uppercase tracking-wider mb-4 px-1 w-full text-left">
                Active Pending Items ({pendingItems.length})
              </div>

              {/* Responsive Deck Grid System:
                  - Mobile Layout: 1 Column spanning full structural screen width 
                  - Tablet Layout (`sm:`): 2 Columns sitting balanced side-by-side
                  - Desktop Layout (`lg:`): 3 Columns keeping content tightly packed and visually aligned
              */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {pendingItems.map((item, idx) => (
                  <div 
                    key={item.point_id || idx} 
                    className="bg-[#161b22]/50 border border-gray-800 rounded-2xl p-5 flex flex-col justify-between shadow-lg hover:scale-[1.01] transition-transform duration-200"
                  >
                    {/* Render standard structured info inside card */}
                    <Cards
                      title={item.event_name}
                      date={formatDate(item.event_date)}
                      status="In process" 
                      points={item.points} 
                      category={item.event_type}
                    />
                    
                    {/* PDF Document Viewer Action Block */}
                    <div className="mt-4 pt-3 border-t border-gray-800/80 flex justify-end">
                      <button
                        onClick={() => viewProofDocument(item.point_id)}
                        className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors border border-blue-900/50 hover:border-blue-700/60 bg-blue-950/20 px-3 py-1.5 rounded-lg cursor-pointer"
                      >
                        View Verification PDF
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}