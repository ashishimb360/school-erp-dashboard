import React from "react";
import MainCard from "../../MainCard";
import { ShieldCheck, Calendar, Users } from "lucide-react";

/**
 * CommitteeCard
 * 
 * Reusable panel presenting regulatory and executive committees (Discipline, Examination, etc.).
 */
const CommitteeCard = ({ 
  name, 
  category = "Administrative", 
  coordinator, 
  membersCount = 0, 
  responsibility,
  onManage 
}) => {
  return (
    <MainCard className="p-5 hover:shadow-md transition-shadow bg-white border border-[#caf0f8]/50 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between border-b border-[#caf0f8]/30 pb-2 mb-3">
          <div className="flex items-center gap-1 text-[#03045e]">
            <ShieldCheck size={14} />
            <span className="text-[9px] font-black uppercase tracking-wider">{category}</span>
          </div>
          <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase text-amber-600 bg-amber-50">
            ACTIVE TERM
          </span>
        </div>

        <h3 className="text-sm font-black text-gray-800 tracking-tight truncate">
          {name}
        </h3>
        
        <p className="text-[10px] font-semibold text-gray-400 mt-1.5 leading-relaxed italic">
          "{responsibility}"
        </p>

        <div className="mt-4 space-y-1.5 text-xs font-semibold text-gray-500">
          <p>Chairperson: <strong className="text-[#03045e]">{coordinator}</strong></p>
        </div>
      </div>

      <div className="mt-5 border-t border-[#caf0f8]/50 pt-3 flex items-center justify-between text-[10px] font-black text-[#03045e]">
        <span className="flex items-center gap-1">
          <Users size={12} className="text-[#00b4d8]" />
          {membersCount} Assigned Staff
        </span>
        {onManage && (
          <button 
            onClick={onManage}
            className="text-[#0077b6] hover:text-[#03045e] transition-colors"
          >
            MANAGE CORE
          </button>
        )}
      </div>
    </MainCard>
  );
};

export default React.memo(CommitteeCard);
