import React, { useMemo } from "react";
import { Users, ShieldCheck, MapPin, AlertCircle } from "lucide-react";

const RoomSupervisionPanel = ({ papers, rooms, teachers, students, classes }) => {
  const roomSchedules = useMemo(() => {
    const grouped = {};

    papers.forEach((paper) => {
      if (!paper.roomId) return;
      const rId = paper.roomId;

      if (!grouped[rId]) {
        grouped[rId] = {
          roomId: rId,
          papers: [],
          invigilatorIds: new Set(),
          classIds: new Set(),
        };
      }

      grouped[rId].papers.push(paper);
      if (paper.invigilatorTeacherIds) {
        paper.invigilatorTeacherIds.forEach((id) => grouped[rId].invigilatorIds.add(id));
      }
      grouped[rId].classIds.add(paper.classId);
    });

    return Object.values(grouped).map((group) => {
      // Find room in master room registry
      const masterRoom = rooms.find((r) => (r.roomId || r.id) === group.roomId) || {
        roomNumber: group.roomId,
        name: group.roomId,
        capacity: 40, // standard default capacity if missing in master
      };

      const roomName = masterRoom.roomNumber || masterRoom.name || group.roomId;
      const capacity = masterRoom.capacity || 40;

      // Count unique invigilators assigned
      const invigilators = Array.from(group.invigilatorIds).map((id) => {
        const teacher = teachers.find((t) => t.id === id);
        return teacher ? teacher.name : id;
      });

      // Calculate total students scheduled in this room (sum of student count for classes in this room)
      const studentCount = Array.from(group.classIds).reduce((sum, classId) => {
        const classStudents = students.filter((s) => s.classId === classId);
        return sum + classStudents.length;
      }, 0);

      const occupancyPercent = Math.min(100, Math.round((studentCount / capacity) * 100));

      let occupancyLabel = "Normal";
      let occupancyColor = "bg-emerald-50 text-emerald-700 border-emerald-100";
      let progressColor = "bg-emerald-500";

      if (occupancyPercent >= 100) {
        occupancyLabel = "Overcapacity";
        occupancyColor = "bg-rose-50 text-rose-700 border-rose-200 animate-pulse";
        progressColor = "bg-rose-500";
      } else if (occupancyPercent >= 80) {
        occupancyLabel = "Crowded";
        occupancyColor = "bg-amber-50 text-amber-700 border-amber-200";
        progressColor = "bg-amber-500";
      }

      return {
        roomId: group.roomId,
        roomName,
        capacity,
        studentCount,
        occupancyPercent,
        occupancyLabel,
        occupancyColor,
        progressColor,
        invigilators,
        classNames: Array.from(group.classIds).map((classId) => {
          const cls = classes.find((c) => c.id === classId);
          return cls?.displayName || cls?.name || classId;
        }),
      };
    });
  }, [papers, rooms, teachers, students, classes]);

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-xs font-black text-[#03045e] uppercase tracking-wider flex items-center gap-1.5">
          <MapPin size={14} className="text-[#00b4d8]" />
          <span>Active Room Occupancy & Invigilator Supervision ({roomSchedules.length})</span>
        </h4>
        <p className="text-[9px] text-gray-400 font-bold uppercase mt-0.5">
          Track room layouts, invigilation duties, and capacity compliance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roomSchedules.map((room) => (
          <div
            key={room.roomId}
            className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4 hover:border-gray-200 transition-all hover:shadow-md"
          >
            {/* Header */}
            <div className="flex justify-between items-start gap-3">
              <div className="space-y-1">
                <span className="text-[9px] font-black uppercase tracking-wider text-gray-400">
                  Room Booking ID: {room.roomId}
                </span>
                <h5 className="text-sm font-black text-[#03045e]">
                  {room.roomName}
                </h5>
              </div>

              <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded border shrink-0 ${room.occupancyColor}`}>
                {room.occupancyLabel}
              </span>
            </div>

            {/* Occupancy Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-bold">
                <span className="text-gray-400 uppercase">Capacity Layout</span>
                <span className="text-[#03045e]">
                  {room.studentCount} / {room.capacity} Enrolled ({room.occupancyPercent}%)
                </span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${room.progressColor}`}
                  style={{ width: `${room.occupancyPercent}%` }}
                />
              </div>
            </div>

            {/* Target Classes */}
            <div className="space-y-1">
              <span className="text-[9px] font-black uppercase tracking-wider text-gray-400 block">
                Target Classes
              </span>
              <p className="text-[11px] font-bold text-[#0077b6]">
                {room.classNames.join(", ") || "No targeted classes"}
              </p>
            </div>

            {/* Invigilators List */}
            <div className="space-y-2 mt-auto pt-3 border-t border-gray-50">
              <span className="text-[9px] font-black uppercase tracking-wider text-gray-400 block">
                Assigned Invigilators
              </span>
              <div className="flex flex-wrap gap-1.5">
                {room.invigilators.map((name, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 bg-[#03045e]/5 text-[#03045e] font-black text-[9px] px-2.5 py-1 rounded-lg uppercase tracking-wider"
                  >
                    <ShieldCheck size={10} className="text-[#0077b6]" />
                    <span>{name}</span>
                  </span>
                ))}

                {room.invigilators.length === 0 && (
                  <span className="text-[9px] font-bold text-rose-500 uppercase">
                    ⚠️ Uninvigilated (Needs Mapping)
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        {roomSchedules.length === 0 && (
          <div className="col-span-full text-center py-16 bg-gray-50/50 border border-dashed border-gray-200 rounded-3xl text-gray-400 font-bold uppercase tracking-wider text-xs">
            <AlertCircle size={24} className="mx-auto mb-2 text-gray-300" />
            <span>No room allocations found under active cycle papers</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomSupervisionPanel;
