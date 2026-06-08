import React from "react";
import { Clock, MapPin, Compass, Play, BookOpen } from "lucide-react";
import MainCard from "../MainCard";

export default function TodayScheduleCard({ schedule = [], currentClass, nextClass }) {
  return (
    <MainCard borderColor="#0077b6" className="p-6 h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
          <h3 className="text-sm font-black text-[#03045e] uppercase tracking-wider flex items-center gap-2">
            <Compass className="w-4.5 h-4.5 text-blue-600 animate-pulse" />
            Today's Teaching Schedule
          </h3>
          <span className="text-[9px] font-black bg-blue-50 text-blue-600 px-2 py-0.5 rounded-lg border border-blue-100 uppercase tracking-tighter">
            {schedule.length} Sessions Today
          </span>
        </div>

        {/* Schedule Timeline */}
        {schedule.length === 0 ? (
          <div className="text-center py-12 text-xs font-bold text-gray-400 italic">
            You have no teaching periods scheduled for today.
          </div>
        ) : (
          <div className="space-y-4">
            {schedule.map((item, idx) => {
              const isCurrent = currentClass && currentClass.period === item.period && currentClass.classId === item.classId;
              const isNext = nextClass && nextClass.period === item.period && nextClass.classId === item.classId;

              return (
                <div 
                  key={idx}
                  className={`p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
                    isCurrent 
                      ? "bg-gradient-to-r from-blue-50 to-[#caf0f8]/20 border-blue-200 shadow-sm"
                      : isNext
                      ? "bg-amber-50/20 border-amber-100"
                      : "bg-white border-gray-50/80 hover:bg-gray-50/20"
                  }`}
                >
                  {isCurrent && (
                    <div className="absolute right-3 top-3 flex items-center gap-1 text-[8px] font-black bg-emerald-500 text-white px-2 py-0.5 rounded-full uppercase tracking-widest animate-bounce">
                      <Play className="w-2.5 h-2.5 fill-current" />
                      Active Now
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs flex-shrink-0 ${
                      isCurrent
                        ? "bg-[#03045e] text-white shadow-md shadow-[#03045e]/20"
                        : "bg-gray-50 text-gray-400 border border-gray-100"
                    }`}>
                      {item.period.replace("Period ", "")}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-[#03045e]">{item.subject}</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                        <span className="font-bold text-xs text-gray-600">Class {item.class}</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 mt-1.5 text-[10px] font-bold text-gray-400">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-blue-400" />
                          <span>{item.time}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#00b4d8]" />
                          <span>{item.room}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {schedule.length > 0 && (
        <div className="pt-4 border-t border-gray-50 mt-6 flex items-center gap-2 text-[10px] font-bold text-gray-400">
          <BookOpen className="w-4 h-4 text-blue-500" />
          <span>Double check room allocations with Admin in case of special lab sessions.</span>
        </div>
      )}
    </MainCard>
  );
}
