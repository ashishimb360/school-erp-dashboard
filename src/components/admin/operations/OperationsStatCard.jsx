import React from "react";
import MainCard from "../../MainCard";
import { Sparkles } from "lucide-react";

/**
 * OperationsStatCard
 * 
 * Reusable panel presenting counters and metrics with stylized background details.
 */
const OperationsStatCard = ({ 
  title, 
  value, 
  description, 
  icon: IconComponent = Sparkles,
  color = "#0077b6",
  bg = "#caf0f8" 
}) => {
  return (
    <MainCard className="p-6 relative overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all duration-150 border border-[#caf0f8]/60 bg-white">
      <div>
        <div className="flex items-center justify-between border-b border-[#caf0f8]/40 pb-3 mb-4">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{title}</span>
          <div 
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: bg, color: color }}
          >
            <IconComponent size={14} />
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-black text-[#03045e] tracking-tight">{value}</h3>
          {description && (
            <p className="text-[10px] font-semibold text-gray-400 mt-1">{description}</p>
          )}
        </div>
      </div>
    </MainCard>
  );
};

export default React.memo(OperationsStatCard);
