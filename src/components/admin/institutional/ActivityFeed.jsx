import React from "react";
import MainCard from "../../MainCard";
import { Sparkles, Calendar } from "lucide-react";

/**
 * ActivityFeed
 * 
 * Reusable chronologically structured timeline logs of school achievements and notice dispatches.
 */
const ActivityFeed = ({ logs = [] }) => {
  return (
    <MainCard className="p-6 border border-[#caf0f8]/50 shadow-sm bg-white">
      <div className="flex items-center justify-between border-b border-[#caf0f8] pb-4 mb-4">
        <div>
          <h3 className="text-sm font-black text-[#03045e] uppercase tracking-wider">Chronological Operations Feed</h3>
          <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Real-time school calendar and announcements log</p>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-[#0077b6] font-bold">
          <Calendar size={12} />
          <span>TODAY</span>
        </div>
      </div>

      <div className="relative border-l-2 border-[#caf0f8] ml-3 pl-6 space-y-6 my-2">
        {logs.map((log, idx) => (
          <div key={idx} className="relative">
            {/* Bullet Point */}
            <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-[#ade8f4] border-2 border-[#0077b6] flex items-center justify-center">
              <Sparkles size={8} className="text-[#03045e]" />
            </div>
            
            <div>
              <span className="block text-[8px] font-black uppercase text-gray-400">
                {log.category || "Engagement Log"}
              </span>
              <h4 className="text-xs font-black text-gray-800 tracking-tight mt-0.5">
                {log.title}
              </h4>
              <p className="text-[10px] font-semibold text-gray-500 mt-1 leading-relaxed">
                {log.description}
              </p>
              <span className="block text-[8px] font-bold text-[#00b4d8] mt-2">
                {log.time || "Just now"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </MainCard>
  );
};

export default React.memo(ActivityFeed);
