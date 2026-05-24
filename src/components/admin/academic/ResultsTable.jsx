import React from "react";
import AcademicTable from "./AcademicTable";
import { Award, CheckCircle } from "lucide-react";

/**
 * ResultsTable
 * 
 * Reusable data grid displaying student academic outcomes, scores, and marks logs.
 */
const ResultsTable = ({ 
  results = [], 
  isEmpty = false, 
  onEditScore 
}) => {
  return (
    <AcademicTable
      headers={[
        "Adm No.",
        "Student Name",
        "Subject",
        "Exam Term",
        "Marks Obtained",
        "Max Marks",
        "Performance Index",
        "Result Status",
        "Actions"
      ]}
      items={results}
      isEmpty={isEmpty}
      emptyTitle="No results posted"
      emptyDescription="Ensure subject teachers have graded student sheets or adjust filter queries."
      renderRow={(res) => {
        const percent = Math.round((res.marksObtained / res.maxMarks) * 100);
        const isPassed = percent >= 40;
        
        return (
          <tr key={res.id} className="hover:bg-[#caf0f8]/10 transition-colors text-xs text-gray-700 font-bold border-b border-[#caf0f8]/40">
            <td className="py-4 px-3 text-[#03045e] font-black first:pl-2">
              {res.admissionNo || res.studentId}
            </td>
            <td className="py-4 px-3 text-gray-800 font-extrabold">{res.studentName}</td>
            <td className="py-4 px-3 text-[#0077b6]">{res.subjectName}</td>
            <td className="py-4 px-3">
              <span className="px-2 py-0.5 rounded bg-gray-50 border border-gray-100 text-gray-500 font-bold text-[9px] uppercase tracking-wider">
                {res.examName}
              </span>
            </td>
            <td className="py-4 px-3 text-[#03045e] font-black">{res.marksObtained}</td>
            <td className="py-4 px-3 text-gray-400 font-bold">{res.maxMarks}</td>
            <td className="py-4 px-3">
              <div className="flex items-center gap-2">
                <div className="w-16 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${
                      percent >= 80 ? "bg-emerald-500" :
                      percent >= 60 ? "bg-[#00b4d8]" :
                      percent >= 40 ? "bg-amber-500" :
                      "bg-rose-500"
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span className="text-[10px] font-black">{percent}%</span>
              </div>
            </td>
            <td className="py-4 px-3">
              <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                isPassed 
                  ? "bg-emerald-50 border border-emerald-100 text-emerald-600" 
                  : "bg-rose-50 border border-rose-100 text-rose-600"
              }`}>
                {isPassed ? "PASSED" : "FAILED"}
              </span>
            </td>
            <td className="py-4 px-3 text-right last:pr-2">
              {onEditScore && (
                <button 
                  onClick={() => onEditScore(res)}
                  className="text-[#0077b6] hover:text-[#03045e] transition-colors bg-[#caf0f8]/40 px-3 py-1.5 rounded-lg text-[9px] font-black"
                >
                  EDIT SCORE
                </button>
              )}
            </td>
          </tr>
        );
      }}
    />
  );
};

export default React.memo(ResultsTable);
