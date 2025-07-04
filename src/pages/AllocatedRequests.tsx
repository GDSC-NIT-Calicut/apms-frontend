import React from "react";
import Cards from "../components/Cards";

const rejectedData = [
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
        Rejected Requests
      </h2>

      <div className="w-full max-w-6xl flex flex-col items-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-30 justify-center">
          {rejectedData.map((req, idx) => (
            <div key={idx} className="w-[290px] sm:w-[350px]">
              {idx === 0 ? (
                <h3 className="text-base font-medium mb-5 text-left">Title</h3>
              ) : (
                <div className="h-6 mb-5" />
              )}
              <Cards title={req.title} date={formatDate(req.date)} status="Resubmit" />
              <p className="text-sm text-white mt-2 ml-2">*{req.reason}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllocatedRequests;