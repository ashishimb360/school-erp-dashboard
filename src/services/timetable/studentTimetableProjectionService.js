import { studentTimetableService } from "./studentTimetableService";
import { getDataProvider } from "../../data";

/**
 * Creates a centralized empty projection for the timetable.
 * Yields a consistent shape to prevent UI crashes and inconsistent empty states.
 */
export const createEmptyTimetableProjection = () => ({
  isConfigured: false,
  status: null,
  today: [],
  weekly: {
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
  },
});

/**
 * Builds the portal-ready UI projection for a student's timetable.
 * - Enforces "published" status visibility.
 * - Maps lowercase days to Capitalized Days.
 * - Derives 'today' schedule.
 */
export const buildStudentTimetableProjection = async (studentId) => {
  const timetable = await studentTimetableService.getStudentTimetable(
    studentId,
  );

  if (!timetable || timetable.status !== "published") {
    return createEmptyTimetableProjection();
  }

  const provider = getDataProvider();
  const subjects = await provider.getSubjects();
  const teachers = await provider.getTeachers();

  const resolveNames = (slot) => {
    if (!slot) return slot;
    const sub = subjects.find((x) => x.id === slot.subjectId);
    const teach = teachers.find((x) => x.id === slot.teacherId);

    let resolvedSubject = slot.subject || (sub ? sub.name : "");
    if (slot.subjectId === "sub-homeroom") {
      resolvedSubject = "Homeroom / Class Teacher Period";
    }

    return {
      ...slot,
      subject: resolvedSubject,
      teacher: slot.teacher || (teach ? teach.metadata?.name || teach.name : ""),
    };
  };

  const rawWeekly = timetable.weeklySchedule || {};

  const weekly = {
    Monday: (rawWeekly.monday || []).map(resolveNames),
    Tuesday: (rawWeekly.tuesday || []).map(resolveNames),
    Wednesday: (rawWeekly.wednesday || []).map(resolveNames),
    Thursday: (rawWeekly.thursday || []).map(resolveNames),
    Friday: (rawWeekly.friday || []).map(resolveNames),
  };

  const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const dayName = days[new Date().getDay()];
  let today = [];

  if (dayName !== "sunday" && dayName !== "saturday") {
    const capitalizedDay = dayName.charAt(0).toUpperCase() + dayName.slice(1);
    today = weekly[capitalizedDay] || [];
  }

  return {
    isConfigured: true,
    status: timetable.status,
    today,
    weekly,
  };
};

export const studentTimetableProjectionService = {
  createEmptyTimetableProjection,
  buildStudentTimetableProjection,
};
