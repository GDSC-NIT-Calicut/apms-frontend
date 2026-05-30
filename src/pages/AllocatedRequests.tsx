import React, { useEffect, useState } from "react";
import EventCards from "../components/EventCards";
import AllocationActionModal from "../components/AllocationActionModal";
import { getAllocatedAllocations, revokeAllocationGroup, downloadAllocationFile } from "../utils/eventOrganizer";

interface BackendAllocationFolder {
  allocation_id: number;
  organizer_id: number;
  event_name: string;
  event_type: string;
  event_date: string;
  allocation_date: string;
  file_path: string;
  status: "allocated";
}

export default function AllocatedRequests(): React.ReactElement {
  const [allocatedItems, setAllocatedItems] = useState<BackendAllocationFolder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modal configuration states
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<BackendAllocationFolder | null>(null);
  const [modalMode, setModalMode] = useState<'update_details' | 'reallocate'>('update_details');

  useEffect(() => {
    fetchAllocatedData();
  }, []);

  const fetchAllocatedData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllocatedAllocations();
      setAllocatedItems(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("Failed to fetch allocated logs:", err);
      setError(err.message || "Failed to load active event allocations ledger.");
    } finally {
      setLoading(false);
    }
  };

  const handleCardActions = async (action: string, req: BackendAllocationFolder) => {
    if (action === "Revoke Allocation") {
      const confirmRevoke = window.confirm(`Are you sure you want to revoke points for "${req.event_name}"? This deletes matching approved points for all associated students.`);
      if (!confirmRevoke) return;
      try {
        await revokeAllocationGroup(req.allocation_id);
        fetchAllocatedData();
      } catch (err: any) {
        alert(err.message || "Failed to execute structural point revocation.");
      }
    } else if (action === "Update Details") {
      setSelectedItem(req);
      setModalMode('update_details');
      setModalOpen(true);
    } else if (action === "Re-Allocate") {
      setSelectedItem(req);
      setModalMode('reallocate');
      setModalOpen(true);
    }
  };

  const cleanDateInputFormat = (isoString: string) => {
    if (!isoString) return "";
    return isoString.split('T')[0];
  };

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "numeric", year: "numeric" });
  };

  return (
    <main className="pt-14 md:pt-0 p-4 sm:p-6 lg:p-10 text-white max-w-6xl mx-auto w-full">
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-6 bg-gradient-to-r from-[#E2453D] via-[#916296] to-[#557FDF] bg-clip-text text-transparent tracking-tight">
        Allocated Requests
      </h1>

      {error && <div className="bg-red-950/40 border border-red-900/50 text-red-400 px-4 py-3 rounded-xl text-sm font-medium mb-6">{error}</div>}

      {loading ? (
        <div className="text-center font-mono text-sm text-gray-500 py-20">Loading active point distributions roster...</div>
      ) : allocatedItems.length === 0 ? (
        <div className="text-center text-gray-500 py-16 bg-[#161b22]/30 border border-gray-800 rounded-2xl w-full">
          <p className="text-base sm:text-lg font-medium">No active student point distributions found on record.</p>
        </div>
      ) : (
        <div className="w-full space-y-4">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-gray-400 font-bold text-xs uppercase tracking-widest">Active Allocated Folders ({allocatedItems.length})</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {allocatedItems.map((req) => (
              <div key={req.allocation_id} className="h-full relative group">
                {/* Embedded download badge link button matching item 7 requirements */}
                <button 
                  onClick={() => downloadAllocationFile(req.allocation_id, req.event_name)}
                  title="Download Ledger CSV source sheet copy"
                  className="absolute top-4 right-4 z-10 bg-gray-900/80 border border-gray-800 hover:border-gray-700 p-2 rounded-lg text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </button>
                
                <EventCards
                  title={req.event_name}
                  date={formatDateDisplay(req.event_date)}
                  actions={["Revoke Allocation", "Re-Allocate", "Update Details"]}
                  onActionClick={(action) => handleCardActions(action, req)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedItem && (
        <AllocationActionModal
          isOpen={modalOpen}
          onClose={() => { setModalOpen(false); setSelectedItem(null); }}
          allocationId={selectedItem.allocation_id}
          initialName={selectedItem.event_name}
          initialDate={cleanDateInputFormat(selectedItem.event_date)}
          initialType={selectedItem.event_type}
          mode={modalMode}
          onSuccess={fetchAllocatedData}
        />
      )}
    </main>
  );
}