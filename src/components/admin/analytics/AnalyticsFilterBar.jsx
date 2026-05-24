import React from "react";
import { Filter } from "lucide-react";

/**
 * AnalyticsFilterBar
 * 
 * Reusable layout bar for filtering logs, trends, and charts dynamically.
 */
const AnalyticsFilterBar = ({ 
  selectedClass = "", 
  onClassChange, 
  selectedStream = "", 
  onStreamChange,
  classes = [],
  streams = []
}) => {
  return (
    <div className="flex flex-wrap items-center gap-3 p-4 rounded-3xl bg-white/75 border border-[#caf0f8]/60 shadow-sm backdrop-blur-md">
      <div className="flex items-center gap-2 text-xs font-black text-[#03045e]">
        <Filter size={14} className="text-[#0077b6]" />
        <span>ANALYTICS SEGMENTATION</span>
      </div>

      <div className="flex flex-wrap items-center gap-2 ml-auto">
        {onClassChange && (
          <select
            value={selectedClass}
            onChange={(e) => onClassChange(e.target.value)}
            className="flex items-center gap-2 border border-[#caf0f8] hover:border-[#00b4d8] px-4 py-2 rounded-xl text-[10px] font-bold text-[#03045e] transition-colors bg-white outline-none"
          >
            <option value="">Filter Class Section...</option>
            {classes.map((c, idx) => (
              <option key={c.id || c || idx} value={c.id || c}>{c.name || c}</option>
            ))}
          </select>
        )}

        {onStreamChange && (
          <select
            value={selectedStream}
            onChange={(e) => onStreamChange(e.target.value)}
            className="flex items-center gap-2 border border-[#caf0f8] hover:border-[#00b4d8] px-4 py-2 rounded-xl text-[10px] font-bold text-[#03045e] transition-colors bg-white outline-none"
          >
            <option value="">Filter Streams...</option>
            {streams.map((s, idx) => (
              <option key={s.id || s || idx} value={s.id || s}>{s.name || s}</option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
};

export default React.memo(AnalyticsFilterBar);
