import React from "react";
import MainCard from "../MainCard";

/**
 * AdminSectionCard
 * 
 * Elegant structured wrapper container utilizing MainCard.
 * Standardizes title spacing, active border markers, and title header actions.
 */
const AdminSectionCard = ({ 
  title, 
  subtitle, 
  children, 
  className = "", 
  headerActions 
}) => {
  return (
    <MainCard className={`p-6 ${className}`}>
      {(title || headerActions) && (
        <div className="flex items-center justify-between border-b border-[#caf0f8] pb-4 mb-4">
          <div>
            {title && (
              <h2 className="text-lg font-black text-[#03045e] tracking-tight">{title}</h2>
            )}
            {subtitle && (
              <p className="text-gray-400 font-bold text-[10px] uppercase tracking-wider mt-0.5">{subtitle}</p>
            )}
          </div>
          {headerActions && (
            <div className="flex-shrink-0">
              {headerActions}
            </div>
          )}
        </div>
      )}
      <div className="w-full">
        {children}
      </div>
    </MainCard>
  );
};

export default React.memo(AdminSectionCard);
