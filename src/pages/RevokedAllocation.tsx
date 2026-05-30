import React, { useEffect, useState } from "react";
import Cards from "../components/Cards";
import AllocationActionModal from "../components/AllocationActionModal";
import { getRevokedAllocations, downloadAllocationFile } from "../utils/eventOrganizer";

interface BackendAllocationItem {
  allocation_id: number;
  organizer_id: number;
  event_name: string;
  event_type: string;
  event_date: string;
  allocation_date: string;
  file_path: string;
  status: "revoked";
}

export default function RevokedAllocation(): React.ReactElement {
  const [revokedItems, setRevokedItems] = useState<BackendAllocationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<BackendAllocationItem | null>(null);

  useEffect(() => {
    fetchRevokedData();
  }, []);

  const fetchRevokedData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getRevokedAllocations();
      setRevokedItems(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("Failed to load revoked logs:", err);
      setError(err.message || "Failed to download revoked points allocation records.");
    } finally {
      setLoading(false);
    }
  };

  const handleReallocateTrigger = (item: BackendAllocationItem) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const cleanDateInputFormat = (isoString: string) => {
    if (!isoString) return "";
    return isoString.split('T')[0];
  };

  const formatDateString = (isoString: string) => {
    if (!isoString) return "N/A";
    const dateObj = new Date(isoString);
    if (isNaN(dateObj.getTime())) return isoString;
    return dateObj.toLocaleDateString("en-GB");
  };

  return (
    <main className="pt-14 md:pt-0 p-4 sm:p-6 lg:p-10 text-white max-w-4xl mx-auto w-full">
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-6 bg-gradient-to-r from-[#E2453D] via-[#916296] to-[#557FDF] bg-clip-text text-transparent tracking-tight">
        Revoked Allocation
      </h1>

      {error && <div className="bg-red-950/40 border border-red-900/50 text-red-400 px-4 py-3 rounded-xl text-sm font-medium mb-6">{error}</div>}

      {loading ? (
        <div className="text-center font-mono text-sm text-gray-500 py-20">Loading revoked ledger metrics tracking array...</div>
      ) : revokedItems.length === 0 ? (
        <div className="text-center text-gray-500 py-16 bg-[#161b22]/30 border border-gray-800 rounded-2xl">
          <p className="text-base sm:text-lg font-medium">No historically revoked point buckets recorded on your account.</p>
        </div>
      ) : (
        <div className="w-full space-y-4">
          <div className="text-gray-400 font-bold text-xs uppercase tracking-widest px-1">Revoked Distribution History</div>

          <div className="flex flex-col gap-4">
            {revokedItems.map((item) => (
              /* Wrapped inside a relative container to overlay the absolute-positioned download action button */
              <div key={item.allocation_id} className="relative group w-full max-w-[500px]">
                
                {/* Embedded download action anchor matching your active allocations page layout */}
                <button 
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevents clicking the download button from opening the reallocate modal
                    downloadAllocationFile(item.allocation_id, item.event_name);
                  }}
                  title="Download Revoked Ledger CSV source sheet copy"
                  className="absolute top-4 right-4 z-10 bg-gray-900/80 border border-gray-800 hover:border-gray-700 p-2 rounded-lg text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </button>

                {/* Main clickable area to trigger reallocation workflow modal */}
                <div onClick={() => handleReallocateTrigger(item)} className="cursor-pointer">
                  <Cards
                    title={item.event_name}
                    date={formatDateString(item.event_date)}
                    status="Re Allocate"
                  />
                </div>
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
          mode="reallocate"
          onSuccess={fetchRevokedData}
        />
      )}
    </main>
  );
}