import React from "react";
import MainCard from "../../../components/MainCard";

const ActionCenterSkeleton = () => {
  return (
    <MainCard className="p-6 border border-gray-100 bg-white relative overflow-hidden animate-pulse">
      <div className="pb-3 border-b border-gray-50 mb-5">
        <div className="h-4 w-32 bg-gray-200 rounded-md mb-2" />
        <div className="h-3 w-48 bg-gray-200 rounded-md" />
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 border border-gray-50 rounded-2xl bg-gray-50/50 space-y-3">
            <div className="flex justify-between items-center">
              <div className="h-3 w-16 bg-gray-200 rounded-md" />
              <div className="h-2 w-10 bg-gray-200 rounded-md" />
            </div>
            <div className="h-3.5 w-full bg-gray-200 rounded-md" />
            <div className="h-3 w-2/3 bg-gray-200 rounded-md" />
          </div>
        ))}
      </div>
    </MainCard>
  );
};

export default ActionCenterSkeleton;

