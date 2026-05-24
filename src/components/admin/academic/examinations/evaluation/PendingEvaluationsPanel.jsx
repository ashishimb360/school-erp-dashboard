import React, { useMemo } from "react";
import { AlertCircle, User, ShieldAlert, Award } from "lucide-react";

export default function PendingEvaluationsPanel({
  examCycle,
  papers,
  classes,
  subjects,
  teachers,
  students,
}) {
  const pendingDetails = useMemo(() => {
    if (!examCycle) return [];

    const storedRecordsStr = localStorage.getItem(`exam_op_state_${examCycle.id}_evaluation_records`) || "[]";
    const allRecords = JSON.parse(storedRecordsStr);

    const sessionPapers = papers.filter((p) => p.examSessionId === examCycle.id);

    return sessionPapers
      .map((p) => {
        const clsObj = classes.find((c) => c.id === p.classId);
        const subObj = subjects.find((s) => s.id === p.subjectId);
        const classStudents = students.filter((s) => s.classId === p.classId);
        const paperRecords = allRecords.filter((r) => r.paperId === p.id);

        const totalStudents = classStudents.length || 1;
        const gradedCount = paperRecords.filter((r) => r.status !== "draft").length;
        const isComplete = gradedCount === totalStudents;

        // Find primary subject teacher assigned to this subject & class
        const teacherId = p.invigilatorTeacherIds?.[0] || "teach-001";
        const teacherObj = teachers.find((t) => t.id === teacherId);

        return {
          paperId: p.id,
          classId: p.classId,
          className: clsObj?.displayName || p.classId,
          subjectName: subObj?.name || p.subjectId,
          teacherName: teacherObj ? teacherObj.name : "Unmapped Teacher",
          gradedCount,
          totalStudents,
          isComplete,
          status: paperRecords[0]?.status || "pending",
        };
      })
      .filter((item) => !item.isComplete);
  }, [examCycle, papers, classes, subjects, teachers, students]);

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-xs font-black text-[#03045e] uppercase tracking-wider">
          Grading Bottlenecks & Pending Evaluators
        </h4>
        <p className="text-[9px] text-gray-400 font-bold uppercase mt-0.5">
          Classes currently blocked from result readiness
        </p>
      </div>

      <div className="flex flex-col gap-3 max-h-[350px] overflow-y-auto pr-1">
        {pendingDetails.map((item) => (
          <div
            key={item.paperId}
            className="p-4 rounded-2xl bg-white border border-gray-100 flex flex-col sm:flex-row justify-between gap-4 sm:items-center hover:shadow-sm transition-shadow"
          >
            <div className="space-y-1">
              <span className="text-[9px] font-black uppercase text-rose-500 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">
                BLOCKED
              </span>
              <h5 className="text-xs font-black text-[#03045e] mt-1">
                {item.subjectName} ({item.className})
              </h5>
              <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold uppercase">
                <User size={11} className="text-[#00b4d8]" />
                <span>Assigned: {item.teacherName}</span>
              </div>
            </div>

            <div className="text-left sm:text-right space-y-1">
              <span className="text-[10px] font-black text-gray-400 uppercase block">
                Progress
              </span>
              <span className="text-xs font-black text-[#03045e]">
                {item.gradedCount} / {item.totalStudents} graded ({Math.round((item.gradedCount / item.totalStudents) * 100)}%)
              </span>
            </div>
          </div>
        ))}

        {pendingDetails.length === 0 && (
          <div className="p-8 text-center bg-emerald-50/20 border border-dashed border-emerald-100 text-emerald-600 rounded-3xl space-y-2">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-emerald-600">
              <Award size={18} />
            </div>
            <strong className="text-xs font-black uppercase block tracking-wider mt-2">
              All Evaluations Finalized
            </strong>
            <p className="text-[10px] text-gray-500 font-semibold leading-relaxed max-w-xs mx-auto">
              No classes are currently blocked. Every scheduled paper's scorecard has been completed.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
