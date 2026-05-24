import React from "react";

/**
 * AudienceBadge
 * 
 * Renders target audience group tags (ALL, STUDENTS, FACULTY, PARENTS) dynamically.
 */
const AudienceBadge = ({ audience = "ALL" }) => {
  const styles = {
    all: "bg-gray-50 text-gray-500 border border-gray-100",
    students: "bg-[#caf0f8]/40 text-[#0077b6] border border-[#caf0f8]",
    faculty: "bg-amber-50 text-amber-600 border border-amber-100",
    parents: "bg-emerald-50 text-emerald-600 border border-emerald-100"
  };

  const formatted = audience.toLowerCase();
  const activeStyle = styles[formatted] || styles.all;

  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${activeStyle}`}>
      {audience}
    </span>
  );
};

export default React.memo(AudienceBadge);
