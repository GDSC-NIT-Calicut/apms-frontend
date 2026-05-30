import React, { useEffect, useState } from "react";
import Cards from "../components/Cards";
import { getApprovedRequests, viewProofDocument } from "../utils/student";

interface ApprovedItem {
  point_id: number | string;
  event_name: string;
  event_date: string;
  points: number;
  event_type: string;
  status: string;
}

export default function ApprovedRequests(): React.ReactElement {
  const [approvedItems, setApprovedItems] = useState<ApprovedItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApproved = async () => {
      try {
        setLoading(true);
        const data = await getApprovedRequests();
        setApprovedItems(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(err.message || "Failed to load approved entries.");
      } finally {
        setLoading(false);
      }
    };
    fetchApproved();
  }, []);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? dateStr : date.toLocaleDateString("en-GB");
  };

  if (loading) return <div className="text-white text-center mt-20 font-mono">Loading data...</div>;

  return (
    <div className="flex min-h-screen bg-[#0d1117] text-white">
      <main className="flex-grow px-4 sm:px-6 lg:px-8 py-10 w-full">
        <section className="max-w-6xl mx-auto flex flex-col items-center">
          
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#E2453D] to-[#557FDF] text-transparent bg-clip-text mb-8 tracking-tight">
            Approved Requests
          </h2>

          {error && <div className="text-red-400 bg-red-950/40 p-4 rounded-xl border border-red-900 mb-6">{error}</div>}

          {!error && approvedItems.length === 0 ? (
            <div className="bg-[#161b22] border border-gray-800 p-8 rounded-2xl text-center max-w-sm w-full shadow-xl">
              <p className="text-gray-400 font-medium">No approved request details found on file.</p>
            </div>
          ) : (
            <div className="w-full">
              <div className="text-gray-500 font-mono text-xs uppercase tracking-wider mb-4 px-1">
                Approved Summary Count ({approvedItems.length})
              </div>

              {/* Dynamic Fluid Asymmetric Tile Deck Grid System */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {approvedItems.map((item, idx) => (
                  <div key={item.point_id || idx} className="bg-[#161b22]/50 border border-gray-800 rounded-2xl p-5 flex flex-col justify-between shadow-lg hover:scale-[1.01] transition-transform">
                    <Cards
                      title={item.event_name}
                      date={formatDate(item.event_date)}
                      status="Approved"
                      points={item.points}
                      category={item.event_type}
                    />
                    
                    {/* Integrated dynamic action link row */}
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