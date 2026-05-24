import React from "react";
import MainCard from "../../MainCard";
import StatusBadge from "./StatusBadge";
import { FileText, Download, ShieldCheck } from "lucide-react";

/**
 * DocumentCard
 * 
 * Reusable layout widget representing student/teacher documents.
 */
const DocumentCard = ({ 
  title, 
  category = "Student Record", 
  fileName, 
  fileSize = "1.2 MB", 
  status = "Verified", 
  onDownload 
}) => {
  return (
    <MainCard className="p-4 hover:shadow-md transition-shadow bg-white border border-[#caf0f8]/50 shadow-sm flex items-center justify-between">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-2xl bg-[#caf0f8]/50 text-[#03045e] flex items-center justify-center flex-shrink-0">
          <FileText size={18} />
        </div>
        <div className="min-w-0">
          <span className="block text-[8px] font-black uppercase text-gray-400 tracking-wider">
            {category}
          </span>
          <h4 className="text-xs font-black text-[#03045e] tracking-tight truncate mt-0.5">
            {title}
          </h4>
          <span className="block text-[9px] font-semibold text-gray-400 mt-1">
            {fileName} ({fileSize})
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <StatusBadge status={status} />
        {onDownload && (
          <button 
            onClick={onDownload}
            className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors border border-gray-150"
            title="Download Document"
          >
            <Download size={14} />
          </button>
        )}
      </div>
    </MainCard>
  );
};

export default React.memo(DocumentCard);
