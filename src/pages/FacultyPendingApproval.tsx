import { useState, useEffect } from 'react';
import { clearCache, getCachedData, getCacheTTL, setCacheData } from '../utils/cache';
import useClientPagination from '../hooks/useClientPagination';
import { getTimeAgo } from '../utils/time';

type PendingRequest = {
  point_id: number;
  student_roll_number: string;
  student_name: string;
  activity_name: string;
  points_awarded: number;
  submission_date: string;
  previous_rejection_reason?: string;
  proof_document?: string;
  status: string;
};

type FacultyPendingApprovalProps = {
  setIsLoggedIn: (val: boolean) => void;
};

const FACULTY_PENDING_CACHE_KEY = 'faculty_pending_requests_cache';
const FACULTY_CACHE_TTL_ENV = 'VITE_OTHER_ROLES_CACHE_ACTIVE_TIME';
const DEFAULT_CACHE_TTL_MINUTES = 10;

export default function FacultyPendingApproval({ /*setIsLoggedIn*/ }: FacultyPendingApprovalProps) {
  const [requestsRaw, setRequestsRaw] = useState<PendingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState<{ [key: number]: string }>({});
  const [showRejectModal, setShowRejectModal] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [fromCache, setFromCache] = useState(false);
  const { items, loadMore, hasMore } = useClientPagination<PendingRequest>(requestsRaw, 15);

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async (bypass = false) => {
    try {
      setLoading(true);
      setError(null);

      if (!bypass) {
        const cachedData = getCachedData<PendingRequest[]>(FACULTY_PENDING_CACHE_KEY);
        if (cachedData && cachedData.length) {
          const rawCache = sessionStorage.getItem(FACULTY_PENDING_CACHE_KEY);
          const cacheEntry = rawCache ? JSON.parse(rawCache) : null;
          setRequestsRaw(cachedData);
          setLastUpdated(cacheEntry?.timestamp || Date.now());
          setFromCache(true);
          setLoading(false);
          return;
        }
      }

      const response = await fetch('/api/faculty/requests/pending', { method: 'GET', credentials: 'include' });
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      const data = await response.json();
      const list = Array.isArray(data) ? data : data.requests || [];
      setRequestsRaw(list);

      const cacheTTL = getCacheTTL(FACULTY_CACHE_TTL_ENV, DEFAULT_CACHE_TTL_MINUTES);
      setCacheData(FACULTY_PENDING_CACHE_KEY, list, cacheTTL);
      setLastUpdated(Date.now());
      setFromCache(false);
    } catch (err: any) {
      setError(err.message || 'Failed to load pending requests');
      setRequestsRaw([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (pointId: number) => {
    try {
      setProcessingId(pointId);
      const response = await fetch('/api/faculty/requests/approve', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ point_id: pointId }),
      });
      if (!response.ok) throw new Error('Failed to approve request');
      clearCache(FACULTY_PENDING_CACHE_KEY);
      setRequestsRaw(prev => prev.filter(r => r.point_id !== pointId));
    } catch (err: any) {
      alert('Error approving request: ' + err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (pointId: number) => {
    const reason = rejectReason[pointId];
    if (!reason?.trim()) {
      alert('Please provide a rejection reason');
      return;
    }
    try {
      setProcessingId(pointId);
      const response = await fetch('/api/faculty/requests/reject', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ point_id: pointId, rejection_reason: reason }),
      });
      if (!response.ok) throw new Error('Failed to reject request');
      clearCache(FACULTY_PENDING_CACHE_KEY);
      setRequestsRaw(prev => prev.filter(r => r.point_id !== pointId));
      setShowRejectModal(null);
      setRejectReason({});
    } catch (err: any) {
      alert('Error rejecting request: ' + err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleViewProof = (pointId: number) => {
    window.open(`/api/faculty/requests/proof?point_id=${pointId}`, '_blank');
  };

  const toTitleCase = (str: string) => {
    if (!str) return '';
    return str.split(' ').map(w => w ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : '').join(' ');
  };

  if (loading) return <div className="text-white bg-[#0d1117] min-h-screen flex items-center justify-center font-mono text-sm">Loading requests list...</div>;

  return (
    <div className="w-full min-h-screen bg-[#0d1117]">
      {/* Container is nested cleanly inside your global application layout shell framework */}
      <main className="flex-grow p-4 sm:p-6 lg:p-10 flex flex-col min-w-0 text-white max-w-6xl mx-auto w-full">
        <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-[#E2453D] via-[#916296] to-[#557FDF] bg-clip-text text-transparent tracking-tight">
              Pending Approval
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-300 mt-2">
              {lastUpdated && (
                <span className="inline-flex items-center gap-2 rounded-full border border-gray-700 bg-white/5 px-3 py-2">
                  Last updated {getTimeAgo(lastUpdated)}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => fetchPendingRequests(true)}
            className="rounded-lg border border-gray-700 bg-[#111827] px-4 py-2 text-white transition hover:bg-[#1f2937]"
          >
            Refresh
          </button>
        </div>

        {error && <div className="bg-red-950/40 border border-red-900/50 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">{error}</div>}

        {items.length === 0 ? (
          <div className="text-center text-gray-500 py-16 bg-[#161b22]/30 border border-gray-800 rounded-2xl">
            <p className="text-base sm:text-lg">No pending student requests waiting for approval.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 w-full">
            {items.map(request => (
              <div key={request.point_id} className="bg-[#161b22]/40 border border-gray-800 rounded-2xl p-5 flex flex-col justify-between shadow-xl transition-all hover:border-blue-500/50">
                <div>
                  <div className="mb-4 pb-3 border-b border-gray-800/80">
                    <h3 className="text-base font-black tracking-wide text-gray-100 truncate">{toTitleCase(request.student_name)}</h3>
                    <p className="text-xs text-gray-500 font-mono mt-0.5 uppercase">Roll: {request.student_roll_number}</p>
                  </div>

                  <div className="space-y-3 text-xs sm:text-sm">
                    <div>
                      <span className="text-gray-500 font-semibold block text-[11px] uppercase tracking-wider mb-0.5">Activity</span>
                      <p className="text-gray-200 font-medium line-clamp-2">{request.activity_name}</p>
                    </div>
                    <div className="flex justify-between border-t border-gray-900 pt-2">
                      <div>
                        <span className="text-gray-500 font-semibold block text-[11px] uppercase tracking-wider">Points</span>
                        <span className="text-green-400 font-mono font-bold">{request.points_awarded} PTS</span>
                      </div>
                      <div className="text-right">
                        <span className="text-gray-500 font-semibold block text-[11px] uppercase tracking-wider">Submitted</span>
                        <span className="text-gray-400 font-mono text-xs">{new Date(request.submission_date).toLocaleDateString('en-GB')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-gray-900">
                  <div className="flex gap-2 w-full">
                    <button onClick={() => handleApprove(request.point_id)} disabled={processingId === request.point_id} className="flex-1 py-2 bg-green-600 hover:bg-green-700 font-bold text-xs rounded-lg transition-all shadow cursor-pointer">
                      Approve
                    </button>
                    <button onClick={() => setShowRejectModal(request.point_id)} disabled={processingId === request.point_id} className="flex-1 py-2 bg-red-600 hover:bg-red-700 font-bold text-xs rounded-lg transition-all shadow cursor-pointer">
                      Reject
                    </button>
                    <button onClick={() => handleViewProof(request.point_id)} className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold text-xs rounded-lg transition-all border border-gray-700/60 cursor-pointer">
                      PDF
                    </button>
                  </div>

                  {showRejectModal === request.point_id && (
                    <div className="mt-3 p-3 bg-red-950/20 border border-red-900/30 rounded-xl space-y-2">
                      <textarea value={rejectReason[request.point_id] || ''} onChange={e => setRejectReason({ ...rejectReason, [request.point_id]: e.target.value })} placeholder="Provide context reason..." className="w-full bg-[#0d1117] text-white p-2 rounded-lg text-xs focus:outline-none focus:border-red-500 border border-gray-800" rows={2} />
                      <div className="flex gap-2">
                        <button onClick={() => handleReject(request.point_id)} disabled={processingId === request.point_id} className="flex-1 py-1.5 bg-red-700 hover:bg-red-800 font-bold text-[11px] rounded-md transition-all cursor-pointer">Confirm</button>
                        <button onClick={() => setShowRejectModal(null)} className="flex-1 py-1.5 bg-gray-800 hover:bg-gray-700 font-bold text-[11px] rounded-md transition-all cursor-pointer">Cancel</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        {hasMore && (
          <div className="w-full flex justify-center mt-6">
            <button onClick={loadMore} className="px-4 py-2 bg-blue-600 rounded text-white">Load more</button>
          </div>
        )}
      </main>
    </div>
  );
}