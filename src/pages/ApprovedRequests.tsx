import React from "react";
import Cards from "../components/Cards";

interface ApprovedItem {
  title: string;
  date: string;
  status: "Approved";
}

export default function ApprovedRequests(): React.ReactElement {
  const approvedItems: ApprovedItem[] = [
    { title: "Environment Talk", date: "02/06/2025", status: "Approved" },
    { title: "Environment Talk", date: "10/06/2025", status: "Approved" },
    { title: "Environment Talk", date: "15/06/2025", status: "Approved" },
  ];

  return (
    <div className="flex min-h-screen bg-black text-white">
      <main className="flex-1 flex flex-col">
        <section className="flex justify-center items-center flex-col mt-12 px-4">
          {/* Gradient Heading */}
          <h2 className="text-2xl font-bold bg-gradient-to-r from-[#E2453D] to-[#557FDF] text-transparent bg-clip-text mb-8">
            Approved Requests
          </h2>

          <div className="w-full max-w-md">
            {/* Title Label */}
            <div className="text-white font-semibold text-lg mb-5">Title</div>

            {/* Card List */}
            <div className="flex flex-col gap-5">
              {approvedItems.map((item, idx) => (
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
