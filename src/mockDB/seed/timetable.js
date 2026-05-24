/**
 * Timetable Seed Data
 *
 * Imports, normalizes, and re-exports the conflict-free CBSE secondary timetable
 * assignments to establish clear schema separation and high-fidelity structures.
 */

import { teacherSubjectAssignments } from "../teacherSubjectAssignments";

const periodTimes = {
  P1: { startTime: "08:00 AM", endTime: "08:50 AM" },
  P2: { startTime: "08:50 AM", endTime: "09:40 AM" },
  P3: { startTime: "09:40 AM", endTime: "10:30 AM" },
  P4: { startTime: "10:30 AM", endTime: "11:20 AM" },
  // Lunch Break: 11:20 AM - 11:50 AM
  P5: { startTime: "11:50 AM", endTime: "12:40 PM" },
  P6: { startTime: "12:40 PM", endTime: "01:30 PM" },
  P7: { startTime: "01:30 PM", endTime: "02:20 PM" },
  P8: { startTime: "02:20 PM", endTime: "03:10 PM" },
};

export const teacherSubjectAssignmentsSeed = teacherSubjectAssignments.map((assignment) => {
  const times = periodTimes[assignment.period] || { startTime: "08:00 AM", endTime: "08:50 AM" };
  const periodId = `${assignment.classId}-${assignment.day}-${assignment.period}`;
  const roomVal = assignment.room || "Room 101";

  return {
    periodId,
    id: periodId, // legacy alias
    classId: assignment.classId,
    subjectId: assignment.subjectId,
    teacherId: assignment.teacherId,
    roomNumber: roomVal,
    room: roomVal, // legacy alias
    startTime: times.startTime,
    endTime: times.endTime,
    day: assignment.day,
    period: assignment.period,
    schedule: `${assignment.day} Period ${assignment.period}`, // legacy alias
  };
});

export default teacherSubjectAssignmentsSeed;
