import React from "react";
import Cards from "../components/Cards";

interface PendingItem {
  title: string;
  date: string;
  status: "In process" | "Approved" | "Resubmit";
}

export default function PendingRequests(): React.ReactElement {
  const pendingItems: PendingItem[] = [
    { title: "Environment Talk", date: "28/5/2025", status: "In process" },
    { title: "Environment Talk", date: "28/5/2025", status: "In process" },
    { title: "Environment Talk", date: "28/5/2025", status: "In process" },
  ];

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <section className="flex justify-center items-center flex-col mt-12 px-4">
          {/* Gradient Heading (aligned same as SubmitActivity) */}
          <h2 className="text-2xl font-bold bg-gradient-to-r from-[#E2453D] to-[#557FDF] text-transparent bg-clip-text mb-8">
            Pending Requests
          </h2>

          <div className="w-full max-w-md">
            {/* Title label and underline */}
            <div className="text-white font-semibold text-lg mb-5">Title</div>
            {/* Card List */}
            <div className="flex flex-col gap-5">
              {pendingItems.map((item, idx) => (
                <Cards
                  key={idx}
                  title={item.title}
                  date={item.date}
                  status={item.status}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
