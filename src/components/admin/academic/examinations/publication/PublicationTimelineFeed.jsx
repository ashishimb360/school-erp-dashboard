import React, { useState, useEffect } from "react";
import { Clock, CheckCircle, AlertTriangle, AlertCircle, Shield } from "lucide-react";

export default function PublicationTimelineFeed({ examCycle }) {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (!examCycle) return;

    const loadTimeline = () => {
      const storedStr = localStorage.getItem(`exam_op_state_${examCycle.id}_evaluation_timeline`) || "[]";
      let parsed = JSON.parse(storedStr);

      if (parsed.length === 0) {
        parsed = [
          {
            timestamp: new Date().toISOString(),
            message: "Evaluation records locked and prepared for publication",
            type: "info",
          }
        ];
      }
      setLogs(parsed);
    };

    loadTimeline();
    const interval = setInterval(loadTimeline, 2000);
    return () => clearInterval(interval);
  }, [examCycle]);

  const getLogIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle size={13} className="text-emerald-500" />;
      case "warning":
        return <Shield size={13} className="text-amber-500" />;
      case "danger":
        return <AlertCircle size={13} className="text-rose-500" />;
      default:
        return <Clock size={13} className="text-sky-500" />;
    }
  };

  const getLogBg = (type) => {
    switch (type) {
      case "success":
        return "bg-emerald-50 border-emerald-100";
      case "warning":
        return "bg-amber-50 border-amber-100";
      case "danger":
        return "bg-rose-50 border-rose-100";
      default:
        return "bg-sky-50 border-sky-100";
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-xs font-black text-[#03045e] uppercase tracking-wider">
          Publication Activity Timeline
        </h4>
        <p className="text-[9px] text-gray-400 font-bold uppercase mt-0.5">
          Auditable log of result release operations
        </p>
      </div>

      <div className="flex flex-col gap-3 max-h-[350px] overflow-y-auto pr-1">
        {logs.map((log, index) => (
          <div
            key={index}
            className={`p-3.5 rounded-2xl border flex gap-3 items-start transition-shadow hover:shadow-sm ${getLogBg(
              log.type
            )}`}
          >
            <div className="p-1.5 bg-white rounded-xl shadow-sm mt-0.5">
              {getLogIcon(log.type)}
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-[#03045e] leading-snug">
                {log.message}
              </p>
              <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest block mt-1">
                {new Date(log.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
