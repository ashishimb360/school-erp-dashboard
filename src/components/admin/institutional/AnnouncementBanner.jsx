import React from "react";
import MainCard from "../../MainCard";
import { Megaphone, Calendar } from "lucide-react";

/**
 * AnnouncementBanner
 * 
 * Featured wide panel presenting institution-wide communications or event alerts.
 */
const AnnouncementBanner = ({ 
  title, 
  content, 
  date = "June 1, 2026",
  audience = "ALL" 
}) => {
  return (
    <MainCard className="p-6 bg-gradient-to-r from-[#03045e] to-[#023e8a] border-none text-white relative overflow-hidden shadow-md">
      {/* Visual background details */}
      <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-4">
        <Megaphone size={120} />
      </div>

      <div className="relative z-10 max-w-xl space-y-3">
        <div className="flex items-center gap-2">
          <span className="bg-[#00b4d8] text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider">
            FEATURED UPDATE
          </span>
          <span className="text-[9px] text-gray-200 font-bold flex items-center gap-1">
            <Calendar size={10} />
            Target: {audience}
          </span>
        </div>
        
        <h3 className="text-base font-black tracking-tight leading-tight">
          {title}
        </h3>
        <p className="text-xs text-gray-100 font-semibold leading-relaxed">
          {content}
        </p>
        
        <div className="pt-2 text-[9px] text-gray-300 font-bold">
          Published: {date}
        </div>
      </div>
    </MainCard>
  );
};

export default React.memo(AnnouncementBanner);
