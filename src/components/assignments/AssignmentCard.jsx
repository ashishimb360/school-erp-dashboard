import React, { useState } from "react";
import MainCard from "../MainCard";
import { useStudent } from "../../context/StudentContext";
import { useAuth } from "../../context/AuthContext";
import { submitAssignment } from "../../services/assignmentService";
import { 
  Calendar, 
  Clock, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  Upload, 
  FileCheck,
  Timer,
  Link as LinkIcon,
  AlignLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const STATUS_CONFIG = {
  PENDING: { color: "text-blue-500", bg: "bg-blue-50", icon: Clock, label: "Active" },
  DUE_SOON: { color: "text-amber-500", bg: "bg-amber-50", icon: Timer, label: "Due Soon" },
  OVERDUE: { color: "text-rose-500", bg: "bg-rose-50", icon: AlertCircle, label: "Overdue" },
  SUBMITTED: { color: "text-emerald-500", bg: "bg-emerald-50", icon: FileCheck, label: "Submitted" },
  REVIEWED: { color: "text-indigo-500", bg: "bg-indigo-50", icon: CheckCircle2, label: "Reviewed" },
  GRADED: { color: "text-indigo-500", bg: "bg-indigo-50", icon: CheckCircle2, label: "Graded" },
  LATE: { color: "text-orange-500", bg: "bg-orange-50", icon: AlertCircle, label: "Late Submission" }
};

const AssignmentCard = ({ assignment, onStatusUpdate }) => {
  const { activeStudentId: studentId } = useStudent();
  const { isParent } = useAuth();
  
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [submissionType, setSubmissionType] = useState("text"); // "text" | "link"
  const [textContent, setTextContent] = useState("");
  const [linkContent, setLinkContent] = useState("");
  const [comments, setComments] = useState("");

  const config = STATUS_CONFIG[assignment.status] || STATUS_CONFIG.PENDING;
  const StatusIcon = config.icon;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const responseContent = submissionType === "text" ? textContent : linkContent;
      await submitAssignment(studentId, assignment.id, {
        content: responseContent,
        comments: comments
      });
      setIsSubmitting(false);
      setShowSubmitModal(false);
      setTextContent("");
      setLinkContent("");
      setComments("");
      if (onStatusUpdate) {
        onStatusUpdate();
      }
    } catch (err) {
      console.error("Submission failed:", err);
      setIsSubmitting(false);
    }
  };

  const isFormValid = submissionType === "text" ? textContent.trim().length > 0 : linkContent.trim().startsWith("http");

  return (
    <>
      <MainCard 
        className="p-6 group relative overflow-hidden transition-all duration-300"
      >
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 flex flex-col h-full">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-tighter ${config.bg} ${config.color}`}>
                    {assignment.type || "Assignment"}
                  </span>
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                    {assignment.totalMarks} Marks • {assignment.subjectName}
                  </span>
                </div>
                <h3 className="text-lg font-black text-[#03045e] group-hover:text-primary transition-colors line-clamp-1 leading-tight">
                  {assignment.title}
                </h3>
              </div>
              <div className={`p-2 rounded-xl shrink-0 ${config.bg} ${config.color} shadow-sm`}>
                <StatusIcon size={18} strokeWidth={2.5} />
              </div>
            </div>

            {/* Body */}
            <p className="text-sm text-gray-500 font-bold leading-relaxed line-clamp-2 mb-4 flex-1">
              {assignment.description}
            </p>

            {/* Footer */}
            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-gray-400 group-hover:text-gray-600 transition-colors">
                  <Calendar size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">{assignment.dueDate}</span>
                </div>
                {assignment.attachment && (
                  <a 
                    href={assignment.attachment}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-blue-500 hover:text-blue-700 transition-colors"
                  >
                    <FileText size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Attachment</span>
                  </a>
                )}
              </div>
              
              {assignment.status === "SUBMITTED" ? (
                <div className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                  <CheckCircle2 size={14} />
                  <span>Submission Received</span>
                </div>
              ) : assignment.status === "REVIEWED" || assignment.status === "GRADED" ? (
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-1 text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                    <CheckCircle2 size={13} />
                    <span>Graded: {assignment.submissionDetails?.score ?? assignment.submissionDetails?.marksAwarded} / {assignment.totalMarks}</span>
                  </div>
                  {assignment.submissionDetails?.feedback && (
                    <span className="text-[9px] font-bold text-gray-500 italic max-w-xs text-right line-clamp-1">
                      "{assignment.submissionDetails.feedback}"
                    </span>
                  )}
                </div>
              ) : isParent ? (
                <div className="flex items-center gap-2 text-[10px] font-black text-rose-500 uppercase tracking-widest">
                  <AlertCircle size={14} />
                  <span>Not Submitted</span>
                </div>
              ) : (
                <button 
                  onClick={() => setShowSubmitModal(true)}
                  className="flex items-center gap-1 text-[10px] font-black text-primary bg-primary/5 px-4 py-2 rounded-xl uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-sm"
                >
                  <Upload size={14} />
                  <span>Submit Work</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </MainCard>

      {/* Submission Modal (Simulated Text / Link) */}
      <AnimatePresence>
        {showSubmitModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2.5rem] p-8 w-full max-w-lg shadow-2xl relative overflow-hidden"
            >
              {/* Modal Background Pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[5rem] -mr-8 -mt-8 pointer-events-none" />

              <div className="relative z-10">
                <h3 className="text-2xl font-black text-[#03045e] mb-2">Submit Assignment</h3>
                <p className="text-sm text-gray-500 font-bold mb-6">
                  Upload your completed work for <span className="text-primary">{assignment.title}</span>.
                </p>

                {/* Submission Type Toggle */}
                <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-2xl mb-6">
                  <button
                    type="button"
                    onClick={() => setSubmissionType("text")}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                      submissionType === "text" ? "bg-white text-[#03045e] shadow-sm" : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    <AlignLeft size={14} />
                    Text Response
                  </button>
                  <button
                    type="button"
                    onClick={() => setSubmissionType("link")}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                      submissionType === "link" ? "bg-white text-[#03045e] shadow-sm" : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    <LinkIcon size={14} />
                    Google Drive / Web Link
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    {submissionType === "text" ? (
                      <div className="space-y-2">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Write your response</span>
                        <textarea 
                          className="w-full rounded-2xl border border-gray-150 bg-gray-50 p-4 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all outline-none text-[#03045e]"
                          placeholder="Type your complete answer or essay here..."
                          rows={5}
                          value={textContent}
                          onChange={(e) => setTextContent(e.target.value)}
                        />
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Submission URL</span>
                        <input 
                          type="url"
                          className="w-full rounded-2xl border border-gray-150 bg-gray-50 p-4 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all outline-none text-[#03045e]"
                          placeholder="https://drive.google.com/..."
                          value={linkContent}
                          onChange={(e) => setLinkContent(e.target.value)}
                        />
                        <span className="text-[8px] font-bold text-gray-400 ml-1">Ensure sharing settings allow viewing.</span>
                      </div>
                    )}

                    <div className="space-y-2">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Comments for Teacher (Optional)</span>
                      <textarea 
                        className="w-full rounded-2xl border border-gray-150 bg-gray-50 p-4 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all outline-none text-[#03045e]"
                        placeholder="Add any extra notes or clarification..."
                        rows={2}
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button 
                      type="button"
                      onClick={() => setShowSubmitModal(false)}
                      className="flex-1 px-6 py-4 rounded-2xl bg-gray-50 text-gray-400 font-black uppercase tracking-widest text-[10px] hover:bg-gray-100 transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={isSubmitting || !isFormValid}
                      className={`flex-1 px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 ${
                        isSubmitting || !isFormValid
                          ? "bg-gray-100 text-gray-300 cursor-not-allowed border border-gray-200" 
                          : "bg-[#03045e] text-white shadow-xl shadow-[#03045e]/20 hover:scale-[1.02]"
                      }`}
                    >
                      {isSubmitting ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <CheckCircle2 size={16} />
                          <span>Submit Assignment</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AssignmentCard;
