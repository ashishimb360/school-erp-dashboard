import React from "react";

/**
 * SubjectBadge
 * 
 * Consistent subject type chip helper.
 */
const SubjectBadge = ({ type = "core", name = "Core" }) => {
  const styles = {
    core: "bg-[#caf0f8] text-[#03045e] border border-[#caf0f8]/80 font-black",
    elective: "bg-[#ade8f4] text-[#0077b6] border border-[#ade8f4]/80 font-extrabold",
    lab: "bg-emerald-50 text-emerald-700 border border-emerald-100 font-extrabold"
  };

  const activeStyle = styles[type.toLowerCase()] || styles.core;

  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-lg text-[9px] uppercase tracking-wider ${activeStyle}`}>
      {name}
    </span>
  );
};

export default React.memo(SubjectBadge);
