import React from "react";
import { Search } from "lucide-react";

/**
 * InstitutionalFilterBar
 * 
 * Reusable filtering toolbar for institutional community engagement portals.
 */
const InstitutionalFilterBar = ({ 
  searchTerm = "", 
  onSearchChange, 
  placeholder = "Search...",
  filterSlots = null 
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-3xl bg-white/75 border border-[#caf0f8]/60 shadow-sm backdrop-blur-md">
      <div className="relative flex-1 max-w-md">
        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
          <Search size={14} />
        </span>
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#caf0f8]/20 border border-[#caf0f8]/50 text-xs text-gray-700 font-bold focus:outline-none focus:border-[#0077b6] placeholder-gray-400 transition-colors"
        />
      </div>
      
      {filterSlots && (
        <div className="flex flex-wrap items-center gap-3">
          {filterSlots}
        </div>
      )}
    </div>
  );
};

export default React.memo(InstitutionalFilterBar);
