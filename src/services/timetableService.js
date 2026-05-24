/**
 * services/timetableService.js
 *
 * localStorage-backed timetable CRUD service for the Admin Portal.
 *
 * Data structure in localStorage (key: 'erp_timetable_v1'):
 * {
 *   "class-11a": {
 *     "Monday": {
 *       "P1": { subjectId, teacherId, subject, teacher, room }
 *     }
 *   }
 * }
 *
 * All reads are synchronous — no async/await.
 * One-time seed from static assignment data on first load.
 */

import { getDataProvider } from "../data";

const DAY_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const PERIOD_ORDER = ["P1", "P2", "P3", "P4", "P5", "P6", "P7", "P8"];

export const PERIOD_CONFIG = {
  P1: {
    label: "P1",
    time: "08:00 – 08:50",
    startTime: "08:00",
    endTime: "08:50",
  },
  P2: {
    label: "P2",
    time: "08:50 – 09:40",
    startTime: "08:50",
    endTime: "09:40",
  },
  P3: {
    label: "P3",
    time: "09:40 – 10:30",
    startTime: "09:40",
    endTime: "10:30",
  },
  P4: {
    label: "P4",
    time: "10:30 – 11:20",
    startTime: "10:30",
    endTime: "11:20",
  },
  P5: {
    label: "P5",
    time: "11:50 – 12:40",
    startTime: "11:50",
    endTime: "12:40",
  },
  P6: {
    label: "P6",
    time: "12:40 – 13:30",
    startTime: "12:40",
    endTime: "13:30",
  },
  P7: {
    label: "P7",
    time: "13:30 – 14:20",
    startTime: "13:30",
    endTime: "14:20",
  },
  P8: {
    label: "P8",
    time: "14:20 – 15:10",
    startTime: "14:20",
    endTime: "15:10",
  },
};

/** Suggested default rooms per subject ID */
export const SUBJECT_DEFAULT_ROOMS = {
  "sub-phy": "Physics Lab 1",
  "sub-chem": "Chemistry Lab 2",
  "sub-bio": "Biology Lab 3",
  "sub-cs": "Computer Lab A",
  "sub-ip": "Computer Lab B",
  "sub-pe": "Sports Ground",
  "sub-math": "Room 101",
  "sub-eng": "Room 101",
  "sub-bst": "Room 103",
  "sub-acc": "Room 103",
  "sub-eco": "Room 103",
  "sub-his": "Room 104",
  "sub-pol": "Room 104",
  "sub-soc": "Room 104",
  "sub-geo": "Room 104",
};

// ── Internal helpers ─────────────────────────────────────────────────────────

export const getTimetable = async () => {
  const provider = getDataProvider();
  return await provider.getTimetable();
};

export const getRaw = async () => {
  const provider = getDataProvider();
  return await provider.getTimetable();
};

export const setRaw = async (data) => {
  const provider = getDataProvider();
  return await provider.setTimetable(data);
};

// ── Initialization ───────────────────────────────────────────────────────────

/**
 * Seed localStorage from static assignment data.
 * Only runs the first time (when the storage key doesn't exist).
 *
 * @param {Array} assignments - raw teacherSubjectAssignments records
 * @param {Array} subjects    - all subject objects { id, name }
 * @param {Array} teachers    - all teacher objects { id, name }
 */
export const initializeTimetable = async (assignments, subjects, teachers) => {
  const provider = getDataProvider();
  const existing = await provider.getTimetable();
  if (Object.keys(existing).length > 0) {
    return { success: true, message: "Timetable already initialized" };
  }

  const data = {};
  for (const assignment of assignments) {
    if (!assignment.day || !assignment.period) continue;
    const { classId, day, period, subjectId, teacherId } = assignment;
    if (!data[classId]) data[classId] = {};
    if (!data[classId][day]) data[classId][day] = {};

    const subject = subjects.find((s) => s.id === subjectId);
    const teacher = teachers.find((t) => t.id === teacherId);
    const room = SUBJECT_DEFAULT_ROOMS[subjectId] || "TBD";

    data[classId][day][period] = {
      subjectId,
      teacherId,
      subject: subject?.name || subjectId,
      teacher: teacher?.metadata?.name || teacher?.name || teacherId,
      room,
    };
  }

  await provider.setTimetable(data);
  return { success: true, message: "Timetable initialized" };
};

/**
 * Re-seed from static data, overwriting any existing localStorage timetable.
 * Use this for the admin "Reset to default" action.
 */
export const resetTimetable = async (assignments, subjects, teachers) => {
  const provider = getDataProvider();
  const data = {};
  for (const assignment of assignments) {
    if (!assignment.day || !assignment.period) continue;
    const { classId, day, period, subjectId, teacherId } = assignment;
    if (!data[classId]) data[classId] = {};
    if (!data[classId][day]) data[classId][day] = {};

    const subject = subjects.find((s) => s.id === subjectId);
    const teacher = teachers.find((t) => t.id === teacherId);
    const room = SUBJECT_DEFAULT_ROOMS[subjectId] || "TBD";

    data[classId][day][period] = {
      subjectId,
      teacherId,
      subject: subject?.name || subjectId,
      teacher: teacher?.metadata?.name || teacher?.name || teacherId,
      room,
    };
  }

  await provider.setTimetable(data);
  return { success: true, message: "Timetable reset" };
};

// ── Read ─────────────────────────────────────────────────────────────────────

/**
 * Get a flat schedule array for a class (sorted by day → period).
 * Used by TimetableGrid.
 */
export const getClassTimetable = async (classId) => {
  const provider = getDataProvider();
  const data = await provider.getTimetable();
  const classData = data[classId] || {};
  const schedule = [];

  for (const day of DAY_ORDER) {
    for (const period of PERIOD_ORDER) {
      const slot = classData[day]?.[period];
      if (slot) {
        schedule.push({ day, period, ...slot });
      }
    }
  }

  return schedule;
};

/**
 * Cross-class scan: get all slots for a specific teacher.
 */
export const getTeacherTimetable = async (teacherId) => {
  const provider = getDataProvider();
  const data = await provider.getTimetable();
  const schedule = [];

  for (const [classId, classData] of Object.entries(data)) {
    for (const [day, dayData] of Object.entries(classData)) {
      for (const [period, slot] of Object.entries(dayData)) {
        if (slot.teacherId === teacherId) {
          schedule.push({ classId, day, period, ...slot });
        }
      }
    }
  }

  return schedule;
};

/**
 * Get a single period slot (or null if empty).
 */
export const getTimetableSlot = async (classId, day, period) => {
  const provider = getDataProvider();
  return await provider.getTimetableSlot(classId, day, period);
};

// ── Write ────────────────────────────────────────────────────────────────────

/**
 * Save a period slot.
 *
 * @param {string} classId
 * @param {string} day
 * @param {string} period
 * @param {{ subjectId, teacherId, subject, teacher, room }} slotData
 * @param {Object} classNamesMap - { classId: className } for conflict messages
 * @param {boolean} force - skip conflict check if true
 *
 * @returns {{ conflict: { classId, className } | null }}
 */
export const saveTimetableSlot = async (
  classId,
  day,
  period,
  slotData,
  classNamesMap = {},
  force = false,
) => {
  const provider = getDataProvider();

  if (!force && slotData.teacherId) {
    const conflictClassId = await checkTeacherConflict(
      slotData.teacherId,
      day,
      period,
      classId,
    );
    if (conflictClassId) {
      return {
        conflict: {
          classId: conflictClassId,
          className: classNamesMap[conflictClassId] || conflictClassId,
        },
      };
    }
  }

  await provider.setTimetableSlot(classId, day, period, slotData);
  return { conflict: null };
};

/**
 * Remove a period slot (make it free).
 */
export const clearTimetableSlot = async (classId, day, period) => {
  const provider = getDataProvider();
  return await provider.clearTimetableSlot(classId, day, period);
};

// ── Conflict check ───────────────────────────────────────────────────────────

/**
 * Check whether a teacher already has a class at the given day + period
 * (excluding the class currently being edited).
 *
 * @returns {string|null} conflicting classId, or null if no conflict
 */
export async function checkTeacherConflict(
  teacherId,
  day,
  period,
  excludeClassId,
) {
  const provider = getDataProvider();
  const data = await provider.getTimetable();
  for (const [classId, classData] of Object.entries(data)) {
    if (classId === excludeClassId) continue;
    const slot = classData[day]?.[period];
    if (slot && slot.teacherId === teacherId) return classId;
  }
  return null;
}

export const timetableService = {
  initializeTimetable,
  resetTimetable,
  getClassTimetable,
  getTeacherTimetable,
  getTimetableSlot,
  saveTimetableSlot,
  clearTimetableSlot,
  checkTeacherConflict,
};
