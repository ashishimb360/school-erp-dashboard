import React from "react";
import { Search } from "lucide-react";

/**
 * AdminSearchBar
 * 
 * Standalone, compact input component with Search prefix.
 */
const AdminSearchBar = ({ 
  value = "", 
  onChange, 
  placeholder = "Quick search..." 
}) => {
  return (
    <div className="relative w-full">
      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
        <Search size={14} />
      </span>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#caf0f8]/20 border border-[#caf0f8]/50 text-xs text-gray-700 font-bold focus:outline-none focus:border-[#0077b6] placeholder-gray-400 transition-colors"
      />
    </div>
  );
};

export default React.memo(AdminSearchBar);
