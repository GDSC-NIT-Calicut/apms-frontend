import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cards from "../components/Cards";
import { getRejectedRequestsCached, viewProofDocument } from "../utils/student";
import useClientPagination from "../hooks/useClientPagination";
import { getTimeAgo } from "../utils/time";

interface RejectedItem {
  point_id: number | string;
  event_name: string;
  event_date: string;
  points: number;
  event_type: string;
  status: string;
  rejection_reason?: string;
}

export default function RejectedRequests(): React.ReactElement {
  const navigate = useNavigate();
  const [rejectedItemsRaw, setRejectedItemsRaw] = useState<RejectedItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [fromCache, setFromCache] = useState(false);

  const fetchRejected = async (bypass = false) => {
    try {
      setLoading(true);
      setError(null);
      const res = await getRejectedRequestsCached(bypass);
      setRejectedItemsRaw(Array.isArray(res.data) ? res.data : []);
      setLastUpdated(res.lastUpdated || null);
      setFromCache(res.fromCache);
    } catch (err: any) {
      setError(err.message || "Failed to load rejected entries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRejected();
  }, []);

  const { items: rejectedItems, loadMore, hasMore } = useClientPagination<RejectedItem>(rejectedItemsRaw, 15);

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
          
          <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#E2453D] to-[#557FDF] text-transparent bg-clip-text tracking-tight">
              Rejected Requests
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-300">
              {lastUpdated && (
                <span className="inline-flex items-center gap-2 rounded-full border border-gray-700 bg-white/5 px-3 py-2">
                  Last updated {getTimeAgo(lastUpdated)}
                </span>
              )}
              <button
                onClick={() => fetchRejected(true)}
                className="rounded-lg border border-gray-700 bg-[#111827] px-3 py-2 text-white transition hover:bg-[#1f2937]"
              >
                Refresh
              </button>
            </div>
          </div>

          {error && <div className="text-red-400 bg-red-950/40 p-4 rounded-xl border border-red-900 mb-6">{error}</div>}

          {!error && rejectedItems.length === 0 ? (
            <div className="bg-[#161b22] border border-gray-800 p-8 rounded-2xl text-center max-w-sm w-full shadow-xl">
              <p className="text-gray-400 font-medium">Clear record! No rejected applications found.</p>
            </div>
          ) : (
            <div className="w-full">
              <div className="text-gray-500 font-mono text-xs uppercase tracking-wider mb-4 px-1">
                Rejected Items ({rejectedItems.length})
              </div>

              {/* Responsive Layout Grid Tile System with clean asymmetrical layout margins */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {rejectedItems.map((item, idx) => (
                  <div 
                    key={item.point_id || idx} 
                    className="bg-[#161b22]/40 border border-gray-800 rounded-2xl p-5 flex flex-col justify-between shadow-xl relative overflow-hidden"
                  >
                    <div>
                      <Cards
                        title={item.event_name}
                        date={formatDate(item.event_date)}
                        status="Resubmit"
                        points={item.points}
                        category={item.event_type}
                      />
                      
                      {/* Reason Container Content Area Box */}
                      <div className="mt-3 bg-red-950/20 border border-red-900/30 rounded-xl p-3">
                        <span className="text-[11px] font-bold text-red-400 uppercase tracking-widest block mb-0.5">
                          Advisor Rejection Reason
                        </span>
                        <p className="text-xs sm:text-sm text-gray-300 italic">
                          "{item.rejection_reason || "No explicit comments provided by faculty."}"
                        </p>
                      </div>
                    </div>

                    {/* Footer Multi-Action Trigger Row Segment links layout */}
                    <div className="mt-4 pt-3 border-t border-gray-800/80 flex items-center justify-between gap-2">
                      <button
                        onClick={() => viewProofDocument(item.point_id)}
                        className="text-xs font-semibold text-gray-400 hover:text-gray-200 transition-colors"
                      >
                        View PDF Link
                      </button>
                      
                      <button
                        onClick={() => navigate('/submit-activity', { state: { editRecord: item } })}
                        className="bg-gradient-to-r from-[#E2453D] to-[#557FDF] text-xs font-bold text-white px-4 py-2 rounded-lg hover:opacity-90 shadow active:scale-95 transition-all cursor-pointer"
                      >
                        Fix & Resubmit
                      </button>
                    </div>

                  </div>
                ))}
              </div>
              {hasMore && (
                <div className="w-full flex justify-center mt-6">
                  <button onClick={loadMore} className="px-4 py-2 bg-blue-600 rounded text-white">Load more</button>
                </div>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}