/**
 * src/initialization/validators/timetableValidator.js
 * 
 * Validates timetable safety to prevent physical impossibility,
 * overlaps, and conflicts with canonical assignments.
 */

import { diagnosticEngine } from "./diagnosticEngine";

export const validateTimetableSafety = (timetableList, assignments) => {
  const MODULE = "TimetableValidator";
  
  if (!timetableList || timetableList.length === 0) {
    diagnosticEngine.info(MODULE, "Timetable is empty, skipping timetable validation.");
    return;
  }

  // Build canonical assignment lookup for fast matching: "classId-subjectId-teacherId"
  const canonicalSet = new Set(assignments.map(a => `${a.classId}-${a.subjectId}-${a.teacherId}`));

  // Tracking for collisions
  // teacherId -> day -> period -> classId
  const teacherSchedule = new Map();
  // classId -> day -> period -> teacherId
  const classSchedule = new Map();

  for (const entry of timetableList) {
    const { classId, day, period, teacherId, subjectId } = entry;

    if (!classId || !day || !period || !teacherId || !subjectId) {
       diagnosticEngine.warn(MODULE, "Malformed timetable entry missing required fields.", { entry });
       continue;
    }

    // 1. Validate against canonical assignments
    const key = `${classId}-${subjectId}-${teacherId}`;
    if (!canonicalSet.has(key)) {
      diagnosticEngine.warn(MODULE, `Timetable desync: Entry assigns teacher ${teacherId} to ${subjectId} for class ${classId}, but this does NOT exist in canonical assignments.`, { entry });
    }

    // 2. Double-booking check (Teacher)
    if (!teacherSchedule.has(teacherId)) teacherSchedule.set(teacherId, new Map());
    const tDayMap = teacherSchedule.get(teacherId);
    if (!tDayMap.has(day)) tDayMap.set(day, new Map());
    const tPeriodMap = tDayMap.get(day);
    
    if (tPeriodMap.has(period)) {
      const existingClass = tPeriodMap.get(period);
      if (existingClass !== classId) {
        diagnosticEngine.critical(MODULE, `Teacher double-booking: Teacher ${teacherId} is scheduled for both ${existingClass} and ${classId} on ${day} ${period}.`, { teacherId, day, period, classes: [existingClass, classId] });
      }
    } else {
      tPeriodMap.set(period, classId);
    }

    // 3. Overlap check (Class)
    if (!classSchedule.has(classId)) classSchedule.set(classId, new Map());
    const cDayMap = classSchedule.get(classId);
    if (!cDayMap.has(day)) cDayMap.set(day, new Map());
    const cPeriodMap = cDayMap.get(day);

    if (cPeriodMap.has(period)) {
      const existingTeacher = cPeriodMap.get(period);
      if (existingTeacher !== teacherId) {
        diagnosticEngine.critical(MODULE, `Class period overlap: Class ${classId} is scheduled for two different teachers on ${day} ${period}.`, { classId, day, period, teachers: [existingTeacher, teacherId] });
      }
    } else {
      cPeriodMap.set(period, teacherId);
    }
  }

  // 4. Daily / Weekly limits per teacher
  const MAX_PERIODS_PER_DAY = 7;
  const MAX_PERIODS_PER_WEEK = 30;

  for (const [teacherId, tDayMap] of teacherSchedule) {
    let weeklyCount = 0;
    for (const [day, tPeriodMap] of tDayMap) {
      const dailyCount = tPeriodMap.size;
      weeklyCount += dailyCount;

      if (dailyCount > MAX_PERIODS_PER_DAY) {
         diagnosticEngine.warn(MODULE, `Teacher ${teacherId} is scheduled for ${dailyCount} periods on ${day}, exceeding recommended maximum of ${MAX_PERIODS_PER_DAY}.`, { teacherId, day, dailyCount });
      }
    }

    if (weeklyCount > MAX_PERIODS_PER_WEEK) {
       diagnosticEngine.warn(MODULE, `Teacher ${teacherId} is scheduled for ${weeklyCount} periods per week, exceeding maximum of ${MAX_PERIODS_PER_WEEK}.`, { teacherId, weeklyCount });
    }
  }
};
