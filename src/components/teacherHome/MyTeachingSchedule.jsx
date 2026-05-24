import React from "react";
import { Clock, MapPin, Compass, Play, BookOpen, AlertCircle, ArrowRight } from "lucide-react";
import MainCard from "../MainCard";

export default function MyTeachingSchedule({ schedule = [], currentClass, nextClass }) {
  return (
    <MainCard className="p-6 border border-slate-100 bg-white shadow-sm rounded-3xl h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div>
            <span className="text-[9px] font-black text-blue-600 uppercase tracking-wider bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md">
              Teaching Movement
            </span>
            <h3 className="text-base font-black text-[#03045e] mt-1.5 flex items-center gap-2">
              <Compass className="w-5 h-5 text-blue-600" />
              My Teaching Schedule (Lectures Today)
            </h3>
          </div>
          <span className="text-[10px] font-black bg-slate-50 text-slate-600 px-3 py-1 rounded-full border border-slate-100">
            {schedule.length} Lectures
          </span>
        </div>

        {/* Schedule Timeline */}
        {schedule.length === 0 ? (
          <div className="text-center py-12 flex flex-col items-center justify-center gap-2">
            <AlertCircle className="w-8 h-8 text-slate-300" />
            <p className="text-xs font-bold text-slate-400 italic">No teaching periods assigned to you today.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {schedule.map((item, idx) => {
              const isCurrent = currentClass && currentClass.period === item.period && currentClass.classId === item.classId;
              const isNext = nextClass && nextClass.period === item.period && nextClass.classId === item.classId;

              return (
                <div 
                  key={idx}
                  className={`p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isCurrent 
                      ? "bg-gradient-to-r from-blue-50/50 to-[#caf0f8]/20 border-blue-200 shadow-sm"
                      : isNext
                      ? "bg-amber-50/20 border-amber-100"
                      : "bg-white border-slate-100 hover:bg-slate-50/45"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs flex-shrink-0 ${
                      isCurrent
                        ? "bg-[#03045e] text-white shadow-md shadow-[#03045e]/20"
                        : isNext
                        ? "bg-amber-500 text-white shadow-md shadow-amber-500/10"
                        : "bg-slate-50 text-slate-400 border border-slate-100"
                    }`}>
                      {item.period.replace("Period ", "P")}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-[#03045e]">{item.subject}</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                        <span className="font-bold text-xs text-slate-600">Class {item.class}</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 mt-1 text-[10px] font-bold text-gray-400">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-blue-500" />
                          <span>{item.time}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#00b4d8]" />
                          <span>{item.room}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isCurrent && (
                      <span className="flex items-center gap-1 text-[8px] font-black bg-emerald-500 text-white px-2 py-0.5 rounded-full uppercase tracking-widest">
                        <Play className="w-2 h-2 fill-current" />
                        Active Now
                      </span>
                    )}
                    {isNext && !isCurrent && (
                      <span className="flex items-center gap-1 text-[8px] font-black bg-amber-500 text-white px-2 py-0.5 rounded-full uppercase tracking-widest">
                        Next Up
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {schedule.length > 0 && (
        <div className="pt-4 border-t border-slate-100 mt-6 flex items-center gap-2 text-[10px] font-bold text-slate-400">
          <BookOpen className="w-4 h-4 text-blue-500" />
          <span>Need adjustments? Report schedule conflicts to the Coordination Desk.</span>
        </div>
      )}
    </MainCard>
  );
}
