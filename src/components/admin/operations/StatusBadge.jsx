import React from "react";

/**
 * StatusBadge
 * 
 * Standardized status indicators across operations modules.
 */
const StatusBadge = ({ status = "pending" }) => {
  const styles = {
    pending: "bg-amber-50 text-amber-600 border border-amber-100",
    approved: "bg-emerald-50 text-emerald-600 border border-emerald-100",
    rejected: "bg-rose-50 text-rose-600 border border-rose-100",
    paid: "bg-emerald-50 text-emerald-600 border border-emerald-100",
    unpaid: "bg-rose-50 text-rose-600 border border-rose-100",
    outstanding: "bg-amber-50 text-amber-600 border border-amber-100",
    "in-route": "bg-blue-50 text-[#0077b6] border border-blue-100",
    completed: "bg-emerald-50 text-emerald-600 border border-emerald-100",
    verified: "bg-emerald-50 text-emerald-600 border border-emerald-100 animate-pulse"
  };

  const formattedStatus = status.toLowerCase();
  const activeStyle = styles[formattedStatus] || styles.pending;

  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${activeStyle}`}>
      {status}
    </span>
  );
};

export default React.memo(StatusBadge);
