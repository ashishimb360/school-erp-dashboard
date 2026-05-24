import React from "react";
import MainCard from "../../MainCard";
import { Users, ArrowRight } from "lucide-react";

/**
 * ClassOverviewCard
 * 
 * Reusable summary card for classes displaying teacher mappings, student load factors, and streaming names.
 */
const ClassOverviewCard = ({ 
  name, 
  stream, 
  classTeacherName, 
  room, 
  strength = 0, 
  capacity = 45, 
  onManage 
}) => {
  const isFull = strength >= capacity;
  const isNear = strength >= capacity - 5 && strength < capacity;

  return (
    <MainCard className="p-6 relative overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all duration-150 border border-[#caf0f8]/60 bg-white">
      <div>
        <div className="flex items-center justify-between border-b border-[#caf0f8] pb-3 mb-4">
          <span className="text-xs font-black text-[#03045e] uppercase tracking-wider">{name}</span>
          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
            isFull ? "bg-rose-50 border border-rose-100 text-rose-600" :
            isNear ? "bg-amber-50 border border-amber-100 text-amber-600" :
            "bg-emerald-50 border border-emerald-100 text-emerald-600"
          }`}>
            {isFull ? "Full" : isNear ? "Near Capacity" : "Available"}
          </span>
        </div>
        <div className="space-y-3">
          <div>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Stream</p>
            <p className="text-xs font-black text-[#03045e] truncate mt-0.5">{stream}</p>
          </div>
          <div>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Class Teacher</p>
            <p className="text-xs font-black text-gray-700 mt-0.5">{classTeacherName || "Unassigned"}</p>
          </div>
          <div>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Room Location</p>
            <p className="text-xs font-semibold text-gray-500 mt-0.5">{room || "N/A"}</p>
          </div>
        </div>
      </div>
      
      <div className="mt-6 border-t border-[#caf0f8]/50 pt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users size={14} className="text-[#0077b6]" />
          <span className="text-xs font-black text-[#03045e]">
            {strength} <span className="text-[10px] text-gray-400 font-bold">/ {capacity}</span>
          </span>
        </div>
        {onManage && (
          <button 
            onClick={onManage}
            className="text-[10px] font-black text-[#0077b6] hover:text-[#03045e] flex items-center gap-1 group transition-colors"
          >
            <span>MANAGE CLASS</span>
            <ArrowRight size={10} className="transform group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </div>
    </MainCard>
  );
};

export default React.memo(ClassOverviewCard);
