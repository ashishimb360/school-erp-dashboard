import React from "react";

/**
 * DashboardSection
 * 
 * Elegant wrapper for grouping widgets under clear titles and divider layouts.
 */
const DashboardSection = ({ 
  title, 
  action = null, 
  children 
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center border-b border-[#caf0f8] pb-2 mb-3">
        <h3 className="text-xs font-black text-[#03045e] uppercase tracking-wider">
          {title}
        </h3>
        {action && (
          <div className="flex items-center gap-2">
            {action}
          </div>
        )}
      </div>
      <div className="w-full">
        {children}
      </div>
    </div>
  );
};

export default React.memo(DashboardSection);
