import React from "react";
import MainCard from "../../MainCard";
import { Calendar, Tag } from "lucide-react";

/**
 * CalendarEventCard
 * 
 * Reusable panel presenting dates, event descriptions, and category tags.
 */
const CalendarEventCard = ({ 
  title, 
  dateStr, 
  category = "Academic", 
  description,
  type = "standard" 
}) => {
  const styles = {
    holiday: "border-rose-100 bg-rose-50/10 text-rose-600",
    exam: "border-amber-100 bg-amber-50/10 text-amber-600",
    competition: "border-blue-100 bg-blue-50/10 text-[#0077b6]",
    standard: "border-[#caf0f8]/50 bg-white text-gray-700"
  };

  const activeStyle = styles[type.toLowerCase()] || styles.standard;

  return (
    <MainCard className={`p-4 border shadow-sm flex items-center justify-between gap-4 ${activeStyle}`}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gray-50 flex flex-col items-center justify-center border border-gray-150 flex-shrink-0">
          <Calendar size={14} className="text-[#03045e]" />
        </div>
        <div>
          <span className="block text-[8px] font-black uppercase tracking-wider text-gray-400">
            {category} Event
          </span>
          <h4 className="text-xs font-black text-[#03045e] tracking-tight mt-0.5">
            {title}
          </h4>
          <p className="text-[10px] font-semibold text-gray-500 mt-1">
            {description}
          </p>
        </div>
      </div>

      <div className="text-right flex-shrink-0">
        <span className="block text-xs font-black text-[#0077b6]">
          {dateStr}
        </span>
        <span className="inline-block mt-1 text-[8px] font-bold text-gray-400 uppercase tracking-widest">
          TERM-I
        </span>
      </div>
    </MainCard>
  );
};

export default React.memo(CalendarEventCard);
