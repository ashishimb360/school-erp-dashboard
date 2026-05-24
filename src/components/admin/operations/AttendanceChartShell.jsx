import React from "react";
import MainCard from "../../MainCard";
import { BarChart2, ShieldAlert } from "lucide-react";

/**
 * AttendanceChartShell
 * 
 * Renders an analytical summary widget displaying attendance benchmarks.
 */
const AttendanceChartShell = ({ breakdown = [] }) => {
  return (
    <MainCard className="p-6 border border-[#caf0f8]/50 shadow-sm bg-white">
      <div className="flex items-center justify-between border-b border-[#caf0f8] pb-4 mb-4">
        <div>
          <h3 className="text-sm font-black text-[#03045e] uppercase tracking-wider">Attendance Rate Benchmark</h3>
          <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Benchmarked today across Senior Secondary sections</p>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-[#0077b6] font-black uppercase">
          <BarChart2 size={12} />
          <span>Active Roster</span>
        </div>
      </div>

      <div className="space-y-4">
        {breakdown.map((item, idx) => {
          const pct = parseFloat(item.rate);
          const isExcellent = pct >= 95;
          const isGood = pct >= 90 && pct < 95;
          
          return (
            <div key={idx} className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-bold text-gray-700">
                <span>{item.classSec}</span>
                <span className={isExcellent ? "text-emerald-600" : isGood ? "text-[#0077b6]" : "text-rose-600"}>
                  {item.rate}% Present
                </span>
              </div>
              <div className="w-full bg-gray-50 h-2 rounded-full overflow-hidden border border-gray-100/30">
                <div 
                  className={`h-full transition-all duration-300 ${
                    isExcellent ? "bg-emerald-500" :
                    isGood ? "bg-[#00b4d8]" :
                    "bg-rose-500"
                  }`} 
                  style={{ width: `${pct}%` }} 
                />
              </div>
            </div>
          );
        })}
      </div>
    </MainCard>
  );
};

export default React.memo(AttendanceChartShell);
