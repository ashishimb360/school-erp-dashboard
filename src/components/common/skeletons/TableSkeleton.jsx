import React from "react";
import MainCard from "../../MainCard";

const TableSkeleton = ({ rows = 4, cols = 4 }) => {
  return (
    <MainCard className="p-6 border border-gray-100 bg-white relative overflow-hidden animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div className="h-4 w-40 bg-gray-200 rounded-md" />
        <div className="h-8 w-24 bg-gray-200 rounded-xl" />
      </div>
      <div className="space-y-4">
        {/* Header Row */}
        <div className="flex gap-4 pb-2 border-b border-gray-100">
          {Array.from({ length: cols }).map((_, i) => (
            <div key={i} className="flex-1 h-3 bg-gray-200 rounded-md" />
          ))}
        </div>
        {/* Body Rows */}
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex gap-4 py-2">
            {Array.from({ length: cols }).map((_, j) => (
              <div key={j} className="flex-1 h-4 bg-gray-200 rounded-md" />
            ))}
          </div>
        ))}
      </div>
    </MainCard>
  );
};

export default TableSkeleton;
