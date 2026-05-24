import React from "react";
import MainCard from "../../MainCard";
import AudienceBadge from "./AudienceBadge";
import { Calendar, Pin, Trash2 } from "lucide-react";

/**
 * NoticeCard
 * 
 * Reusable panel presenting school bulletins, pinned statuses, and publisher names.
 */
const NoticeCard = ({ 
  title, 
  content, 
  date, 
  audience = "ALL", 
  isPinned = false, 
  onDelete 
}) => {
  return (
    <MainCard className={`p-5 hover:shadow-md transition-shadow bg-white border shadow-sm relative flex flex-col justify-between ${
      isPinned ? "border-amber-200 bg-amber-50/10" : "border-[#caf0f8]/50"
    }`}>
      {isPinned && (
        <div className="absolute top-0 right-0 p-3 text-amber-500" title="Pinned Notice">
          <Pin size={13} fill="currentColor" />
        </div>
      )}

      <div>
        <div className="flex items-center gap-2 border-b border-[#caf0f8]/40 pb-2.5 mb-3">
          <AudienceBadge audience={audience} />
          <span className="text-[9px] font-bold text-gray-400 flex items-center gap-1">
            <Calendar size={10} />
            {date}
          </span>
        </div>
        <h4 className="text-xs font-black text-[#03045e] tracking-tight line-clamp-1">
          {title}
        </h4>
        <p className="text-[10px] font-semibold text-gray-500 mt-2 line-clamp-3 leading-relaxed">
          {content}
        </p>
      </div>

      <div className="mt-4 border-t border-[#caf0f8]/30 pt-3 flex items-center justify-between">
        <span className="text-[9px] font-black text-[#0077b6] uppercase">Active Circular</span>
        {onDelete && (
          <button 
            onClick={onDelete}
            className="p-1 text-gray-300 hover:text-rose-600 transition-colors"
            title="Delete Notice"
          >
            <Trash2 size={12} />
          </button>
        )}
      </div>
    </MainCard>
  );
};

export default React.memo(NoticeCard);
