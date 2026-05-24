import React from "react";
import AdminEmptyState from "./AdminEmptyState";

/**
 * AdminDataTable
 * 
 * Reusable, high-fidelity table supporting custom row render functions,
 * scroll overflow limits, styled header grids, and automatic empty fallbacks.
 */
const AdminDataTable = ({ 
  headers = [], 
  items = [], 
  renderRow, 
  isEmpty = false,
  emptyTitle,
  emptyDescription,
  minWidth = "800px"
}) => {
  const isReallyEmpty = isEmpty || items.length === 0;

  return (
    <div className="overflow-x-auto w-full">
      {isReallyEmpty ? (
        <AdminEmptyState 
          title={emptyTitle || "No records matching query"} 
          description={emptyDescription || "Modify filters or clear active search keywords to view records."} 
        />
      ) : (
        <table className="w-full text-left border-collapse" style={{ minWidth }}>
          <thead>
            <tr className="border-b border-[#caf0f8] text-[10px] uppercase font-black tracking-wider text-gray-400">
              {headers.map((header, idx) => (
                <th key={idx} className="py-4 px-3 first:pl-2 last:pr-2">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#caf0f8]/30">
            {items.map((item, index) => renderRow(item, index))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default React.memo(AdminDataTable);
