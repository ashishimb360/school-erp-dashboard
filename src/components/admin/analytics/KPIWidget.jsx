import React from "react";
import MainCard from "../../MainCard";
import { TrendingUp, TrendingDown } from "lucide-react";

/**
 * KPIWidget
 * 
 * Reusable card rendering critical operational metrics (Totals, Percentages) with trend rates.
 */
const KPIWidget = ({ 
  title, 
  value, 
  description, 
  icon: IconComponent, 
  trend = null, 
  trendDirection = "up",
  color = "#0077b6",
  bg = "#caf0f8" 
}) => {
  return (
    <MainCard className="p-5 hover:shadow-md transition-all duration-300 bg-white border border-[#caf0f8]/50 shadow-sm relative overflow-hidden flex flex-col justify-between h-32">
      <div className="flex justify-between items-start">
        <div>
          <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">
            {title}
          </span>
          <h2 className="text-xl font-black text-[#03045e] tracking-tight mt-1">
            {value}
          </h2>
        </div>

        <div 
          className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: bg, color: color }}
        >
          {IconComponent && <IconComponent size={16} />}
        </div>
      </div>

      <div className="flex items-center justify-between mt-3">
        <span className="text-[10px] font-bold text-gray-400">
          {description}
        </span>
        {trend && (
          <span className={`flex items-center gap-0.5 text-[10px] font-black ${
            trendDirection === "up" ? "text-emerald-600 bg-emerald-50 border border-emerald-100" : "text-rose-600 bg-rose-50 border border-rose-100"
          } px-2 py-0.5 rounded-full`}>
            {trendDirection === "up" ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            {trend}
          </span>
        )}
      </div>
    </MainCard>
  );
};

export default React.memo(KPIWidget);
