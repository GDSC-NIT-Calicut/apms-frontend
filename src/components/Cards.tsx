import React from "react";

type CardProps = {
  title: string;
  date: string;
  status: "In process" | "Approved" | "Resubmit";
};

const statusStyles: Record<CardProps["status"], string> = {
  "In process": "bg-gradient-to-r from-[#992622] to-[#1E3A8A] text-white",
  "Approved": "bg-gradient-to-r from-[#992622] to-[#1E3A8A] text-white",
  "Resubmit": "bg-gradient-to-r from-[#992622] to-[#1E3A8A] text-white",
};

const Cards: React.FC<CardProps> = ({ title, date, status }) => {
  return (
    <div className="border border-white/30 rounded-md w-90 px-6 py-6 flex flex-col gap-4 bg-black text-white">
      <div className="text-base font-medium">{title}</div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-300">{date}</span>
        <span
          className={`text-sm px-5 py-3 rounded font-semibold ${statusStyles[status]}`}
        >
          {status}
        </span>
      </div>
    </div>
  );
};

export default Cards;
