import React from "react";
import { ChevronRight } from "lucide-react";

/**
 * AdminQuickActionCard
 * 
 * Reusable, interactive list action panel.
 * Elevates subtly on hover with a smooth layout transition and chevron accent.
 */
const AdminQuickActionCard = ({ 
  title, 
  description, 
  onClick, 
  icon: Icon 
}) => {
  return (
    <button 
      onClick={onClick}
      className="w-full p-4 text-left rounded-2xl bg-white border border-[#caf0f8] hover:bg-[#caf0f8]/30 hover:border-[#00b4d8] transition-all duration-150 group flex items-start justify-between gap-3"
    >
      <div className="flex gap-3 items-start min-w-0">
        {Icon && (
          <div className="p-2.5 rounded-xl bg-[#caf0f8]/50 text-[#03045e] group-hover:bg-[#03045e] group-hover:text-white transition-colors flex-shrink-0 mt-0.5">
            <Icon size={16} />
          </div>
        )}
        <div className="min-w-0">
          <p className="text-xs font-black text-[#03045e] group-hover:text-[#0077b6] transition-colors truncate">
            {title}
          </p>
          {description && (
            <p className="text-[10px] font-semibold text-gray-400 mt-1 leading-relaxed line-clamp-2">
              {description}
            </p>
          )}
        </div>
      </div>
      <ChevronRight 
        size={14} 
        className="text-[#00b4d8] group-hover:text-[#03045e] transition-colors flex-shrink-0 mt-1.5 self-center" 
      />
    </button>
  );
};

export default React.memo(AdminQuickActionCard);
