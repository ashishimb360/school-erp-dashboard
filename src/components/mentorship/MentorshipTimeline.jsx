import React, { useState } from "react";
import { Calendar, User, Eye, EyeOff, BookOpen, AlertTriangle, Activity, PhoneCall, Award, Clock, CheckCircle2, Check, X } from "lucide-react";
import { updateSessionStatus } from "../../services/mentorshipService";
import { motion } from "framer-motion";

export default function MentorshipTimeline({ remarks, onToggleFollowUp }) {
  const [completingSessId, setCompletingSessId] = useState(null);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const CATEGORY_STYLES = {
    ACADEMIC: {
      label: "Academic Session",
      bg: "bg-blue-50 text-blue-700 border-blue-100",
      icon: <BookOpen className="w-3.5 h-3.5" />
    },
    ATTENDANCE: {
      label: "Attendance Review",
      bg: "bg-amber-50 text-amber-700 border-amber-100",
      icon: <AlertTriangle className="w-3.5 h-3.5" />
    },
    BEHAVIOR: {
      label: "Behavioral Check-in",
      bg: "bg-purple-50 text-purple-700 border-purple-100",
      icon: <Activity className="w-3.5 h-3.5" />
    },
    PARENT_MEETING: {
      label: "Parent Interaction",
      bg: "bg-emerald-50 text-emerald-700 border-emerald-100",
      icon: <PhoneCall className="w-3.5 h-3.5" />
    },
    COUNSELING: {
      label: "Counseling & Wellbeing",
      bg: "bg-indigo-50 text-indigo-700 border-indigo-100",
      icon: <User className="w-3.5 h-3.5" />
    },
    POSITIVE_FEEDBACK: {
      label: "Feedback Advisory",
      bg: "bg-pink-50 text-pink-700 border-pink-100",
      icon: <Award className="w-3.5 h-3.5" />
    }
  };

  const formatDate = (isoStr) => {
    if (!isoStr) return "";
    const date = new Date(isoStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const handleStatusUpdate = async (sessId, status, noteStr = "") => {
    setLoading(true);
    try {
      await updateSessionStatus(sessId, status, noteStr);
      setCompletingSessId(null);
      setNotes("");
      if (onToggleFollowUp) onToggleFollowUp(sessId); // trigger parent workspace refresh!
    } catch (err) {
      alert("Failed to update session status: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (remarks.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="text-gray-300 mb-2">
          <Activity className="w-12 h-12 mx-auto stroke-1" />
        </div>
        <p className="text-xs font-bold text-gray-400 italic">
          No scheduled sessions or advisory notes logged for this student.
        </p>
      </div>
    );
  }

  return (
    <div className="relative border-l-2 border-indigo-50 pl-6 ml-4 space-y-8 py-2">
      {remarks.map((remark, idx) => {
        const cat = CATEGORY_STYLES[remark.category] || CATEGORY_STYLES.ACADEMIC;
        const original = remark.originalSession || {};
        const status = original.status || "Completed";

        const isPending = status === "Pending";
        const isApproved = status === "Approved";
        const isCompleted = status === "Completed";
        const isRejected = status === "Rejected";

        return (
          <motion.div
            key={remark.id}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            className="relative"
          >
            {/* Timeline node icon indicator */}
            <div className="absolute -left-[35px] top-1.5 w-6 h-6 rounded-xl bg-white border-2 border-indigo-200 flex items-center justify-center shadow-sm">
              <span className="text-[#03045e]">{cat.icon}</span>
            </div>

            {/* Observation Card Container */}
            <div className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm space-y-3 hover:shadow-md transition-shadow">
              {/* Category, Date & Visibility Header */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${cat.bg}`}>
                    {cat.label}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${
                    isPending ? "bg-amber-50 text-amber-700 border border-amber-100" :
                    isApproved ? "bg-indigo-50 text-indigo-700 border border-indigo-100 animate-pulse" :
                    isCompleted ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                    "bg-gray-100 text-gray-600 border border-gray-200"
                  }`}>
                    {status}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(remark.createdAt)}</span>
                  </span>
                </div>
              </div>

              {/* Title & Observations text details */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-extrabold text-[#03045e]">{remark.title}</h4>
                <p className="text-xs text-gray-600 font-bold leading-relaxed">{remark.note}</p>
                {isCompleted && original.mentorNotes && (
                  <div className="p-3 bg-emerald-50/30 rounded-xl border border-emerald-100/30 text-xs font-semibold text-emerald-800 mt-2">
                    <span className="block text-[8px] font-black text-emerald-600 uppercase tracking-widest mb-1">Completed Outcome Note:</span>
                    "{original.mentorNotes}"
                  </div>
                )}
              </div>

              {/* Interactive composing form for completing session */}
              {completingSessId === remark.id && (
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-3 mt-2">
                  <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest block">Add Short Session Summary Notes</label>
                  <textarea
                    rows="2"
                    placeholder="Describe main advisory outcome (e.g., provided physics formulas, revised study timetable)..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-2.5 bg-white border border-gray-100 text-xs font-semibold text-[#03045e] rounded-xl focus:outline-none resize-none"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setCompletingSessId(null)}
                      className="px-3 py-1 bg-gray-200 text-gray-700 text-[9px] font-black uppercase tracking-wider rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(remark.id, "Completed", notes)}
                      disabled={loading || !notes.trim()}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[9px] font-black uppercase tracking-wider rounded-lg disabled:opacity-40"
                    >
                      Submit & Complete
                    </button>
                  </div>
                </div>
              )}

              {/* Inline action triggers for teachers */}
              {!completingSessId && (isPending || isApproved) && (
                <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-50">
                  {isPending && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(remark.id, "Approved")}
                        disabled={loading}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[9px] font-black uppercase tracking-widest rounded-lg border border-indigo-100 transition-colors"
                      >
                        <Check className="w-3 h-3" />
                        <span>Approve Session</span>
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(remark.id, "Rejected")}
                        disabled={loading}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 text-[9px] font-black uppercase tracking-widest rounded-lg border border-rose-100 transition-colors"
                      >
                        <X className="w-3 h-3" />
                        <span>Reject</span>
                      </button>
                    </>
                  )}
                  {isApproved && (
                    <button
                      onClick={() => setCompletingSessId(remark.id)}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[9px] font-black uppercase tracking-widest rounded-lg border border-emerald-100 transition-colors"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Mark Session Completed</span>
                    </button>
                  )}
                </div>
              )}

              {/* Tags and composed by footer */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-50">
                <div className="flex flex-wrap gap-1">
                  {remark.tags && remark.tags.map((tag, tIdx) => (
                    <span key={tIdx} className="text-[9px] font-bold text-indigo-500 bg-indigo-50/50 px-2 py-0.5 rounded-lg border border-indigo-100/20">
                      #{tag}
                    </span>
                  ))}
                </div>
                <span className="text-[9px] font-bold text-gray-400">
                  by {remark.teacherName}
                </span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
