import React from "react";
import { Search } from "lucide-react";

/**
 * AdminFilterBar
 * 
 * Reusable layout row containing a highly styled text search input
 * and slot alignment for action/filter dropdown buttons.
 */
const AdminFilterBar = ({ 
  searchTerm = "", 
  onSearchChange, 
  placeholder = "Search directory database...", 
  filterButton,
  additionalControls
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#caf0f8]/50 pb-6">
      {/* Search Input Box */}
      <div className="relative flex-1 max-w-md">
        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
          <Search size={16} />
        </span>
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#caf0f8]/20 border border-[#caf0f8]/50 text-xs text-gray-700 font-bold focus:outline-none focus:border-[#0077b6] placeholder-gray-400 transition-colors"
        />
      </div>

      {/* Operations Filter Slots */}
      <div className="flex items-center gap-2 self-end md:self-auto flex-wrap">
        {filterButton && (
          <div className="flex-shrink-0">
            {filterButton}
          </div>
        )}
        {additionalControls && (
          <div className="flex-shrink-0">
            {additionalControls}
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(AdminFilterBar);
