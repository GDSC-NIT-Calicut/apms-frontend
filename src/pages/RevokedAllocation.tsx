import React from "react";
import Cards from "../components/Cards";

interface RevokedItem {
  title: string;
  date: string;
  status: "Re Allocate"; 
}

export default function RevokedAllocation(): React.ReactElement {
  const revokedItems: RevokedItem[] = [
    { title: "Environment Talk", date: "28/5/2025", status: "Re Allocate" },
    { title: "Environment Talk", date: "28/5/2025", status: "Re Allocate" },
    { title: "Environment Talk", date: "28/5/2025", status: "Re Allocate" },
  ];

  return (
    <div className="flex min-h-screen bg-black text-white">
      <main className="flex-1 flex flex-col">
        <section className="flex justify-center items-center flex-col mt-12 px-4">
          {/* Gradient Heading */}
          <h2 className="text-2xl font-bold bg-gradient-to-r from-[#E2453D] to-[#557FDF] text-transparent bg-clip-text mb-8">
            Revoked Allocation
          </h2>

          <div className="w-full max-w-md">
            {/* Title Label */}
            <div className="text-white font-semibold text-lg mb-5">Title</div>

            {/* Card List */}
            <div className="flex flex-col gap-5">
              {revokedItems.map((item, idx) => (
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
