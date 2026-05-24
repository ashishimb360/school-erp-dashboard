import React from "react";
import { AlertCircle, CheckCircle } from "lucide-react";

export default function FollowUpBadge({ required, resolved, onToggle, disabled }) {
  if (!required) return null;

  if (resolved) {
    return (
      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider">
        <CheckCircle className="w-3 h-3 text-emerald-500" />
        <span>Resolved</span>
      </span>
    );
  }

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        if (onToggle && !disabled) onToggle();
      }}
      disabled={disabled}
      className={`inline-flex items-center gap-1 bg-rose-50 text-rose-700 border border-rose-100 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider transition-colors ${
        onToggle && !disabled ? "hover:bg-rose-100 cursor-pointer" : "cursor-default"
      }`}
      title={onToggle && !disabled ? "Click to mark as resolved" : "Follow-up required"}
    >
      <AlertCircle className="w-3 h-3 text-rose-500 animate-pulse" />
      <span>Pending Follow-up</span>
    </button>
  );
}
