import React from "react";
import MainCard from "../../MainCard";

/**
 * AnalyticsCard
 * 
 * Container panel designed specifically to host lightweight chart widgets, filters, and logs summaries.
 */
const AnalyticsCard = ({ 
  title, 
  subtitle, 
  children, 
  actionsSlot = null 
}) => {
  return (
    <MainCard className="p-6 hover:shadow-md transition-shadow bg-white border border-[#caf0f8]/50 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#caf0f8]/30 pb-4 mb-4">
          <div>
            <h3 className="text-xs font-black text-[#03045e] uppercase tracking-wider">
              {title}
            </h3>
            {subtitle && (
              <p className="text-[10px] text-gray-400 font-semibold mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          {actionsSlot && (
            <div className="flex items-center gap-2 self-start sm:self-auto">
              {actionsSlot}
            </div>
          )}
        </div>
        
        <div className="w-full">
          {children}
        </div>
      </div>
    </MainCard>
  );
};

export default React.memo(AnalyticsCard);
