import { db } from "./entities";
import { getItem, setItem, removeItem } from "../persistence/storage";
import { STORAGE_KEYS } from "../persistence/storageKeys";

/**
 * generateDailyAttendance
 *
 * Generates relational daily attendance records for the MockDB.
 * Format: { id, studentId, classId, date, status, markedBy, markedAt, attendanceSession }
 */
const ATTENDANCE_SCHEMA_VERSION = "v5"; // Bumped to v5 for rich history

export const generateDailyAttendance = (db) => {
  // Schema version guard — clears stale cache on model upgrades
  const storedVersion = getItem("erp_attendance_schema_version");
  if (storedVersion !== ATTENDANCE_SCHEMA_VERSION) {
    removeItem(STORAGE_KEYS.DAILY_ATTENDANCE);
    removeItem(STORAGE_KEYS.ATTENDANCE_SESSIONS);
    setItem("erp_attendance_schema_version", ATTENDANCE_SCHEMA_VERSION);
  }

  const persistedAtt = getItem(STORAGE_KEYS.DAILY_ATTENDANCE);
  const persistedSessions = getItem(STORAGE_KEYS.ATTENDANCE_SESSIONS);

  if (persistedAtt) {
    db.dailyAttendance = persistedAtt;
    db.attendanceSessions = persistedSessions || [];
    return;
  }

  db.dailyAttendance = [];
  db.attendanceSessions = [];

  // Create attendance history for the past 30 days to produce realistic dynamic percentages
  const today = new Date();
  const formatDate = (d) => d.toISOString().split("T")[0];

  // Generate past 30 calendar days
  const dates = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    // Exclude weekends (Saturday = 6, Sunday = 0)
    const dayOfWeek = d.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      dates.push({
        dateStr: formatDate(d),
        isToday: i === 0,
      });
    }
  }

  dates.forEach(({ dateStr, isToday }) => {
    db.classes.forEach((cls) => {
      const studentsInClass = db.students.filter((s) => s.classId === cls.id);
      let allUnmarked = true;

      studentsInClass.forEach((student) => {
        let status = "PRESENT";

        if (isToday) {
          // Today starts as UNMARKED for class-teacher interactive workflow
          status = "UNMARKED";
        } else {
          // Dynamic historical generation: 90% Present, 10% Absent
          // Deterministic seed based on student/date so refreshes yield consistent (but distinct per student) attendance
          const pseudoRandom =
            (student.id.charCodeAt(student.id.length - 1) * 7 +
              dateStr.charCodeAt(dateStr.length - 1) * 13) %
            100;
          status = pseudoRandom > 92 ? "ABSENT" : "PRESENT";
        }

        if (status !== "UNMARKED") {
          allUnmarked = false;
        }

        db.dailyAttendance.push({
          id: `att_${student.id}_${dateStr}`,
          studentId: student.id,
          classId: cls.id,
          date: dateStr,
          status: status,
          markedBy: status !== "UNMARKED" ? cls.classTeacherId : null,
          markedAt: status !== "UNMARKED" ? new Date().toISOString() : null,
          attendanceSession: "MORNING",
        });
      });

      if (!allUnmarked) {
        db.attendanceSessions.push({
          id: `sess_${cls.id}_${dateStr}`,
          classId: cls.id,
          date: dateStr,
          submittedAt: new Date().toISOString(),
          submittedBy: cls.classTeacherId,
        });
      }
    });
  });

  setItem(STORAGE_KEYS.DAILY_ATTENDANCE, db.dailyAttendance);
  setItem(STORAGE_KEYS.ATTENDANCE_SESSIONS, db.attendanceSessions);
};
