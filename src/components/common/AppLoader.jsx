import React from "react";
import { Loader2 } from "lucide-react";

/**
 * AppLoader
 * 
 * Unified institutional loading component using standard branding colors.
 * Provides a professional, non-blocking spinner and status text.
 */
const AppLoader = ({ message = "Loading Workspace...", className = "" }) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center space-y-4 ${className}`}>
      <div className="relative flex items-center justify-center">
        {/* Institutional styled pulsing backgrounds */}
        <div className="absolute w-12 h-12 bg-sky-100 rounded-full animate-ping opacity-35" />
        <div className="relative p-3 bg-white rounded-2xl border border-sky-100 shadow-sm">
          <Loader2 className="w-6 h-6 text-[#0077b6] animate-spin" />
        </div>
      </div>
      <div>
        <p className="text-xs font-black text-[#03045e] uppercase tracking-wider">
          {message}
        </p>
        <p className="text-[10px] font-bold text-gray-400 mt-0.5">
          Retrieving academic rosters...
        </p>
      </div>
    </div>
  );
};

export default AppLoader;
