import React from "react";
import EventCards from "../components/EventCards";

const allocatedData = [
  {
    title: "AI Workshop Participation",
    date: "2024-05-12",
    reason: "Incomplete documentation provided.",
  },
  {
    title: "Tech Fest Volunteering",
    date: "2024-06-01",
    reason: "Activity hours exceeded the allowed limit.",
  },
  {
    title: "Hackathon Winner",
    date: "2024-04-20",
    reason: "Certificate not verified by authority.",
  },
  {
    title: "Open Source Contribution",
    date: "2024-03-15",
    reason: "GitHub link missing.",
  },
];

const AllocatedRequests: React.FC = () => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    }); // => D/M/YYYY format
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 py-8 flex flex-col items-center">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-[#E2453D] to-[#557FDF] text-transparent bg-clip-text mb-8">
        Allocated Requests
      </h2>

      <div className="w-full max-w-6xl flex flex-col items-start ml-30">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 gap-y-2 w-full max-w-[1000px] px-4">
          {allocatedData.map((req, idx) => (
            <div key={idx}>
              {/* Only show Title heading above first card */}
              {idx === 0 ? (
                <h3 className="text-base font-medium mb-4 text-left">Title</h3>
              ) : (
                <div className="h-6 mb-4" /> // spacer for alignment
              )}
              <EventCards
                title={req.title}
                date={formatDate(req.date)}
                actions={["Revoke Allocation", "Re-Allocate", "Update Details"]}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllocatedRequests;