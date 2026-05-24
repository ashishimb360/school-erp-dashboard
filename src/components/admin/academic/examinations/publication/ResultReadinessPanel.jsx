import React, { useMemo } from "react";
import { AlertCircle, CheckCircle, Clock, ShieldAlert } from "lucide-react";

export default function ResultReadinessPanel({ examCycle, papers, classes, subjects, students }) {
  const readiness = useMemo(() => {
    if (!examCycle) return [];

    const storedRecordsStr = localStorage.getItem(`exam_op_state_${examCycle.id}_evaluation_records`) || "[]";
    const allRecords = JSON.parse(storedRecordsStr);

    const sessionPapers = papers.filter((p) => p.examSessionId === examCycle.id);

    return sessionPapers.map((p) => {
      const clsObj = classes.find((c) => c.id === p.classId);
      const subObj = subjects.find((s) => s.id === p.subjectId);
      const classStudents = students.filter((s) => s.classId === p.classId);
      const paperRecords = allRecords.filter((r) => r.paperId === p.id);

      const totalStudents = classStudents.length || 1;
      const gradedCount = paperRecords.filter((r) => r.status !== "draft").length;
      
      let status = "pending";
      let badgeStyle = "bg-rose-50 text-rose-600 border-rose-100";
      
      if (paperRecords.length > 0 && paperRecords.every((r) => r.status === "locked")) {
        status = "Locked & Cascaded";
        badgeStyle = "bg-emerald-50 text-emerald-600 border-emerald-100";
      } else if (paperRecords.length > 0 && paperRecords.every((r) => r.status === "moderated")) {
        status = "Moderated (Pending Lock)";
        badgeStyle = "bg-indigo-50 text-indigo-600 border-indigo-100";
      } else if (gradedCount === totalStudents) {
        status = "Evaluated (Pending Moderation)";
        badgeStyle = "bg-indigo-50 text-indigo-600 border-indigo-100";
      } else if (gradedCount > 0) {
        status = "Grading In Progress";
        badgeStyle = "bg-amber-50 text-amber-600 border-amber-100";
      }

      return {
        paperId: p.id,
        className: clsObj?.displayName || p.classId,
        subjectName: subObj?.name || p.subjectId,
        gradedCount,
        totalStudents,
        status,
        badgeStyle,
      };
    });
  }, [examCycle, papers, classes, subjects, students]);

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-xs font-black text-[#03045e] uppercase tracking-wider">
          Class-wise Result Publication Readiness
        </h4>
        <p className="text-[9px] text-gray-400 font-bold uppercase mt-0.5">
          Auditing evaluation locks before declaration
        </p>
      </div>

      <div className="flex flex-col gap-3 max-h-[350px] overflow-y-auto pr-1">
        {readiness.map((item) => (
          <div
            key={item.paperId}
            className="p-4 rounded-2xl bg-white border border-gray-100 flex flex-col sm:flex-row justify-between gap-4 sm:items-center hover:shadow-sm transition-shadow"
          >
            <div>
              <h5 className="text-xs font-black text-[#03045e]">
                {item.subjectName} ({item.className})
              </h5>
              <span className="text-[9px] text-gray-400 font-bold block mt-1 uppercase">
                Scoresheet Progress: {item.gradedCount} / {item.totalStudents} graded
              </span>
            </div>

            <div className="flex sm:justify-end">
              <span
                className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${item.badgeStyle}`}
              >
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
