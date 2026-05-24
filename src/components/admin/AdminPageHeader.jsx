import React from "react";
import { motion } from "framer-motion";

/**
 * AdminPageHeader
 * 
 * Standardized high-fidelity header for all administrative modules.
 * Handles actions, responsive wrapping, and page descriptions dynamically.
 */
const AdminPageHeader = ({ title, description, actionButton, breadcrumbs = [] }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#caf0f8]/30 pb-4"
    >
      <div className="space-y-1">
        {breadcrumbs.length > 0 && (
          <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                <span>{crumb}</span>
                {idx < breadcrumbs.length - 1 && <span className="text-[#00b4d8] font-bold">/</span>}
              </React.Fragment>
            ))}
          </div>
        )}
        <h1 className="text-3xl font-black text-[#03045e] tracking-tight">{title}</h1>
        {description && (
          <p className="text-gray-500 font-semibold text-xs leading-relaxed">{description}</p>
        )}
      </div>
      {actionButton && (
        <div className="flex-shrink-0 self-start md:self-auto">
          {actionButton}
        </div>
      )}
    </motion.div>
  );
};

export default React.memo(AdminPageHeader);
