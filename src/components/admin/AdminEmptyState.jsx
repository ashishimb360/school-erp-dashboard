import React from "react";
import { Inbox } from "lucide-react";

/**
 * AdminEmptyState
 * 
 * Elegant fallback state with centered layout, subtle dashed borders,
 * and descriptive text when directory results map to zero length.
 */
const AdminEmptyState = ({ 
  title = "No records matching query", 
  description = "Alter your search filter or clear active criteria to view administrative registry rows.", 
  icon: Icon = Inbox 
}) => {
  return (
    <div className="py-12 px-6 text-center border border-dashed border-[#caf0f8] shadow-sm flex flex-col items-center justify-center rounded-3xl bg-white w-full">
      <div className="w-14 h-14 rounded-full bg-[#caf0f8]/30 flex items-center justify-center text-[#03045e] mb-4">
        <Icon size={24} />
      </div>
      <h3 className="text-sm font-black text-[#03045e] mb-1.5">{title}</h3>
      {description && (
        <p className="text-xs text-gray-400 font-bold max-w-sm leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
};

export default React.memo(AdminEmptyState);
