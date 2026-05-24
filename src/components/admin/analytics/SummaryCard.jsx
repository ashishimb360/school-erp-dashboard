import React from "react";
import MainCard from "../../MainCard";

/**
 * SummaryCard
 * 
 * Renders lists of metrics or active logs (fee collections progress, exam syllabus checks)
 * in simple, high-visibility rows.
 */
const SummaryCard = ({ 
  title, 
  items = [] 
}) => {
  return (
    <MainCard className="p-5 border border-[#caf0f8]/50 shadow-sm bg-white">
      <h3 className="text-xs font-black text-[#03045e] border-b border-[#caf0f8]/30 pb-3 mb-4 uppercase tracking-wider">
        {title}
      </h3>
      
      <div className="space-y-3">
        {items.map((it, idx) => (
          <div key={idx} className="flex justify-between items-center text-xs font-bold text-gray-700 border-b border-gray-50 pb-2 last:border-0 last:pb-0">
            <span className="text-gray-500 font-semibold">{it.label}</span>
            <span className={it.highlight ? "text-[#0077b6] font-black" : "text-gray-800"}>
              {it.value}
            </span>
          </div>
        ))}
      </div>
    </MainCard>
  );
};

export default React.memo(SummaryCard);
