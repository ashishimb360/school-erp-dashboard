import React, { useState } from "react";
import { ShieldAlert, Plus, CheckCircle, AlertTriangle, User, FileText, ChevronRight } from "lucide-react";

const MalpracticeConsole = ({
  students,
  papers,
  subjects,
  classes,
  incidents,
  onAddIncident,
  onUpdateStatus,
}) => {
  const [studentId, setStudentId] = useState("");
  const [paperId, setPaperId] = useState("");
  const [severity, setSeverity] = useState("Medium");
  const [details, setDetails] = useState("");
  const [action, setAction] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!studentId || !paperId || !details) {
      alert("Please complete Student, Paper, and Incident Details fields.");
      return;
    }

    onAddIncident({
      studentId,
      paperId,
      severity,
      incidentDetails: details,
      disciplinaryAction: action,
    });

    // Reset Form
    setStudentId("");
    setPaperId("");
    setSeverity("Medium");
    setDetails("");
    setAction("");
  };

  const getSeverityColor = (sev) => {
    switch (sev.toLowerCase()) {
      case "low":
        return "bg-gray-50 text-gray-700 border-gray-200";
      case "medium":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "high":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "critical":
        return "bg-rose-50 text-rose-700 border-rose-200 animate-pulse border";
      default:
        return "bg-gray-50 text-gray-500 border-gray-100";
    }
  };

  const getStatusColor = (stat) => {
    switch (stat.toLowerCase()) {
      case "reported":
        return "bg-sky-50 text-sky-700 border-sky-100";
      case "reviewed":
        return "bg-indigo-50 text-indigo-700 border-indigo-100";
      case "resolved":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "escalated":
        return "bg-purple-50 text-purple-700 border-purple-100";
      default:
        return "bg-gray-50 text-gray-500 border-gray-100";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Incident Log Form */}
      <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4">
        <div>
          <h4 className="text-xs font-black text-[#03045e] uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert size={14} className="text-rose-500" />
            <span>Report Student Infraction</span>
          </h4>
          <p className="text-[9px] text-gray-400 font-bold uppercase mt-0.5">
            Record live malpractice details and actions
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[9px] uppercase font-black text-gray-400 tracking-wider">
              Student Accused
            </label>
            <select
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-xl outline-none font-bold text-xs focus:ring-2 focus:ring-[#00b4d8]/20 transition-all text-[#03045e] cursor-pointer"
            >
              <option value="">Select Student...</option>
              {students.map((s) => {
                const cls = classes.find((c) => c.id === s.classId);
                return (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.admissionNo} - {cls?.displayName || cls?.name || s.classId})
                  </option>
                );
              })}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] uppercase font-black text-gray-400 tracking-wider">
              Active Examination Paper
            </label>
            <select
              value={paperId}
              onChange={(e) => setPaperId(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-xl outline-none font-bold text-xs focus:ring-2 focus:ring-[#00b4d8]/20 transition-all text-[#03045e] cursor-pointer"
            >
              <option value="">Select Exam/Subject...</option>
              {papers.map((p) => {
                const sub = subjects.find((s) => s.id === p.subjectId);
                const cls = classes.find((c) => c.id === p.classId);
                return (
                  <option key={p.id} value={p.id}>
                    {sub?.name || p.subjectId} - {cls?.displayName || cls?.name || p.classId} ({p.startTime})
                  </option>
                );
              })}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] uppercase font-black text-gray-400 tracking-wider">
              Severity Level
            </label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-xl outline-none font-bold text-xs focus:ring-2 focus:ring-[#00b4d8]/20 transition-all text-[#03045e] cursor-pointer"
            >
              <option value="Low">Low (Unauthorized materials/talking)</option>
              <option value="Medium">Medium (Copying/possessing electronic gadgets)</option>
              <option value="High">High (Impersonation/sharing answers)</option>
              <option value="Critical">Critical (Violence/extreme non-compliance)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] uppercase font-black text-gray-400 tracking-wider">
              Infraction Details
            </label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={3}
              placeholder="Describe exact details of the incident..."
              className="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-xl outline-none font-semibold text-xs focus:ring-2 focus:ring-[#00b4d8]/20 transition-all text-[#03045e]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] uppercase font-black text-gray-400 tracking-wider">
              Immediate Disciplinary Action
            </label>
            <input
              type="text"
              value={action}
              onChange={(e) => setAction(e.target.value)}
              placeholder="e.g. Answer sheet confiscated, warning issued"
              className="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-xl outline-none font-semibold text-xs focus:ring-2 focus:ring-[#00b4d8]/20 transition-all text-[#03045e]"
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black py-3 rounded-xl shadow-md shadow-rose-100 transition-colors uppercase tracking-wider"
          >
            <Plus size={14} />
            <span>SUBMIT INCIDENT REPORT</span>
          </button>
        </form>
      </div>

      {/* Incidents Feed */}
      <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4">
        <div>
          <h4 className="text-xs font-black text-[#03045e] uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert size={14} className="text-amber-500" />
            <span>Active Incidents Feed ({incidents.length})</span>
          </h4>
          <p className="text-[9px] text-gray-400 font-bold uppercase mt-0.5">
            Review and resolve reported exam infractions
          </p>
        </div>

        <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-1">
          {incidents.map((inc) => {
            const student = students.find((s) => s.id === inc.studentId);
            const paper = papers.find((p) => p.id === inc.paperId);
            const sub = paper ? subjects.find((s) => s.id === paper.subjectId) : null;
            const cls = paper ? classes.find((c) => c.id === paper.classId) : null;

            return (
              <div
                key={inc.id}
                className="p-4 rounded-2xl border border-gray-100 bg-gray-50/30 hover:border-gray-200 transition-all flex flex-col md:flex-row md:items-start justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${getSeverityColor(inc.severity)}`}>
                      {inc.severity} Severity
                    </span>
                    <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${getStatusColor(inc.status)}`}>
                      {inc.status}
                    </span>
                    <span className="text-[9px] text-gray-400 font-bold">
                      {new Date(inc.reportedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h5 className="text-xs font-black text-[#03045e] flex items-center gap-1.5">
                      <User size={13} className="text-gray-400 shrink-0" />
                      <span>{student?.name || "Unknown Student"}</span>
                      <span className="text-[10px] text-gray-400 font-medium">({student?.admissionNo})</span>
                    </h5>
                    <p className="text-[10px] text-[#0077b6] font-bold flex items-center gap-1">
                      <FileText size={12} className="shrink-0" />
                      <span>{cls?.displayName || cls?.name || "Class"} • {sub?.name || "Subject"}</span>
                    </p>
                  </div>

                  <div className="text-xs text-gray-600 font-medium bg-white p-3 rounded-xl border border-gray-100/60 leading-relaxed shadow-sm">
                    <strong>Incident:</strong> {inc.incidentDetails}
                    {inc.disciplinaryAction && (
                      <div className="mt-1.5 pt-1.5 border-t border-gray-50 text-[11px] text-rose-700">
                        <strong>Action Taken:</strong> {inc.disciplinaryAction}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-row md:flex-col gap-2 shrink-0 self-end md:self-start">
                  <select
                    value={inc.status}
                    onChange={(e) => onUpdateStatus(inc.id, e.target.value)}
                    className="p-2 bg-white border border-gray-200 rounded-lg text-[10px] font-black uppercase tracking-wider text-[#03045e] outline-none cursor-pointer"
                  >
                    <option value="reported">Reported</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="resolved">Resolved</option>
                    <option value="escalated">Escalated</option>
                  </select>
                </div>
              </div>
            );
          })}

          {incidents.length === 0 && (
            <div className="text-center py-12 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 text-gray-400 font-bold uppercase tracking-wider text-xs">
              No malpractice incidents reported under this cycle
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MalpracticeConsole;
